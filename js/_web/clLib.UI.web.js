"use strict";

clLib.UI.web = {};

window.clEdited = false;
clLib.UI.web = {
	tableEdited : function(yesno) {
		window.clEdited = yesno;
		$(".editRelevant").prop("disabled", yesno);
	}
	,buildDatePickerFilter : function($dpEl, api) {
		var changeDoneToClearButtonFunc = function( input ) {
            setTimeout(function() {
                var $doneButton = $( input )
                    .datepicker( "widget" )
                    .find( ".ui-datepicker-buttonpane" )
                    .find(".ui-datepicker-close")
                    .html("Clear")
                ;
                $doneButton.click(function(e) {
                    $(input)
                        .val("")
                        .trigger("change")
                    ;
                    
                });
            }, 1 );
        };
        
        $dpEl
			.on('change', function () {
				if($(this).val() != $dpEl.attr("oldvalue")) {
					api.draw();
					$dpEl.attr("oldvalue", $(this).val());
				}
				api.draw();
			})
			.datepicker({
				dateFormat: "yy-mm-dd"
				,showButtonPanel: true
				//,showOn: "button",
				//buttonImage: "../files/views/assets/image/calendar.gif",
				//buttonImageOnly: true,
				//buttonText: "From Date"
                ,beforeShow: changeDoneToClearButtonFunc
                ,onChangeMonthYear: changeDoneToClearButtonFunc
            })
			.on('click', function(evt) {
				$dpEl.datepicker("show");
				evt.stopImmediatePropagation();
			})
		;
	
	}
	,addDateRangeSearch : function(forColIdx, $dateFromEl, $dateToEl) {
		$.fn.dataTable.ext.search.push(
			function( settings, data, dataIndex ) {
                var eligibleFrom = false, eligibleTo = false;
				console.log("comparing " + $dateFromEl.val() + " and " + data[forColIdx]);
				
				if($dateFromEl.val()) {
					if(data[forColIdx] > $dateFromEl.val()) {
						eligibleFrom = true;
					}
				} else {
					eligibleFrom = true;
				}
				if($dateToEl.val()) {
					if(data[forColIdx] < $dateToEl.val()) {
						eligibleTo = true;
					}
				} else {
					eligibleTo = true;
				}
				//alert("true!");
                console.log(">" + JSON.stringify(data[forColIdx]) + "< from >" + $dateFromEl.val() + "(=" + eligibleFrom + ")< to >" + $dateToEl.val() + "(=" + eligibleTo + ")<");
				return eligibleFrom && eligibleTo;
			}
		);
	}
	,addFullTextSearch : function($searchEl, forColIdx, api) {
		$searchEl
			.on('click', function(evt) {
				console.log("clicked!!" + evt.target);
				evt.stopImmediatePropagation();
				$searchEl.focus();
			})
			.on('keyup', function () {
				if($(this).val() != $searchEl.attr("oldvalue")) {
					api.draw();
					$searchEl.attr("oldvalue", $(this).val());
				}
				api.draw();
			})

		$.fn.dataTable.ext.search.push(
			function( settings, data, dataIndex ) {
				var eligible = false;
				console.log("comparing " + $searchEl.val() + " and " + data[forColIdx]);
				
				var fullTextRE = new RegExp("(.*)" + $searchEl.val() + "(.*)", "mg");
				if(fullTextRE.test(data[forColIdx])) {
					eligible = true;
				}
				return eligible;
			}
		);
	}
	,createTable : function($tableContainer, options, successFunc, errorFunc) {
		var routeLogConfig = clLib.webFieldConfig._routeLogConfig;
		console.log(JSON.stringify(routeLogConfig));

        if(options["readonly"]) {
            routeLogConfig.remove("clControls");
        }
        
        var processEntities = function(resultObj) {
            var routeLogs = resultObj.RouteLog;
            console.log(routeLogs.length);
            
            //routeLogs = [];
            
            window.$table = $("<table>");
            $table.addClass("display");
            $table.addClass("cell-border");
            

            var $tbody = $("<tbody>");
            
            //
            // Table header...
            //
            var $th = $("<thead>");
            var $thTr = $("<tr>");
            
            var fields = routeLogConfig.fields();
/*				$thTr.append($("<th data-clColName='clControls' class='clControls'>")
                .append("")
            );
*/
            window.dtColumnAt = [];
            var dtColumnAtCt = 0;
            var dtColumnDefs = [];
            var dtColumns = [];
            $.each(fields, function(idx, fieldName) {
                var curFieldConfig = routeLogConfig.get(fieldName) || {};
                var displayName = fieldName;
                if(curFieldConfig["displayName"]) {
                    displayName = curFieldConfig["displayName"];
                }
                $thTr.append($("<th data-clColName='"+fieldName+"' class='"+fieldName+"'>")
                    .append(displayName)
                );
                dtColumnAt.push(fieldName);
                dtColumns[dtColumnAtCt] = {
                    data : fieldName
                    ,name : fieldName
                    ,className : curFieldConfig["className"] //"" + fieldName
                    ,visible : curFieldConfig["visible"]
                };
                
                dtColumnAtCt++;
                
                dtColumnDefs.push({
                    "targets": fieldName,
                    "orderable": curFieldConfig["orderable"]
                    ,"bUseRendered": false
                    ,"render": function ( data, type, full, meta ) {
                        if(type != "display") {
                            return data;
                        }
                        if(window.dtDebug) {
                            //alert("rendering >" + fieldName + "< and value >" + data + "<(" + (data !== undefined) + ")");
                        }
                        
                        //console.log("render me!");
                        var renderedVal = "";
                        if(
                            (
                                data  != clLib.UI["NOTSELECTED"].value &&
                                data !== undefined && 
                                (data + "") != ""
                            ) 
                            || curFieldConfig["fieldName"] == 'clControls'
                            || curFieldConfig["dummyField"] == true
                        ) {
                            renderedVal = data;
                            if(typeof(curFieldConfig) == "object" && curFieldConfig["renderFunc"]) {
                                renderedVal = curFieldConfig["renderFunc"](data, full);
                            }
                            else {
                                alert("could not find renderer for >" + fieldName + "< and value >" + data + "<");
                            }
                        } else {
                            renderedVal = "?";
                        }
                        
                        if(window.dtDebug) {
                            //alert("returning rendered >" + fieldName + "< as >" + renderedVal + "<");
                        }

                        return renderedVal;
                    }

                });
    
            });
            $th.append($thTr);
            
            $table.append($th);
            
            // 
            // Table body
            //
            console.log("Eaching routeLogs >" + JSON.stringify(routeLogs) + "<");
            if(routeLogs[0] == null) {
                alert("fuck me, I'm null!!");
                routeLogs = [];
            }
            $.each(routeLogs, function(idx, routeLog) {
                $.each(routeLogConfig.fields(), function(idx, keyName) {
                    var curFieldConfig = routeLogConfig.get(keyName) || {};
                    console.log("routeLog >" + JSON.stringify(routeLog) + "<");
                    if(!(keyName in routeLog) || curFieldConfig["dummyField"]) {
                        routeLog[keyName] = '';
                        if(curFieldConfig["renderFunc"]) {
                            routeLog[keyName] = curFieldConfig.renderFunc("", routeLog);
                        }
                    }
                });
            });

            $table.append($tbody);

            $tableContainer.append($table);


            //alert("adding columns >" + JSON.stringify(dtColumns) + "<");
            console.log("adding columns >" + JSON.stringify(dtColumns) + "<");
            
            
            window.$dataTable = $table.dataTable({
                "a": "b"
                ,data : routeLogs
                ,order: [
                    dtColumnAt.indexOf("DateISO"), "desc"
                ]
                ,"columns": dtColumns
                ,"columnDefs": dtColumnDefs
                ,"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                    $('td', nRow).attr('nowrap','nowrap');
                    return nRow;
                }
                ,"dom": 'CRlfrtip' // 'T<"clear">C<"clear">Rlfrtip' //'C<"clear">Rlfrtip' //lfrtip<"clear">
                //,"scrollX": true
/*
*
*	FILTER!!!!!
*
*/
                ,initComplete: function () {
                
                    var api = this.api();
                    api.columns().indexes().flatten().each( function ( i ) {
                        if($(api.column(i).header()).attr("data-clColName") == 'clControls') {
                            return;
                        }

                        var column = api.column( i );

                        if(routeLogConfig.get(dtColumnAt[i]).filterElement) {
                            console.log("found filter element for " +  dtColumnAt[i]);
                            return routeLogConfig.get(dtColumnAt[i]).filterElement(column, api, i);
                        }


                    } );
                }		
            })
            ;

            //
            // Add event listener to ADD a new row
            //
            $thTr.on('click', 'th.clControls img.clAdd', function () {
                if(window.clEdited) return;
                clLib.UI.web.tableEdited(true);
                
                console.log("new row for table >" + Object.keys($dataTable)  + "<");
                //alert("new row for table >" + Object.keys($dataTable)  + "<");
                var $thead = $thTr.closest('thead');

                var $newTr = $("<tr>");
                $newTr.addClass("clEdited odd");
                $table.find("tr:not(.clEdited)").addClass("clBlurred");
                $table.find("th:not(.clEdited)").addClass("clBlurred");

                $thTr.find("th").each(function() {
                    var $th = $(this);
                    var $newTd = $("<td>");
                    var colIdx = $th.index();
                    var colName = $th.data("clcolname");
                    $newTd = $("<td class='"+colName+"' data-clcolname='"+colName+"' >");

                    //alert("adding blank td for " + colName);

                    if(colName) {	
                        var currentFieldConfig = routeLogConfig.get(colName);
                        //alert("building edit control for >" + colName + "<");
                    
                        var currentValue;
                        currentValue = "" + currentFieldConfig["defaultValue"];
                        if(currentValue == "undefined") {
                            currentValue = "";
                        }
                        
                        var $editElement;
                        if(currentFieldConfig && currentFieldConfig["editElement"]) {
                            console.log("got custom edit element for " + colName);
                            $editElement = currentFieldConfig["editElement"]["create"](colName, currentValue, $thead, currentFieldConfig);
                            console.log("editeleletn is now " + $editElement.html());
                        }
                        else {
                            alert("no editElement for >" + colName + "<, using renderFunc (=> readonly display)");
                            $editElement = $(currentFieldConfig["renderFunc"](currentValue));
                        }
                        $newTd
                                .append($editElement)
                            ;

                            // Let element refresh itself (if it wants to)
                        currentFieldConfig["editElement"]["addRefreshHandler"]($editElement);
                            
                        //}
                        $newTr.append($newTd);

                    }
                                            
                    $newTd.find(".clRefreshable" ).trigger("clRefresh");                        

                });
                $tbody.prepend($newTr);
            });


            //
            // Add event listener for EDITNG
            //
            $tbody.on('click', 'td.clControls img.clEdit', function () {
                if(window.clEdited) return;
                clLib.UI.web.tableEdited(true);
                
                var $tbody = $(this).closest("tbody");
                var $thead = $tbody.siblings("thead");
                var $tr = $(this).closest('tr');
                window.$origTr = $tr.clone();
                $tr.addClass("clEdited");
                $table.find("tr:not(.clEdited)").addClass("clBlurred");
                $table.find("th:not(.clEdited)").addClass("clBlurred");
                
                var rowData = $dataTable.fnGetData($tr);

                //console.error("ROWDATA" + JSON.stringify(rowData));

                $tr.find("td").each(function() {
                    var $td = $(this);
                    var colIdx = $td.index();
                    var colName = $table.find('thead').find("th:eq(" + colIdx + ")").data("clcolname");
                    if(colName) {	
                        var currentFieldConfig = routeLogConfig.get(colName);
                        console.log("building edit control for >" + colName + "<");
                    
                        var currentValue;
                        currentValue = rowData[colName];
                        console.log("original value >" + currentValue + "<");
                        console.log("getting editElement for " + colName + "," + JSON.stringify(currentFieldConfig));
                        
                        var $editElement;
                        if(currentFieldConfig && currentFieldConfig["editElement"]/* && colName != 'clControls'*/) {
                            console.log("got custom edit element for " + colName);
                            $editElement = currentFieldConfig["editElement"]["create"](colName, currentValue, $thead, currentFieldConfig, rowData);
                            console.log("editeleletn is now " + $editElement.html());

                            $td
                                .empty()
                                .append($editElement)
                            ;
                            
                            // Let element refresh itself (if it wants to)
                            currentFieldConfig["editElement"]["addRefreshHandler"]($editElement);
                        }

                    }
                    
                    $td.find(".clRefreshable" ).trigger("clRefresh");                        
                });
                
                
    
            } );				
            
            //
            // Add event listener for DELETING
            //
            $tbody.on('click', 'td.clControls img.clDelete', function () {
                if(window.clEdited) return;
                
                var $tbody = $(this).closest("tbody");
                var $tr = $(this).closest('tr');
                var rowData = $dataTable.fnGetData($tr);

                routeLogConfig.config.deleteHandler(
                    rowData
                    ,function() {
                        $dataTable.fnDeleteRow($tr);
                        $table.api().draw();
                    }
                    ,function(e) {
                        alert("could not delete row due to >" + e + "<(" + JSON.stringify(e) + ")");
                    }
                );
            } );				
            
            
            return successFunc();

        };
        
        // items already there..
        if(options["items"]) {
            return processEntities(options["items"]);
        }
        // Need to fetch via REST..
        else {
            
            console.log(JSON.stringify(options["where"]));

            if(!options["where"]) {
                options["where"] = {};
            }
        

            var whereObj = options["where"];
            whereObj["username"] = function() { return clLib.getUserInfo()["username"]}();
            whereObj = $.extend(whereObj, clLib.mongoNe("deleted",1));;
            
            return clLib.REST.getEntities(
                options["entity"]
                ,whereObj 
                ,processEntities
                ,errorFunc
                ,{
                    requireResult : false
                }
            );
        
        }
        
	}
};


