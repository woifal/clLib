"use strict";


var profiledFnCall = function(iterations, aFunc) {
	var totalDuration = 0;
	for(var i = 0; i < iterations; i++) {
		var startDate = +new Date();
		aFunc();
		var endDate = +new Date();
		totalDuration += (endDate - startDate);
	}
	return totalDuration / iterations;
};

//(function(){
var clLib = {};


/*
*   Populates a select box with available gradeTypes from clLib.gradeConfig.
*/
clLib.populateGradeTypes = function($gradeTypeSelect, preselectedGradeType){
	console.log("refreshing gradeTypes for preselected gradetype " + preselectedGradeType);
//	clLib.populateSelectBox($gradeTypeSelect, Object.keys(clLib.gradeConfig), preselectedGradeType);
	clLib.populateSelectBox({
		selectBoxElement : $gradeTypeSelect,
		dataObj : Object.keys(clLib.gradeConfig),
		selectedValue : preselectedGradeType
	});
};

/*
*   Populates a select box with available grades in a certain gradeType.
*/
clLib.populateGrades = function($gradeSelect, selectedGradeType) {
	console.log("refreshing grades for gradetype " + selectedGradeType);
	//clLib.populateSelectBox($gradeSelect, Object.keys(clLib.gradeConfig[selectedGradeType]["grades"]), clLib.gradeConfig[selectedGradeType]["defaultGrade"]);

	clLib.populateSelectBox({
		selectBoxElement : $gradeSelect,
		dataObj : Object.keys(clLib.gradeConfig[selectedGradeType]["grades"]),
		selectedValue : clLib.gradeConfig[selectedGradeType]["defaultGrade"]
	});
	
};

/*
*   Calculates a total score for an array of route logs based on config in clLib.gradeConfig.
*/ 
clLib.calculateScore = function(routeLogs) {
	var totalScore = 0;
	for (var i = 0; i < routeLogs.length; i++) {
		var routeLog = routeLogs[i];
		totalScore += clLib.computeScore(routeLog);
	}
	console.log("Total score is " + totalScore);
    return totalScore;
};

/*
*   Calculates a score for a single route log based on config in clLib.gradeConfig.
*/ 
clLib.computeScore = function(routeLogObj) {
	if(!(routeLogObj.GradeSystem in clLib.gradeConfig)) {
		console.log("unknown gradeType " + routeLogObj.GradeSystem);
		return 0;
	}
	var gradeTypeScore = clLib.gradeConfig[routeLogObj.GradeSystem];
	if(!(routeLogObj.Grade in gradeTypeScore.grades)) {
		console.log("unknown grade " + routeLogObj.Grade);
		return 0;
	}
	if(!(routeLogObj.TickType in gradeTypeScore.tickTypeFactors)) {
		console.log("unknown ticktype " + routeLogObj.TickType);
		return 0;
	}
	
	var score =
		gradeTypeScore["grades"][routeLogObj.Grade]+ 0
		+ gradeTypeScore["tickTypeFactors"][routeLogObj.TickType] + 0
	;
	console.log("computed score >" + score + "< for route " + JSON.stringify(routeLogObj));
	return score;
};

/*
*   Returns a Date object for today at 00:00:00
*/
clLib.today = function() {
	var current = new Date();
	current.setHours(0,0,0,0);
	return current;
};

/*
*   Returns a Date object for tomorrow at 00:00:00
*/
clLib.tomorrow = function() {
	var today = clLib.today();
	today.setDate(today.getDate()+1);
	return today;
};



