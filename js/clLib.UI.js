"use strict";

clLib.UI = {};

clLib.UI = {
	"NOTSELECTED": {
		text : "UNKNOWN",
		value : "__UNKNOWN__"
	}
};

clLib.UI.autoLoad = {
	newRouteLog : [
		"newRouteLog_gradeTypeSelect",
		"newRouteLog_searchRoute",
		"newRouteLog_ratingSelect"
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
		"newRouteLog_ratingSelect"
	],
	startScreen : [
	]
};

clLib.UI.pageElements = {
	newRouteLog : [
		"newRouteLog_gradeTypeSelect",
		"newRouteLog_gradeSelect",
		"newRouteLog_sectorSelect",
		"newRouteLog_colourSelect",
		"newRouteLog_lineSelect",
		"newRouteLog_searchRouteResults",
		"newRouteLog_searchRoute",
		"newRouteLog_ratingSelect"
	],
	startScreen : [
		"startScreen_areaSelect",
		"startScreen_selectedArea"
	]
};

clLib.UI.elements = {
	"newRouteLog_gradeTypeSelect" : {
		"refreshHandler" : function($this) { 
			clLib.populateGradeTypes($this, "UIAA") },
		"refreshOnUpdate" : {
			"newRouteLog_gradeSelect" : { }
		}
	},
	"newRouteLog_gradeSelect" : {
		"refreshHandler" : function($this) { 
			clLib.populateGrades($this, 
				$("#newRouteLog_gradeTypeSelect").val()
			); 
		},
		"refreshOnUpdate" : {
			"newRouteLog_sectorSelect" : {}
			//,"newRouteLog_lineSelect": {}
		}
	},
	"newRouteLog_sectorSelect" : {
		"refreshHandler" : function($this) { 
			//console.log("handling content for sector.." + $this.val());

			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea")
//				,"Line" : $("#newRouteLog_lineSelect").val()
			});
			
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			console.log("got sectors for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { return clLib.UI.setSelectedValueOnlyHandler($this, changeOptions); }
		,"changeHandler" : function($this, changeOptions) {
			//alert("sector change handler!!");
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
			console.log("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
			if(results.length == 1) {
				$sectorSelect.val(results[0]);
				$sectorSelect.selectmenu('refresh', true);

				console.log("sectorselect changed to " + results[0]);
			} else {
				if(
					$("#newRouteLog_lineSelect").val() != clLib.UI.NOTSELECTED.value &&
					$("#newRouteLog_lineSelect").val() != ""
				) {
					console.log("2013-10-07-WTF!?!?!? multiple sectors for line " + $("#newRouteLog_lineSelect").val() + " found - setting sector to the one of first result...");
					alert("setting sector to the one of first result...");
					$sectorSelect.val(results[0]);     
				}

				$sectorSelect.selectmenu('refresh', true);
			}

			clLib.UI.defaultChangeHandler($this, changeOptions);
		},




		"refreshOnUpdate" : {
			"newRouteLog_colourSelect" : {}
			,"newRouteLog_lineSelect" : {}
		}
	},
	"newRouteLog_lineSelect" : {
		"refreshHandler" : function($this) { 
			console.log("getting lines");
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
				preserveCurrentValue : true,
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
			console.log("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
			if(results.length == 1) {
				$sectorSelect.val(results[0]);
				$sectorSelect.selectmenu('refresh', true);

				console.log("sectorselect changed to " + results[0]);
			} else {
				if($("#newRouteLog_lineSelect").val() != clLib.UI.NOTSELECTED.value) {
					//alert("2013-10-07-WTF!?!?!? multiple sectors for line " + $("#newRouteLog_lineSelect").val() + " found - setting sector to the one of first result...");
					$sectorSelect.val(results[0]);     
				}

				$sectorSelect.selectmenu('refresh', true);
			}

			clLib.UI.defaultChangeHandler($this, changeOptions);
		}
		,"refreshOnUpdate" : {
/*			"newRouteLog_sectorSelect" : {
				noRefreshOn : "newRouteLog_lineSelect"
			}*/
/*			,"newRouteLog_searchRouteResults" : {
				hideOnSingleResult : true
			}
*/
			"newRouteLog_colourSelect" : {}
		}


	},
	"newRouteLog_colourSelect": {
		"refreshHandler" : function($this) { 
			console.log("getting colours");
			var distinctColumn, where, results;
			distinctColumn = "Colour";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Sector" : $("#newRouteLog_sectorSelect").val(),
				"Line" : $("#newRouteLog_lineSelect").val()
			});
			//console.log("Getting routese for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			console.log("got colours for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
			clLib.addColorBackground("newRouteLog_colourSelect"); 
			
		}
		,"setSelectedValueHandler" : function($this, changeOptions) { 
			clLib.UI.setSelectedValueOnlyHandler($this, changeOptions);
			clLib.addColorBackground($this.attr("id")); 
		}
		,"refreshOnUpdate" : {
			"newRouteLog_searchRouteResults" : {
				hideOnSingleResult : true
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
			console.log("refreshing searchrouteresults with options " + JSON.stringify(options));
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
			console.log("Getting routes for " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			
			console.log("got routes " + JSON.stringify(results));


			//console.log("adding results from " + $forElement.attr("id") + " to " + $inElement.attr("id"));
			clLib.populateSearchProposals($forElement, $inElement, results, options["hideOnSingleResult"]);
		}
		,"refreshOnUpdate" : []
	},
	"newRouteLog_searchRoute" : {
		"refreshHandler" : function($this, options) { 
			console.log("binding to keyup events...");
			$this.bind("keyup.clLib", function() {
				console.log("keyup, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger(
					"refresh.clLib", 
					clLib.UI.addObjArr(options || {}, ["eventSourcePath"], $this.attr("id"))
				);
			});
			$this.bind("click.clLib", function() {
				console.log("click, refresh search proposals!!!");
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
				console.log("empty out search route field..");
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
			console.log("got route data for " + JSON.stringify(where) + " >" + JSON.stringify(currentRoute));
			
			if(currentRoute) {
				clLib.UI.setSelectedValue($("#newRouteLog_sectorSelect"), currentRoute[0]["Sector"]);
				clLib.UI.setSelectedValue($("#newRouteLog_lineSelect"), currentRoute[0]["Line"]);
				clLib.UI.setSelectedValue($("#newRouteLog_colourSelect"), currentRoute[0]["Colour"]);
			} else {
				alert("no route for name >" + changeOptions["value"] + "< found.");
			}
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
			alert("setting rating select to " + JSON.stringify(changeOptions));
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
			console.log("handling content for area..");
			var distinctColumn, where, results;
			distinctColumn = "Area";
			//alert("building where");
			where = clLib.getRoutesWhere("UIAA", "VIII");
			//alert("where=" + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			console.log("got areas for " + JSON.stringify(where) + ",>" + JSON.stringify(results));
			
			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true
			});
		},
		"refreshOnUpdate" : {
			"startScreen_selectedArea" : {}
		}
	},
	"startScreen_selectedArea" : {
		"refreshHandler" : function($this) { 
			localStorage.setItem("currentlySelectedArea", $("#startScreen_areaSelect").val());
			clLib.UI.fillUIelements("newRouteLog");
		},
		"refreshOnUpdate" : {}
	}
};

clLib.UI.killEventHandlers = function($element, eventName) {
	$element.die(eventName);
	$element.off(eventName);
	$element.unbind(eventName);
}


clLib.UI.setSelectedValue = function($element, newValue) {
	//alert("triggering setSelectedValue.clLib on " + $element.attr("id") + " with value " + JSON.stringify(newValue));
	$element.trigger("setSelectedValue.clLib", 
		{ "value": newValue }
	);
};





clLib.populateListView = function($list, dataObj, formatFunc){
	$list.empty();
	$.each(dataObj, function(index, value) {
		var itemValue;
		if(formatFunc) {
			itemValue = formatFunc(value);
		}
		else {
			itemValue = value;
		}
		var $listItem = $('<li></li>')
                .html(itemValue);
		$list.append($listItem);
	});
	$list.listview('refresh', true);
};


clLib.populateSelectBox = function(options) {
	var defaultOptions = {
		preserveCurrentValue : false
	};
	$.extend(defaultOptions, options);

/*
	var oldEventHandler = function() {console.log("undefined event handler");};
	console.log("oldEventHandler = " + options.selectBoxElement.attr("id") + ">" + JSON.stringify(options.selectBoxElement.data("events")));
	// remember current onChange Handler
	if(options.selectBoxElement.data("events")) {
		oldEventHandler = options.selectBoxElement.data("events")['change.clLib'][0].handler;
		console.log("oldEventHandler " + JSON.stringify(oldEventHandler));
*/
		// disable current onChange handler
	var selectBoxId = options.selectBoxElement.attr('id');
	console.log("killing evnet handlers for  " + selectBoxId);

	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");
/*
	}
*/
	var needRefresh = clLib.populateSelectBox_plain(
		options.selectBoxElement,
		options.dataObj,
		options.selectedValue,
		options.preserveCurrentValue,
		options.additionalValue
	);

	var customChangeHandler = clLib.UI.elements[selectBoxId]["changeHandler"];
	if(customChangeHandler) {
		//console.log("custom event handler for " + selectBoxId + "found.." + customChangeHandler);
	}
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;

	options.selectBoxElement.bind("change.clLib", function(event, changeOptions) {
		changeHandler($(this), changeOptions);
	});

	
	if(needRefresh) {
		options.selectBoxElement.trigger("change.clLib", options.changeOptions);
	}

};

clLib.populateSelectBox_plain = function($selectBox, dataObj, selectedValue, preserveCurrentValue, additionalValue){
	var oldValue = $selectBox.val();
	var oldValueFound = true;
	if(preserveCurrentValue && oldValue) {
		//console.log("preserving >" + oldValue + "<");
		selectedValue = oldValue;
		oldValueFound = false;
	}
	
	$selectBox.empty();
	if(additionalValue) {
		var $option = $('<option></option>');
		if(additionalValue instanceof Object) {
			$option
				.val(additionalValue["value"])
				.html(additionalValue["text"]);
		} else {
			$option
				.val(additionalValue)
				.html(additionalValue);
		}
		$selectBox.append($option);
	}
	
	if(dataObj instanceof Array && dataObj.length == 1) {
		console.log("Yes, array...take first element.." + JSON.stringify(dataObj));
		selectedValue = dataObj[0];
	} else if(dataObj instanceof Object && Object.keys(dataObj).length == 1) {
		console.log("Yes, object...take first element.." + JSON.stringify(dataObj));
		selectedValue = Object.keys(dataObj)[0];
	}

	var i = 0;
	$.each(dataObj, function(index, value) {
		//console.log("adding option " + value);
		var $option = $('<option></option>')
                .val(dataObj instanceof Array ? value : index)
                .html(value);
		//console.log("comp " + value + " + against " + selectedValue);
		if(value == selectedValue) {
			console.log("Found old value..");
			$option.attr("selected", "selected");
			oldValueFound = true;
		}
		$selectBox.append($option);
	});
	
	$selectBox.selectmenu('refresh', true);

	if(oldValueFound) {
		// no refresh necessary..
		return false;
	}

	// need to refresh
	return true;
	//console.log("Previous value >" + oldValue + "< is no longer present in the select list.");

};


// $inElement = $("#startScreen_nameSearchResult").
// $forElement = Appery("nameSearchField");
clLib.populateSearchProposals = function($forElement, $inElement, dataObj, hideOnSingleResult) {
	
	//alert(JSON.stringify(dataObj));
	if(hideOnSingleResult && dataObj.length == 1) {
		//alert("single element found, hiding results..");
		$forElement.val(dataObj[0]);
		$inElement.hide();
		return;
	} else {
		//$forElement.val("");
	}
	
	clLib.populateListView($inElement, dataObj);

	$inElement.attr("data-theme", "c");
	$inElement.show();
	console.log("shown" + $inElement.children().length);

	$inElement.children().click(function() {
        console.log("this child;" + $(this).html());
		var result = $.trim($(this).html());
		console.log("seeting selectedresult to " + result);

		console.log("forElement is " + $forElement.attr("id"));
		$forElement.trigger("setSelectedValue.clLib", {"value": result});
		//$forElement.val(result);

		$(this).parent().hide();
		console.log("hidden");
		//$("#startScreen_mobilefooter1").html(result);
	});
};

clLib.UI.defaultChangeHandler = function($element, changeOptions) {
	// Store current value
	$element.data("clLib.currentValue", $element.val());
	//alert($element.attr("id") + " was changed to: >" + $element.data("clLib.currentValue") + "<" + JSON.stringify(changeOptions));
	var elementConfig = clLib.UI.elements[$element.attr("id")];
	//console.log("elementConfig for " + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
		console.log("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			console.log("element " + "#" + refreshTargetName + " not found!");
		}

		$.extend(refreshOptions, changeOptions);
		
		$("#" + refreshTargetName)
			.trigger("refresh.clLib", 
				clLib.UI.addObjArr(refreshOptions, ["eventSourcePath"], $element.attr("id"))
		);
	});

}
	
