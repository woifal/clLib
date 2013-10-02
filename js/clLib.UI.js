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
		"newRouteLog_searchRoute"
	],
	startScreen : [
		"startScreen_areaSelect"
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
		"newRouteLog_searchRoute"
	],
	startScreen : [
		"startScreen_areaSelect",
		"startScreen_selectedArea"
	]
};

clLib.UI.elements = {
	"newRouteLog_gradeTypeSelect" : {
		"contentHandler" : function($this) { 
			clLib.populateGradeTypes($this, "UIAA") },
		"refreshOnUpdate" : {
			"newRouteLog_gradeSelect" : {}
		}
	},
	"newRouteLog_gradeSelect" : {
		"contentHandler" : function($this) { 
			clLib.populateGrades($this, 
				$("#newRouteLog_gradeTypeSelect").val()
			); 
		},
		"refreshOnUpdate" : {
			"newRouteLog_sectorSelect" : {},
			"newRouteLog_lineSelect": {}
		}
	},
	"newRouteLog_sectorSelect" : {
		"contentHandler" : function($this) { 
			//console.log("handling content for sector.." + $this.val());
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere({
				"GradeType" : $("#newRouteLog_gradeTypeSelect").val(),
				"Grade" : $("#newRouteLog_gradeSelect").val(),
				"Area" : localStorage.getItem("currentlySelectedArea"),
				"Line" : $("#newRouteLog_lineSelect").val()
			});
			
				results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
				console.log("got sectors for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		},
		"refreshOnUpdate" : {
			"newRouteLog_colourSelect" : {}
			/*,
			"newRouteLog_lineSelect" : {}*/
		}
	},
	"newRouteLog_lineSelect" : {
		"contentHandler" : function($this) { 
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
			alert("Getting lines for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			alert("got lines for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : clLib.UI.NOTSELECTED
			});
		},
		"refreshOnUpdate" : {
/*			"newRouteLog_sectorSelect" : {
				noRefreshOn : "newRouteLog_lineSelect"
			},*/
			"newRouteLog_searchRouteResults" : {
				hideOnSingleResult : true
			}
		}
	},
	"newRouteLog_colourSelect": {
		"contentHandler" : function($this) { 
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
		},
		"refreshOnUpdate" : {
			"newRouteLog_searchRouteResults" : {
				hideOnSingleResult : true
			}
		}
	},
	"newRouteLog_searchRouteResults" : {
		"contentHandler" : function($this, options) { 
			options = options || {};
			console.log("refreshing searchrouteresults with options " + JSON.stringify(options));
			var $inElement = $this;
			
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
				"$starts-with" : $("#newRouteLog_searchRoute").val()	
			}
			alert("Getting routes for " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			
			console.log("got routes " + JSON.stringify(results));

			var $forElement = $("#newRouteLog_searchRoute");
			//console.log("adding results from " + $forElement.attr("id") + " to " + $inElement.attr("id"));
			clLib.populateSearchProposals($forElement, $inElement, results, options["hideOnSingleResult"]);
		},
		"refreshOnUpdate" : []
	},
	"newRouteLog_searchRoute" : {
		"contentHandler" : function($this) { 
			console.log("binding to keyup events...");
			$this.bind("keyup.clLib", function() {
				console.log("keyup, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger("refresh.clLib");
			});
			$this.bind("click.clLib", function() {
				console.log("click, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger("refresh.clLib");
			});
			$this.bind("change.clLib.route", function() {
				console.log("changed, refresh search proposals!!!");
				$("#newRouteLog_searchRouteResults").trigger("refresh.clLib");
			});
		},
		"refreshOnUpdate" : []
	},
	"startScreen_areaSelect" : {
		"contentHandler" : function($this) { 
			console.log("handling content for area..");
			var distinctColumn, where, results;
			distinctColumn = "Area";
			//alert("building where");
			where = clLib.getRoutesWhere("UIAA", "VIII");
			alert("where=" + JSON.stringify(where));
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
		"contentHandler" : function($this) { 
			localStorage.setItem("currentlySelectedArea", $("#startScreen_areaSelect").val());
		},
		"refreshOnUpdate" : {}
	}
};

clLib.UI.killEventHandlers = function($element, eventName) {
	$element.die(eventName);
	$element.off(eventName);
	$element.unbind(eventName);
}

clLib.populateListView = function($list, dataObj){
	$list.empty();
	$.each(dataObj, function(index, value) {
		var $listItem = $('<li></li>')
                .html(value);
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
	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");
/*
	}
*/
	var returnObj = clLib.populateSelectBox_plain(
		options.selectBoxElement,
		options.dataObj,
		options.selectedValue,
		options.preserveCurrentValue,
		options.additionalValue
	);

	options.selectBoxElement.live("change.clLib", function() {
		clLib.UI.defaultChangeHandler($(this))
	});

	return returnObj;

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
		console.log("adding option " + value);
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

	if(!oldValueFound) {
		1;
		//console.log("Previous value >" + oldValue + "< is no longer present in the select list.");
	}
};


// $inElement = $("#startScreen_nameSearchResult").
// $forElement = Appery("nameSearchField");
clLib.populateSearchProposals = function($forElement, $inElement, dataObj, hideOnSingleResult) {
	
	//alert(JSON.stringify(dataObj));
	if(hideOnSingleResult && dataObj.length == 1) {
		$forElement.val(dataObj[0]);
		$inElement.hide();
		return;
	}
	
	clLib.populateListView($inElement, dataObj);

	$inElement.attr("data-theme", "c");
	$inElement.show();
	console.log("shown" + $inElement.children().length);

// Following was replaced by dataObj checking..
/*
	if($inElement.children().length == 1) {
		var result = $.trim($inElement.children().first().text());
		console.log("seeting SINGLE selectedresult to " + result);
		$forElement.val(result);
		$inElement.hide();
		console.log("hidden (SINGLE)");
	}
*/	
	$inElement.children().click(function() {
        console.log("this child;" + $(this).html());
		var result = $.trim($(this).html());
		console.log("seeting selectedresult to " + result);
		$forElement.val(result);
		$(this).parent().hide();
		console.log("hidden");
		//$("#startScreen_mobilefooter1").html(result);
	});
};

clLib.UI.defaultChangeHandler = function($element) {
	// Store current value
	$element.data("clLib.currentValue", $element.val());
	console.log($element.attr("id") + " was changed(to: >" + $element.data("clLib.currentValue") + "<");
	var elementConfig = clLib.UI.elements[$element.attr("id")];
	//console.log("elementConfig for " + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
		console.log("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			alert("element " + "#" + refreshTargetName + " not found!");
		}
		$("#" + refreshTargetName)
			.trigger("refresh.clLib", refreshOptions);
	});

}
	

/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "refresh.clLib" event can (and should) be used to re-populate such elements using the defined "contentHandler" function.
*
*/
clLib.UI.fillUIelements = function(pageName) {
	console.log("populating UI elements for page >" + pageName + "<");
	$.each(clLib.UI.pageElements[pageName], function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];
		console.log("adding events for  element >" + elementName + "<");
		var $element = $("#" + elementName);
		//console.log("element is >" + $element.attr("id") + "<");

		// Re-attach event handlers
		clLib.UI.killEventHandlers($element, "change.clLib");
		clLib.UI.killEventHandlers($element, "refresh.clLib");
		$element.bind("change.clLib", function() {
			clLib.UI.defaultChangeHandler($element);
		});

		// populate current element..
		$element.bind("refresh.clLib", function(event, additionalOptions) {
			if(!additionalOptions) additionalOptions = {};
			//alert("refreshing element " + elementName + " == " +  additionalOptions["noRefreshOn"]);
			if(
				typeof(additionalOptions) !== "undefined" &&
				additionalOptions["noRefreshOn"] == elementName
			) {
				alert("not refreshing element " + elementName);
			}
			console.log("refresh element " + $(this).attr("id") + " with elementConfig " + JSON.stringify(elementConfig));
			elementConfig.contentHandler($element, additionalOptions);
			$(this).trigger("change.clLib");
		});
	});

	// populate autoload elements
	$.each(clLib.UI.autoLoad[pageName], function(idx, elementName) {
		console.log("triggering autoload for " + elementName);
		//alert($("#" + elementName).html());
		$("#" + elementName).trigger("refresh.clLib");
	});
};

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
