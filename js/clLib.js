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
clLib.UI = {};



/*
*   Populates a select box with available grade systems from clLib.gradeConfig.
*
*	!!!! FUNCTION IS OBSOLETE SINCE GRADE CONFIG WAS CHANGED TO USE CORE LOCAL STORAGE!!!
*
*/
clLib.populateGradeSystems = function($gradeSystemSelect, preselectedGradeSystem){
	//alert("refreshing grade systems for preselected grade system " + preselectedGradeSystem);
//	clLib.populateSelectBox($gradeSystemSelect, Object.keys(clLib.gradeConfig), preselectedGradeSystem);
	clLib.populateSelectBox({
		selectBoxElement : $gradeSystemSelect,
		dataObj : Object.keys(clLib.gradeConfig),
		selectedValue : preselectedGradeSystem
	});
};

/*
*   Populates a select box with available grades in a certain grade system.
*
*	!!!! FUNCTION IS OBSOLETE SINCE GRADE CONFIG WAS CHANGED TO USE CORE LOCAL STORAGE!!!
*
*/
clLib.populateGrades = function($gradeSelect, selectedGradeSystem, selectedGrade) {
	//alert("refreshing grades for grade system " + selectedGradeSystem);
	//clLib.populateSelectBox($gradeSelect, Object.keys(clLib.gradeConfig[selectedGradeSystem]["grades"]), clLib.gradeConfig[selectedGradeSystem]["defaultGrade"]);

	//clLib.loggi("default grade " + localStorage.getItem("defaultGrade") + "||+ " + clLib.gradeConfig[selectedGradeSystem]["defaultGrade"]);
	clLib.populateSelectBox({
		selectBoxElement : $gradeSelect,
		dataObj : Object.keys(clLib.gradeConfig[selectedGradeSystem]["grades"]),
		selectedValue:
            selectedGrade ||
            localStorage.getItem("defaultGrade") ||
            clLib.gradeConfig[selectedGradeSystem]["defaultGrade"]
	});
	
};

/*
* Finds a grade with a (best matching) score in another grade system.
*/
clLib.findEquivalentGrade = function(origGradeSystem, origGrade, newGradeSystem){
	var newGrade = "";
	// current grade system is default grade system? in this case the default grade can be pre-selected..
	if(origGradeSystem == newGradeSystem) {
		newGrade = origGrade;
	}
	// default grade is not in current grade system. guess grade-to-preselect based on default grade's score..
	else {
		// 1) Get score of default grade 
		var results = clLib.localStorage.getDistinct(
			"Grades"
			, { 
				  "GradeSystem": origGradeSystem
				, "Grade" : origGrade
			}
			, "Score"
			, "defaultStorage"
		);
		var defaultScore = results[0];
		
		// 2) find equivalent for default score in currently selected grade system..
		var results = clLib.localStorage.getDistinct("Grades", { 
				  "GradeSystem": newGradeSystem
				, "Score" : { 
					"$gte": JSON.parse(defaultScore)
				}
			}
			, "Grade"
			, "defaultStorage"
		);
		var equivalentGrade = results[0];
		clLib.loggi("found equivalent grade: " + equivalentGrade);
		newGrade = equivalentGrade;
	}

	return newGrade;

}

/*
*   Calculates a total score for an array of route logs based on config in clLib.gradeConfig.
*/ 
clLib.calculateScore = function(routeLogs) {
	var totalScore = 0;
	for (var i = 0; routeLogs && (i < routeLogs.length); i++) {
		var routeLog = routeLogs[i];
		totalScore += clLib.computeScore(routeLog);
	}
	clLib.loggi("Total score is " + totalScore);
    return totalScore;
};

/*
*   Calculates a score for a single route log based on config in clLib.gradeConfig.
*/ 
clLib.computeScore = function(routeLogObj) {
	if(!(routeLogObj.GradeSystem in clLib.gradeConfig)) {
		clLib.loggi("unknown grade system " + routeLogObj.GradeSystem);
		return 0;
	}
	var gradeSystemScore = clLib.gradeConfig[routeLogObj.GradeSystem];
	if(!(routeLogObj.Grade in gradeSystemScore.grades)) {
		clLib.loggi("unknown grade " + routeLogObj.Grade);
		return 0;
	}
	if(!(routeLogObj.TickType in gradeSystemScore.tickTypeFactors)) {
		clLib.loggi("unknown ticktype " + routeLogObj.TickType);
		return 0;
	}
	
	var score =
		gradeSystemScore["grades"][routeLogObj.Grade]+ 0
	;
	// allow for flexible tick type factors a eval-able expressions...
	score = eval(score + gradeSystemScore["tickTypeFactors"][routeLogObj.TickType]);
	;
	clLib.loggi("computed score >" + score + "< for route " + JSON.stringify(routeLogObj));
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
    clLib.loggi("returning where " + JSON.stringify(whereObj));
	return JSON.stringify(whereObj);
};

