"use strict";

clLib.UI.selector = {
	
}
clLib.UI.elements = {
	"newRoute" : {
		"gradeTypeSelect" : {
			"contentHandler" : function($this) { 
				clLib.populateGradeTypes($this, "UIAA") },
			"refreshOnUpdate" : [
				"gradeSelect"
			]
		},
		"gradeSelect" : {
			"contentHandler" : function($this, jqmPageName) { 
				clLib.populateGrades($this, 
					//Appery("gradeTypeSelect").val()
					$("#" + jqmPageName + "_" + "gradeTypeSelect").val()
				); 
			},
			"refreshOnUpdate" : [
				"sectorSelect"
			]
		},
		"areaSelect" : {
			"contentHandler" : function($this) { 
				var distinctColumn, where, results;
				distinctColumn = "Area";
				where = clLib.getRoutesWhere();
				results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
				clLib.populateSelectBox($this, results, null, true);
			},
			"refreshOnUpdate" : [
				"sectorSelect",
			]
		},
		"sectorSelect" : {
			"contentHandler" : function($this, jqmPageName) { 
				var distinctColumn, where, results;
				distinctColumn = "Sector";
				where = clLib.getRoutesWhere(
					//Appery("gradeTypeSelect").val(), 
					$("#" + jqmPageName + "_" + "gradeTypeSelect").val(),
					//Appery("gradeSelect").val(), 
					$("#" + jqmPageName + "_" + "gradeSelect").val(),
					//Appery("areaSelect").val(), 
					$("#" + jqmPageName + "_" + "areaSelect").val(),
					null);
				results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
				clLib.populateSelectBox($this, results, null, true);
			},
			"refreshOnUpdate" : [
				"colourSelect"
			]
		},
		"colourSelect": {
			"contentHandler" : function($this, jqmPageName) { 
				var distinctColumn, where, results;
				distinctColumn = "Sector";
				where = clLib.getRoutesWhere(
					//Appery("gradeTypeSelect").val(), 
					$("#" + jqmPageName + "_" + "gradeTypeSelect").val(),
					//Appery("gradeSelect").val(), 
					$("#" + jqmPageName + "_" + "gradeSelect").val(),
					//Appery("areaSelect").val(), 
					$("#" + jqmPageName + "_" + "areaSelect").val(),
					//Appery("sectorSelect").val()
					$("#" + jqmPageName + "_" + "sectorSelect").val(),	
				);
				results = clLib.localStorage.getDistinct("routes", where, distinctColumn, "routeStorage");
				clLib.populateSelectBox($this, results, null, true);
				clLib.addColorBackground("newRoute_colourSelect"); 
			},
			"refreshOnUpdate" : []
		}
	}
};


/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "clLib.refresh" event can (and should) be used to re-populate such elements using the defined "contentHandler" function.
*
*/
clLib.UI.fillUIelements = function(jqmPageName) {
	$.each(clLib.UI.elements[jqmPageName], function(elementName, elementConfig) {
		var $element = 
			//Appery(elementName);
			$(jqmPageName + "_" + elementName);
		// define dependent targets for current element..
		$element.live("clLib.change", function() {
			$.each(elementConfig.refreshOnUpdate, function(index, refreshTargetName) {
				//Appery(refreshTargetName)
				$(jqmPageName + "_" + refreshTargetName)
					.trigger("clLib.refresh");
			});
		});
		// populate current element..
		$element.live("clLib.refresh", function() {
			elementConfig.contentHandler($element, jqmPageName);
		});
		$
	});

	$.each(clLib.UI.elements[jqmPageName], function(elementName, elementConfig) {
		var $element = 
			//Appery(elementName);
			$(jqmPageName + "_" + elementName);
		// populate current element..
		$element.trigger("clLib.refresh");
	});	
}
