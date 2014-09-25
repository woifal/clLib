"use strict";

function ClInfo(message, infoType) {
	this.message = message;
	this.infoType = infoType || 'info';
}


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

//window.priority = 1;
//
// TESTING: Set to 0 to disable login need...
//
clLib.VERIFY_LOGIN = 1;


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
	//alert("computing score for " + JSON.stringify(routeLogObj));
	if(!(routeLogObj.GradeSystem in clLib.gradeConfig)) {
		clLib.loggi("unknown grade system " + routeLogObj.GradeSystem);
		return 0;
	}
	var gradeSystemScore = clLib.gradeConfig[routeLogObj.GradeSystem];
	if(!(routeLogObj.Grade in gradeSystemScore.grades)) {
		clLib.loggi("unknown grade " + routeLogObj.Grade);
		return 0;
	}
/*	if(!(routeLogObj.TickType in gradeSystemScore.tickTypeFactors)) {
		clLib.loggi("unknown ticktype " + routeLogObj.TickType);
		return 0;
	}
*/	
	var score =
		gradeSystemScore["grades"][routeLogObj.Grade]+ 0
	;
	
	// allow for flexible tick type factors a eval-able expressions...
	$.each(gradeSystemScore["tickTypeFactors"], function(tickType, expr) {
		//alert("checking " + tickType + ": " + routeLogObj[tickType]);
		if(routeLogObj[tickType]) {
			score = eval(score + gradeSystemScore["tickTypeFactors"][tickType]);
		}
	});
	
	clLib.loggi("computed score >" + score + "< for route " + JSON.stringify(routeLogObj));
	return score;
};

