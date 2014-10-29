"use strict";
clLib.UI.cssBackgrounds = {
    "colourSelect": {
        "white/green/blue" : "white-green-blue"
        , "white/yellow/black" : "white-yellow-black"
    }
    , "characterSelect": {
        "Ueberhaengend": "Ueberhaengend"
    }
};



clLib.UI.pageRequisites = {
    "startScreen": { 
        "clBeforeChange" : [
            function(successFunc, errorFunc) {
                console.log("!?!?!?! change to users - but WITH redirect!!!!");
                return clLib.tryLogin(successFunc, errorFunc, false);
            }
            ,clLib.prefsCompleteCheck
            ,clLib.wasOnlineCheck
        ]
    }
    , "preferences": {}
    , "newRouteLog_default": { 
		"clBeforeChange" : [clLib.prefsCompleteCheck, clLib.tryLogin, clLib.wasOnlineCheck
/*            ,function (callbackFunc, errorFunc) {
				var options = {};
				options.uri = clLib.REST.clLibServerURI + "/sleep/5";
				return clLib.REST.execGET(options, callbackFunc, errorFunc);
			}
*/
        ] 
	}
    , "newRouteLog_reduced": { 
		"clBeforeChange" : [clLib.prefsCompleteCheck, clLib.tryLogin, clLib.wasOnlineCheck
/*            ,function (callbackFunc, errorFunc) {
				var options = {};
				options.uri = clLib.REST.clLibServerURI + "/sleep/5";
				return clLib.REST.execGET(options, callbackFunc, errorFunc);
			}
*/
        ] 
	}
    , "users": { "clBeforeChange" : [function(successFunc, errorFunc) {
        console.log("!!!!!changing to users - but no redirect(=>useless)..");
        return clLib.tryLogin(successFunc, errorFunc, true);
    }] }
    , "users_clLogin": { "clBeforeChange" : [function(successFunc, errorFunc) {
        console.log("!!!!!changing to users - but no redirect(=>useless)..");
        return clLib.tryLogin(successFunc, errorFunc, true);
    }] }
    , "users_verification": { }
    , "buy": { }
    , "stats": {
		"clBeforeChange" : [
			function(successFunc, errorFunc) {
//				alert("checking for full version...");
				
				//return successFunc();
				
				return clLib.IAP.hasFullVersion(
					function() {
						//alert("yes, has full version...");
						return successFunc();
					}, 
					function(e) {
						//alert("don't know about full version, check IAP..");
						return clLib.PAGES.changeTo("clLib_buy.html", {"targetPage": "clLib_stats.html"});
					}
				);
			}
		]
	}
    , "diagram": {
		"clBeforeChange" : [
			function(successFunc, errorFunc) {
				//return successFunc();

				//alert("checking for full version...");
				return clLib.IAP.hasFullVersion(function() {
					//alert("yes, has full version...");
					return successFunc();
				}, 
				function(e) {
					//alert("don't know about full version, check IAP..");
					return clLib.PAGES.changeTo("clLib_buy.html", {"targetPage": "clLib_diagram.html"});
				}
				);
			}
		]
	}
    , "AGB": { }
    , "feedback": { }
    , "trickGoogle": { }
    , "purchases": { }
	, "areaSearch": {}
};


clLib.UI.saveHandlers= {
      "preferences": clLib.UI.localStorageSaveHandler
    , "newRouteLog_default": clLib.UI.RESTSaveHandler
    , "newRouteLog_reduced": clLib.UI.RESTSaveHandler
    , "startScreen": clLib.UI.RESTSaveHandler
    , "users": clLib.UI.userHandler
    , "users_clLogin": clLib.UI.userHandler
    , "users_verification": clLib.UI.userHandler
    , "feedback": clLib.UI.RESTSaveHandler
};

clLib.UI.autoLoad = {
	_COMMON_ : {
		default: [
			"displayName"
			, "defaultLayoutMenuSwitch"
		]
		,reduced: [
			"displayName"
			, "defaultLayoutMenuSwitch"
		]
	} 
	,newRouteLog_default : {
		default: [
			"gradeSystemSelect"
			, "searchRoute"
			, "ratingSelect"
			, "tickType_redpoint"
			, "tickType_flash"
			, "tickType_attempt"
			, "tickType_toprope"
			, "characterSelect"
			, "routeLogContainer"
		]
	}
	,newRouteLog_reduced : {
		default: [
			"gradeSystemSelect"
			, "ratingSelect"
			, "tickType_redpoint"
			, "tickType_flash"
			, "tickType_attempt"
			, "tickType_toprope"
			, "colourSelect"
			, "characterSelect"
			, "routeLogContainer"
		]
	}
	,gradeConversion : {
		default: [
			"gradeSystemSelect"
			, "gradeSelect"
			, "convertedGrades"
		],
	}
	,startScreen: {
		default: [
			"areaSelect"
			, "onlineIcon"
			, "currentScore"
			, "areaSearchButton"
			]
	}
	,preferences : {
		default: [
			, "displayName"
			, "buddiesStr"
			, "showTopX"
			, "defaultLayout"
			, "defaultGradeSystem"
			, "defaultGrade"
			, "onlineMode"
			, "selectedGradeSystems"
		]
	}
    ,users : {
		default: [
			"currentUser",
			"currentPassword",
			"loginError"
		]
	}
    ,"users_clLogin": {
		default: [
			"currentUser",
			"currentPassword",
			"loginError"
		]
	}
    ,"users_verification" : {
		default: [
			"currentUser"
			,"notification"
			,"loginError"
		]
	}
    ,"stats" : {
		default: [
			"todaysRouteLogs"
			//,"monthRouteLogs"
			,"allRouteLogs"
		]
	}
    ,"diagram" : {
		default: [
		]
	}
	,"areaSearch": {
		default: [
			"searchAreaTypeSelect"
			, "searchArea"
			, "searchAreaResults"
			, "selectedArea"
		]
	}
};

