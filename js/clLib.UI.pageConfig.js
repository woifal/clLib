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
    "startScreen": { "pagebeforeshow" : [clLib.prefsCompleteCheck, clLib.tryLogin, clLib.wasOnlineCheck] }
    , "preferences": { "pagebeforeshow" : [] }
    , "newRouteLog": { "pagebeforeshow" : [clLib.prefsCompleteCheck, clLib.tryLogin, clLib.wasOnlineCheck] }
    , "users": { "pagebeforeshow" : [clLib.tryLogin] }
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
			"gradeSystemSelect",
			"searchRoute",
			"ratingSelect",
			"tickType",
			"characterSelect",
			"routeLogContainer"
		],
		reduced: [
			"gradeSystemSelect",
			"ratingSelect",
			"tickType",
			"colourSelect",
			"characterSelect",
			"routeLogContainer"
		]
	}
	,startScreen: {
		default: [
			"areaSelect"
			, "currentUserReadOnly"
			, "defaultLayout"
			, "onlineIcon"
			]
	}
	,preferences : {
		default: [
			"currentUserReadOnly"
			, "buddiesStr"
			, "showTopX"
//			, "defaultLayout"
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
		"defaultLayout"
	]
    , preferences: [
		"currentUserReadOnly"
		, "buddiesStr"
        , "showTopX"
//        , "defaultLayout"
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
			, "tickType"
			, "characterSelect"
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
			, "tickType"
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
			, "currentUserReadOnly"
			, "defaultLayout"
			, "onlineIcon"
	    ]
	}
    , preferences: {
        default: [
			"currentUserReadOnly"
			, "buddiesStr"
            , "showTopX"
//            , "defaultLayout"
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
};



clLib.UI.elements = {
    "currentUserReadOnly": $.extend({}, {
		"dbField": "username"
    }, clLib.UI.elementConfig.localVar)
    ,"currentUser": $.extend({}, {
		"dbField": "username"
    }, clLib.UI.elementConfig.localVarSaveImmediately)
    ,"currentPassword": $.extend({}, {
		"dbField": "password"
    }, clLib.UI.elementConfig.localVarSaveImmediately)
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
					alert("button - " + $this.attr("id") + " setting txt to " + localVarValue);
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
    , "defaultLayout":  clLib.UI.elementConfig.localVarSaveImmediately

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
			var selectedValue = clLib.findEquivalentGrade(
				localStorage.getItem("defaultGradeSystem") || "UIAA"
				, localStorage.getItem("defaultGrade") || "VI"			
				, $("#newRouteLog_gradeSystemSelect").val()
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
	},
	"tickType" : {
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
	"sectorSelect" : {
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
			distinctColumn = "Area";
			where = clLib.getRoutesWhere();
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "defaultStorage");
			
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
			clLib.loggi("refreshing routelogs..");
			var $container = $this;
			var $list;
			//$list = $container.first().children("ul").first();
			$list = $container.children("div").first().find("ul").first();

			// build where clause for today's routelogs
			var where = clLib.getRouteLogWhereToday(clLib.getCurrentUserWhere());

			//alert("getting today's route logs..");
		    // retrieve today's routelogs (sorted by Date)
			var todaysRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", "DateISO", true);
			// retrieve today's 10 top scored routelogs
			//alert("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "defaultStorage", clLib.sortByScoreFunc, true, 10);
			//alert("items retrieved(high-scored first) " + JSON.stringify(todaysTopRouteLogs));
			//alert("items retrieved(latest first) " + JSON.stringify(todaysRouteLogs));

			// calculate today's score
			var todaysTopScore = clLib.calculateScore(todaysTopRouteLogs);
			//alert("Todays score is: " + todaysTopScore);
			
			var $collapsedItemText = $container.children("div").first().find("h2").first().find(".ui-btn-text");
			$collapsedItemText.html("Score: <strong>" + todaysTopScore + "</strong>");
			//alert("adding list items..");
			clLib.UI.addListItems($list, todaysRouteLogs, clLib.UI.list.formatRouteLogRow, 2, true);
			//alert("added list items..");
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
};
