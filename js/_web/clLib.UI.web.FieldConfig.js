"use strict";




clLib.webFieldConfig = {
	FieldConfigError: function (message) {
	  this.name = 'FieldConfigError';
	  this.message = message || 'Unknown reason';
	  alert("FieldConfigError " + JSON.stringify(this.message));
	  this.prototype = new Error();
	  //this.prototype.constructor = clLib.UI.fc.FieldConfigError;
	}
	,FieldConfigCollection : function(fieldConfigCollectionConfig) {
		this.fieldConfigs = {};
		this.defaults = {
            collectionName : "_NO_FIELD_COLLECTION_DEFINED"
			,entityName : "_NO_ENTITYNAME_DEFINED"
			,getEntityName : function() {
				console.log("returning " + this.config.entityName);
				return this.config.entityName;
			}
            ,validateFields : function(fieldData, successFunc, errorFunc) {
                var fieldCollection = this;
                try {
                    $.each(fieldData, function(fieldName, fieldData) {
                        var fieldConfig = fieldCollection.get(fieldName);
                        var validationResult = fieldConfig.validate(fieldData);
                        clLib.loggi("validated field >" + fieldConfig.displayName + "< with result >" + validationResult + "<", "20150202");
                    });
                } catch(e) {
                    return errorFunc(e);
                }
                return successFunc();
            }
            ,saveHandler : function(fieldData, newRowFlag, successFunc, errorFunc) {
				var myErrorHandler = function(e) {
                    var errorMsg = e.message;
                    var errorCode = "N/A";
                    if(e.message) {
                        try {
                            var jsonParsedMeassage = JSON.parse(e.message);
                            if(jsonParsedMessage["responseText"]) {
                                errorCode = JSON.parse(JSON.parse(e.message)["responseText"])["code"];
                                errorMsg = JSON.parse(JSON.parse(e.message)["responseText"])["description"];
                            }
                        }
                        catch(e) {
                            console.log("no XHR error..");
                        }
                    }
                    var errString =  "could not sync item due to:" + e.name + " + (" + e.message + ") >" + errorCode + ">,<" + errorMsg + "<";
                    console.error(errString);
                    return errorFunc(errString);
                };
                
                clLib.loggi("saving row(" + newRowFlag + ") with data >" + JSON.stringify(fieldData) + "<", "20150129");
                var fieldConfig = this.config;
                return this.config.validateFields(
                    fieldData
                    ,function() {
                        var targetFunc = newRowFlag ? clLib.REST.storeEntity : clLib.REST.updateEntity;
                        var entityId = -1;
                        
                        return targetFunc(fieldConfig.getEntityName(), fieldData
                        ,function(realInstance) {
                            clLib.loggi("synced realInstance >" + JSON.stringify(realInstance) + "<");
                            entityId = realInstance["_id"];	

                            clLib.loggi("synced UP >" + fieldData["_id"] + "<, new id is (" + typeof(realInstance) + ")>" + realInstance["_id"] + "<, dummyId was >" + fieldData["_id"] + "<");
                            
                            return successFunc(entityId);
                        }
                        ,myErrorHandler
                        );

                    }
                    ,myErrorHandler
                );
                
			}
			,deleteHandler : function(fieldData, successFunc, errorFunc) {
				clLib.loggi("deleting row with data >" + JSON.stringify(fieldData) + "<", "20150129");
				fieldData["deleted"]  = 1;

				return this.config.saveHandler(fieldData, false /* =>newRowFlag */, successFunc, errorFunc);
			}
		};
		this.add = function(fieldConfigObj) {
			if(!(fieldConfigObj instanceof clLib.webFieldConfig.FieldConfig)) {
				throw new clLib.UI.fc.FieldConfigError("trying to add invalid FieldConfig object.");
			}
			this.fieldConfigs[fieldConfigObj.fieldName] = fieldConfigObj;
		}
		this.get = function(fieldName) {
			if(!this.fieldConfigs[fieldName]) {
				clLib.loggi("field >" + fieldName + "< not found in collection.", "20150129");
				return {};
				//throw new clLib.UI.web.FieldConfigError("field >" + fieldName + "< not found in collection.");
			}
			return this.fieldConfigs[fieldName].config;
		}
		this.fields = function() {
			return Object.keys(this.fieldConfigs);
		}
		this.config = this.defaults;
		this.config = $.extend(true, this.config, fieldConfigCollectionConfig);
		this.config.getEntityName = this.config.getEntityName.bind(this);
		this.config.saveHandler = this.config.saveHandler.bind(this);
		this.config.deleteHandler = this.config.deleteHandler.bind(this);
		this.config.validateFields = this.config.validateFields.bind(this);

	}
	,FieldConfig : function(fieldConfig) {
		//alert("building field with config " + JSON.stringify(fieldConfig));
		this.fieldName = fieldConfig["fieldName"];
		this.defaults = {
			fieldName : this.fieldName
			,displayName : this.fieldName
			,className : this.fieldName
			,visible : true
			,orderable : true
            ,validate: function(fieldData) {
                return true;
            }
			,renderFunc : function(colValue, rowValue) { return "" + colValue; }
			,editElement : {
				serialize: function($editEl) {
					console.log("(" + this.fieldName + ") the editEl is >" + $editEl + "<");
					return $editEl.find("select").val();
				}
                , addRefreshHandler : function($editElement) {
                    var fieldConfig = this.config;
                    if(fieldConfig.editElement.refreshFrom) {
                        $editElement.addClass("clRefreshable");
						$editElement.on("clRefresh", function() {
							clLib.loggi("need to refresh me, which is >" + fieldConfig.fieldName + "<", "20150129");
							var routeLog = {};
							
							var $thisField = $(this);
							$.each(fieldConfig.editElement.refreshFrom, function(idx, fromColName) {
								console.log(">" + idx + "<,>" + fromColName + "<");
								console.log("thisField >" + $thisField[0].outerHTML + "<");
								console.log("2thisField >" + $thisField.closest("tr,th")[0].outerHTML + "<");
								console.log("getting serialized version of >" + $thisField.closest("tr").find("." + fromColName)[0].outerHTML + "<");
								routeLog[fromColName] = 
									routeLogConfig.get(fromColName).editElement.serialize(
										$thisField.closest("tr").find("." + fromColName)
									)
								;
							});

							fieldConfig.editElement.refresh($thisField, routeLog);
						});
					}
                    
                }
                ,refresh: function($editElement, rowData) {
                    return 1;
                }
				,create: function(colName, currentValue, $thead) {
					//alert("(" + this.fieldName + ") creating >" + colName + "< with value >" + currentValue + "<");
					var $fieldValsSelect = $thead
						.find("tr th." + colName + " select")
						.clone()
						// ensure control is editable...
						.prop("disabled", false)
						.val(currentValue)
                    ;
					var fieldConfig = this.config;
					$fieldValsSelect.on("change", function() {
						if(fieldConfig.refreshOnUpdate) {
							console.log("refreshing >" + JSON.stringify(fieldConfig.refreshOnUpdate) + "<");
                            var $editEl = $(this);
							$.each(fieldConfig.refreshOnUpdate, function(idx, refreshSelector) {
                                console.log("refreshing >" + JSON.stringify($editEl.closest("tr").find("." + refreshSelector + " .clRefreshable" )[0].outerHTML) + "<");
                                $editEl.closest("tr").find("." + refreshSelector + " .clRefreshable" ).trigger("clRefresh");
                            });
						}
						else {
							console.log("no refresh targets defined..");
						}
					});
					return $fieldValsSelect;
				}
			}
			,getAvailableItems : function(column, api, successFunc) {
				return successFunc(column.data().unique().sort());
			}
			,filterElement: function(column, api, i) {
				console.log("adding filter select..");
				var foo = $('<br>').appendTo( $(column.header()) );
				var select = $('<select style="width: 100%; ">');
				select.addClass("editRelevant");
				select.addClass("clRefreshable");
                var fieldConfig = this.config;
                select.on("clFilterRefresh", function(event, rowData) {
                    console.log("filter refresh for (" + fieldConfig.fieldName + ")" + $(column.header()).attr("class") + " with data >"  + rowData[fieldConfig.fieldName]);
                    var found = false;
                    var newOption = rowData[fieldConfig.fieldName];
                    if(newOption == "") {
                        return;
                    }
                    
                    $.each($(this).find("option"), function(name, val) {
                        console.log(">" + val + "< == >" + newOption + "<");
                        if($(val).val() == newOption) {
                            found = true;
                        }
                    });
                    if(!found) {
                        console.log("not found >" + newOption + "<, appending..");
                        $(this).append(
                            "<option value='" + newOption + "'>" + newOption + "</option>"
                        );
                        // 2DO: Refresh filter on NEW value(because it was not there previously)
                        //$(this).val(newOption);
                    }
                    
                });
				select.append('<option style="text-align: center;" value="">-- All --</option></select>');
				select
					.appendTo( $(column.header()) )
					.on( 'change', function () {
						console.log("filtering on >" + this.value + "<");
						console.log("Changed >" + i + "< >" + $(this).parent().index() + "< >" + column.header() + "<>" + $(column.header()).attr("class") + "<!!!");
						console.log("column is >" + $(this).parent().index()+':visible' + "<");
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
				//select.selectmenu();
 
				/*
				*		Get all filter items...
				*/
				this.config.getAvailableItems(
					column
					,api
					,function(filterItems) {
						$.each(filterItems, function(idx, val) {
							if(val != "") {
// Renderd values currently not used for filter items..
/*								
								var renderedValue = val;
								if(this.renderFunc) {
									renderedValue = this.renderFunc(val);
								}
*/
								var option = '<option '
									+ ' value="' + val +'">'
									+ val
									+ '</option>'
								;
								select.append( option );
							}
						});
					}
				);
				
			}

		}

		this.config = this.defaults;
		this.config = $.extend(true, this.config, fieldConfig);
		this.config.editElement.serialize = this.config.editElement.serialize.bind(this);
		this.config.editElement.create = this.config.editElement.create.bind(this);
        this.config.editElement.addRefreshHandler = this.config.editElement.addRefreshHandler.bind(this);
        this.config.editElement.refresh = this.config.editElement.refresh.bind(this);
        this.config.filterElement = this.config.filterElement.bind(this);
        this.config.validate = this.config.validate.bind(this);
        

    }
		
};

		var FieldConfigCollection = clLib.webFieldConfig.FieldConfigCollection;
		var FieldConfig = clLib.webFieldConfig.FieldConfig;
		var FieldConfigError = clLib.webFieldConfig.FieldConfigError;


		var routeLogConfig = new FieldConfigCollection({
			collectionName: "routeLogConfig"
			,entityName : "RouteLog"
		});

		routeLogConfig.add(new FieldConfig({
			fieldName : "clControls"
			,displayName: function() {
				var $ctlEl = $("<span>");
				$ctlEl.append($("<img class='clAdd'>")
				);
				return $ctlEl[0].outerHTML;
			}()
			,orderable: false
			,renderFunc : function(x) {
				var $ctlEl = $("<div>");
				$ctlEl.append($("<img class='clEdit'>"));
				$ctlEl.append($("<img class='clDelete'>"));
				return $ctlEl[0].outerHTML;
			}
			,editElement : {
				create: function(colName, currentValue) {
					var $ctlEl = $("<span>");

					$ctlEl.append($("<img class='clSave'>")
						.on("click", function(evt) {
							var serRow  = {};
							var newRow = false;
							var $tr = $(this).closest('tr');
							var rowData = $dataTable.fnGetData($tr);
							if (!rowData) {
								rowData = {};
								newRow = true;
							}
							$tr.find("td").each(function() {
								var $td = $(this);
								var colIdx = $td.index();
								var colName = $table.find('thead').find("th:eq(" + colIdx + ")").data("clcolname");
								console.log("working on col >" + colName + "<");
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
								var serializedVal = serializeFunc($editEl) || "";
								serRow[colName] = serializedVal;
								console.log("serRow is now >" + JSON.stringify(serRow) + "<");
								
							});
							
							//2DO: need to pass id to update!!!
							clLib.loggi("ID TO SAVE >" + JSON.stringify(rowData) + "<", "20150129");
							serRow["_id"] = rowData["_id"];
							clLib.loggi("USER TO SAVE >" + JSON.stringify(rowData) + "<", "20150129");
							serRow["username"] = rowData["username"] || clLib.getUserInfo()["username"];
							
							
							console.log("Serialized row >" + JSON.stringify(serRow) + "<");
							
							routeLogConfig.config.saveHandler(
								serRow
								,newRow
								,function(newId) {
									if(newRow) {
										serRow["_id"] = newId;
										console.error("adding >" + JSON.stringify(serRow) + "<");
										//window.dtDebug = true;
                                        $table.api().row.add(serRow);
									}
									else {
                                        serRow["_id"] = rowData["_id"];
                                        
										$tr.find("td").each(function() {
											var $td = $(this);
											var colIdx = $td.index();
											var colName = $table.find('thead').find("th:eq(" + colIdx + ")").data("clcolname");
											if(!colName) {
												alert("no colname at idx " + colIdx);
												return;
											}

											var currentFieldConfig = routeLogConfig.get(colName);
											// set underlying table cell data to new value..
											rowData[colName] = serRow[colName];
											// set table cell to NEW value(=> rendered :)
											console.log("serializing val >" + serRow[colName] + "< for row >" + colName + "<");
                                            $td.html(currentFieldConfig["renderFunc"](serRow[colName], serRow));
										});

                                        // Update underlying row data with (possibly) new values..
                                        $table.api().row($tr).data(rowData);

                                    }
                                    // 2DO: refresh filter for column
                                    clLib.loggi("triggering refresh on " + $dataTable.find("thead")[0].outerHTML, "20150129");
                                    //$dataTable.find("thead").find(".clRefreshable" ).trigger("clFilterRefresh", serRow);
                                   							
                                    $table.find("tr").removeClass("clBlurred");
                                    $table.find("th").removeClass("clBlurred");
                                    $tr.removeClass("clEdited");

                                    clLib.UI.web.tableEdited(false);
 
                                    console.log("refreshing table!");
                                    $table.api().draw();
                                    console.log("refreshed table!");
								}
								,function(e) {
									alert("Could not sync entity!");
									alert(">" + e + "<");
								}
							);
							

							
						})
					)
					;

					$ctlEl.append($("<img class='clCancel'>")
						.on("click", function() {
							var $tr = $(this).closest('tr');
							
                            if(!window["$origTr"] || $origTr.find("td").size() == 0) {
                                $tr.remove();
                            }
                            else 
                            {
                                $tr.removeClass("clEdited");
                                $tr.find("td").each(function(idx) {
                                    var $origTd = $origTr.find("td:eq(" + idx + ")")
                                    console.log($(this).attr("class") + " <-> " + $origTd.attr("class"));
                                    $(this).replaceWith($origTd.clone());
                                
                                });
                                console.log("origtr restored.");
                                $origTr.empty();
                            }

                            $table.find("tr").removeClass("clBlurred");
                            $table.find("th").removeClass("clBlurred");
                            
                            clLib.UI.web.tableEdited(false);
                        })
					);
				
					return $ctlEl;
				}
			}
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "username"
			,displayName: "User"
			,visible: false
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "DateISO"
			,visible: true
			,displayName: "Date"
			,renderFunc : function(x) { return clLib.ISOStrToDate(x); }
            ,validate: function(fieldData) {
                //alert("validating DateISO field for >" + fieldData + "<");
                if(!fieldData) {
                    clLib.loggi("wrong!", "20150202");
                    throw new FieldConfigError(this.config.displayName + " is mandatory!");
                }
                clLib.loggi("correct!", "20150202");
                return true;
            }
            ,filterElement: function(column, api, i) {
				var cont = $('<div class="fromToFilter" style="">').appendTo( $(column.header()) );
				
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
					var currentValue = clLib.ISOStrToDate(currentValue);
                    var $el = $("<div>");
					var $input = $("<input class='datePortion' style='width: 75px;'>")
						.val(
							currentValue.substring(0,10)
						);
					$el.append($input);
					$input.datepicker({
						showOn: "button",
						buttonImage: "/Joomla/KURT/files/views/assets/image/calendar.gif",
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
			fieldName : "_id"
			,visible: false
		}));
		
        routeLogConfig.add(new FieldConfig({
            fieldName : "GradeSystem"
            ,defaultValue: "UIAA"
//			,editElement: {
//			create: function(colName, currentValue) {
//				return "<h1>" + colName + "--" + currentValue + "</h1";
//			}
//		}
//
			,refreshOnUpdate: [
                "Grade"
                ,"score"
            ]
            ,getAvailableItems : function(column, api, successFunc) {
                var gradeSystems = Object.keys(clLib.gradeConfig);
                return successFunc(gradeSystems );
			}

		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Grade"
			,defaultValue: "I-"
            ,refreshOnUpdate: [
                "score"
            ]
			,editElement : {
				refreshFrom : [
					"GradeSystem"
				]
                , refresh : function($editElement, rowData) {
                    var oldValue = $editElement.val();
                    var gradeSystem = rowData["GradeSystem"];
                    var grades = clLib.gradeConfig[gradeSystem] ? Object.keys(clLib.gradeConfig[gradeSystem]["grades"]) : ["??"];
                    
                    
                    console.log("grades for gradesystem >" + gradeSystem + "> are >" + JSON.stringify(grades) + "<");
                    var optionsAsString = "";
                    $.each(grades, function(idx, grade) {
                        optionsAsString += "<option value='" + grade + "'>" + grade + "</option>";
                    });
                    
                    console.log("adding options >" + optionsAsString + "<");
                    $editElement.find('option').remove().end().append($(optionsAsString));
                    $editElement.val(oldValue);

                }

			}				
        }));
        

		routeLogConfig.add(new FieldConfig({
			fieldName : "score"
			,displayName: "Score"
			,visible: true
			,dummyField: true
			,renderFunc : function(colValue, rowValue) {
				var score = clLib.computeScore(rowValue);
				console.log("returning score of >" + score + "<");
				return score;
			}
			,editElement : {
				refreshFrom : [
					"GradeSystem"
					,"Grade"
				]
				, create: function(colName, currentValue, $thead, currentFieldConfig, rowData) {
					//alert("rowData is >" + JSON.stringify(rowData) + "<");
					var $el  = $("<span>..loading..</span>");
                    return $el;
				}
                , refresh : function($editElement, rowData) {
                    var fieldConfig = this.config;
                    //alert("XXXroutelog is >" + JSON.stringify(rowData) + "<");
                    var newValue = fieldConfig.renderFunc("", rowData);
                    console.log("XXXnewValue is >" + JSON.stringify(newValue) + "<");

                    $editElement.html(newValue);
                }
				,serialize : function($editElement) {
					var val = 
						$editElement.find("span").html();
					return val;
				}
			}				
			

		}));
        
        routeLogConfig.add(new FieldConfig({
			fieldName : "Rating"
			,renderFunc : function(x) {
				return clLib.UI.ratingToStars(x);
			}
            ,getAvailableItems : function(column, api, successFunc) {
                return successFunc([
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ]);
			}
            
		}));

		routeLogConfig.add(new FieldConfig({
			fieldName : "Sector"
			,visible: false
			,getAvailableItems : function(column, api, successFunc) {
				return clLib.REST.getEntitiesDistinctFields(
					"RouteLog"
					,this.fieldName
					,{}//{"username": function() { return clLib.getUserInfo()["username"]}()} /*"foo6@gmail.com"} */ 
					,function(items) {
						console.log("1got items >" + items + "<");
						console.log("1bgot items >" + JSON.stringify(items) + "<");
						return successFunc(items["RouteLog"]);
					}
				);
			}
			
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Line"
			,visible: false
			,getAvailableItems : function(column, api, successFunc) {
				return clLib.REST.getEntitiesDistinctFields(
					"RouteLog"
					,this.fieldName
					,{}//{"username": function() { return clLib.getUserInfo()["username"]}()} /*"foo6@gmail.com"} */ 
					,function(items) {
						console.log("1got items >" + items + "<");
						console.log("1bgot items >" + JSON.stringify(items) + "<");
						return successFunc(items["RouteLog"]);
					}
				);
			}
		}));
		routeLogConfig.add(new FieldConfig({
			fieldName : "Colour"
			,renderFunc : function(x) { 
				//console.log("rendering >" + x + "<");
				var colourDisplayName = x;
				if(x === undefined || x == "" || x == '__UNKNOWN__') {
					x = "__UNKNOWN__";
					colourDisplayName = "?";
				}
				//console.log("x >" + x + "<");
				var $colour = clLib.tickTypeSymbol("Colour", x, {"Colour": x});
				if($colour && x ) {
					$colour.css("width", "100%");
					$colour.css("margin-left", "0px");
					$colour.css("text-align", "center");
					$colour.css("font-weight", "bold");
					$colour.css("height", "22px");
					$colour.append(colourDisplayName);
					return $colour[0].outerHTML; 
				}
				else {
					return "furzkacki!";
				}
			}
			,getAvailableItems : function(column, api, successFunc) {
				return clLib.REST.getEntitiesDistinctFields(
					"RouteLog"
					,this.fieldName
					,{}//{"username": function() { return clLib.getUserInfo()["username"]}()} /*"foo6@gmail.com"} */ 
					,function(items) {
						console.log("1got items >" + items + "<");
						console.log("1bgot items >" + JSON.stringify(items) + "<");
						return successFunc(items["RouteLog"]);
					}
				);
			}
			,editElement : {
				create: function(colName, currentValue, $thead, currentFieldConfig) {
					var $colourSelector = $('<div title="Colour Selector">');
					var fieldConfig = this.config;
					
					var $colourDisplay; 
					$colourDisplay = $(fieldConfig.renderFunc(currentValue));
					
					$colourDisplay.data("clValue", currentValue);
					
					this.config.getAvailableItems(
						null
						,null
						,function(items) {

							$colourDisplay.on("click", function(e) {
								$colourSelector.dialog();
							});
							$.each(items, function(idx, colour) {
								$colourSelector.append(
									$(currentFieldConfig.renderFunc(colour))
										.on("click", function(e) {
											console.log("setting colourdisplay to " + colour);
											$colourDisplay.replaceWith($(currentFieldConfig.editElement.create(colName, colour, $thead, currentFieldConfig)));
											$colourDisplay.data("clValue", colour);
											$colourSelector.dialog("close");
										})
								);
							});
							console.log("colourDisplay returned >" + $colourDisplay.html() + "<");
							return $colourDisplay;
						}
					);
					
					return $colourDisplay;
				}
				,serialize : function($editElement) {
					var val = 
						$editElement.find(".clCSSBg").data("clValue"); 
					return val || "";
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
            ,getAvailableItems : function(column, api, successFunc) {
                return successFunc([
                    "slab",
                    "vertical",
                    "overhang",
                    "roof"
                ]);
			}

		}));
		
		routeLogConfig.add(new FieldConfig({
			fieldName : "deleted"
			,visible: false
		}));

		
		
		clLib.webFieldConfig["_routeLogConfig"] = routeLogConfig;



		