clLib.trimApostrophs = function(str) {
	var trimmedStr;
	trimmedStr = str.substring(1,str.length-1);
	return trimmedStr;
};

clLib.lpad = function(str1, padString, length) {
    var str = str1 +"";
    //alert("padding " + str + " with " + padString + " to " + length);
    while (str.length < length)
        str = padString + str;
    //alert("returning " + str);
    return str;
};

clLib.dateToStr = function(dateObj) {
	var dateStr = 
		dateObj.getFullYear() + 
		"-" + 
        clLib.lpad((dateObj.getMonth() + 1), '0', 2) + 
		"-" + 
		clLib.lpad(dateObj.getDate(), '0', 2) + 
		" " + 
		clLib.lpad(dateObj.getHours(), '0', 2)+ 
		":" + 
		clLib.lpad(dateObj.getMinutes(), '0', 2) + 
		":" + 
		clLib.lpad(dateObj.getSeconds(), '0', 2) + 
		"." + 
		clLib.lpad(dateObj.getMilliseconds(), '0', 2)
	;
	//alert(dateStr);
	return dateStr;
};

/*
*   Returns a "BETWEEN startDate and endDate" where condition in JSON notation.
*/
clLib.colBetweenDate = function(colName, startDate, endDate) {
	//alert("getting between date " + JSON.stringify(startDate) + " and " + JSON.stringify(endDate));
	var whereObj = {};
	whereObj[colName] = {
		"$gte": clLib.dateToStr(startDate), 
		"$lt": clLib.dateToStr(endDate)
	};
	1;
	
	//alert(JSON.stringify(whereObj));
	return whereObj;
};

/*
* Builds a mongodb WHERE clause to use for "Routes" collection queries based on
*	- grade system MANDATORY
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
clLib.getRoutesWhere = function(gradeSystem, grade, area, sector, colour, line) {
	//alert("typeof first ehre argument " + typeof(gradeSystem));
	//alert("getting " + line);
	if(typeof(gradeSystem) !== "object") {
		return clLib.getRoutesWhere_plain(gradeSystem, grade, area, sector, colour, line);
	} else {
		return clLib.getRoutesWhere_obj(gradeSystem);
	}
}

clLib.getRoutesWhere_plain = function(gradeSystem, grade, area, sector, colour, line) {
	var restrictionObj = {};
	//alert("building restrictionobj" + JSON.stringify(line));
	if(restrictionObj["GradeSystem"]) {
		restrictionObj["GradeSystem"] = gradeSystem;
		restrictionObj["Grade"] = grade;
	}
	clLib.extendIfDefined(restrictionObj, "Area", area);
	clLib.extendIfDefined(restrictionObj, "Sector", sector);
	clLib.extendIfDefined(restrictionObj, "Colour", colour);
	clLib.extendIfDefined(restrictionObj, "Line", line);
	//alert("getRoutesWhere2" + JSON.stringify(restrictionObj));
	return clLib.getRoutesWhere(restrictionObj);
	
};

clLib.getRoutesWhere_obj = function(restrictionObj) {
	var gradeSystem, grade;
	gradeSystem = restrictionObj["GradeSystem"];
	grade = restrictionObj["Grade"];
	delete restrictionObj["GradeSystem"];
	delete restrictionObj["Grade"];
	
	if(gradeSystem) {
		restrictionObj[gradeSystem] = grade;
	}
	clLib.removeIfNotDefined(restrictionObj, "Area");
	clLib.removeIfNotDefined(restrictionObj, "Sector");
	clLib.removeIfNotDefined(restrictionObj, "Colour");
	clLib.removeIfNotDefined(restrictionObj, "Line");
	return restrictionObj;
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
clLib.getRouteLogWhereAt = function(dateWhereObj, additionalWhere) {
	var whereObj = {};
	$.extend(whereObj, dateWhereObj);
	$.extend(whereObj, additionalWhere);
	return whereObj;
};

clLib.getCurrentUserWhere = function() {
	return {
		userName: localStorage.getItem("currentUser")
	}
}

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on routeLogs from today.
*/
clLib.getRouteLogWhereToday = function(additionalWhere) {
	return clLib.getRouteLogWhereAtDay(clLib.today(), additionalWhere);
}

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on routeLogs at the day contained in "dateObj".
*/
clLib.getRouteLogWhereAtDay = function(dateObj, additionalWhere){
	return clLib.getRouteLogWhereAt(
		clLib.colBetweenDate("Date", clLib.dayBegin(dateObj), clLib.dayEnd(dateObj)),
		additionalWhere
	);
};

