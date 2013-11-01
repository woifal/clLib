"use strict";

clLib.UI.autoLoad = {
	newRouteLog : [
		"newRouteLog_gradeTypeSelect",
		"newRouteLog_searchRoute",
		"newRouteLog_ratingSelect",
		"newRouteLog_tickType",
		"newRouteLog_character"
	],
	startScreen : [
		"startScreen_areaSelect"
	]
};

clLib.UI.elementsToReset = {
	newRouteLog : [
		"newRouteLog_lineSelect",
		"newRouteLog_sectorSelect",
		"newRouteLog_colourSelect",
		"newRouteLog_ratingSelect",
		"newRouteLog_searchRouteResults"
	],
	startScreen : [
	]
};

clLib.UI.pageElements = {
	newRouteLog : {
		default: [
			"newRouteLog_gradeTypeSelect",
			"newRouteLog_gradeSelect",
			"newRouteLog_sectorSelect",
			"newRouteLog_colourSelect",
			"newRouteLog_lineSelect",
			"newRouteLog_searchRouteResults",
			"newRouteLog_searchRoute",
			"newRouteLog_commentText",
			"newRouteLog_ratingSelect",
			"newRouteLog_tickType",
			"newRouteLog_character"
		],
		reduced: [
			"newRouteLog_gradeTypeSelect",
			"newRouteLog_gradeSelect",
			"newRouteLog_colourSelect",
			"newRouteLog_tickType",
			"newRouteLog_character"
		]
	},
	startScreen : {
		default: [
			"startScreen_areaSelect",
			"startScreen_selectedArea"
		]
	}
};

