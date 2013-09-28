"use strict";

clLib.UI = {};


clLib.UI.selector = {
	
}
clLib.UI.autoLoad = [
		"newRoute_areaSelect"
];
clLib.UI.elements = {
	"newRoute_gradeTypeSelect" : {
		"contentHandler" : function($this) { 
			clLib.populateGradeTypes($this, "UIAA") },
		"refreshOnUpdate" : [
			"newRoute_gradeSelect"
		]
	},
	"newRoute_gradeSelect" : {
		"contentHandler" : function($this) { 
			clLib.populateGrades($this, 
				//Appery("gradeTypeSelect").val()
				$("#newRoute_gradeTypeSelect").val()
			); 
		},
		"refreshOnUpdate" : [
			"newRoute_sectorSelect"
		]
	},
	"newRoute_areaSelect" : {
		"contentHandler" : function($this) { 
			console.log("handling content for area..");
			var distinctColumn, where, results;
			distinctColumn = "Area";
//				where = clLib.getRoutesWhere("UIAA", "VIII", "Kletterhalle Wien");
			where = clLib.getRoutesWhere("UIAA", "VIII");
			results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
			console.log("got areas for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement :  $this,
				dataObj : results,
				preserveCurrentValue : true
			});
		},
		"refreshOnUpdate" : [
			"newRoute_gradeTypeSelect"
//			,"newRoute_sectorSelect"
		]
	},
	"newRoute_sectorSelect" : {
		"contentHandler" : function($this) { 
			//console.log("handling content for sector.." + $this.val());
			var distinctColumn, where, results;
			distinctColumn = "Sector";
			where = clLib.getRoutesWhere(
				//Appery("gradeTypeSelect").val(), 
				$("#newRoute_gradeTypeSelect").val(),
				//Appery("gradeSelect").val(), 
				$("#newRoute_gradeSelect").val(),
				//Appery("areaSelect").val(), 
				$("#newRoute_areaSelect").val(),
				null);
			
				results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
				console.log("got sectors for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : " HMMM ??"
			});
		},
		"refreshOnUpdate" : [
			"newRoute_colourSelect"
		]
	},
	"newRoute_colourSelect": {
		"contentHandler" : function($this) { 
			console.log("getting colours");
			var distinctColumn, where, results;
			distinctColumn = "Colour";
			where = clLib.getRoutesWhere(
				//Appery("gradeTypeSelect").val(), 
				$("#newRoute_gradeTypeSelect").val(),
				//Appery("gradeSelect").val(), 
				$("#newRoute_gradeSelect").val(),
				//Appery("areaSelect").val(), 
				$("#newRoute_areaSelect").val(),
				//Appery("sectorSelect").val()
				$("#newRoute_sectorSelect").val()	
			);
			//console.log("Getting routese for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
			console.log("got colours for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

			clLib.populateSelectBox({
				selectBoxElement : $this,
				dataObj : results,
				preserveCurrentValue : true,
				additionalValue : " ??? "
			});
			clLib.addColorBackground("newRoute_colourSelect"); 
		},
		"refreshOnUpdate" : [
			"newRoute_searchRouteResults"
		]
	},
	"newRoute_searchRouteResults" : {
		"contentHandler" : function($this) { 
			
			var $inElement = $this;
			
			var distinctColumn, where, results;
			distinctColumn = "Name";
			where = clLib.getRoutesWhere(
				//Appery("gradeTypeSelect").val(), 
				$("#newRoute_gradeTypeSelect").val(),
				//Appery("gradeSelect").val(), 
				$("#newRoute_gradeSelect").val(),
				//Appery("areaSelect").val(), 
				$("#newRoute_areaSelect").val(),
				//Appery("sectorSelect").val()
				$("#newRoute_sectorSelect").val(),
				//Appery("sectorSelect").val()
				$("#newRoute_colourSelect").val()	
			);
			console.log("Getting routes for " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
			
			console.log("got routes " + JSON.stringify(results));
			clLib.populateListView($this, results);
			

			var $forElement = $("#newRoute_searchRoute");
			//console.log("adding results from " + $forElement.attr("id") + " to " + $inElement.attr("id"));
			clLib.populateSearchProposals($forElement, $inElement);
		},
		"refreshOnUpdate" : []
	}
};


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
	options.selectBoxElement.die("change.clLib");
	options.selectBoxElement.off("change.clLib");
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
		var $option = $('<option></option>')
			.val("")
			.html(additionalValue);
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
		if(value == selectedValue 
// hack for excessive change events...
//		|| i++ == 0
		) {
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
clLib.populateSearchProposals = function($forElement, $inElement) {
	
	$inElement.attr("data-theme", "c");
	$inElement.show();
	console.log("shown" + $inElement.children().length);

	if($inElement.children().length == 1) {
		var result = $.trim($inElement.children().first().text());
		console.log("seeting SINGLE selectedresult to " + result);
		$forElement.val(result);
		$inElement.hide();
		console.log("hidden (SINGLE)");
	}
	
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
	console.log("elementConfig fo r" + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	$.each(elementConfig.refreshOnUpdate, function(index, refreshTargetName) {
		console.log("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			alert("element " + "#" + refreshTargetName + " not found!");
		}
		//Appery(refreshTargetName)
		$("#" + refreshTargetName)
			.trigger("refresh.clLib");
	});

}
	

/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "refresh.clLib" event can (and should) be used to re-populate such elements using the defined "contentHandler" function.
*
*/
clLib.UI.fillUIelements = function() {
	console.log("populating UI elements for current page");
	$.each(clLib.UI.elements, function(elementName, elementConfig) {
		//console.log("adding events for  element >" + elementName + "<");
		var $element = 
			//Appery(elementName);
			$("#" + elementName);
		// define dependent targets for current element..
		//console.log("element is >" + $element.attr("id") + "<");
		$element.die("change.clLib");
		$element.die("refresh.clLib");
		$element.off("change.clLib");
		$element.off("refresh.clLib");
		$element.bind("change.clLib", function() {
			clLib.UI.defaultChangeHandler($element);
		});

		// populate current element..
		$element.live("refresh.clLib", function() {
			console.log("refresh element " + $(this).attr("id") + " with elementConfig " + JSON.stringify(elementConfig));
			
			console.log("calling contenthandler" + $(this).attr("id"));
			elementConfig.contentHandler($element);
			$(this).trigger("change.clLib");
			
		});
	});

	$.each(clLib.UI.autoLoad, function(idx, elementName) {
		console.log("triggering refresh on element >" + elementName + "<");
		var $element = 
			//Appery(elementName);
			$("#" + elementName);
		// populate current element..
		$element.trigger("refresh.clLib");
		
	});	
}