clLib.UI.defaultSetSelectedValueHandler = function($element, changeOptions) {
	return clLib.UI.defaultChangeHandler($element, changeOptions);
}
	
clLib.UI.setSelectedValueOnlyHandler = function($element, changeOptions) {
	console.log("solely changing value of .." + $element.attr("id") + " to " + JSON.stringify(changeOptions));
	// avoid default onChange handler..
	clLib.UI.killEventHandlers($element, "change.clLib");
	var newValue = changeOptions["value"];
	
	delete(changeOptions["value"]);
	// set desired value
	$element.val(newValue);
	$element.selectmenu('refresh', true);
	// restore onChange handler for further changes..
	var customChangeHandler = clLib.UI.elements[$element.attr("id")]["changeHandler"];
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;
	$element.bind("change.clLib", function(event, changeOptions) {
		changeHandler($element, changeOptions);
	});
}
	

clLib.UI.resetUIelements = function(pageName) {

	// populate autoload elements
	$.each(clLib.UI.elementsToReset[pageName], function(idx, elementName) {
		//alert("triggering reset/refresh for " + elementName);
		var $element = $("#" + elementName);
		clLib.UI.setSelectedValue($element, clLib.UI.NOTSELECTED.value);
	});
};
	
/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "refresh.clLib" event can (and should) be used to re-populate such elements using the defined "refreshHandler" function.
*
*/
clLib.UI.fillUIelements = function(pageName) {
	//alert("populating UI elements for page >" + pageName + "<");
	$.each(clLib.UI.pageElements[pageName], function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];
		//alert("adding events for  element >" + elementName + "<");
		var $element = $("#" + elementName);
		//console.log("element is >" + $element.attr("id") + "<");

		// Re-attach event handlers
		clLib.UI.killEventHandlers($element, "change.clLib");
		clLib.UI.killEventHandlers($element, "refresh.clLib");
		var changeHandler = elementConfig["changeHandler"] || clLib.UI.defaultChangeHandler;
		$element.bind("change.clLib", function() {
			changeHandler($element);
		});

		var setSelectedValueHandler = elementConfig["setSelectedValueHandler"] || clLib.UI.defaultSetSelectedValueHandler;
		//alert("setting setSelectedValueHandle for " + $element.attr("id"));
		$element.bind("setSelectedValue.clLib", function(event, changeOptions) {
			//alert("executing setSelectedValue handler for "+ $element.attr("id") + ">>>>" + elementConfig["setSelectedValueHandler"]);
			setSelectedValueHandler($element, changeOptions);
		});

		// populate current element..
		$element.bind("refresh.clLib", function(event, additionalOptions) {
			if(!additionalOptions) additionalOptions = {};
			//alert("refreshing element " + elementName + " with " +  JSON.stringify(additionalOptions));
			if(
				typeof(additionalOptions) !== "undefined" &&
				additionalOptions["noRefreshOn"] == elementName
			) {
				console.log("not refreshing element " + elementName);
			}
			console.log("refresh element " + $(this).attr("id") + " with elementConfig " + JSON.stringify(elementConfig));
			elementConfig.refreshHandler($element, additionalOptions);
			$(this).trigger("change.clLib", additionalOptions);
		});
	});

	// populate autoload elements
	$.each(clLib.UI.autoLoad[pageName], function(idx, elementName) {
		//alert("triggering autoload for " + elementName);
		//alert($("#" + elementName).html());
		var optionObj = {};
		$("#" + elementName).trigger("refresh.clLib", 
			clLib.UI.addObjArr(optionObj,["eventSourcePath"], "AUTOLOAD")
		);
	});
};