/*
*   Returns a Date object for today at 00:00:00
*/
clLib.today = function() {
	var current = new Date();
	// hours = UTC
	// => we're CET, so add 1...
	current.setHours(0+1,0,0,0);
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

clLib.rpad = function(str1, padString, length) {
    var str = str1 +"";
    //alert("padding " + str + " with " + padString + " to " + length);
    while (str.length < length)
        str = str + padString;
    //alert("returning " + str);
    return str;
};

clLib.dateToStr = function(dateObj) {
	// ALL dates are ISO dates!!
	var asISOstring = true;
	var dateStr;
	dateStr = 
		dateObj.getUTCFullYear() + 
		"-" + 
        clLib.lpad((dateObj.getUTCMonth() + 1), '0', 2) + 
		"-" + 
		clLib.lpad(dateObj.getUTCDate(), '0', 2) + 
		// !!!
		(asISOstring ? "T" : " " ) +
		clLib.lpad(
			dateObj.getUTCHours(), 
			'0', 
			2
		)+ 
		":" + 
		clLib.lpad(dateObj.getUTCMinutes(), '0', 2) + 
		":" + 
		clLib.lpad(dateObj.getUTCSeconds(), '0', 2) + 
		"." + 
		clLib.lpad(dateObj.getUTCMilliseconds(), '0', 3) +
		(asISOstring ? "Z" : "")
		//(asISOstring ? "+01:00" : "")
	;
	//alert(dateStr);
	
	//if(asISOstring) {
	//	dateStr = { "$date" : dateStr };
	//}
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
* The username is taken from clLib.getCurrentUserInfo.
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
    var userName = clLib.getUserInfo()["username"];
    return {"username" : userName};
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
		clLib.colBetweenDate("DateISO", clLib.dayBegin(dateObj), clLib.dayEnd(dateObj)),
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
	priority = priority || window.priority || 0;
	if(priority) {
		if(priority == 1) {
			alert("asdfasdf" + text);
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


clLib.login = function(successFunc, errorFunc) {
	//alert("clLib.login called.....");
	var userObj = {};
	userObj = clLib.getUserInfo();
    //userObj["username"] = clLib.getUserInfo()["username"];
	//userObj["password"] = localStorage.getItem("currentPassword");
    return clLib.REST.loginUser(userObj, 
	function(returnObj) {
		var sessionToken = returnObj["sessionToken"];
		var currentUserId = returnObj["_id"];
		//alert("success login!");
		console.log("retrieved sessionToken >" + sessionToken + "<");
		clLib.sessionToken = sessionToken;

		// Clear any "old" error messages 
		clLib.setUIMessage(new ClInfo("Logged in."), true);
		
		//alert("logged in, return success");
		return successFunc(returnObj);
	}
	, errorFunc
	);
};

clLib.isOnline = function() {
	var onlineMode = "" + localStorage.getItem("onlineMode");
	onlineMode = onlineMode != "false";
//	alert("currentlyOnline? >" + onlineMode);
	if(onlineMode) {
//		alert("yes, fuck you true!!!");
	    onlineMode = navigator.onLine;
	}
	
	return onlineMode;
};

clLib.formatError = function(e) {
	clLib.loggi("error type " + typeof(e));
	clLib.loggi("JSON ERROR " + JSON.stringify(e));
	
	// object is already a ClInfo instance? return it straightaway..
	if(e instanceof ClInfo) {
		return e;
	}
	
	var errorMsg = e.message;
	if(e.message && e.message["reponseText"] && JSON.parse(e.message)["responseText"]) {
		errorMsg = JSON.parse(JSON.parse(e.message)["responseText"])["description"];
	} 
	else if(e.responseText) {
		errorMsg = e.responseText;
	}
	else if(e.message) {
		errorMsg = e.message;
	}
	else {
		errorMsg = "Server down.";
		// Don't know what type of error this is, assume server is down..
		//errorMsg = e;
	}
	
	return new ClInfo(errorMsg, "error");
};

clLib.loginErrorHandler = function(e) {
	var clInfoObj = clLib.formatError(e);

	clLib.sessionToken = null;
	clLib.setUIMessage(clInfoObj, true);

	clLib.UI.byId$("loginError", "users").trigger("refresh.clLib");
	return false;
};


clLib.loggedInCheck = function (callbackFunc, errorFunc) {
    //alert("clLib.loggedInCheck called..");
	//alert(clLib.sessionToken);
	// not online? assume you're logged in..
	if(!clLib.isOnline()) {
		return errorFunc(false);
	}
	// online - check for valid sessiontoken
	// if VERIFY_LOGIN is not set, don't login user
	if (!clLib.VERIFY_LOGIN || clLib.sessionToken) {
        //alert("yes, logged in mofu!");
		return callbackFunc(/*true*/);
    }
	//alert("no session token!");
	
	// no stored credentials. Ask user to provide some..
	if(!clLib.getUserInfo()["username"]) {
		return errorFunc(new ClInfo("Please login.", "error"));
	}
	
	// no session token found - try to logon using stored credentials
	console.log("logging in..");
	return clLib.login(
		function() {
			// successfully logged in, return true
			//alert("logged in now, returning true");
            $("#_COMMON__displayName").trigger("refresh.clLib");
            return callbackFunc(/*true*/);
		}
		, errorFunc
	);

	// should not get here, return false anyway.
	alert("should not get here 45345");
};

clLib.wasOnlineCheck = function (successFunc, errorFunc) {
	//alert("last refresh:" + clLib.localStorage.getLastRefreshDate("defaultStorage"));
	// data from previous refresh found?
    if (clLib.localStorage.getLastRefreshDate("defaultStorage")) {
        console.log("was refresh already at >" + clLib.localStorage.getLastRefreshDate("defaultStorage") + "<");
        return successFunc();
    }

    if (!clLib.localStorage.refreshAllData(
		function() {
			//alert("refreshed!");
			return successFunc();
		}
		,function() {
			alert("not refreshed!");
			return errorFunc();
		}
	)) {
		//alert("You need to go online once to get initial Route(Log) data!");
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


clLib.dateToISOStr = function(dateObj) {
	return JSON.parse(JSON.stringify(dateObj));
};

clLib.formatObj = function(itemObj, exprs) {
	var tmpStr = "";
	for(var i = 0; i < exprs.length; i++) {
		if(clLib.isFunction(exprs[i])) {
			tmpStr += exprs[i](itemObj);
		}
		else {
			tmpStr += itemObj[exprs[i]];
		}
	}
	return tmpStr;
};

clLib.formatArr = function(resultObj, exprs) {
	//alert("formatting obj " + JSON.stringify(resultObj));
	var newArr =  [];
	for(var i = 0; i < resultObj.length; i++) {
		newArr.push(clLib.formatObj(resultObj[i], exprs));
	}
	//alert("returning formatted obj " + JSON.stringify(newArr));
	return newArr;
};

clLib.formatArrInt = function(resultObj, exprs) {
	//alert("formatting obj " + JSON.stringify(resultObj));
	var newArr =  [];
	for(var i = 0; i < resultObj.length; i++) {
		newArr.push(parseInt(clLib.formatObj(resultObj[i], exprs)));
	}
	//alert("returning formatted obj " + JSON.stringify(newArr));
	return newArr;
};

clLib.getObjValues = function(resultObj) {
	var values = [];
	for(var key in resultObj) {
		values.push(resultObj[key]);
	}
	//alert("values are " + JSON.stringify(values));
	return values;
};



clLib.getUserInfo = function() {
    var userObj= {};
    if(window.userInfo) {
        //console.log("window.userInfo : " + JSON.stringify(window.userInfo));
        userObj = window.userInfo;
    } else {
        if(localStorage.getItem("userInfo")) {
            //console.log("localuserinfo is " + localStorage.getItem("userInfo"));
            userObj = JSON.parse(localStorage.getItem("userInfo"));
            window.userInfo = userObj;
        }
    }
    return userObj;
};

clLib.setUserInfo = function(newUserInfo, replaceFlag) {
    var curUserInfo = clLib.getUserInfo();
    if(replaceFlag) {
        curUserInfo = newUserInfo;
    }
    else {
        $.each(newUserInfo, function(key, value) {
            curUserInfo[key] = value;
        });
    }
    localStorage.setItem("userInfo", JSON.stringify(curUserInfo));
    window.userInfo = curUserInfo;
};

clLib.getUIMessage = function() {
    var UIMessage = {};
    if(window.UIMessage) {
        //console.log("window.userInfo : " + JSON.stringify(window.userInfo));
        UIMessage = window.UIMessage;
    } else {
        if(localStorage.getItem("UIMessage")) {
            console.log("localUIMessage is " + localStorage.getItem("UIMessage"));
            UIMessage = JSON.parse(localStorage.getItem("UIMessage"));
            window.UIMessage = UIMessage;
        }
    }
    return UIMessage;
};

clLib.setUIMessage = function(newUIMessage, replaceFlag) {
    var curUIMessage = clLib.getUIMessage();
    if(replaceFlag) {
        curUIMessage = newUIMessage;
    }
    else {
        $.each(newUIMessage, function(key, value) {
            curUIMessage[key] = value;
        });
    }
    localStorage.setItem("UIMessage", JSON.stringify(curUIMessage));
    window.UIMessage = curUIMessage;
};



//})(jQuery)
;