clLib.UI.elementsToReset = {
	newRouteLog_default : [
		"lineSelect",
		"sectorSelect",
		"colourSelect",
		"ratingSelect",
		"searchRouteResults",
		"searchRoute",
		"routeLogContainer"/*,
		"characterSelect"*/
	]
	,areaSearch: [
		"searchArea"
		,"searchAreaResults"
		,"searchAreaTypeSelect"
		,"selectedArea"
	]
	,newRouteLog_reduced : [
		"lineSelect",
		"sectorSelect",
		"colourSelect",
		"ratingSelect",
		"searchRouteResults",
		"searchRoute",
		"routeLogContainer"/*,
		"characterSelect"*/
	]
	, startScreen : [
		"currentScore"
		,"areaSearchButton"
	]
	, gradeConversion: [
		"gradeSystemSelect"
		, "gradeSelect"
		, "convertedGrades"
	]
    , preferences: [
		, "displayName"
		, "buddiesStr"
        , "showTopX"
        , "defaultLayout"
        , "defaultGradeSystem"
        , "defaultGrade"
		, "selectedGradeSystems"
    	]
    , users: [
		"currentUser"
		, "currentPassword"
        , "loginError"
    	]
    , users_clLogin: [
		"currentUser"
		, "currentPassword"
        , "loginError"
    	]
    , users_verification: [
        "loginError"
    	]
	, feedback: [
		"feedbackText"
	]

};

clLib.UI.pageElements = {
	_COMMON_ : {
		default: [
			"displayName"
			, "defaultLayoutMenuSwitch"
		]
		,reduced: [
			"displayName"
			, "defaultLayoutMenuSwitch"
		]
	}, 
	gradeConversion : {
		default: [
			"gradeSystemSelect"
			, "gradeSelect"
			, "convertedGrades"
		]
	}
	,newRouteLog_default : {
		default: [
    		"currentLayout"
            , "gradeSystemSelect"
			, "gradeSelect"
			, "sectorSelect"
			, "colourSelect"
			, "lineSelect"
			, "searchRouteResults"
			, "searchRoute"
			, "commentText"
			, "ratingSelect"
			, "tickType_redpoint"
			, "tickType_flash"
			, "tickType_attempt"
			, "tickType_toprope"
			, "characterSelect"
			, "selectedArea"
			, "currentUserPref"
			, "currentDate"
			, "routeLogContainer"
		]
	}
	,areaSearch: {
		default: [
			"searchArea"
			,"searchAreaResults"
			,"searchAreaTypeSelect"
			,"selectedArea"
		]
	}
	,newRouteLog_reduced : {
		default: [
            "currentLayout"
            , "gradeSystemSelect"
			, "gradeSelect"
			, "colourSelect"
			, "ratingSelect"
			, "tickType_redpoint"
			, "tickType_flash"
			, "tickType_attempt"
			, "tickType_toprope"
			, "characterSelect"
			, "commentText"
			, "selectedArea"
			, "currentUserPref"
			, "currentDate"
			, "routeLogContainer"
		]
	}
	,startScreen: {
	    default: [
			"areaSelect"
			, "selectedArea"
			, "onlineIcon"
			, "currentScore"
			,"areaSearchButton"
	    ]
	}
    , preferences: {
        default: [
			"currentUserReadOnly"
			, "displayName"
			, "buddiesStr"
            , "showTopX"
            , "defaultLayout"
            , "defaultGradeSystem"
            , "defaultGrade"
            , "onlineMode"
			, "selectedGradeSystems"
        ]
    }
    ,users: {
        default: [
			"currentUser"
			,"currentPassword"
			,"loginError"
        ]
    }
    ,users_clLogin: {
        default: [
			"currentUser"
			,"currentPassword"
			,"loginError"
        ]
    }
    ,"users_verification": {
        default: [
			"currentUser",
			"notification"
			,"verificationToken"
			,"password"
			,"loginError"
        ]
    }
    ,"stats": {
        default: [
			, "todaysRouteLogs"
			//, "monthRouteLogs"
			, "allRouteLogs"
			, "yearRouteLogs"
        ]
    }
    ,"diagram": {
        default: [
        ]
    }
	, "feedback": {
		default: [
			"feedbackText"
		]
	}

};