/*
*   Builds a mongodb WHERE clause to use for "RouteLog" collection queries.
*   Restricts results on the currently defined scoreRange(in localStorage item "scoreRange").
*   The following score ranges are supported:
*       "customRange" (between localStorage items "scoreRangeFrom" and "scoreRangeTo" )
*       "today"
*/
clLib.getRouteLogWhereCurrentScoreRange =  function(additionalWhere) {
	if(localStorage.getItem("scoreRange") == 'today') {
		return clLib.getRouteLogWhereToday(additionalWhere);
	}
	else if(localStorage.getItem("scoreRange") == 'customRange') {
		var fromDate = localStorage.getItem("scoreRangeFrom");
		var toDate = localStorage.getItem("scoreRangeTo");
		return clLib.getRouteLogWhereAt(
				clLib.colBetweenDate(
						fromDate, toDate
				),
				additionalWhere
		);
	}
};


/*
*   Returns dateObj at 00:00:00.
*/
clLib.dayBegin = function(dateObj) {
	//alert("setting hours to 0 in " + JSON.stringify(dateObj));
	var foo = new Date(dateObj.setHours(0, 0, 0, 0));
	//alert("set hours to 0 in " + JSON.stringify(foo));
	return foo;
};

/*
*   Returns dateObj at 23:59:59.
*/
clLib.dayEnd = function(dateObj) {
	//alert("dateTomorrows was " + JSON.stringify(dateObj));
	var dateTomorrow = new Date(dateObj.setDate(dateObj.getDate()+1));
	//alert("dateTomorrows now is " + JSON.stringify(dateTomorrow));
	var foo = clLib.dayBegin(dateTomorrow);
	//alert("begin of tomorrow is " + JSON.stringify(foo));
	return foo;
};


/*
*	Extends "targetObj" with "value" at "key".
*	=> but only if value is defined!
*/
clLib.extendIfDefined = function(targetObj, key, value) {
	//alert("checking " + targetObj[key] + "!=" + clLib.UI["NOTSELECTED"]["value"]);
	if(	
		value &&
		value != clLib.UI["NOTSELECTED"]["value"]
	) targetObj[key] = value;
};

/*
*	Removes "key" from "targetObj"
*	=> but only if value is NOT defined!
*/
clLib.removeIfNotDefined = function(targetObj, key) {
	//alert("removeIfNotDefined " + JSON.stringify(targetObj) +", ? => " + key);
	if(!targetObj[key]) delete targetObj[key];
	if(targetObj[key] == clLib.UI["NOTSELECTED"]["value"]) delete targetObj[key];
};


clLib.addObjArr = function(anObj, pathArr, arrValueToAdd) {
	var tmpObj = anObj;
//	alert("is tmpObj?" + JSON.stringify(tmpObj));
	if(!tmpObj) {
		//alert("no");
		tmpObj = {};
	}
//	alert("yes");
	for(var i = 0; i < pathArr.length; i++) {
//		alert("looping " + i);
		if(!pathArr[i]) {
//			alert("returning early");
			return;
		}
		if(i < pathArr.length - 1) {
//			alert("getting childobj " + pathArr[i] + " " + JSON.stringify(tmpObj));
			tmpObj = clLib.getChildObj(tmpObj, pathArr[i]);
		} else {
//			alert("getting childarr " + pathArr[i] + " " + JSON.stringify(tmpObj));
			tmpObj = clLib.getChildArr(tmpObj, pathArr[i]);
		}
//		alert("tmpObj is " + JSON.stringify(tmpObj));
//		alert("anObj is " + JSON.stringify(anObj));
	}
	
	tmpObj.push(arrValueToAdd);
//	alert("2tmpObj is " + JSON.stringify(tmpObj));
//	return JSON.parse(JSON.stringify(tmpObj));
//	return tmp0bj;
}; 

