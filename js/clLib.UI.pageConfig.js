"use strict";

clLib.UI.autoLoad = {
	newRouteLog : [
		"gradeTypeSelect",
		"searchRoute",
		"ratingSelect",
		"tickType",
		"character"
	],
	startScreen : [
		"areaSelect"
	]
};

clLib.UI.elementsToReset = {
	newRouteLog : [
		"lineSelect",
		"sectorSelect",
		"colourSelect",
		"ratingSelect",
		"searchRouteResults"
	],
	startScreen : [
	]
};

clLib.UI.pageElements = {
	newRouteLog : {
		default: [
			"gradeTypeSelect",
			"gradeSelect",
			"sectorSelect",
			"colourSelect",
			"lineSelect",
			"searchRouteResults",
			"searchRoute",
			"commentText",
			"ratingSelect",
			"tickType",
			"character"
		],
		reduced: [
			"gradeTypeSelect",
			"gradeSelect",
			"colourSelect",
			"tickType",
			"character"
		]
	},
	startScreen : {
		default: [
			"areaSelect",
			"selectedArea"
		]
	}
};


clLib.UI.elements = {
	"gradeTypeSelect" : {
		"refreshHandler" : function($this) { 
			clLib.populateGradeTypes($this, localStorage.getItem("defaultGradeType") || "UIAA") },
		"refreshOnUpdate" : {
			default: {
				"gradeSelect" : { }
			}
		}
	},
	"gradeSelect" : {
		"refreshHandler" : function($this) { 
			var $gradeTypeSelect = clLib.UI.byId$("gradeTypeSelect");
			clLib.loggi("populating grades in " + $gradeTypeSelect.attr("id"));
			clLib.populateGrades($this, 
				$gradeTypeSelect.val()
			); 
			//clLib.loggi("Grades populated to " +$(this).val());
		},
		"refreshOnUpdate" : {
			default: {
				"sectorSelect" : {}
				//,"colourSelect" : {}
				,"lineSelect": {}
			},
			reduced: {
				"colourSelect" : {}
			}
		}
	},
	"tickType" : {
		"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : [
					"Red Point",
					"Flash",
					"Onsight",
					"Attempt",
					"Top Rope"
				],
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"refreshOnUpdate" : []
	},
	"character" : {
		"refreshHandler" : function($this) { 
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : [
					"Platte",
					"Senkrecht",
					"Leicht überhängend",
					"Starkt überhängend",
					"Dach"
				],
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"refreshOnUpdate" : []
	},
	"sectorSelect" : {
		"refreshHandler" : function($this) { 
			//clLib.loggi("handling content for sector.." + $this.val());

			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade" : clLib.UI.byId$("gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea")
				,"Line" : clLib.UI.byId$("lineSelect").val()
			});
			
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got sectors for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			clLib.UI.setSelectedValue(clLib.UI.byId$("lineSelect"), clLib.UI.NOTSELECTED);

			//clLib.loggi("sector change handler!!");
/*
			var $sectorSelect = clLib.UI.byId$("sectorSelect");
			
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade" : clLib.UI.byId$("gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Line" : clLib.UI.byId$("lineSelect").val()
			});
			
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
*/		
/*
			if(results.length == 1) {
				$sectorSelect.val(results[0]);
				$sectorSelect.selectmenu('refresh', true);

				clLib.loggi("sectorselect changed to " + results[0]);
			} else {
				if(
					clLib.UI.byId$("lineSelect").val() != clLib.UI.NOTSELECTED.value &&
					clLib.UI.byId$("lineSelect").val() != ""
				) {
					clLib.loggi("2013-10-07-WTF!?!?!? multiple sectors for line " + clLib.UI.byId$("lineSelect").val() + " found - setting sector to the one of first result...");
					clLib.loggi("setting sector to the one of first result...");
					$sectorSelect.val(results[0]);     
				}

				$sectorSelect.selectmenu('refresh', true);
			}
*/
			clLib.UI.defaultChangeHandler($this, changeOptions);
		},




		"refreshOnUpdate" : {
			default: {
				"colourSelect" : {}
				,"lineSelect" : {}
			}
		}
	},
	"lineSelect" : {
		"refreshHandler" : function($this) { 
			clLib.loggi("getting lines");
			var distinctColumn, where, results;
			distinctColumn = "Line";
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade" : clLib.UI.byId$("gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Sector" : clLib.UI.byId$("sectorSelect").val(),
				"Colour" : clLib.UI.byId$("colourSelect").val()
			});
			//clLib.loggi("Getting lines for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			//clLib.loggi("got lines for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : false,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			var $sectorSelect = clLib.UI.byId$("sectorSelect");
			
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade" : clLib.UI.byId$("gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Line" : clLib.UI.byId$("lineSelect").val()
			});
			
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
			if(results.length == 1) {
				clLib.UI.setSelectedValue($sectorSelect, results[0]);
				$sectorSelect.selectmenu('refresh', true);

				clLib.loggi("sectorselect changed to " + results[0]);
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
	/*			"sectorSelect" : {
					noRefreshOn : "lineSelect"
				}*/
	/*			,"searchRouteResults" : {
					hideOnSingleResult : true
				}
	*/
				"colourSelect" : {}
			}
		}
	},
	"colourSelect": {
		"refreshHandler" : function($this) { 
			clLib.loggi("getting colours");
			//clLib.loggi("gettting colours for grades populated to " +clLib.UI.byId$("gradeSelect").val());
/*clLib.loggi("gettting colours for ALL :" + JSON.stringify(
			{
					"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
					"Grade" : clLib.UI.byId$("gradeSelect").val(),
					"Area" : localStorage.getItem("currentlySelectedArea"),
					"Sector" : clLib.UI.byId$("sectorSelect").val(),
					"Line" : clLib.UI.byId$("lineSelect").val()
				}));
*/
			var distinctColumn, where, results;
			distinctColumn = "Colour";
			var routeWhereObj = {};
			
			var baseWhereObj;
			var currentLayout = localStorage.getItem("currentLayout") || "default";
			if(currentLayout == 'reduced') {
				// for reduced layout get ALL available colours..
				baseWhereObj = {};
			} else {
				baseWhereObj = {
					"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
					"Grade" : clLib.UI.byId$("gradeSelect").val(),
					"Area" : localStorage.getItem("currentlySelectedArea"),
					"Sector" : clLib.UI.byId$("sectorSelect").val(),
					"Line" : clLib.UI.byId$("lineSelect").val()
				};
			}
			where = clLib.getRoutesWhere(baseWhereObj);
			clLib.loggi("Getting colours for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got colours for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : false,
				additionalValue : clLib.UI.NOTSELECTED
			});
			clLib.addColorBackground("colourSelect"); 
			
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			clLib.UI.setSelectedValueOnlyHandler($this, changeOptions);
			clLib.addColorBackground($this.attr("id")); 
		}
		,"refreshOnUpdate" : {
			default: {
				"searchRouteResults" : {
					hideOnSingleResult : true
				}
			}
		}
		,"changeHandler" : function($this, changeOptions) {
			var $forElement = clLib.UI.byId$("searchRoute");
			$forElement.val("");
			//clLib.loggi("searchRoute set to ''");

			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
	},
	"searchRouteResults" : {
		"refreshHandler" : function($this, options) { 
			options = options || {};
			clLib.loggi("refreshing searchrouteresults with options " + JSON.stringify(options));
			var $inElement = $this;
			var $forElement = clLib.UI.byId$("searchRoute");
			;
			
			var distinctColumn, where, results;
			distinctColumn = "Name";
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade": clLib.UI.byId$("gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Sector" : clLib.UI.byId$("sectorSelect").val(),
				"Colour" : clLib.UI.byId$("colourSelect").val(),
				"Line" : clLib.UI.byId$("lineSelect").val()
			});
			where["Name"] = {
				"$starts-with" : $forElement.val()	
			}
			clLib.loggi("Getting routes for " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			
			clLib.loggi("got routes " + JSON.stringify(results));


			//clLib.loggi("adding results from " + $forElement.attr("id") + " to " + $inElement.attr("id"));
			clLib.populateSearchProposals($forElement, $inElement, results, options["hideOnSingleResult"]);
		}
		,"refreshOnUpdate" : []
	},
	"searchRoute" : {
		"refreshHandler" : function($this, options) { 
			clLib.loggi("binding to keyup events...");
			$this.bind("keyup.clLib", function() {
				clLib.loggi("keyup, refresh search proposals!!!");
				clLib.UI.byId$("searchRouteResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
			$this.bind("click.clLib", function() {
				clLib.loggi("click, refresh search proposals!!!");
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
			//clLib.loggi("searchRoute changed, refresh all other elements!!!");
			//clLib.loggi(">>>" + $this.attr("id") + "," + JSON.stringify(changeOptions));

			if(changeOptions["value"] == clLib.UI.NOTSELECTED.value) {
				clLib.loggi("empty out search route field..");
				$this.val("");
				return;
			}

			$this.val(changeOptions["value"]);
			
			
			//
			//	set all other elements to the one of the currently selected route..
			//
			var distinctColumn, where, results;
			where = clLib.getRoutesWhere({
				"GradeType" : clLib.UI.byId$("gradeTypeSelect").val(),
				"Grade" : clLib.UI.byId$("gradeSelect").val(),
				"Name": changeOptions["value"]
			});
			
			var currentRoute = clLib.localStorage.getEntities("Routes", where, "routeStorage");
			//clLib.loggi("got route data for " + JSON.stringify(where) + " >" + JSON.stringify(currentRoute));
			
			if(currentRoute) {
				clLib.UI.setSelectedValue(clLib.UI.byId$("sectorSelect"), currentRoute[0]["Sector"]);
				clLib.UI.setSelectedValue(clLib.UI.byId$("lineSelect"), currentRoute[0]["Line"]);
				clLib.UI.setSelectedValue(clLib.UI.byId$("colourSelect"), currentRoute[0]["Colour"]);
			} else {
				clLib.loggi("no route for name >" + changeOptions["value"] + "< found.");
			}
			//clLib.loggi("done with setselectedvalue handler for searchroute..");
		}
		,"refreshOnUpdate" : []
	},
	"ratingSelect" : {
		"refreshHandler" : function($this, options) { 
			//clLib.loggi("refreshign ratingselec.t..");
			$("input[type='radio']", $this).each(function() {
				$(this).addClass("unrated");
			});
//			clLib.loggi("onclicking ratingselec.t..");
			clLib.UI.killEventHandlers($("input[type='radio']", $this), "click.clLib");

			$("input[type='radio']", $this).bind("click.clLib", function(e) {
				//clLib.loggi("radio clicked!" + $(this).val());
				var $label = $(this).parent();

				$label.nextAll().addClass("unrated");
				$label.nextAll().removeClass("rated");
				$label.prevAll().addClass("rated");
				$label.addClass("rated");
				$label.prevAll().removeClass("unrated");
				$label.removeClass("unrated");
			});
//			clLib.loggi("inclicked ratingselec.t..");
		},
		"refreshOnUpdate" : []
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			//clLib.loggi("setting rating select to " + JSON.stringify(changeOptions));
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
	},
	"areaSelect" : {
		"refreshHandler" : function($this) { 
			clLib.loggi("handling content for area..");
			var distinctColumn, where, results;
			distinctColumn = "Area";
			//clLib.loggi("building where");
			where = clLib.getRoutesWhere("UIAA", "VIII");
			//clLib.loggi("where=" + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got areas for " + JSON.stringify(where) + ",>" + JSON.stringify(results));
			
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true
			});
		},
		"refreshOnUpdate" : {
			default: {
				"selectedArea" : {}
			}
		}
	},
	"selectedArea" : {
		"refreshHandler" : function($this) { 
			localStorage.setItem("currentlySelectedArea", clLib.UI.byId$("areaSelect").val());
//			clLib.UI.fillUIelements("newRouteLog");
		},
		"refreshOnUpdate" : {}
	}
};