clLib.UI.addObjArr = function(anObj, pathArray, objValue) {
	clLib.addObjArr(anObj,pathArray, objValue);
	return JSON.parse(JSON.stringify(anObj));
}

clLib.UI.showLoading = function(text, html) {
	$.mobile.loading( 'show', {
		text: 'foo',
		textVisible: true,
		//theme: 'z',
		html: html
	});
};

clLib.UI.hideLoading = function() {
	$.mobile.hidePageLoadingMsg();
};



clLib.UI.showAllTodayScores = function(buddyNames, targetElement) {
	//alert("buddies changed..refreshing todaysscore..");

	var allTodaysScores = [];
	var buddyArray = (buddyNames && buddyNames.split(",")) || [];
	buddyArray.push(localStorage.getItem("currentUser"));
	$.each(buddyArray, function(idx, buddyName) {
		// build where clause for today's routelogs
		var buddyWhere = clLib.getRouteLogWhereToday({userName: buddyName});
		// retrieve today's top scored routelogs
		var buddyTodaysTopRouteLogs = clLib.localStorage.getEntities("RouteLog", buddyWhere, "routeLogStorage", 
			clLib.sortByScoreFunc,
			true, 10);
		// calculate today's score
		var buddyTodaysTopScore = clLib.calculateScore(buddyTodaysTopRouteLogs);
		//alert("buddys todays score(top10)" + buddyTodaysTopScore);
		var buddyTodayStr = buddyName + " => " + buddyTodaysTopScore;
		allTodaysScores.push(buddyTodayStr);
	});
	//alert("allTodaysTopScore: " + JSON.stringify(allTodaysScores));
	// show buddies todays' score
	clLib.populateListView(targetElement, allTodaysScores);
};