clLib.addObjValue = function(anObj, pathArr, valueToAdd) {
    var anObj = anObj || {};
    var tmpObj = anObj;
	for(var i = 0; i < pathArr.length -1; i++) {
		//alert("at path elemnt >" + pathArr[i]);
		if(!tmpObj[pathArr[i]]) {
			tmpObj[pathArr[i]] = {};
		}
		//alert("new anObj " + JSON.stringify(anObj));
        tmpObj = tmpObj[pathArr[i]];
	}
	tmpObj[pathArr[pathArr.length-1]] = valueToAdd;
	//alert("final tmpobj " + JSON.stringify(tmpObj));
	//alert("final anObj " + JSON.stringify(anObj));
    return anObj;
}; 

clLib.getChildObj = function(anObj, objKey) {
	//alert("getChildObj called for " + objKey);
	if(!anObj[objKey]) {
		anObj[objKey] = {};
	}
	return anObj[objKey];
} 

clLib.getChildArr = function(anObj, objKey) {
	//clLib.loggi("getChildArr called for " + objKey);
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








clLib.sortByScoreFunc = function(routeLog) {
	//alert("functon called!" + JSON.stringify(routeLog));
	return clLib.computeScore(routeLog);
};






Array.prototype.hasValue = function(needle) {
	return this.indexOf(needle) > -1;
};




clLib.loggi = function(text, priority) {
	priority = priority || 0;
	if(priority) {
		if(priority == 1) {
			alert(text);
		} else {
			console.log(text);
		}
	}
};

clLib.alert = function (text, html) {
    /*
    $.mobile.loading('show', {
        text: text,
        textVisible: true,
        //theme: 'z',
        html: html
    });
    setTimeout(function () {
        $.mobile.loading('hide');
    }, 10000);
    */
    alert(":) " + text);
};


clLib.login = function() {
	var userObj = {};
	userObj["username"] = localStorage.getItem("currentUser");
	userObj["password"] = localStorage.getItem("currentPassword");
    var returnObj = clLib.REST.loginUser("users", userObj, "users");
	var sessionToken = returnObj["sessionToken"];
	//alert("retrieved sessionToken >" + sessionToken + "<");
	clLib.sessionToken = sessionToken;
	// Clear any "old" error messages 
	localStorage.removeItem("loginError");
};

clLib.isOnline = function() {
	var onlineMode = "" + localStorage.getItem("onlineMode");
	onlineMode = onlineMode != "false";
	//alert("currentlyOnline? >" + onlineMode);
	if(onlineMode) {
		//alert("yes, fuck you true!!!");
	    onlineMode = navigator.onLine;
	}
	
	//alert("onlineMode >" + onlineMode + "<");
	var iconSrc = "";
	if(onlineMode){
		iconSrc = "files/views/assets/image/online.jpg";
	} else {
		iconSrc = "files/views/assets/image/offline.jpg";
	}
	//alert("src is " + iconSrc);
	$("#header_onlineIcon").attr("src", iconSrc); 

	return onlineMode;
};

clLib.loggedInCheck = function () {
    //alert(clLib.sessionToken);
	// not online? assume you're logged in..
	if(!clLib.isOnline()) {
		return false;
	}
	// online - check for valid sessiontoken
	if (clLib.sessionToken) {
        return true;
    }
	clLib.loggi("no session token!");
	// no session token found - try to logon using stored credentials
	try {
		clLib.login();
		// successfully logged in, return true
		return true;
	} catch (e) {
		// could not login - alert error and return false
        clLib.sessionToken = null;
		localStorage.setItem("loginError", "Could not login user: " + JSON.parse(JSON.parse(e.message)["responseText"])["description"]);
		return false;
	}

	// should not get here, return false anyway.
	return false;
};

clLib.wasOnlineCheck = function () {
	//alert("last refresh:" + clLib.localStorage.getLastRefreshDate("defaultStorage"));
	// data from previous refresh found?
    if (clLib.localStorage.getLastRefreshDate("defaultStorage")) {
        return true;
    }

    if (!clLib.localStorage.refreshAllData()) {
		alert("You need to go online once to get initial Route(Log) data!");
		$.mobile.navigate("clLib_startScreen.html");
	}
};

//
// Polyfill for "String.endsWith()" function
//
if (!String.prototype.endsWith) {
	Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}



//})(jQuery)
;