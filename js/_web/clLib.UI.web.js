"use strict";

clLib.UI.web = {};

clLib.UI.web = {
	buildDatePickerFilter : function($dpEl, api) {
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
				//buttonImage: "./files/views/assets/image/calendar.gif",
				//buttonImageOnly: true,
				//buttonText: "From Date"
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
		var FieldConfigCollection = clLib.webFieldConfig.FieldConfigCollection;
		var FieldConfig = clLib.webFieldConfig.FieldConfig;
		var FieldConfigError = clLib.webFieldConfig.FieldConfigError;
		
		var routeLogConfig = new FieldConfigCollection("routeLogConfig");
		routeLogConfig.add(new FieldConfig({
			fieldName : "clControls"
			,displayName: " "
			,orderable: false
			,renderFunc : function(x) {
				var $ctlEl = $("<span>");
				//$ctlEl.append($("<span style='display: none;'>" + routeLog["_id"] + "</span>"));
				$ctlEl.append($("<img class='clEdit'>"));
				return $ctlEl[0].outerHTML;
			}
			
			
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "username"
			,displayName: "User"
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "DateISO"
			,displayName: "Date"
			,renderFunc : clLib.ISOStrToDate
			,filterElement: function(column, api, i) {
				var cont = $('<div style="left: auto; float: left; width: 140px">').appendTo( $(column.header()) );
				
				var $dateFrom = $("<input class='dateFrom' placeholder='from' style='width: 55px;'>")
					.appendTo(cont);
				clLib.UI.web.buildDatePickerFilter($dateFrom, api);

				var $dateTo = $("<input class='dateTo' placeHolder='to' style='width: 55px;'>")
					.appendTo(cont);
				clLib.UI.web.buildDatePickerFilter($dateTo, api);

				clLib.UI.web.addDateRangeSearch(i, $dateFrom, $dateTo);
			}
			,editElement : {
				create: function(colName, currentValue) {
					var $el = $("<div>");
					var $input = $("<input class='datePortion' style='width: 75px;'>")
						.val(
							currentValue.substring(0,10)
						);
					$el.append($input);
					$input.datepicker({
						showOn: "button",
						buttonImage: "./files/views/assets/image/calendar.gif",
						buttonImageOnly: true,
						dateFormat: "yy-mm-dd"
						//buttonText: "Select date"
					});
					$input = $("<input class='timePortion' style='width: 55px'>")
						.val(
							currentValue.substring(11,19)
						);
					$el.append($input);
					return $el;
				}
				,serialize : function($editElement) {
					var val = 
						$editElement.find("input.datePortion").val() 
						+ " " 
						+ $editElement.find("input.timePortion").val();
					val = clLib.dateStrToISOStr(val);
					return val;
				}
			}			
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "Rating"
			,renderFunc : function(x) {
				return clLib.UI.ratingToStars(x);
			}
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "GradeSystem"
/*			,editElement: {
				create: function(colName, currentValue) {
					return "<h1>" + colName + "--" + currentValue + "</h1";
				}
			}
*/
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Sector"
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Line"
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Colour"
			,renderFunc : function(x) { 
				var $colour = clLib.tickTypeSymbol("Colour", x, {"Colour": x});
				if($colour) {
					$colour.css("width", "100%");
					$colour.css("margin-left", "0px");
					$colour.css("text-align", "center");
					$colour.css("font-weight", "bold");
					$colour.css("height", "22px");
					$colour.append(x);
					return $colour[0].outerHTML; 
				}
				else {
					return x;
				}
			}
			,editElement : {
				create: function(colName, currentValue, $thead, currentFieldConfig) {
					var $colourSelector = $('<div title="Colour Selector">');
					var tmpColours = [
						"green"
						,"red"
						,"blue"
					];
					var $colourDisplay; 
					//$colourDisplay = $(currentFieldConfig.renderFunc(currentValue));
					$colourDisplay = $(this.config.renderFunc(currentValue));
					$colourDisplay.attr("id", "xxx");
					$colourDisplay.data("clValue", currentValue);
					$colourDisplay.on("click", function(e) {
						$colourSelector.dialog();
					});
					$.each(tmpColours, function(idx, colour) {
						$colourSelector.append(
							$(currentFieldConfig.renderFunc(colour))
								.on("click", function(e) {
									console.log("setting colourdisplay to " + colour);
									$colourDisplay = $("#xxx");
									$colourDisplay.replaceWith($(currentFieldConfig.editElement.create(colName, colour, $thead, currentFieldConfig)));
									$colourDisplay.data("clValue", colour);
									$colourSelector.dialog("close");
								})
						);
					});
					
					return $colourDisplay;
				}
				,serialize : function($editElement) {
					var val = 
						$editElement.find(".clCSSBg").data("clValue"); 
/*					var val = 
						$editElement.find("textarea").val();
*/
					return val;
				}
			}			
		}));
	
		routeLogConfig.add(new FieldConfig({
			fieldName : "Comment"
			,renderFunc : function(comment) {
				comment = comment || "";
				return comment;
				//return comment.substring(0,15) + "...";
			}
			,filterElement: function(column, api, i) {
				
				var $filterInput = $("<input class='fullText' placeholder='search for' style='width: 55px;'>")
					.appendTo( $(column.header()) );
				clLib.UI.web.addFullTextSearch($filterInput, i, api);
			}
			,editElement : {
				create: function(colName, currentValue) {
					var $el = $("<textarea>" + currentValue + "</textarea>");
					return $el;
				}
				,serialize : function($editElement) {
					var val = 
						$editElement.find("textarea").val() 
					return val;
				}
			}			
		}));
		
		routeLogConfig.add(new FieldConfig({
			fieldName : "character"
		//	,renderFunc : clLib.getIconImg
		}));
		
		routeLogConfig.add(new FieldConfig({
			fieldName : "_id"
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "deleted"
		}));

		console.log(JSON.stringify(options["where"]));
		return clLib.REST.getEntities(
			options["entity"]
			,options["where"] || {"username": function() { return clLib.getUserInfo()["username"]}()} /*"foo6@gmail.com"} */ 
			,function(resultObj) {
				var routeLogs = resultObj.RouteLog;
				console.log(routeLogs.length);
				
				var $table = $("<table>");
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
				window.dtColumns = [];
				var dtColumnDefs = [];
				$.each(fields, function(idx, fieldName) {
					var curFieldConfig = routeLogConfig.get(fieldName) || {};
					var displayName = fieldName;
					if(curFieldConfig["displayName"]) {
						displayName = curFieldConfig["displayName"];
					}
					$thTr.append($("<th data-clColName='"+fieldName+"' class='"+fieldName+"'>")
						.append(displayName)
					);
					dtColumns.push(fieldName);
					dtColumnDefs.push({
						"targets": fieldName,
						"orderable": curFieldConfig["orderable"]
						,"bUseRendered": false
						,"render": function ( data, type, full, meta ) {
							//console.log("render me!");
							var renderedVal = "";
							if(
								(
									data  != clLib.UI["NOTSELECTED"].value &&
									data +"" != ""
								) 
								|| curFieldConfig["fieldName"] == 'clControls'
							) {
								renderedVal = data;
								if(typeof(curFieldConfig) == "object" && curFieldConfig["renderFunc"]) {
									renderedVal = curFieldConfig["renderFunc"](data);
								}
							} else {
								renderedVal = "?";
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
				$.each(routeLogs, function(idx, routeLog) {
					var $tr = $("<tr>");

					$.each(routeLogConfig.fields(), function(idx, keyName) {
						if(keyName == "XXXXXXXX" + "clControls") {
							var $td = $("<td class='clControls'>");
							$td.append($("<span style='display: none;'>" + routeLog["_id"] + "</span>"));
							$td.append($("<img class='clEdit'>"));
							//$td.append($("<img class='clDelete'>"));
							$tr.append($td);
						}
						else {
							var $td = $("<td class='"+keyName+"' data-clcolname='"+keyName+"' >");
							$td.append(routeLog[keyName]);
							$tr.append($td);
						}
					});
					$tbody.append($tr);
				});
				

				$table.append($tbody);

				$tableContainer.append($table);


				
				window.$dataTable = $table.dataTable({
					"a": "b"
					,order: []
					,"columnDefs": dtColumnDefs
					,"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
						$('td', nRow).attr('nowrap','nowrap');
						return nRow;
					}
					,"dom": 'CRlfrtip' // 'T<"clear">C<"clear">Rlfrtip' //'C<"clear">Rlfrtip' //lfrtip<"clear">
					//,"scrollX": true
					,initComplete: function () {
/*
*
*	FILTER!!!!!
*
*/
					
					var api = this.api();
						api.columns().indexes().flatten().each( function ( i ) {
							if($(api.column(i).header()).attr("data-clColName") == 'clControls') {
								return;
							}

							var column = api.column( i );

							if(routeLogConfig.get(dtColumns[i]).filterElement) {
								return routeLogConfig.get(dtColumns[i]).filterElement(column, api, i);
							}

							
							console.log("adding filter select..");
							var foo = $('<br>').appendTo( $(column.header()) );
							var select = $('<select><option style="text-align: center;" value="">-- All --</option></select>')
								.appendTo( $(column.header()) )
								.on( 'change', function () {
									console.log("filtering on >" + this.value + "<");
									console.log("Changed >" + i + "< >" + $(this).parent().index() + "< >" + column.header() + "<>" + $(column.header()).attr("class") + "<!!!");

									api
										.column( $(this).parent().index()+':visible' )
										.search( this.value )
										.draw();
								} )
								.on('click', function(evt) {
									console.log("clicked!!" + evt.target);
									evt.stopImmediatePropagation();
								})
							;
			 
							column.data().unique().sort().each( function ( d, j ) {
								if(d != "") {
									var renderedValue = d;
									if(routeLogConfig.get(dtColumns[i])["renderFunc"]) {
										renderedValue = routeLogConfig.get(dtColumns[i])["renderFunc"](d);
									}
									var asdf = '<option '
										+ ' value="' + d +'">'
										+ d
										+ '</option>'
									;
									//console.log(asdf);
									select.append( asdf )
								}
							} );

						} );
					}		
				})
				;



				//
				// Add event listener for EDITNG
				//
				$tbody.on('click', 'td.clControls img.clEdit', function () {
					var $tbody = $(this).closest("tbody");
					var $thead = $tbody.siblings("thead");
					var $tr = $(this).closest('tr');
					var $origTr = $tr.clone();
					$tr.addClass("clEdited");
					$table.find("tr:not(.clEdited)").addClass("clBlurred");
					$table.find("th:not(.clEdited)").addClass("clBlurred");
					var $td = $(this).closest('td');
					$td.find("img.clEdit").css("display", "none");
					$td.append(
						$("<button class='clSave'>Save</button>")
							.on("click", function(evt) {
								var serRow  = {};
								$tr.find("td").each(function() {
									var $td = $(this);
									var colIdx = $td.index();
									var colName = $td.data("clcolname");
									if(!colName) {
										alert("no colname at idx " + colIdx);
										return;
									}
									//$td.css("background", "#FF0000");
									console.log("getting field config for " + colName);
									var currentFieldConfig = routeLogConfig.get(colName);
									var $editEl = $td;
									console.log("found el " + $editEl.html());
									var editElConfig = currentFieldConfig["editElement"] || {};
									var serializeFunc = (editElConfig && editElConfig["serialize"]) || function($editEl) {
										alert("no ser func, returning >" + $editEl.find("select").val()+ "<");
										return $editEl.find("select").val();
									};
									serRow[colName] = serializeFunc($editEl);
									// set table cell to NEW value(=> rendered :)
									$td.html(currentFieldConfig["renderFunc"](serializeFunc($editEl)));
									
								});
								console.log("Serialized row >" + JSON.stringify(serRow) + "<");
								$table.find("tr").removeClass("clBlurred");
								$table.find("th").removeClass("clBlurred");
								$tr.removeClass("clEdited");
								
							})
						)
					;
					$td.append(
						$("<button class='clCancel'>Cancel</button>")
							.on("click", function() {
								$tr = $(this).closest('tr');
								$tr.removeClass("clEdited");
								$tr.find("td").each(function(idx) {
									console.log($(this).attr("class") + " <-> " + $origTr.find("td." + $(this).attr("class")).attr("class"));
									$(this).replaceWith($origTr.find("td." + $(this).attr("class")));
								
								});
								$table.find("tr").removeClass("clBlurred");
								$table.find("th").removeClass("clBlurred");
								$origTr.empty();
								console.log("origtr restored.");
							})
					);

			
					var rowData = $dataTable.fnGetData($tr);

					console.log("ROWDATA" + JSON.stringify(rowData));

					$tr.find("td").each(function() {
						var $td = $(this);
						var colIdx = $td.index();
						var colName = $td.data("clcolname");
						if(colName) {	
							var currentFieldConfig = routeLogConfig.get(colName);
							//alert("building edit control for >" + colName + "<");
						
							var currentValue;
//							currentValue = $td.html();
//							alert("rendred value >" + currentValue + "<");
							currentValue = rowData[dtColumns.indexOf(colName)];
//							alert("original value >" + currentValue + "<");
							//alert("getting editElement for " + colName + "," + JSON.stringify(currentFieldConfig));
							
							var $editElement;
							if(currentFieldConfig && currentFieldConfig["editElement"] && colName != 'clControls') {
								console.log("got custom edit element for " + colName);
								$editElement = currentFieldConfig["editElement"]["create"](colName, currentValue, $thead, currentFieldConfig);
								$td
									.empty()
									.append($editElement)
								;
							}

						}
					});
		
				} );				
								
				
				return successFunc();

			}
			,errorFunc
		);
	}
};