/*
*  Adds css classes (with the same name as the _values_) to the options
*  from the specified select box (with id _targetId_).
*  Currently selected option(=color) is set as class of the currently selected
*  element.
*
*  _targetId_ is expected to be a select menu rendered by jqm.
*
*/
clLib.addColorBackground = function(targetId) {
	console.log("adding colors to " + targetId);
    $('#' + targetId).unbind('change.clLibColour');
	$('#' + targetId).off('change.clLibColour');
	$('#' + targetId).die('change.clLibColour');
	
	// Add css class named option.value for every entry in #targetId
    $('#' + targetId + ' option').each(function () {
        var ind = $(this).index();
        // fetch current option element
        var entry = $('#' + targetId + '-menu').find('[data-option-index=' + ind + ']');
        // set corresponding css class
        console.log("adding class" + entry.find("a").html());
        entry
            .addClass("clColorBg")
            .addClass(entry.find("a").html());
    });
    // Set currently selected color in collapsed select menu 
    var last_style; // remembers last color chosen
    
	// Update jqm generated widget
//	$('#' + targetId).trigger('change.clLibColour');

	$('#' + targetId).on('change.clLibColour', function () {
        // Get currently selected element
        var selection = $(this).find(':selected').html();
        // Remove CSS class for previously selected color
        if (last_style) {
            $(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
        }
        // Set currently selected color
        $(this).closest('.ui-select').find('.ui-btn').addClass(selection);
        // Remember currently selected color
        last_style = selection;
        //$(this).change();
    });

 	
};





/****************************************************************************************************
*           WHERE conditions utility functions
*
*           To be used in REST service calls to retrieve collection(-object)s
*
*****************************************************************************************************/
/*
*   Returns a single where condition in JSON notation.
*/
clLib.buildSimpleWhere = function(whereCol, whereVal) {
    var whereObj = {};
	whereObj[whereCol] = whereVal;
    console.log("returning where " + JSON.stringify(whereObj));
	return JSON.stringify(whereObj);
};

/*
*   Returns a "BETWEEN startDate and endDate" where condition in JSON notation.
*/
clLib.colBetweenDate = function(colName, startDate, endDate) {
	var whereObj = {};
	whereObj.colName = {
		"$gte": startDate, 
		"$lt": endDate
	};
	console.log(JSON.stringify(whereObj));
	return whereObj;
};

/*
* Builds a mongodb WHERE clause to use for "Routes" collection queries based on
*	- gradeType MANDATORY
*	- grade     MANDATORY
*	- area      OPTIONAL
*	- sector    OPTIONAL
* colums.
* Restrictions are only used if the value to search the colum for contains
* a not-null value.
*
* Returns the WHERE clause in JSON notation.
*
*/
clLib.getRoutesWhere = function(gradeType, grade, area, sector, colour) {
	var whereObj = {};
	whereObj[gradeType] = grade;
	clLib.extendIfDefined(whereObj, "Area", area);
	clLib.extendIfDefined(whereObj, "Sector", sector);
	clLib.extendIfDefined(whereObj, "Colour", colour);
	return whereObj;
};

/*
* Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
* Extends the given "dateWhereObj" where clause by an additional restriction on the "USERNAME" column.
*
* The username is taken from the localStorage item "currentUser".
*
* Returns the WHERE clause in JSON notation.
*
*/
clLib.getRouteLogWhere = function(dateWhereObj) {
	var whereObj = {};
	$.extend(whereObj, dateWhereObj);
	$.extend(clLib.extendIfDefined(
            whereObj, "username", localStore.getItem("currentUser")));
	return JSON.stringify(whereObj);
};

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on routeLogs from today.
*/
clLib.getRouteLogWhereToday = function() {
	return getRouteLogWhereAtDay(clLib.today())	;
}

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on routeLogs at the day contained in "dateObj".
*/
clLib.getRouteLogWhereAtDay = function(dateObj){
	return getRouteLogWhere(
		clLib.colBetweenDate(clLib.dayBegin(dateObj), clLib.dayEnd(dateObj))
	);
};

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on the currently defined scoreRange(in localStorage item "scoreRange").
*   The following score ranges are supported:
*       "customRange" (between localStorage items "scoreRangeFrom" and "scoreRangeTo" )
*       "today"
*/
clLib.getRouteLogWhereCurrentScoreRange =  function() {
	if(localStorage.getItem("scoreRange") == 'today') {
		return clLib.getRouteLogWhereToday();
	}
	else if(localStorage.getItem("scoreRange") == 'customRange') {
		var fromDate = localStorage.getItem("scoreRangeFrom");
		var toDate = localStorage.getItem("scoreRangeTo");
		return clLib.getRouteLogWhere(
				clLib.colBetweenDate(
						fromDate, toDate
				)
		);
	}
};


/*
*   Returns dateObj at 00:00:00.
*/
clLib.dayBegin = function(dateObj) {
	dateObj.setHours(0, 0, 0, 0);
};

/*
*   Returns dateObj at 23:59:59.
*/
clLib.dayEnd = function(dateObj) {
	var dateTomorrow = dateObj.setDate(dateObj.getDate()+1);
	return dateTomorrow.dayBegin();
};


/*
*	Extends "targetObj" with "value" at "key".
*	=> but only if value is defined!
*/
clLib.extendIfDefined = function(targetObj, key, value) {
	if(value) targetObj[key] = value;
};


clLib.addObjArr = function(anObj, pathArr, arrValueToAdd) {
	var tmpObj = anObj;
	for(var i = 0; i < pathArr.length; i++) {
		if(!pathArr[i]) {
			return;
		}
		if(i < pathArr.length - 1) {
			tmpObj = clLib.getChildObj(tmpObj, pathArr[i]);
		} else {
			tmpObj = clLib.getChildArr(tmpObj, pathArr[i]);
		}
		//console.log("anObj is " + JSON.stringify(anObj));
	}
	tmpObj.push(arrValueToAdd);
}; 


clLib.getChildObj = function(anObj, objKey) {
	//console.log("getChildObj called for " + objKey);
	if(!anObj[objKey]) {
		anObj[objKey] = {};
	}
	return anObj[objKey];
} 

clLib.getChildArr = function(anObj, objKey) {
	//console.log("getChildArr called for " + objKey);
	if(!anObj[objKey]) {
		anObj[objKey] = [];
	}
	return anObj[objKey];
} 

clLib.addObjKey = function(anObj, pathArr) {
	var tmpObj = anObj;
	for(var i = 0; i < pathArr.length; i++) {
		if(!pathArr[i]) {
			return;
		}
		tmpObj = clLib.getChildObj(tmpObj, pathArr[i]);
	}
	tmpObj += 1;
}; 


//})(jQuery)
;