clLib.UI.buildRatingRadio = function($element) {
	$element.children().remove();
	$element.html("" + 
"                                                                                                                                                                               " +
"<style>                                                                                                                                                                        " +
".ratingSelect {                                                                                                                                                                " +
"	border: 0px solid red;                                                                                                                                                      " +
"	padding: 0px 0px 0px 0px;                                                                                                                                                   " +
"	margin: 0px 0px 0px 0px;                                                                                                                                                    " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label > input {                                                                                                                                                " +
"    display: none;                                                                                                                                                             " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label > .img {                                                                                                                                                 " +
"	float: left;                                                                                                                                                                " +
"	width: 20px;                                                                                                                                                                " +
"	height: 20px;                                                                                                                                                               " +
"	border: none;                                                                                                                                                               " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label.rated > .img {                                                                                                                                           " +
"	background-image: url(\"files/views/assets/image/star_rated.png\"); /* no-repeat;*/                                                                                                             " +
"	background-size: 100% 100%;                                                                                                                                                 " +
"}                                                                                                                                                                              " +
".ratingSelect > label.unrated > .img { 	                                                                                                                                    " +
"	background-image: url(\"files/views/assets/image/star_unrated.png\"); /* no-repeat; */                                                                                                          " +
"	background-size: 100% 100%;                                                                                                                                                 " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"</style>                                                                                                                                                                       " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"			<div data-role=\"none\" class=\"ratingSelect\" id=\"newRouteLog_ratingSelect\">                                                                                           " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"1\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"2\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"3\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"4\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"5\"/><div class=\"img\"></div></label>  " +
"				</div>                                                                                                                                                          " +
"	                                                                                                                                                                            " +
""
	);

};