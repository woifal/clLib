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
    , "newRouteLog": { 
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
    , "users_verification": { }
    , "stats": { }
    , "diagram": { }
    , "AGB": { }
    , "feedback": { }
    , "trickGoogle": { }
};


clLib.UI.saveHandlers= {
      "preferences": clLib.UI.localStorageSaveHandler
    , "newRouteLog": clLib.UI.RESTSaveHandler
    , "startScreen": clLib.UI.RESTSaveHandler
    , "users": clLib.UI.userHandler
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
	}, 
	newRouteLog : {
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
		],
		reduced: [
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
	,startScreen: {
		default: [
			"areaSelect"
			, "onlineIcon"
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
    ,"users_verification" : {
		default: [
			"currentUser",
			"notification"
		]
	}
    ,"stats" : {
		default: [
			"todaysRouteLogs"
			,"monthRouteLogs"
		]
	}
    ,"diagram" : {
		default: [
		]
	}
};

clLib.UI.elementsToReset = {
	newRouteLog : [
		"lineSelect",
		"sectorSelect",
		"colourSelect",
		"ratingSelect",
		"searchRouteResults",
		"searchRoute",
		"routeLogContainer",
		"characterSelect"
	]
	, startScreen : [
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
	newRouteLog : {
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
			, "routeLogContainer"
			, "selectedArea"
			, "currentUserPref"
			, "currentDate"
			, "routeLogContainer"
		],
		reduced: [
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
    ,"users_verification": {
        default: [
			"currentUser",
			"notification"
        ]
    }
    ,"stats": {
        default: [
			, "todaysRouteLogs"
			, "monthRouteLogs"
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
	"username": $.extend({}, {
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
            
            var profileURL = clLib.getUserInfo()["profileURL"];
            var displayName = clLib.getUserInfo()["displayName"];
            var authType = clLib.getUserInfo()["authType"];

/*
<div style="width: 200px; border: 1px solid red">
<img src="files/views/assets/image/redpoint.PNG" style="float:left; width:35px; height:35px;"/>
<span style="border: 1px solid green; float: left; margin-top:10px;">woi fal</span>
<img src="files/views/assets/image/googleAuth.jpg" style="border: 1px solid blue; float:right; vertical-align: middle;width:15px; height:15px;"/>

*/
            
            $currentUser = $("<div>");
            if(profileURL) {
                $currentUser.append(
                    $("<img>")
                    .attr({
                        "src" : profileURL
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
/*
		return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : localStorage.getItem("defaultGradeSystem") || "UIAA",
				preserveCurrentValue : true,
				additionalValue : null	
			});*/
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
			return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : localStorage.getItem("selectedGradeSystems") || clLib.UI.varDefaults["selectedGradeSystems"],
				preserveCurrentValue : true,
				additionalValue : null	
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
			return $this.find("input:radio:checked" ).val()
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
				, clLib.UI.getVal(clLib.UI.elementNameFromId("newRouteLog_gradeSystemSelect"))
			);

			//alert("preselecting " + selectedValue);
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
			},
			reduced: {
				"colourSelect" : {}
			}
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
/*	"tickType" : {
		"dbField" : "TickType"
		,"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this
				,dataObj : [
					"Red Point",
					"Flash",
					"Onsight",
					"Attempt",
					"Top Rope"
				]
				,preserveCurrentValue : true
				,additionalValue : {
					text: "TickType?",
					value: "__UNKNOWN__"
				}
				//clLib.UI.NOTSELECTED
				,selectedValue : "Red Point"
			});
		}
	},
*/
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
		,"refreshHandler" : function($this) { 
		    clLib.UI.defaultRefreshHandler($this, { preserveCurrentValue: false });
		    clLib.addCSSBackground($this.attr("id"));
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
			clLib.UI.buildRatingRadio(clLib.UI.byId$("ratingSelectWrapper"));

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
	,"characterSelect": {
		"dbField" : "character"
		,"dependingOn" : {
			default: [
				"gradeSystemSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
			]
		}
		,"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : [
					"Platte",
					"Senkrecht",
					"Ueberhaengend",
					"Dach"
				],
				selectedValue : "Platte",
				preserveCurrentValue : true,
				additionalValue : {
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
			var where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			console.log("where = "+ JSON.stringify(where));
			clLib.loggi("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);
			//alert("items retrieved(high-scored first) " + JSON.stringify(todaysTopRouteLogs));
			//alert("items retrieved(high-scored first) " + todaysTopRouteLogs.length);
			//alert("items retrieved(latest first) " + JSON.stringify(todaysRouteLogs));

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);

			var titleText = "Score: <strong>" + todaysTopScore + "</strong>"


			clLib.loggi("getting today's route logs..");
		    // retrieve today's routelogs (sorted by Date)
			var todaysRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", "DateISO", true);
			// retrieve today's 10 top scored routelogs
			//alert("got today's top route logs.." + JSON.stringify(todaysRouteLogs));
			//alert("got today's top route logs.." + todaysRouteLogs.length);

			
			clLib.UI.addCollapsible({
				collapsibleSet : $container
				,titleText : titleText
				,listItems : todaysRouteLogs
				,clearCurrentItems : true
			});
		
		
		}
	}
	,"selectedArea" : {
		"dbField" : "Area"
		,"customVal": function() {
			return localStorage.getItem("currentlySelectedArea"); //"KletterHalle Wien"; //
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
			// build where clause for today's routelogs
			var where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			
			clLib.loggi("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);
			//alert("items retrieved(high-scored first) " + JSON.stringify(todaysTopRouteLogs));
			//alert("items retrieved(high-scored first) " + todaysTopRouteLogs.length);
			//alert("items retrieved(latest first) " + JSON.stringify(todaysRouteLogs));

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);

			var titleText = "Score: <strong>" + todaysTopScore + "</strong>"
			$("#stats_todaysTopScoreBubble").html(todaysTopScore);

			clLib.loggi("getting today's route logs..");
		    // retrieve today's routelogs (sorted by Date)
			var todaysRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", "DateISO", true);
			// retrieve today's 10 top scored routelogs
			//alert("got today's top route logs.." + JSON.stringify(todaysRouteLogs));
			//alert("got today's top route logs.." + todaysRouteLogs.length);

			
			clLib.UI.addCollapsible({
				collapsibleSet : $container,
				titleText : titleText,
				listItems : todaysRouteLogs
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
			//var where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());
			var where = clLib.getRouteLogWhereToday({"username": "asdf"});
			
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
};
