"use strict";

clLib.UI.autoLoad = {
	newRouteLog : [
		"gradeTypeSelect",
		"searchRoute",
		"ratingSelect",
		"tickType",
		"characterSelect",
		"routeLogContainer"
	]
	, startScreen: [
		"areaSelect"
	]
	,preferences : [
		"currentUser"
		, "buddiesStr"
        , "showTopX"
        , "defaultLayout"
        , "defaultGradeType"
        , "defaultGrade"
	]
};

clLib.UI.elementsToReset = {
	newRouteLog : [
		"lineSelect",
		"sectorSelect",
		"colourSelect",
		"ratingSelect",
		"searchRouteResults",
		"searchRoute",
		"routeLogContainer"
	],
	startScreen : [
	]
};

clLib.UI.pageElements = {
	newRouteLog : {
		default: [
            "currentLayout"
            , "gradeTypeSelect"
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
            , "gradeTypeSelect"
			, "gradeSelect"
			, "colourSelect"
			, "tickType"
			, "characterSelect"
			, "selectedArea"
			, "currentUserPref"
			, "currentDate"
			, "routeLogContainer"
		]
	}
	,startScreen: {
	    default: [
			"areaSelect",
			"selectedArea"
	    ]
	}
    ,preferences : {
		default: [
			"currentUser"
			,"buddiesStr"
            ,"showTopX"
            ,"defaultLayout"
            ,"defaultGradeType"
            ,"defaultGrade"
        ]
    }
};

clLib.UI.defaultLocalVarElementConfig = {
    "refreshHandler" : function($this) { 
        var elementName = clLib.UI.elementNameFromId($this.attr("id"));
        var localVarValue = localStorage.getItem(elementName);
        $this.val(localVarValue);
    }
    ,"changeHandler" : function($this, changeOptions) { 
        var elementName = clLib.UI.elementNameFromId($this.attr("id"));
        var localVarValue = $this.val();
        localStorage.setItem(elementName, $this.val());
    }
};

clLib.UI.elements = {
    "currentLayout": {
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

    ,"currentUser": clLib.UI.defaultLocalVarElementConfig
    ,"buddiesStr" : clLib.UI.defaultLocalVarElementConfig
    ,"showTopX" : clLib.UI.defaultLocalVarElementConfig
    , "defaultLayout": {
        "refreshHandler": function ($this) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = localStorage.getItem(elementName);
            $this.val(localVarValue);
        }
        , "changeHandler": function ($this, changeOptions) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = $this.val();
            localStorage.setItem(elementName, $this.val());
            localStorage.setItem("currentLayout", $this.val());
        }
    }
    ,"defaultGradeType" : {
        "refreshHandler" : function($this) { 
            clLib.populateGradeTypes($this, localStorage.getItem("defaultGradeType") || "UIAA");
        }
        , "changeHandler": function ($this, changeOptions) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = $this.val();
            localStorage.setItem(elementName, $this.val());
            clLib.UI.defaultChangeHandler($this, changeOptions);
        }
		, "refreshOnUpdate": {
		    default: {
		        "defaultGrade": {}
		    }
		}
    }
    ,"defaultGrade" : {
        "refreshHandler" : function($this) { 
            var defaultGradeType = localStorage.getItem("defaultGradeType");
            alert("repopulating for gradetype " + defaultGradeType);
            clLib.populateGrades($this,
				defaultGradeType
			); 
        }
        , "changeHandler": function ($this, changeOptions) {
            var elementName = clLib.UI.elementNameFromId($this.attr("id"));
            var localVarValue = $this.val();
            localStorage.setItem(elementName, $this.val());
        }

    }

    ,"gradeTypeSelect": {
		"dbField" : "GradeSystem"
		,"refreshHandler" : function($this) { 
			clLib.populateGradeTypes($this, localStorage.getItem("defaultGradeType") || "UIAA") 
		}
		,"refreshOnUpdate" : {
			default: {
				"gradeSelect" : { }
			}
		}
	},
	"gradeSelect" : {
		"dbField" : "Grade"
		,"refreshHandler" : function($this) { 
			var $gradeTypeSelect = clLib.UI.byId$("gradeTypeSelect");
			clLib.populateGrades($this, 
				$gradeTypeSelect.val()
			); 
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
				,additionalValue : clLib.UI.NOTSELECTED
				,selectedValue : "Red Point"
			});
		}
	},
	"sectorSelect" : {
		"dbField" : "Sector"
		,"dependingOn": {
			default: [
				"gradeTypeSelect", "gradeSelect", "selectedArea", "lineSelect"
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
				"gradeTypeSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
			]
		}
		,"refreshHandler" : function($this) { 
			return clLib.UI.defaultRefreshHandler($this, { preserveCurrentValue: false });
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			var $sectorSelect = clLib.UI.byId$("sectorSelect");
			
			var results = clLib.UI.defaultEntitySearch("Sector", ["gradeTypeSelect", "gradeSelect", "selectedArea", "lineSelect"], true);
			
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
				"gradeTypeSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
		    ]
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
		            hideOnSingleResult: true
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
				"Name", 
				["gradeTypeSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect", "lineSelect"], 
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
				"Sector", 
				["gradeTypeSelect", "gradeSelect"], 
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
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			
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
	,"characterSelect": {
		"dbField" : "character"
		,"dependingOn" : {
			default: [
				"gradeTypeSelect", "gradeSelect", "selectedArea", "sectorSelect", "colourSelect"
			]
		}
		,"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : [
					"Platte",
					"Senkrecht",
					"Leicht-Ueberhaengend",
					"Stark-Ueberhaengend",
					"Dach"
				],
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
			clLib.addCSSBackground($this.attr("id")); 
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
					"RouteLog", where, "routeLogStorage", "Date", true);
			// retrieve today's 10 top scored routelogs
			//alert("getting today's top route logs..");
			var todaysTopRouteLogs = clLib.localStorage.getEntities(
					"RouteLog", where, "routeLogStorage", clLib.sortByScoreFunc, true, 10);
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
		"dbField" : "Date"
		,"customVal": function() {
			return new Date();
		}
	}
	,"commentText" : {
		"dbField" : "Comment"
	}
};