clLib.UI.elements = {
	"verificationToken": $.extend({}, {
		"dbField": "verificationToken"
    }, clLib.UI.elementConfig.plainElement)
	,"username": $.extend({}, {
		"dbField": "username"
    }, clLib.UI.elementConfig.plainElement)
	,"password": $.extend({}, {
		"dbField": "password"
    }, clLib.UI.elementConfig.plainElement)
	,"email": $.extend({}, {
		"dbField": "email"
    }, clLib.UI.elementConfig.plainElement)
	,"currentUserReadOnly": $.extend({}, {
		"dbField": "username"
    }, clLib.UI.elementConfig.localVar)
	,"displayName": $.extend({}, clLib.UI.elementConfig.localVar, {
		"dbField": "displayName"
		,"refreshHandler": function ($this) {
			//alert("!!!!!!!!!!!!refreshing " + $this.attr("id") + " with >" + JSON.stringify(clLib.getUserInfo()));
            var $currentUser;
            
            var imageURL = clLib.getUserInfo()["imageURL"];
            var displayName = clLib.getUserInfo()["displayName"] || "????";
            var authType = clLib.getUserInfo()["authType"];

/*
<div style="width: 200px; border: 1px solid red">
<img src="files/views/assets/image/redpoint.PNG" style="float:left; width:35px; height:35px;"/>
<span style="border: 1px solid green; float: left; margin-top:10px;">woi fal</span>
<img src="files/views/assets/image/googleAuth.jpg" style="border: 1px solid blue; float:right; vertical-align: middle;width:15px; height:15px;"/>

*/
            
            $currentUser = $("<div>");
            if(imageURL) {
                $currentUser.append(
                    $("<img>")
                    .attr({
                        "src" : imageURL
                    })
                    .css({
                        float: "left"
                        ,width : "25px"
                        ,height : "25px"
                    })
                )
            }
            $currentUser.append(
                $("<span>")
                    .css({
                        float: "left"
                        ,"margin-left": "10px"
                        ,border: "0px solid red"
                    })
                    .text(displayName)
            )
            ;
            if(authType == 'facebook' || authType == 'google') {
                var authTypeImgURL = "";
                if(authType == "google") {
                    authTypeImgURL = "files/views/assets/image/googleAuth.jpg";
                }
                else if(authType == "facebook") {
                    authTypeImgURL = "files/views/assets/image/facebookAuth.png";
                } 
                $currentUser.append(
                    $("<img>")
                    .attr({
                        "src" : authTypeImgURL
                    })
                    .css({
                        width : "25px"
                        ,height : "25px"
                        ,float: "right"
                    })
                );
            }
            
            console.log("emptying userinfo div..");
            $this.empty();
            console.log("appending new user info.." + $currentUser.html());
            $this.append($currentUser);
            //$this.trigger("refresh");
            
/*
			var elValue;
			if(localStorage.getItem("displayName") && localStorage.getItem("displayName") != "undefined") {
				//alert("yes, display name found: >" + localStorage.getItem("displayName") + "<");
				elValue = localStorage.getItem("displayName");
			} 
			else {
				//alert("no, display name not found, using currentUser..");
				elValue = localStorage.getItem("currentUser");
			}
			var jqmDataRole = $this.attr("data-role");
			if (jqmDataRole == "button") {
				$this.text(elValue);
				$this.button("refresh");
			} else if($this.is("span")) {
				$this.text(elValue);
			}
			else {
				$this.val(elValue);
			}
			//alert("set value to " + localVarValue);
			//$("#mypanel").trigger("create");
*/
        }
	})

    ,"currentUser": $.extend({}, {
		"dbField": "username"
    }, clLib.UI.elementConfig.localVarSaveImmediately)
	,"currentPassword": $.extend({}, clLib.UI.elementConfig.localVar, {
		"dbField": "password"
	    ,"refreshHandler": function ($this) {
			//alert("refreshing currentpwd" + localStorage.getItem("currentPassword"));
			if(localStorage.getItem("currentPassword")) {
				$this.val("xxxxxxxx");	
			} else {
				$this.val("");
			}
			//alert("click handler?");
			$this.off("click").on("click", function(e) {
				//alert("password clicked!!");
				$this.val("");
			});
		}
	})
    , "loginError": $.extend({}, clLib.UI.elementConfig.localVar, {
	    "refreshHandler": function ($this) {
			//alert("loginError with id >" + $this.attr("id") + "<");
			
			//alert("hiding " + "#" + $this.attr("id") + "Container");
			$("#" + $this.attr("id") + "Container").hide();
			var elementName = clLib.UI.elementNameFromId($this.attr("id"));
			//alert("loginError with name >" + elementName + "<");

			var clInfoObj = clLib.getUIMessage();
			$this.empty();

			if(clInfoObj && clInfoObj["message"]) {
				var $clInfoEl = $("<div>"+ clInfoObj["message"] + "</div>");
				$clInfoEl
/*					.css({
						"background-color": "#00BB00"
						,"color" : "white"
						,"font-weight" : "normal"
						,"margin-left" : "10px"
						,"margin-right" : "10px"
					})*/
					.addClass("clInfo")
					.addClass(clInfoObj["infoType"])
					.buttonMarkup({
						"icon": clInfoObj["infoType"] == "error" ? "alert" : "info"
						,"iconpos": "right"
						,"theme": "b"
					});
				$this.append($clInfoEl);
				//alert("set value to " + localVarValue);
			}
		}
        ,
		"dbField": "loginError"
    })
	, "notification": $.extend({}, clLib.UI.elementConfig.localVar, {
	    "refreshHandler": function ($this) {
			//alert("hiding " + "#" + $this.attr("id") + "Container");
			$("#" + $this.attr("id") + "Container").hide();
			var elementName = clLib.UI.elementNameFromId($this.attr("id"));
			var localVarValue = localStorage.getItem(elementName);
			if(localVarValue) {
				//alert("yes, value; " + localVarValue);
				$("#" + $this.attr("id") + "Container").show();
				//alert("AAAA setting element " + elementName + " to " + localStorage.getItem(elementName));
				//$this.val(localVarValue).attr('selected', true).siblings('option').removeAttr('selected');
				//$this.selectmenu("refresh", true);
				var jqmDataRole = $this.attr("data-role");
				if (jqmDataRole == "button") {
					//alert("button - " + $this.attr("id") + " setting txt to " + localVarValue);
					$this.text(localVarValue);
		//            $this.find(".ui-btn-text").text(localVarValue);
					$this.button("refresh");
				} 
				else if($this.prop("tagName") == "SPAN") {
					$this.html(localVarValue);
				}		
				else {
					$this.val(localVarValue);
				}
				//alert("set value to " + localVarValue);
			}
		}
        ,
		"dbField": "loginError"
    })
    , "buddiesStr": clLib.UI.elementConfig.localVar
    , "showTopX":       clLib.UI.elementConfig.localVar
    , "onlineMode":     clLib.UI.elementConfig.localVar
    , "defaultLayout":  clLib.UI.elementConfig.localVar
	,"defaultLayoutMenuSwitch": $.extend({}, clLib.UI.elementConfig.localVarSaveImmediately, {
		"dbField": "username"
		,"localVar" : "defaultLayout"
    } )
	, "defaultGradeSystem" : {
		"localVarField" : "defaultGradeSystem"
		,"localStorageVar" : "selectedGradeSystems"
		,"dbField" : "GradeSystem"
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) { 
			//alert("refreshing defaultGradeSystem..");
			return clLib.UI.localStorageRefreshHandler($this, {
				selectedValue : localStorage.getItem("defaultGradeSystem") || "UIAA",
				preserveCurrentValue : true,
				additionalValue : null,
				strDataObj: function() { return clLib.UI.getVal("selectedGradeSystems"); }()
				,localStorageVar : "selectedGradeSystems"
			});
		}
		,"refreshOnUpdate" : {
			default: {
				"defaultGrade" : {}
			}
		}
    }
	, "selectedGradeSystems" : {
		"localVarField" : "selectedGradeSystems"
		,"dbField" : "GradeSystem"
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) { 
			clLib.UI.defaultRefreshHandler($this, {
				selectedValue : localStorage.getItem("selectedGradeSystems") || clLib.UI.varDefaults["selectedGradeSystems"],
				preserveCurrentValue : true,
				additionalValue : null	
			});
			$("input[type='checkbox']", $this).off("click").on("click", function(e) {
				var $optionEl = $(this);
				//alert("this checked is" + ($optionEl.is(":checked")));
				var selectedOptions = clLib.UI.getVal(clLib.UI.elementNameFromId($this.attr("id")));
				var selectedOptionsArr = selectedOptions ? selectedOptions.split(",") : [];
				if(selectedOptionsArr.length > 3) {
					alert("Only 3 default grade systems can be selected!");
					$(this).prop("checked", false);
				}
			});

		}
		,"refreshOnUpdate" : {
			default: {
				"defaultGradeSystem" : {}
			}
		}
		,"customVal" : function($this) {
			//alert("getting customval for selectedGradeTyoeSystems..");
			var commaSepVals = [];
			$.each($this.find("input:checkbox:checked"), function(idx, el) {
				commaSepVals.push($(el).val());
			});
			commaSepVals = commaSepVals.join(",");
			//alert("commaSepVals = " + commaSepVals);
			return commaSepVals;
		}


    }
    , "defaultGrade": {
		"localVarField" : "defaultGrade"
		,"dbField" : "Grade"
		,"dependingOn": {
			default: [
				"defaultGradeSystem"
			],
		}
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) {
			var selectedValue = clLib.findEquivalentGrade(
				localStorage.getItem("defaultGradeSystem") || "UIAA"
				, localStorage.getItem("defaultGrade") || "VI"
				, $("#preferences_defaultGradeSystem").val()
			);

			//alert("preselecting " + selectedValue);
			return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : selectedValue,
				preserveCurrentValue : false,
				additionalValue : null	
			});
		}
	}
    , "currentLayout": {
        "refreshHandler": function ($this) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = localStorage.getItem(elementName);
            $this.val(localVarValue);
        }
        , "changeHandler": function ($this, changeOptions) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = $this.val();
            localStorage.setItem(elementName, $this.val());
            location.reload();
        }
    }   
	, "gradeSystemSelect" : {
		"dbField" : "GradeSystem"
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) { 
			return clLib.UI.localStorageRefreshHandler($this, {
				selectedValue : localStorage.getItem("defaultGradeSystem") || "UIAA",
				preserveCurrentValue : true,
				additionalValue : null,
				localStorageVar : "selectedGradeSystems"
			});
		}
		,"refreshOnUpdate" : {
			default: {
				"gradeSelect" : {}
			}
		}
		,"customVal" : function($this) {
			if($this.find("input:radio:checked" ).size() > 0) {
				return $this.find("input:radio:checked" ).val();
			} 
			else {
				return $this.val();
			}
		}
	}
	, "searchAreaTypeSelect" : {
		"dbField" : "YYY"
		,"refreshFromEntity" : "XXX"
		,"refreshHandler" : function($this) { 
			return clLib.UI.localStorageRefreshHandler($this, {
				selectedValue : "Near",
				preserveCurrentValue : true,
				additionalValue : null,
				strDataObj : "Near,Search" /*"Near,Fav.,Search"*/
			});
		}
		,"refreshOnUpdate" : {
			default: {
				"searchAreaResults" : {}
			}
		}
		,"customVal" : function($this) {
			if($this.find("input:radio:checked" ).size() > 0) {
				return $this.find("input:radio:checked" ).val();
			} 
			else {
				return $this.val();
			}
		}
	}
	,"searchAreaResults" : {
		"refreshHandler" : function($this, options) { 
		    options = options || {};
			var $inElement = $this;
			;
			var results;
			var $forElement = clLib.UI.byId$("selectedArea");

			if(clLib.UI.getVal("searchAreaTypeSelect") == "Search") {
				clLib.UI.byId$("searchArea").parent(".ui-input-search").show();

				console.log("Searching areas...");
				results= clLib.UI.defaultEntitySearch(
					"Area",
					"AreaName", 
					[], 
					true, 
					{"AreaName": { "$like" : clLib.UI.byId$("searchArea").val() }}
					,true
				);
				console.log("Found areas >" + JSON.stringify(results) + "<");

				clLib.populateSearchProposals($forElement, $inElement, results, options["hideOnSingleResult"]);

			}
			else if(clLib.UI.getVal("searchAreaTypeSelect") == "Near") {
				clLib.UI.byId$("searchArea").parent(".ui-input-search").hide();
				if (navigator.geolocation) {
					alert("getting current position..");
					navigator.geolocation.getCurrentPosition(function(position) {
						alert("GOT current position..");

						var additionalParams = {
							geoPos : {
								lat: position.coords.latitude
								,lng: position.coords.longitude
							}
						};
						console.log("Getting areas for geopos >" + JSON.stringify(additionalParams) + "<");
						clLib.REST.getEntities("AreaRaw3", {}
						,function(resultObj) {
							console.log("Found areas >" + JSON.stringify(resultObj) + "<");
							
							clLib.populateSearchProposals($forElement, $inElement, resultObj["AreaRaw3"], options["hideOnSingleResult"]
							,function(dataRow) {
								var $listItem = $('<li></li>')
									.append($("<h2>")
										.append(dataRow.Name)
									)
									.append($("<span>")
										.addClass("ui-li-count")
										.append(parseFloat(dataRow.dis).toFixed(0) + "m")
									)
									.append($("<p>")
										.append(dataRow.Address)
									)
									.attr("clValue", dataRow.Name);
								return $listItem;
							});

						}
						,function(e) {
							alert(e);
						}
						,additionalParams);
					
					}
					,function(e) {
						alert("Geolocation not available: >" + e.code + "<");
					},
					{timeout: 5000
					,maximumAge: 300000}
					);
				} else {
					alert("Geolocation is not supported by this browser.");
				}

			}
		}
	}
	,"searchArea" : {
		"dbField" : "AreaName"
		,"refreshHandler" : function($this, options) { 
			$this.bind("keyup.clLib", function() {
				clLib.UI.byId$("searchAreaResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
			$this.bind("click.clLib", function() {
				clLib.UI.byId$("searchAreaResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
		
		}
		,"setSelectedValueHandler" : function($this, changeOptions) {
			if(changeOptions["value"] == clLib.UI.NOTSELECTED.value) {
				$this.val("");
				return;
			}
			alert("setting search result to >" + changeOptions["value"] + "<");
			$this.val(changeOptions["value"]);
		}
	}

	, "gradeSelect" : {
		"dbField" : "Grade"
		,"dependingOn": {
			default: [
				"gradeSystemSelect"
			],
		}
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) {
			//alert("getting grades for " + localStorage.getItem("defaultGradeSystem") + " and " + localStorage.getItem("defaultGrade"));
			var selectedValue = clLib.findEquivalentGrade(
				localStorage.getItem("defaultGradeSystem") || "UIAA"
				, localStorage.getItem("defaultGrade") || "VI"			
				, clLib.UI.getVal(clLib.UI.elementNameFromId(clLib.UI.currentPage() + "_" + "gradeSystemSelect"))
			);

			
			console.log("preselecting " + selectedValue);
			return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : selectedValue,
				preserveCurrentValue : false,
				additionalValue : null	
			});
		}
		,"refreshOnUpdate" : {
			default: {
				"sectorSelect" : {}
				,"lineSelect": {}
				, "convertedGrades" : {}
			},
			reduced: {
				"colourSelect" : {}
			}
		}
	}
	, "convertedGrades" : {
		"dependingOn": {
			default: [
				"gradeSystemSelect"
			],
		}
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) {
			$this.empty();
			//$this.html("<ul>");
			//$this.attr("data-role", "listview");
			var selectedGradeSystems = localStorage.getItem("selectedGradeSystems");
			if(!selectedGradeSystems) {
				selectedGradeSystems = clLib.UI.varDefaults["selectedGradeSystems"];
			}
			selectedGradeSystems = selectedGradeSystems.split(",");

			$.each(selectedGradeSystems, function(idx, gradeSystemName) {
				var aGrade = clLib.findEquivalentGrade(
					clLib.UI.getVal(clLib.UI.elementNameFromId(clLib.UI.currentPage() + "_" + "gradeSystemSelect"))
					, clLib.UI.getVal(clLib.UI.elementNameFromId(clLib.UI.currentPage() + "_" + "gradeSelect"))
					, gradeSystemName
				);

				var $foo = $("<li style='height: 30px;'>");
				$foo
					.append("<span style='position: absolute; top: 50%; margin-top: -10px; left: 10px;  width: 80px; border: 0px solid red;'>"+ gradeSystemName + "</span>")
					.append("<span style='position: absolute; top: 50%; margin-top: -10px; left: 50%; width: 80px; border: 0px solid blue;'>" + aGrade  + '</span>')
					.append('<span class="ui-li-count">' + clLib.gradeConfig[gradeSystemName]["grades"][aGrade] + '</span>');
				$this.append($foo);
			});

			$this.listview("refresh");
		}
	}
	, "tickType_redpoint" : $.extend({}, {
		"customVal" : function($this) {
			return $this.prop("checked");
		}
    }, clLib.UI.elementConfig.plainElement)
	, "tickType_flash" : $.extend({}, {
		"customVal" : function($this) {
			return $this.prop("checked");
		}
    }, clLib.UI.elementConfig.plainElement)
	, "tickType_attempt" : $.extend({}, {
		"customVal" : function($this) {
			return $this.prop("checked");
		}
    }, clLib.UI.elementConfig.plainElement)
	, "tickType_toprope" : $.extend({}, {
		"customVal" : function($this) {
			return $this.prop("checked");
		}
    }, clLib.UI.elementConfig.plainElement)
	, "sectorSelect" : {
		"dbField" : "Sector"
		,"dependingOn": {
			default: [
				"gradeSystemSelect", "gradeSelect", "selectedArea", "lineSelect"
			],
		}
		,"refreshHandler" : function($this) { return clLib.UI.defaultRefreshHandler($this); }
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			clLib.UI.setSelectedValue(clLib.UI.byId$("lineSelect"), clLib.UI.NOTSELECTED);
			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
		,"refreshOnUpdate" : {
			default: {
				"colourSelect" : {}
				,"lineSelect" : {}
			}
		}
	},
	"lineSelect" : {
		"dbField" : "Line"
		,"dependingOn" : {
			default: [
				"gradeSystemSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
			]
		}
		,"refreshHandler" : function($this) { 
			return clLib.UI.defaultRefreshHandler($this, { preserveCurrentValue: false });
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			var $sectorSelect = clLib.UI.byId$("sectorSelect");
			
			var results = clLib.UI.defaultEntitySearch("Routes", "Sector", ["gradeSystemSelect", "gradeSelect", "selectedArea", "lineSelect"], true);
			
			if(results.length == 1) {
				clLib.UI.setSelectedValue($sectorSelect, results[0]);
				$sectorSelect.selectmenu('refresh', true);
			} else {
				var $lineSelect = clLib.UI.byId$("lineSelect");
				if($lineSelect.val() != clLib.UI.NOTSELECTED.value) {
					//clLib.loggi("2013-10-07-WTF!?!?!? multiple sectors for line " + $lineSelect.val() + " found - setting sector to the one of first result...");
					clLib.UI.setSelectedValue($sectorSelect, results[0]);
				}

				$sectorSelect.selectmenu('refresh', true);
			}

			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
		,"refreshOnUpdate" : {
			default: {
				"colourSelect" : {}
			}
		}
	},
	"colourSelect": {
		"dbField" : "Colour"
		,"dependingOn" : {
		    default: [
				"gradeSystemSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
		    ]
			, reduced: []
		}
		,"refreshHandler" : function($this, additionalOptions) { 
		    //alert("refreshing colours with >" + JSON.stringify(additionalOptions) + "<");
			clLib.UI.defaultRefreshHandler(
				$this
				,$.extend(additionalOptions, { preserveCurrentValue: false })
			);
		    clLib.addCSSBackground($this.attr("id"), {addClasses: "clColourBg"});
			$("#" + clLib.UI.currentPage() + "_colourSelect-listbox-popup")
				.find(".ui-btn.clCSSBg.more.clColourBg").click(function(e) {
					$("#" + clLib.UI.currentPage() + "_colourSelect")
						.trigger("refresh.clLib", 
						{
							dependingOnOverride:1
						})
						;
				});
	
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			//alert("Setting selected value..");
			clLib.UI.setSelectedValueOnlyHandler($this, changeOptions);
			clLib.addCSSBackground($this.attr("id"));
		}
		,"refreshOnUpdate" : {
		    default: {
		        "searchRouteResults": {
		            // 2013-12-20 WD: don't hide single result - causes select boxes to never be able to get "unselected" again.
					//hideOnSingleResult: true
					hideOnSingleResult: false
		        }
		    }
        }
		,"changeHandler" : function($this, changeOptions) {
		    var $forElement = clLib.UI.byId$("searchRoute");
			$forElement.val("");
			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
	},
	"searchRouteResults" : {
		"refreshHandler" : function($this, options) { 
		    options = options || {};
			var $inElement = $this;
			var $forElement = clLib.UI.byId$("searchRoute");
			;
			
			var results= clLib.UI.defaultEntitySearch(
				"Routes",
				"Name", 
				["gradeSystemSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect", "lineSelect"], 
				true, 
				{"Name": { "$starts-with" : $forElement.val() }}
			);

			clLib.populateSearchProposals($forElement, $inElement, results, options["hideOnSingleResult"]);
		}
	},
	"searchRoute" : {
		"dbField" : "RouteName"
		,"refreshHandler" : function($this, options) { 
			$this.bind("keyup.clLib", function() {
				clLib.UI.byId$("searchRouteResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
			$this.bind("click.clLib", function() {
				clLib.UI.byId$("searchRouteResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
/*
			$this.bind("change.clLib.route", function() {
			});
*/
		
		}
		,"setSelectedValueHandler" : function($this, changeOptions) {
			if(changeOptions["value"] == clLib.UI.NOTSELECTED.value) {
				$this.val("");
				return;
			}
			//alert("setting search result ");
			$this.val(changeOptions["value"]);
			
			
			//
			//	set all other elements to the one of the currently selected route..
			//
			var currentRoute = clLib.UI.defaultEntitySearch(
				"Routes",
				"Sector", 
				["gradeSystemSelect", "gradeSelect"], 
				false, 
				{"Name": changeOptions["value"]})
			;
			//alert("got current route" + JSON.stringify(currentRoute));
			if(currentRoute) {
				clLib.UI.setSelectedValue(clLib.UI.byId$("sectorSelect"), currentRoute[0]["Sector"]);
				clLib.UI.setSelectedValue(clLib.UI.byId$("lineSelect"), currentRoute[0]["Line"]);
				clLib.UI.setSelectedValue(clLib.UI.byId$("colourSelect"), currentRoute[0]["Colour"]);
			} else {
				clLib.loggi("no route for name >" + changeOptions["value"] + "< found.");
			}
		}
	},
	"ratingSelect" : {
		"dbField" : "Rating"
		,"refreshHandler" : function($this, options) { 
			$("input[type='radio']", $this).each(function() {
				$(this).addClass("unrated");
			});
			clLib.UI.killEventHandlers($("input[type='radio']", $this), "click.clLib");

			$("input[type='radio']", $this).bind("click.clLib", function(e) {
				var $label = $(this).parent();

				$label.nextAll().addClass("unrated");
				$label.nextAll().removeClass("rated");
				$label.prevAll().addClass("rated");
				$label.addClass("rated");
				$label.prevAll().removeClass("unrated");
				$label.removeClass("unrated");
			});
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			if(changeOptions && changeOptions["value"] == clLib.UI.NOTSELECTED.value) {
				$this.children().addClass("unrated");
				$this.children().removeClass("rated");
				$("input[type='radio']", $this).each(function() {
					$(this).prop('checked', false);
				});
			}

		}
		,"changeHandler" : function($this, changeOptions) {}
		,"customVal": function() {
			//alert(clLib.UI.getId$("ratingSelect") + ":checked");
			return $(clLib.UI.getId$("ratingSelectRadio") + ":checked").val();
		}
	},
	"areaSelect" : {
		"refreshHandler" : function($this) { 
			var distinctColumn, where, results;
			distinctColumn = "AreaName";
			where = clLib.getRoutesWhere();
			//alert("refreshing areaSelect where " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Area", where, distinctColumn, "defaultStorage");
			//alert("got local areas >" + JSON.stringify(results) + "<");
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				selectedValue : localStorage.getItem("currentlySelectedArea")
			});
		}
		,"changeHandler" : function($this, changeOptions) {
			localStorage.setItem("currentlySelectedArea", $this.val());
		}
		,"refreshOnUpdate" : {
			default: {
				"selectedArea" : {}
			}
		}
	}
	, "onlineIcon" : {
		"refreshHandler" : function($this) { 
			var isOnline = clLib.isOnline();
			clLib.loggi("isOnline for icon? >" + isOnline + "<");
			var iconSrc = "";
			if(isOnline){
				iconSrc = "files/views/assets/image/online.jpg";
			} else {
				iconSrc = "files/views/assets/image/offline.jpg";
			}
			//alert("src is " + iconSrc);
			$this.attr("src", iconSrc); 
		}
	}
	, "currentScore" : {
		"refreshHandler" : function($this) { 
			var where;
			where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			// TESTING: return all routelogs for now..
			//where = {};
			
			console.log("where = "+ JSON.stringify(where));
			clLib.loggi("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);

			var currentScoreText = "Today: <strong>" + todaysTopScore + "</strong> pts"

			$this.empty();
			$this.append(currentScoreText);
		}
	}
	,"characterSelect": {
		"dbField" : "character"
		,"dependingOn" : {
			default: [
				"gradeSystemSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
			]
		}
		,"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this
				,dataObj : [
					"Platte",
					"Senkrecht",
					"Ueberhaengend",
					"Dach"
				]
				,preserveCurrentValue : true
				,additionalValue : {
					text: "Character?",
					value: "__UNKNOWN__"
				}
				//clLib.UI.NOTSELECTED
			});

			
			clLib.addCSSBackground($this.attr("id"), {iconOnly: true}); 
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			clLib.UI.setSelectedValueOnlyHandler($this, changeOptions);
			clLib.addCSSBackground($this.attr("id")); 
		}
	}
	,"routeLogContainer": {
		"setSelectedValueHandler" : function($this, changeOptions) { return $this.trigger("refresh.clLib"); }
		,"refreshHandler" : function($this) { 
			var $container = $this;
			// build where clause for today's routelogs
			
			
			var where;
			where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			// TESTING: return all routelogs for now..
			//where = {};
			
			console.log("where = "+ JSON.stringify(where));
			clLib.loggi("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);

			var titleText = "Today: <strong>" + todaysTopScore + "</strong> pts"


			clLib.loggi("getting today's route logs..");
		    // retrieve today's routelogs (sorted by Date)
			var todaysRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", "DateISO", true);
			
			//alert("got today's routelogs..");
			//alert(JSON.stringify(todaysRouteLogs));
			//$container.append("<h3>asdfasfs" + titleText + "</h3>");
			
			
			var $containerContent = $("<div>")
				.attr("cl-role", "content")
				.attr("data-role", "collapsible")
				.attr("data-content-theme", "a")
				.attr("data-theme", "a")
				.attr("data-collapsed-icon", "cl_plus_blue")
				.attr("data-expanded-icon", "cl_minus_blue")
				.attr("data-inset", "false")
				.addClass("clRouteLogs clIconCollapsible clIconBlue")
			;
			
			$containerContent
				.append("<h3>" + titleText + "</h3>")
			;
			
			$container
				.empty()
				.append($containerContent);
				
			clLib.UI.addCollapsiblesNEW({
				container : $container
				,items : todaysRouteLogs
				,clearCurrentItems : true
			});

			// Scroll down so that collapsible header in on top of viewport..
			$container.on("collapsibleexpand", "[data-role=collapsible]", function (e) {
				var position = $(e.target).offset().top;
				$.mobile.silentScroll(position);
			});
			
		
		}
	}
	,"areaSearchButton" : {
		"refreshHandler" : function($this) { 
			$this.html(localStorage.getItem("currentlySelectedArea"));
		}
	}
	,"selectedArea" : {
		"dbField" : "Area"
		,"customVal": function() {
			return localStorage.getItem("currentlySelectedArea"); //"KletterHalle Wien"; //
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			localStorage.setItem("currentlySelectedArea", changeOptions["value"]); 
			return clLib.PAGES.changeTo("clLib_startScreen.html");
		}
		,"refreshHandler" : function($this) { 
			$this.val(localStorage.getItem("currentlySelectedArea"));
		}
	}

	,"currentUserPref" : {
		"dbField" : "username"
		,"customVal": function() {
			return clLib.getUserInfo()["username"];
		}
	}
	,"currentDate" : {
		"dbField" : "DateISO"
		,"customVal": function() {
			// Build ISO date string
			var currentDate = clLib.dateToISOStr(new Date());
			console.log("Storing current date of " + currentDate);
			return currentDate;
		}
	}
	,"commentText" : {
		"dbField" : "Comment"
	}
	,"feedbackText" : {
		"dbField" : "feedbackText"
	}
	,"todaysRouteLogs": {
		"setSelectedValueHandler" : function($this, changeOptions) { return $this.trigger("refresh.clLib"); }
		,"refreshHandler" : function($this) { 

				
			var $container = $this;
			$container.empty();
			
			var where;
			where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			// TESTING: return all routelogs for now..
			// build where clause for today's routelogs
			//where = {};
			
			
			clLib.loggi("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);
			//alert("items retrieved(high-scored first) " + JSON.stringify(todaysTopRouteLogs));
			//alert("items retrieved(high-scored first) " + todaysTopRouteLogs.length);
			//alert("items retrieved(latest first) " + JSON.stringify(todaysRouteLogs));

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);

			
			var titleText;
			if(clLib.UI.currentPage() == "stats") {
				titleText = "Details"
			}
			else {
				titleText = "Score: <strong>" + todaysTopScore + "</strong>"
			}
			
			$("#stats_todaysTopScoreBubble").html(todaysTopScore);

			clLib.loggi("getting today's route logs..");
		    // retrieve today's routelogs (sorted by Date)
			var todaysRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", "DateISO", true);
			// retrieve today's 10 top scored routelogs
			//alert("got today's top route logs.." + JSON.stringify(todaysRouteLogs));
			//alert("got today's top route logs.." + todaysRouteLogs.length);


			var $containerContent = $("<div>")
				.attr("cl-role", "content")
				.attr("data-role", "collapsible")
				.attr("data-content-theme", "a")
				.attr("data-theme", "a")
				.attr("data-collapsed-icon", "cl_plus_blue")
				.attr("data-expanded-icon", "cl_minus_blue")
				.attr("data-inset", "false")
				.addClass("clRouteLogs clIconCollapsible clIconBlue")
			;
			
			$containerContent
				.append("<h3>" + titleText + "</h3>")
			;
			
			$container.append($containerContent);
			clLib.UI.addCollapsiblesNEW({
				container : $container
				,items : todaysRouteLogs
				,clearCurrentItems : true
			});
	
		}
	}	
	
	,"monthRouteLogs": {
		"setSelectedValueHandler" : function($this, changeOptions) { return $this.trigger("refresh.clLib"); }
		,"refreshHandler" : function($this) { 
			//alert("refreshing monthRouteLogs...");
				
			var $container = $this;
			// build where clause for today's routelogs
			var where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			
			var successHandler = function(resultObj) {
				resultObj = JSON.parse(resultObj);
				//alert("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));

				$("#stats_monthScoreBubble").html("????");

				var i;
				var aggResultKeys = Object.keys(resultObj);
				for (var i = 0; i < aggResultKeys.length; i++) {
					
					var titleText = aggResultKeys[i];
					//alert("adding item >" + titleText + "<");
					clLib.UI.addCollapsible({
						collapsibleSet : $container,
						titleText : titleText,
						listItems : resultObj[aggResultKeys[i]].items
						//,clearCurrentItems : true
					});

					console.log(JSON.stringify(resultObj[aggResultKeys[i]]));
				}
				
			};

			
			
			clLib.REST.requestStats({
				where : where
			},
			successHandler, 
			function(e) {
				alert("error!");
				alert(clLib.formatError(e));
			}
			);
		
		
		}
	}		
	,"allRouteLogs": {
		"setSelectedValueHandler" : function($this, changeOptions) { return $this.trigger("refresh.clLib"); }
		,"refreshHandler" : function($this) { 
			//alert("refreshing allRouteLogs...");
				
			var $allContainer = $this;
			$allContainer.empty()

			// build where clause for ALL  routelogs
			var where = clLib.getCurrentUserWhere();
			
			var daysToShow = 4;
			
			var buildDaysRouteLogs = function(resultObj, itemCount, startFrom) {
				var i;
				startFrom = startFrom || 0;
				var aggResultKeys = Object.keys(resultObj);
				
				for (var i = startFrom ; i < aggResultKeys.length && i < startFrom + itemCount; i++) {
					buildSingleDayRouteLogs(resultObj, aggResultKeys[i]);
				}
				
				var $addMoreElement = $allContainer.find(".addMore2").remove();
				$addMoreElement = $("<div>")
					.addClass("addMore2")
					.attr("data-role", "collapsible")
					.attr("data-theme", "c")
					.attr("data-iconpos", "none")
					.append("<h1>...</h1>")
					.css("text-align", "center")
					.attr("data-collapsed-icon", "cl_plus_blue")
					.attr("data-expanded-icon", "cl_minus_blue")
				;
				
				var itemsShown = Math.min(startFrom + itemCount, aggResultKeys.length);
				
				if(itemsShown < aggResultKeys.length) {
					$allContainer.append($addMoreElement);
				}
				
				
				//alert("installing click handler for #" + $(".addMore2 *", $allContainer).size() + " elements");
				$(".addMore2 *", $allContainer)
					.off("click")
					.on("click", function() {
						//alert("adding routelog days..");
						// Remember add-more-button's position
						var position = $(this).offset().top;
						buildDaysRouteLogs(resultObj, daysToShow, itemsShown);
		
						$allContainer.trigger("create");
						
						// Scroll down so that collapsible header in on top of viewport..
						$.mobile.silentScroll(position);
				});

	
			}
			
			var buildSingleDayRouteLogs = function(resultObj, key) {
				var titleText = key;
				
				if(titleText == "") {
					return;
				}
				var $bubble = $("<span>")
					.addClass("ui-li-count")
			//		.append(dataRow[dataFormat["bubble"]])
				;
				$bubble.html(resultObj[key].score);


				var $container = $('' + 
				'<div                                   ' +
				'			id="' + titleText + '"      ' +
				'			data-role="collapsibleset"  ' +
				'			data-inset="false"          ' +
				'			data-content-theme="a"      ' +
				'			data-theme="a"              ' +
				'	>                                   ' +
				'	</div>                              ' +
				'');

				console.log("adding child coll for >" + titleText + "<");
				var $containerContent = $("<div>")
					.attr("id", titleText + "-content")
					.addClass("collContainer")
					.attr("cl-role", "content")
					.attr("data-role", "collapsible")
					.attr("data-content-theme", "a")
					.attr("data-theme", "a")
					.attr("data-collapsed-icon", "cl_plus_blue")
					.attr("data-expanded-icon", "cl_minus_blue")
					.attr("data-inset", "false")
					.addClass("clRouteLogs clIconCollapsible clIconBlue")
				;
				
				var $h3 = $("<h3>" + titleText + "</h3>");
				$h3.append($bubble);
				$containerContent.append(
					$h3
				);
				
				$container.append($containerContent);
				clLib.UI.addCollapsiblesNEW({
					container : $container
					,items : resultObj[key].items
					,clearCurrentItems : true
				});
				console.log(">>>>" + JSON.stringify(resultObj[key]));

				$allContainer.append($container);
				
			}
			
			var successHandler = function(resultObj) {
				resultObj = JSON.parse(resultObj);
				//alert("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));
				buildDaysRouteLogs(resultObj, daysToShow);

							
			};


			
			clLib.REST.requestStats({
				where : where
			},
			successHandler, 
			function(e) {
				alert("error!");
				alert(clLib.formatError(e));
			}
			);
		
			$allContainer.trigger("create");
	
		}
	}		
};