clLib.UI.elements = {
	"newRouteLog_gradeTypeSelect" : {
		"refreshHandler" : function($this) { 
			clLib.populateGradeTypes($this, localStorage.getItem("defaultGradeType") || "UIAA") },
		"refreshOnUpdate" : {
			default: {
				"newRouteLog_gradeSelect" : { }
			}
		}
	},
	"newRouteLog_gradeSelect" : {
		"refreshHandler" : function($this) { 
			clLib.populateGrades($this, 
				$("#newRouteLog_gradeTypeSelect").val()
			); 
			//alert("Grades populated to " +$("#newRouteLog_gradeSelect").val());
		},
		"refreshOnUpdate" : {
			default: {
				"newRouteLog_sectorSelect" : {}
				//,"newRouteLog_colourSelect" : {}
				,"newRouteLog_lineSelect": {}
			},
			reduced: {
				"newRouteLog_colourSelect" : {}
			}
		}
	},
	"newRouteLog_tickType" : {
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
	"newRouteLog_character" : {
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
	"newRouteLog_sectorSelect" : {
		"refreshHandler" : function($this) { 
			//clLib.loggi("handling content for sector.." + $this.val());

			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea")
				,"Line" : $("#newRouteLog_lineSelect").val()
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
			clLib.UI.setSelectedValue($("#newRouteLog_lineSelect"), clLib.UI.NOTSELECTED);

			//alert("sector change handler!!");
/*
			var $sectorSelect = $("#newRouteLog_sectorSelect");
			
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Line" : $("#newRouteLog_lineSelect").val()
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
					$("#newRouteLog_lineSelect").val() != clLib.UI.NOTSELECTED.value &&
					$("#newRouteLog_lineSelect").val() != ""
				) {
					clLib.loggi("2013-10-07-WTF!?!?!? multiple sectors for line " + $("#newRouteLog_lineSelect").val() + " found - setting sector to the one of first result...");
					alert("setting sector to the one of first result...");
					$sectorSelect.val(results[0]);     
				}

				$sectorSelect.selectmenu('refresh', true);
			}
*/
			clLib.UI.defaultChangeHandler($this, changeOptions);
		},




		"refreshOnUpdate" : {
			default: {
				"newRouteLog_colourSelect" : {}
				,"newRouteLog_lineSelect" : {}
			}
		}
	},
	"newRouteLog_lineSelect" : {
		"refreshHandler" : function($this) { 
			clLib.loggi("getting lines");
			var distinctColumn, where, results;
			distinctColumn = "Line";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Sector" : $("#newRouteLog_sectorSelect").val(),
				"Colour" : $("#newRouteLog_colourSelect").val()
			});
			//alert("Getting lines for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			//alert("got lines for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : false,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			var $sectorSelect = $("#newRouteLog_sectorSelect");
			
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Line" : $("#newRouteLog_lineSelect").val()
			});
			
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
			if(results.length == 1) {
				clLib.UI.setSelectedValue($sectorSelect, results[0]);
				$sectorSelect.selectmenu('refresh', true);

				clLib.loggi("sectorselect changed to " + results[0]);
			} else {
				if($("#newRouteLog_lineSelect").val() != clLib.UI.NOTSELECTED.value) {
					//alert("2013-10-07-WTF!?!?!? multiple sectors for line " + $("#newRouteLog_lineSelect").val() + " found - setting sector to the one of first result...");
					clLib.UI.setSelectedValue($sectorSelect, results[0]);
				}

				$sectorSelect.selectmenu('refresh', true);
			}

			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
		,"refreshOnUpdate" : {
			default: {
	/*			"newRouteLog_sectorSelect" : {
					noRefreshOn : "newRouteLog_lineSelect"
				}*/
	/*			,"newRouteLog_searchRouteResults" : {
					hideOnSingleResult : true
				}
	*/
				"newRouteLog_colourSelect" : {}
			}
		}
	},
	"newRouteLog_colourSelect": {
		"refreshHandler" : function($this) { 
			clLib.loggi("getting colours");
			//alert("gettting colours for grades populated to " +$("#newRouteLog_gradeSelect").val());
/*alert("gettting colours for ALL :" + JSON.stringify(
			{
					"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
					"Grade" : $("#newRouteLog_gradeSelect").val(),
					"Area" : localStorage.getItem("currentlySelectedArea"),
					"Sector" : $("#newRouteLog_sectorSelect").val(),
					"Line" : $("#newRouteLog_lineSelect").val()
				}));
*/
			var distinctColumn, where, results;
			distinctColumn = "Colour";
			var routeWhereObj = {};
			
			var baseWhereObj;
			var currentLayout = localStorage.getItem("currentLayout");
			if(currentLayout == 'reduced') {
				// for reduced layout get ALL available colours..
				baseWhereObj = {};
			} else {
				baseWhereObj = {
					"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
					"Grade" : $("#newRouteLog_gradeSelect").val(),
					"Area" : localStorage.getItem("currentlySelectedArea"),
					"Sector" : $("#newRouteLog_sectorSelect").val(),
					"Line" : $("#newRouteLog_lineSelect")
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
			clLib.addColorBackground("newRouteLog_colourSelect"); 
			
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			clLib.UI.setSelectedValueOnlyHandler($this, changeOptions);
			clLib.addColorBackground($this.attr("id")); 
		}
		,"refreshOnUpdate" : {
			default: {
				"newRouteLog_searchRouteResults" : {
					hideOnSingleResult : true
				}
			}
		}
		,"changeHandler" : function($this, changeOptions) {
			var $forElement = $("#newRouteLog_searchRoute");
			$forElement.val("");
			//alert("searchRoute set to ''");

			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
	},
	"newRouteLog_searchRouteResults" : {
		"refreshHandler" : function($this, options) { 
			options = options || {};
			clLib.loggi("refreshing searchrouteresults with options " + JSON.stringify(options));
			var $inElement = $this;
			var $forElement = $("#newRouteLog_searchRoute");
			;
			
			var distinctColumn, where, results;
			distinctColumn = "Name";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade": $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Sector" : $("#newRouteLog_sectorSelect").val(),
				"Colour" : $("#newRouteLog_colourSelect").val(),
				"Line" : $("#newRouteLog_lineSelect").val()
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
	"newRouteLog_searchRoute" : {
		"refreshHandler" : function($this, options) { 
			clLib.loggi("binding to keyup events...");
			$this.bind("keyup.clLib", function() {
				clLib.loggi("keyup, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
			$this.bind("click.clLib", function() {
				clLib.loggi("click, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger(
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
			//alert("searchRoute changed, refresh all other elements!!!");
			//alert(">>>" + $this.attr("id") + "," + JSON.stringify(changeOptions));

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
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Name": changeOptions["value"]
			});
			
			var currentRoute = clLib.localStorage.getEntities("Routes", where, "routeStorage");
			//alert("got route data for " + JSON.stringify(where) + " >" + JSON.stringify(currentRoute));
			
			if(currentRoute) {
				clLib.UI.setSelectedValue($("#newRouteLog_sectorSelect"), currentRoute[0]["Sector"]);
				clLib.UI.setSelectedValue($("#newRouteLog_lineSelect"), currentRoute[0]["Line"]);
				clLib.UI.setSelectedValue($("#newRouteLog_colourSelect"), currentRoute[0]["Colour"]);
			} else {
				alert("no route for name >" + changeOptions["value"] + "< found.");
			}
			//alert("done with setselectedvalue handler for searchroute..");
		}
		,"refreshOnUpdate" : []
	},
	"newRouteLog_ratingSelect" : {
		"refreshHandler" : function($this, options) { 
			//alert("refreshign ratingselec.t..");
			$("input[type='radio']", $this).each(function() {
				$(this).addClass("unrated");
			});
//			alert("onclicking ratingselec.t..");
			clLib.UI.killEventHandlers($("input[type='radio']", $this), "click.clLib");

			$("input[type='radio']", $this).bind("click.clLib", function(e) {
				//alert("radio clicked!" + $(this).val());
				var $label = $(this).parent();

				$label.nextAll().addClass("unrated");
				$label.nextAll().removeClass("rated");
				$label.prevAll().addClass("rated");
				$label.addClass("rated");
				$label.prevAll().removeClass("unrated");
				$label.removeClass("unrated");
			});
//			alert("inclicked ratingselec.t..");
		},
		"refreshOnUpdate" : []
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			//alert("setting rating select to " + JSON.stringify(changeOptions));
//			clLib.UI.buildRatingRadio($("#newRouteLog_ratingSelectWrapper"));

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
	"startScreen_areaSelect" : {
		"refreshHandler" : function($this) { 
			clLib.loggi("handling content for area..");
			var distinctColumn, where, results;
			distinctColumn = "Area";
			//alert("building where");
			where = clLib.getRoutesWhere("UIAA", "VIII");
			//alert("where=" + JSON.stringify(where));
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
				"startScreen_selectedArea" : {}
			}
		}
	},
	"startScreen_selectedArea" : {
		"refreshHandler" : function($this) { 
			localStorage.setItem("currentlySelectedArea", $("#startScreen_areaSelect").val());
//			clLib.UI.fillUIelements("newRouteLog");
		},
		"refreshOnUpdate" : {}
	}
};

