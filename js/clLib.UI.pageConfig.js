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
    "startScreen": { "pagebeforeshow" : [clLib.prefsCompleteCheck, clLib.wasOnlineCheck, clLib.tryLogin] }
    , "preferences": { "pagebeforeshow" : [] }
    , "newRouteLog": { "pagebeforeshow" : [clLib.prefsCompleteCheck, clLib.tryLogin, clLib.wasOnlineCheck] }
    , "users": { "pagebeforeshow" : [clLib.tryLogin] }
    , "users_verification": { }
    , "stats": { }
    , "diagram": { }
};


clLib.UI.saveHandlers= {
      "preferences": clLib.UI.localStorageSaveHandler
    , "newRouteLog": clLib.UI.RESTSaveHandler
    , "startScreen": clLib.UI.RESTSaveHandler
    , "users": clLib.UI.userHandler
};

clLib.UI.autoLoad = {
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
			, "displayName"
			, "onlineIcon"
			]
	}
	,preferences : {
		default: [
			"currentUserReadOnly"
			, "displayName"
			, "buddiesStr"
			, "showTopX"
			, "defaultLayout"
			, "defaultGradeSystem"
			, "defaultGrade"
			, "onlineMode"
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
		"currentUserReadOnly"
		, "displayName"
		, "buddiesStr"
        , "showTopX"
        , "defaultLayout"
        , "defaultGradeSystem"
        , "defaultGrade"
    	]
    , users: [
		"currentUser"
		, "currentPassword"
        , "loginError"
    	]

};

clLib.UI.pageElements = {
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
			, "selectedArea",
			, "displayName"
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
			//alert("refreshing " + $this.attr("id"));
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
	, "defaultGradeSystem" : {
		"localVarField" : "defaultGradeSystem"
		,"dbField" : "GradeSystem"
		,"refreshFromEntity" : "Grades"
		,"refreshHandler" : function($this) { 
			return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : localStorage.getItem("defaultGradeSystem") || "UIAA",
				preserveCurrentValue : true,
				additionalValue : null	
			});
		}
		,"refreshOnUpdate" : {
			default: {
				"defaultGrade" : {}
			}
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
			return clLib.UI.defaultRefreshHandler($this, {
				selectedValue : localStorage.getItem("defaultGradeSystem") || "UIAA",
				preserveCurrentValue : true,
				additionalValue : null	
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
//			clLib.UI.buildRatingRadio(clLib.UI.byId$("ratingSelectWrapper"));

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
			//alert("refreshing routelogs..");
				
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
		"dbField" : "userName"
		,"customVal": function() {
			return localStorage.getItem("currentUser");
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
			var where = clLib.getRouteLogWhereToday({"userName": "asdf"});
			
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
