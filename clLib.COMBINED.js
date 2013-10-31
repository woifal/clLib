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
*   Populates a select box with available gradeTypes from clLib.gradeConfig.
*/
clLib.populateGradeTypes = function($gradeTypeSelect, preselectedGradeType){
	//alert("refreshing gradeTypes for preselected gradetype " + preselectedGradeType);
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
	clLib.loggi("refreshing grades for gradetype " + selectedGradeType);
	//clLib.populateSelectBox($gradeSelect, Object.keys(clLib.gradeConfig[selectedGradeType]["grades"]), clLib.gradeConfig[selectedGradeType]["defaultGrade"]);

	clLib.populateSelectBox({
		selectBoxElement : $gradeSelect,
		dataObj : Object.keys(clLib.gradeConfig[selectedGradeType]["grades"]),
		selectedValue : localStorage.getItem("defaultGrade") || clLib.gradeConfig[selectedGradeType]["defaultGrade"]
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
	clLib.loggi("Total score is " + totalScore);
    return totalScore;
};

/*
*   Calculates a score for a single route log based on config in clLib.gradeConfig.
*/ 
clLib.computeScore = function(routeLogObj) {
	if(!(routeLogObj.GradeSystem in clLib.gradeConfig)) {
		clLib.loggi("unknown gradeType " + routeLogObj.GradeSystem);
		return 0;
	}
	var gradeTypeScore = clLib.gradeConfig[routeLogObj.GradeSystem];
	if(!(routeLogObj.Grade in gradeTypeScore.grades)) {
		clLib.loggi("unknown grade " + routeLogObj.Grade);
		return 0;
	}
	if(!(routeLogObj.TickType in gradeTypeScore.tickTypeFactors)) {
		clLib.loggi("unknown ticktype " + routeLogObj.TickType);
		return 0;
	}
	
	var score =
		gradeTypeScore["grades"][routeLogObj.Grade]+ 0
	;
	// allow for flexible tick type factors a eval-able expressions...
	score = eval(score + gradeTypeScore["tickTypeFactors"][routeLogObj.TickType]);
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
	//clLib.loggi("adding colors to " + targetId);
	var $targetEl = $('#' + targetId);
	clLib.UI.killEventHandlers($targetEl, "change.clLibColour");
	
	// Add css class named option.value for every entry in #targetId
    $('option', $targetEl).each(function () {
        var ind = $(this).index();
        // fetch current option element
        var entry = $('#' + targetId + '-menu').find('[data-option-index=' + ind + ']');
        // set corresponding css class
        //clLib.loggi("adding class" + entry.find("a").html());
        entry
            .addClass("clColorBg")
            .addClass(entry.find("a").html());
    });
    
	// Set currently selected color in collapsed select menu 
    var last_style; // remembers last color chosen
    
	$targetEl.on('change.clLibColour', function () {
		var last_style = $(this).data("cllast_style");

		// Get currently selected element
        var selection = $(this).find(':selected').html();

        //alert("last_style " + last_style + ",changing to " + selection);

        // Remove CSS class for previously selected color
        if (last_style) {
            $(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
        }
        // Set currently selected color
        $(this).closest('.ui-select').find('.ui-btn').addClass(selection);
        // Remember currently selected color
        $(this).data("cllast_style", selection);
        //alert("remembering last_style " + selection);
		//$(this).change();
    });

	// Update jqm generated widget
	$('#' + targetId).trigger('change.clLibColour');
//	$('#' + targetId).trigger('change');
 	
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
clLib.getRoutesWhere = function(gradeType, grade, area, sector, colour, line) {
	//alert("typeof first ehre argument " + typeof(gradeType));
	//alert("getting " + line);
	if(typeof(gradeType) !== "object") {
		return clLib.getRoutesWhere_plain(gradeType, grade, area, sector, colour, line);
	} else {
		return clLib.getRoutesWhere_obj(gradeType);
	}
}

clLib.getRoutesWhere_plain = function(gradeType, grade, area, sector, colour, line) {
	var restrictionObj = {};
	//alert("building restrictionobj" + JSON.stringify(line));
	if(restrictionObj["GradeType"]) {
		restrictionObj["GradeType"] = gradeType;
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
	var gradeType, grade;
	gradeType = restrictionObj["GradeType"];
	grade = restrictionObj["Grade"];
	delete restrictionObj["GradeType"];
	delete restrictionObj["Grade"];
	
	if(gradeType) {
		restrictionObj[gradeType] = grade;
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
			clLib.loggi(text);
		}
	}
};







//})(jQuery)
;"use strict";

/*
*   Configuration object for grades.
*   Keys are the available gradeTypes.
*   For every gradeType column with the same name has to be present in the Routes collection.
*
*/

/*
Red Point
Onsight: + 145 points (based on Red Pointing)
Flash: +53 points (based on Red Pointing)
Top Rope: - 150 points (based on Red Pointing)
Attempt: 0 points

*/
clLib.defaultTickTypeFactors = {
	"Red Point" : "+0",
	"Flash" : "+53",
	"Onsight" : "+145",
	"Attempt" : "*0",
	"Top Rope" : "-150"
};

clLib.gradeConfig = {
	"UIAA" : {
		defaultGrade: "V+",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"I-" : 10                 ,
			"I" : 15                  ,
			"I+" : 20                 ,
			"II-" : 25                ,
			"II" : 30                 ,
			"II+" : 35                ,
			"III-" : 40               ,
			"III" : 45                ,
			"III+" : 50               ,
			"III+/IV-" : 60           ,
			"IV-" : 70                ,
			"IV-/IV" : 80             ,
			"IV" : 90                 ,
			"IV+" : 100               ,
			"IV+/V-" : 125            ,
			"V-" : 150                ,
			"V-/V" : 175              ,
			"V" : 200                 ,
			"V/V+" : 225              ,
			"V+" : 250                ,
			"V+/VI-" : 275            ,
			"VI-" : 300               ,
			"VI-/VI" : 325            ,
			"VI" : 350                ,
			"VI/VI+" : 375            ,
			"VI+" : 400               ,
			"VI+/VII-" : 425          ,
			"VII-" : 450              ,
			"VII-/VII" : 475          ,
			"VII" : 500               ,
			"VII/VII+" : 525          ,
			"VII+" : 550              ,
			"VII+/VIII-" : 600        ,
			"VIII-" : 625             ,
			"VIII-/VIII" : 650        ,
			"VIII" : 700              ,
			"VIII/VIII+" : 750        ,
			"VIII+" : 775             ,
			"VIII+/IX-" : 800         ,
			"IX-" : 850               ,
			"IX-/IX" : 875            ,
			"IX" : 900                ,
			"IX/IX+" : 925            ,
			"IX+" : 950               ,
			"IX+/X-" : 1000           ,
			"X-" : 1050               ,
			"X-/X" : 1075             ,
			"X" : 1100                ,
			"X/X+" : 1125             ,
			"X+" : 1150               ,
			"X+/XI-" : 1200           ,
			"XI-" : 1225              ,
			"XI-/XI" : 1250           ,
			"XI" : 1300               ,
			"XI/XI+" : 1325           ,
			"XI+" : 1350              ,
			"XI+/XII-" : 1375         ,
			"XII-" : 1400             ,
			"XII-/XII" : 1450         
		}
	},
	"French" : {                        
		defaultGrade: "5b",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"1" : 10                  ,
			"2" : 25                  ,
			"3" : 40                  ,
			"4a" : 90                 ,
			"4a/4b" : 125             ,
			"4b" : 150                ,
			"4b/4c" : 175             ,
			"4c" : 200                ,
			"4c/5a" : 225             ,
			"5a" : 250                ,
			"5a/5b" : 275             ,
			"5b" : 300                ,
			"5b/5c" : 325             ,
			"5c" : 350                ,
			"5c/6a" : 375             ,
			"6a" : 400                ,
			"6a/6a+" : 425            ,
			"6a+" : 450               ,
			"6a+/6b" : 475            ,
			"6b" : 500                ,
			"6b/6b+" : 525            ,
			"6b+" : 550               ,
			"6c" : 600                ,
			"6c/6c+" : 625            ,
			"6c+" : 650               ,
			"7a" : 700                ,
			"7a/7a+" : 750            ,
			"7a+" : 775               ,
			"7b" : 800                ,
			"7b+" : 850               ,
			"7b+/7c" : 875            ,
			"7c" : 900                ,
			"7c/7c+" : 925            ,
			"7c+" : 950               ,
			"8a" : 1000               ,
			"8a+" : 1050              ,
			"8a+/8b" : 1075           ,
			"8b" : 1100               ,
			"8b/8b+" : 1125           ,
			"8b+" : 1150              ,
			"8c" : 1200               ,
			"8c/8c+" : 1225           ,
			"8c+" : 1250              ,
			"9a" : 1300               ,
			"9a/9a+" : 1325           ,
			"9a+" : 1350              ,
			"9a+/9b" : 1375           ,
			"9b" : 1400               ,
			"9b+" : 1450              
		}
	},
	"Bleau" : {                        
		defaultGrade: "Fb 5a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                     
			"Fb 1" : 10               ,
			"Fb 2" : 90               ,
			"Fb 3" : 225              ,
			"Fb 4a" : 275             ,
			"Fb 4b" : 350             ,
			"Fb 4c" : 375             ,
			"Fb 5a" : 450             ,
			"Fb 5b" : 500             ,
			"Fb 5c" : 550             ,
			"Fb 6a" : 625             ,
			"Fb 6a+" : 700            ,
			"Fb 6b" : 750             ,
			"Fb 6b+" : 775            ,
			"Fb 6c" : 800             ,
			"Fb 6c+" : 875            ,
			"Fb 7a" : 900             ,
			"Fb 7a+" : 950            ,
			"Fb 7b" : 1050            ,
			"Fb 7b+" : 1100           ,
			"Fb 7c" : 1150            ,
			"Fb 7c+" : 1225           ,
			"Fb 8a" : 1300            ,
			"Fb 8a+" : 1325           ,
			"Fb 8b" : 1350            ,
			"Fb 8b+" : 1375           ,
			"Fb 8c" : 1400            ,
			"Fb 8c+" : 1450           
		}
	},
	"USA" : {                      
		defaultGrade: "5.10a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"5.0" : 10                ,
			"5.1" : 25                ,
			"5.2" : 45                ,
			"5.3" : 90                ,
			"5.4" : 100               ,
			"5.5" : 150               ,
			"5.6" : 225               ,
			"5.7" : 250               ,
			"5.8" : 300               ,
			"5,9" : 350               ,
			"5.9" : 375               ,
			"5.10a" : 400             ,
			"5.10b" : 450             ,
			"5.10c" : 475             ,
			"5.10d" : 500             ,
			"5.11a" : 550             ,
			"5.11b" : 600             ,
			"5.11c" : 650             ,
			"5.11d" : 750             ,
			"5.12a" : 775             ,
			"5.12b" : 800             ,
			"5.12c" : 875             ,
			"5.12d" : 900             ,
			"5.13a" : 950             ,
			"5.13b" : 1000            ,
			"5.13c" : 1050            ,
			"5.13d" : 1100            ,
			"5.14a" : 1125            ,
			"5.14b" : 1200            ,
			"5.14c" : 1250            ,
			"5.14d" : 1300            ,
			"5.15a" : 1325            ,
			"5.15b" : 1375            ,
			"5.15c" : 1450            	
		}
	}
};

"use strict";


/*
*
*
*
*
*	experimental: localStorage alternative to REST service
*
*
*
*/
clLib.localStorage ={};

//
// Cached versions of parsed JSON strings from localStorage as objects
//
var storageCache = {};



clLib.localStorage.indexExists = function(storageName, indexName) {
	var indexedStorages = clLib.localStorage.indexes;
	if(
		storageName in indexedStorages &&
		indexName in indexedStorages.storageName
	) {
		return true;
	}
	return false;
};


clLib.localStorage.initStorage = function(storageName, storageObj) {
	// Delete cache
	var storageItemsKey = storageName + "_items";
	
//	localStorage.removeItem("cache_" + storageItemsKey);
	delete(storageCache[storageItemsKey]);


	//alert("adding elements " + Object.keys(storageObj).length + "->" + JSON.stringify(Object.keys(storageObj)));
	var allItems = {};
	for(var entityName in storageObj) {
		//alert("entity: " + entityName);
		var entityItems = {};
		for(var i = 0; i < storageObj[entityName].length; i++) {
			entityItems[storageObj[entityName][i]["_id"]] = storageObj[entityName][i];
		}

		// add UNSYNCED entries to cache	
		var unsyncedStorage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
		clLib.loggi("currently unsynced items for entity >" + entityName + "< =>" + JSON.stringify(unsyncedStorage) + "<");
		if(unsyncedStorage) {
			$.each(unsyncedStorage[entityName], function(dummyId) {
				var entityInstance = unsyncedStorage[entityName][dummyId];
				//alert("add to storage items for >" + dummyId + "< bzw. >" + JSON.stringify(entityInstance) + "<");
				entityItems[entityInstance["_id"]] = entityInstance;
			});
		}
		
		// store retrieved AND unsynced items
		allItems[entityName] = entityItems;

	}



	clLib.loggi("storing items");
	clLib.localStorage.setStorageItems(storageName, allItems);
	clLib.loggi("items stored");
	
/*
	var storageItems = clLib.localStorage.getStorageItems(storageName);
	var indexedEntities = clLib.localStorage.indexes;
	var indexedItems = {};
	
	clLib.loggi("indexItems: " + tojson(indexedEntities));
	//clLib.loggi("allitems " + tojson(storageItems));
	// check all entities in storageObj for configured indexs..
	for(var entityName in indexedEntities) {
	//$.each(indexedEntities, function(entityName) {
		//clLib.loggi("working on indexedentity " + entityName);
		
		// iterate indexed entities from storageObj
		var currentEntityIndexes = indexedEntities[entityName];
		var currentEntityItems = storageItems[entityName];
		var currentEntityIdxItems = {};
		//clLib.loggi("working on currententityitems " + tojson(currentEntityItems));
		if(!currentEntityItems) {
			//clLib.loggi("no items for " + entityName + " in current collection..");
			return;
		}
		// Iterate all items of current entity(routes, areas, etc..)
		$.each(currentEntityItems, function(currentId, currentItem) {
		//for(var currentId in currentEntityItems) {
			var currentItem = currentEntityItems[currentId];
			// Resolve every index for current item
			for(var indexedCol in currentEntityIndexes) {
			//$.each(currentEntityIndexes, function(idx, indexedCol) {
				//clLib.loggi("!!Checking indexed column " + indexedCol);
				var currentIdxKey = currentItem[indexedCol];
				clLib.addObjArr(
					currentEntityIdxItems, 
					[indexedCol, currentIdxKey,	"items"], // French => 8a+ => "items"
					currentId);  // _123123123
				// Need to take care of distinct values per indexed column value?
				$.each(currentEntityIndexes[indexedCol].distinct, function(i, distinctColValue) {
					clLib.addObjKey(
							currentEntityIdxItems, 
							[
								indexedCol, currentIdxKey, "distinct", distinctColValue,  // French => 8a+ => "distinct" => Colour
								currentItem[distinctColValue]
							]); // Blue
				});
				
			}
			//);
			//clLib.loggi("3after adding row it is" + tojson(currentEntityIdxItems));
		//}
		});
		//clLib.loggi("setting index to " + tojson(currentEntityIdxItems));
		//
		// Store indexed for current entity
		//
		clLib.localStorage.setStorageIndexes(storageName, entityName, currentEntityIdxItems);
		
	}
	//);
	*/
	
	//clLib.loggi("initialized storage " + storageName);
	//clLib.loggi("storage now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_items")));
	//clLib.loggi("index now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_index_" + "routes")));
	//alert("local storage after init " + JSON.stringify(localStorage));
};



window.tojson  = function(x) {
	return JSON.stringify(x);
}

clLib.localStorage.getItem = function(key) {
	return localStorage.getItem(key);
}
clLib.localStorage.setItem = function(key, value){
	localStorage.setItem(key, value);
}










clLib.localStorage.getStorageItems = function(storageName, reinitCache) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	// session cache is good enough?
	if(
		reinitCache ||
		!storageCache[storageItemsKey]
	) {
		clLib.localStorage.initCache(storageName);
	}
	return storageCache[storageItemsKey];
};

clLib.localStorage.initCache = function(storageName) {
	var storageItemsKey = storageName + "_items";
	//alert("init cache for " + storageName + " and key " + storageItemsKey);
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storage	= JSON.parse(jsonItems);
	storageCache[storageItemsKey] = storage;
};


clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
	clLib.localStorage.setItem(storageName + "_createdAt", tojson(new Date()));
};

clLib.localStorage.addStorageItem = function(storageName, entity, newItem) {
	//alert("adding storage for storageName >" + storageName + "< and entity >" + entity + "<");
	// storageItems => [entity][_id]
	
	// fetch storage items - NOT using the session cache
	var storageItemsKey = storageName + "_items";
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storageItems = JSON.parse(jsonItems);
	// add new item to localstorage 
	//alert("old storageitems: " + JSON.stringify(storageItems));
	storageItems = clLib.addObjValue(storageItems, [entity, newItem["_id"]], newItem);

	//alert("new storageItems >" + JSON.stringify(storageItems));
	clLib.localStorage.setStorageItems(storageName, storageItems);
	clLib.localStorage.initCache(storageName, storageItems);
};


clLib.localStorage.removeStorageItem = function(storageName, entity, id2delete) {
	// storageItems => [entity][_id]
	
	// fetch storage items - NOT using the session cache
	var storageItemsKey = storageName + "_items";
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storageItems = JSON.parse(jsonItems);
	// remove new item from localstorage 
	delete(storageItems[entity][id2delete]);
	clLib.localStorage.setStorageItems(storageName, storageItems);
	clLib.localStorage.initCache(storageName, storageItems);
};














clLib.localStorage.getStorageIndexes = function(storageName, entityName) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	if(!storageCache[indexItemsKey]) {
		var jsonIndexes = clLib.localStorage.getItem(indexItemsKey); 
		var storage = JSON.parse(jsonIndexes)
		storageCache[indexItemsKey] = storage;
	}
	
	return storageCache[indexItemsKey];
};



clLib.localStorage.getLastRefreshDate = function(storageName) {
	return clLib.localStorage.getItem(storageName + "_createdAt");
};

clLib.localStorage.setStorageIndexes = function(storageName, entityName, indexItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	clLib.localStorage.setItem(indexItemsKey, tojson(indexItems)); 
};



Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

Array.prototype.getIntersect = function(anotherArray) {
	var i = 0;
	var resultArray = [];
	for(i = 0; i < anotherArray.length; i++) {
		if(this.indexOf(anotherArray[i]) > -1) {
			resultArray.push(anotherArray[i]);
		}
	}
	return resultArray;
}
	
clLib.isFunction = function(functionToCheck) {
 var getType = {};
 //alert("am i a function? :" + getType.toString.call(functionToCheck));
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

Array.prototype.sortByKey = function(sortKey, descSortFlag) {
    this.sort(function(a, b) {
		var sortResult = 
			a[sortKey] < b[sortKey] ? -1 : 1;
		if(descSortFlag) {
			sortResult *= -1;
		}
		return sortResult;
	});
};

Array.prototype.sortByFunction = function(sortFunction, descSortFlag) {
//	alert("yes, sorting by function " + JSON.stringify(sortFunction));
    this.sort(function(a, b) {
		var sortResult = 
			sortFunction(a) < sortFunction(b) ? -1 : 1;
		if(descSortFlag) {
			sortResult *= -1;
		}
		return sortResult;
    });
};

Array.prototype.sortBy = function(sortBy, descSortFlag) {
	var sortFunc;
//	alert("sortBy " + JSON.stringify(sortBy));

	if(clLib.isFunction(sortBy)) {
//		alert("JSON.stringify " + JSON.stringify(sortBy));
		return this.sortByFunction(sortBy, descSortFlag);	
	} else {
		return this.sortByKey(sortBy, descSortFlag);
	}
};

clLib.localStorage.syncAllUp = function(entity, storageName) {
	clLib.loggi("syncing up all entities for >" + entity + "< in >" + storageName + "<");
	var storage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	clLib.loggi("currently unsynced items >" + JSON.stringify(storage) + "<");
	$.each(storage[entity], function(dummyId) {
		var entityInstance = storage[entity][dummyId];
		clLib.loggi("call syncup for >" + dummyId + "< bzw. >" + JSON.stringify(entityInstance) + "<");

		clLib.localStorage.syncUp(entity, entityInstance, storageName);
	});
}


clLib.localStorage.syncUp = function(entity, entityInstance, storageName) {
	var entityStorage = clLib.localStorage.getStorageItems(storageName);
	entityStorage = entityStorage[entity];
	
	var unsyncedStorage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	unsyncedStorage = unsyncedStorage[entity];
	
	var dummyId = entityInstance["_id"];

	//alert("unsynced items:  >" + JSON.stringify(unsyncedStorage) + "<");
	//alert(">" + dummyId + "< in storagecache? >" + JSON.stringify(entityStorage[dummyId]) + "<");

	delete(entityInstance["_id"]);
	var realInstance = clLib.REST.storeEntity(entity, entityInstance);
	entityInstance["_id"] = realInstance["_id"];	

	clLib.loggi("synced UP >" + dummyId + "<, new id is " + realInstance["_id"]);
	// delete dummy id
	clLib.localStorage.removeStorageItem(storageName, entity, dummyId);
	// delete from unsynced entries..
	clLib.localStorage.removeStorageItem("UNSYNCED_" + storageName, entity, dummyId);

	// store real id
	clLib.localStorage.addStorageItem(storageName, entity, entityInstance);
	
}



clLib.localStorage.addInstance = function(entity, entityInstance, storageName) {
	var storage = clLib.localStorage.getStorageItems(storageName);
	
	var dummyId = "DUMMY" + new Date().getTime();
	entityInstance["_id"] = dummyId;

	clLib.localStorage.addStorageItem(storageName, entity, entityInstance);
	// mark as local-only

	clLib.localStorage.addStorageItem("UNSYNCED_" + storageName, entity, entityInstance);
	
	if(clLib.isOnline()) {
		clLib.loggi("online, syncing UP!!!");
		//clLib.localStorage.syncUp(entity, entityInstance, storageName);
		clLib.localStorage.syncAllUp(entity, storageName);
	} else {
		clLib.loggi("offline, saving for later sync UP..");
	}
}

clLib.isOnline = function() {
	return navigator.onLine;
/*
	var currentlyOnline = localStorage.getItem("online");
	alert("currentlyOnline? >" + currentlyOnline);
	if(currentlyOnline != -1) {
		return true;
	} else {
		return false;
	}
*/
};

/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName, sortKey, descSortFlag, limit) {
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		//alert("no local store available => you need to refresh first.");
		return;
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		//alert("no local data available for >" + entity + "<. You need to refresh first.");
		return;
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}
	//clLib.loggi("storage keys: "+ Object.keys(storage));
	
	// Indexes?
/*
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//clLib.loggi("Indexes for queried entity: " + JSON.stringify(indexes));
	var remainingWhereObj = {};
	var foundIds = [];
	var indexFound = false;
	if(Object.keys(clLib.localStorage.indexes[entity]) > 0) {
		$.each(whereObj, function(keyName, condition) {
			clLib.loggi("check for index entries with key " + keyName + " in (" + typeof(clLib.localStorage.indexes[entity]) + ") " + JSON.stringify(clLib.localStorage.indexes[entity]));
			if(Object.keys(clLib.localStorage.indexes[entity]).indexOf(keyName) > -1) {
				//clLib.loggi("   found!");
				//foundIds.push.apply(foundIds, indexes[keyName][condition]);
				if(indexFound) {
					//foundIds = indexes[keyName][condition].items;
					foundIds = foundIds.getIntersect(indexes[keyName][condition].items);
				} else{
					foundIds = indexes[keyName][condition].items;
				}
				indexFound = true;
			} else {
				remainingWhereObj[keyName] = condition;
				//clLib.loggi("   not found!");
			}
		});
	}
	//foundIds = foundIds.getUnique();
	//clLib.loggi("got unique ids " + JSON.stringify(foundIds));
	//clLib.loggi("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	var remainingIdsToQuery = Object.keys(storage[entity]);
	if(indexFound) {
		remainingIdsToQuery = foundIds;
	} else {
		remainingWhereObj = whereObj;
	}
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundIds;
	}
*/
	var remainingIdsToQuery = Object.keys(storage[entity]);
	
	$.each(remainingIdsToQuery, function(index, id) {
		//clLib.loggi("remainigni items!!");
		var currentItem = storage[entity][id];
		//clLib.loggi("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
		var eligible = true;
		if(	
			typeof(whereObj) !== "undefined" &&
			Object.keys(whereObj).length > 0
		) {
			// item is the current row to iterate
			$.each(whereObj, function(keyName, condition) {
				// still eligible? check remaining conditions..
				if(eligible) {
					eligible = clLib.localStorage.evalCondition(currentItem[keyName], condition);
				}
			});
		}
		if(eligible) {
			//alert("eligible!");
/*			if(!(indexFound) || (
				indexFound && foundIds.indexOf(id) > -1
			)) {
				resultsObj.push(currentItem);
			}
*/
			resultsObj.push(currentItem);
			
		}
	});
	
	if(sortKey) {
		//alert("sorting by "  + sortKey);
		resultsObj.sortBy(sortKey, descSortFlag);
		//alert("sorted result " + JSON.stringify(resultsObj));
	}

	if(limit) {
		resultsObj = resultsObj.slice(0, limit);
	}
	return resultsObj;
	
	
}

/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getDistinct = function(entity, whereObj, colName, storageName) {
	var resultsObj = {};
	var storage = clLib.localStorage.getStorageItems(storageName);
	//clLib.loggi("storage keys: "+ Object.keys(storage));
	
/*
	// indexes?
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//clLib.loggi("Indexes for queried entity: " + JSON.stringify(indexes));

	var remainingWhereObj = {};
	var foundValues = [];
	var indexFound = false;
	
	//clLib.loggi("Iterating where " + JSON.stringify(whereObj));
	$.each(whereObj, function(keyName, condition) {
		// Is there an index for the current where-column?
		//clLib.loggi("Checking for " + keyName + " in " + JSON.stringify(clLib.localStorage.indexes[entity]));
		if(
			clLib.localStorage.indexes[entity][keyName] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"].indexOf(colName) > -1
		) {
			//clLib.loggi("   found!");
			if(indexFound) {
				foundValues = foundValues.getIntersect(
					Object.keys(indexes[keyName][condition]["distinct"][colName])
				);
			} else{
				//clLib.loggi("indexsxxx" + JSON.stringify(indexes));
				//clLib.loggi("indeasfdas" + JSON.stringify(indexes[keyName][condition]["distinct"][colName]));
				foundValues = Object.keys(indexes[keyName][condition]["distinct"][colName]);
			}
			indexFound = true;
	
		} else {
			remainingWhereObj[keyName] = condition;
			clLib.loggi("   not found!");
		}
	});
	//foundValues = foundValues.getUnique();
	//clLib.loggi("got unique ids " + JSON.stringify(foundValues));
	//clLib.loggi("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundValues;
	}
*/	
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		//alert("no local store available for storage " + storageName + " => you need to refresh first.");
		return {};
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		//alert("no local data available for " + storageName + "[" + entity + "]=> you need to refresh first.");
		return {};
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}

	var remainingIdsToQuery = Object.keys(storage[entity]);
	var foundCounter = 0;
	var limit = 30;
	$.each(remainingIdsToQuery, function(index, id) {
/*
		if(foundCounter > limit) {
			return;
		}
*/		
		var currentItem = storage[entity][id];
		//clLib.loggi("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
		var eligible = true;
		
		// item is the current row to iterate
		$.each(whereObj, function(keyName, condition) {
			// still eligible? check remaining conditions..
			if(eligible) {
				eligible = clLib.localStorage.evalCondition(currentItem[keyName], condition);
		 	}
		});
		if(eligible) {
			if(typeof(currentItem[colName]) !== 'undefined') {
				//alert("aaaa" + colName);
				resultsObj[currentItem[colName]] += 1;
				foundCounter++;
			}
		}
	});
	clLib.loggi("Got resultsobj" + JSON.stringify(resultsObj));
/*	if(Object.keys(foundValues).length > 0) {
		return foundValues.getIntersect(
			Object.keys(resultsObj));
	}
*/
	return resultsObj ? Object.keys(resultsObj) : null;
}


/*
*	{
*		"area": "x"
*	}
*			OR
*	{
*		"area" : {
*			"$gte": 1,
*			"$lt": 3
*		}
*	}
*
*
*/

clLib.localStorage.evalCondition = function(valueToTest, condition) {
	// remove leading/trailing whitespace..
	valueToTest = $.trim(valueToTest);

	//clLib.loggi("checking " + valueToTest + " against " + JSON.stringify(condition));
	if(!valueToTest) {
		return false;
	}

	
	var eligible = true;
	if(!(condition instanceof Object)) {
		//alert("no object, comparing string values >" + $.trim(valueToTest) + "< against >" + condition + "<");
		if($.trim(valueToTest) != condition) {
			eligible = false;
		}
	}
	else {
		//clLib.loggi("object condition, comparing advanced values");
		//alert("evaling conditions " + JSON.stringify(condition));
		$.each(condition, function(operator, compValue) {
			//alert("evaling condition " + JSON.stringify(operator));
			if(operator == "$gte"){
				//alert("$gt " + valueToTest + " < " + compValue);
				//alert("$gte2 " + valueToTest + " < " + compValue);
				if(!(valueToTest >= compValue)) {
					eligible = false;
				} else {
					//alert("yes, gte!");
				}
			} else 
			if(operator == "$gt"){
				//alert("$gt " + valueToTest + " < " + compValue);
				//alert("$gt2 " + valueToTest + " < " + compValue);
				if(!(valueToTest > compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$lt") {
				//alert("$lt " + valueToTest + " < " + compValue);
				//alert("$lt2 " + valueToTest + " < " + compValue);
				if(!(valueToTest < compValue)) {
					eligible = false;
				} else {
					//alert("yes, st!!!");
				}
			} else 
			if(operator == "$like"){
				if(!(valueToTest.indexOf(compValue) > -1)) {
					eligible = false;
				} else {
					//clLib.loggi("found match!!" + valueToTest);
				}
			} 
			if(operator == "$starts-with"){
				if(!(valueToTest.indexOf(compValue) == 0)) {
					eligible = false;
				} else {
					//clLib.loggi("found starting match!!" + valueToTest);
				}
			} 
		});
	};
	if(eligible) {
		//alert("Eligibility is " + eligible);
	}
	return eligible;
	
};
"use strict";

clLib.localStorage.indexes = {
	routes: {
		/*"French" : {
			"distinct": ["Colour", "Sector"]
		}*//*,
		"Area": {
			"distinct": ["Colour", "Sector"]
		},
		"Sector" : {
			"distinct": ["Colour", "French"]
		}*/
		/*,
		"UIAA",
		"French"
		,
		"Bleau",
		"USA"*/
	}
	/*,
	routeLogs: [
	]*/
};
"use strict";

clLib.UI = {
	"NOTSELECTED": {
		text : "UNKNOWN",
		value : "__UNKNOWN__"
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
	var oldEventHandler = function() {clLib.loggi("undefined event handler");};
	clLib.loggi("oldEventHandler = " + options.selectBoxElement.attr("id") + ">" + JSON.stringify(options.selectBoxElement.data("events")));
	// remember current onChange Handler
	if(options.selectBoxElement.data("events")) {
		oldEventHandler = options.selectBoxElement.data("events")['change.clLib'][0].handler;
		clLib.loggi("oldEventHandler " + JSON.stringify(oldEventHandler));
*/
		// disable current onChange handler
	var selectBoxId = options.selectBoxElement.attr('id');
	clLib.loggi("killing event handlers for  " + selectBoxId);

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
		//clLib.loggi("custom event handler for " + selectBoxId + "found.." + customChangeHandler);
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
		//clLib.loggi("preserving >" + oldValue + "<");
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
		clLib.loggi("Yes, array...take first element.." + JSON.stringify(dataObj));
		selectedValue = dataObj[0];
	} else if(dataObj instanceof Object && Object.keys(dataObj).length == 1) {
		clLib.loggi("Yes, object...take first element.." + JSON.stringify(dataObj));
		selectedValue = Object.keys(dataObj)[0];
	}

	var i = 0;
	$.each(dataObj, function(index, value) {
		//clLib.loggi("adding option " + value);
		var $option = $('<option></option>')
                .val(dataObj instanceof Array ? value : index)
                .html(value);
		//clLib.loggi("comp " + value + " + against " + selectedValue);
		if(value == selectedValue) {
			clLib.loggi("Found old value..");
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
	//clLib.loggi("Previous value >" + oldValue + "< is no longer present in the select list.");

};


// $inElement = $("#startScreen_nameSearchResult").
// $forElement = Appery("nameSearchField");
clLib.populateSearchProposals = function($forElement, $inElement, dataObj, hideOnSingleResult) {
	
	//alert(JSON.stringify(dataObj));
	if(hideOnSingleResult && dataObj.length == 1) {
		//alert("single element found (" + dataObj[0] + "), hiding results..");
		var result = $.trim(dataObj[0]);

		clLib.loggi("seeting selectedresult to " + result);
		$inElement.hide();
		$forElement.trigger("setSelectedValue.clLib", {"value": result, noDependentRefresh : true});
		return;
	} else {
		//$forElement.val("");
	}
	
	clLib.populateListView($inElement, dataObj);

	$inElement.attr("data-theme", "c");
	$inElement.show();
	clLib.loggi("shown" + $inElement.children().length);

	$inElement.children().click(function() {
        clLib.loggi("this child;" + $(this).html());
		var result = $.trim($(this).html());
		clLib.loggi("seeting selectedresult to " + result);

		clLib.loggi("forElement is " + $forElement.attr("id"));
		$forElement.trigger("setSelectedValue.clLib", {"value": result});
		//$forElement.val(result);

		$(this).parent().hide();
		clLib.loggi("hidden");
		//$("#startScreen_mobilefooter1").html(result);
	});
};

clLib.UI.defaultChangeHandler = function($element, changeOptions) {
	// Store current value
	$element.data("clLib.currentValue", $element.val());
	//alert($element.attr("id") + " was changed to: >" + $element.data("clLib.currentValue") + "<" + JSON.stringify(changeOptions));
	var elementConfig = clLib.UI.elements[$element.attr("id")];
	//clLib.loggi("elementConfig for " + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	
	//
	// consider currently chosen layout from now on..
	//
	var currentLayout = localStorage.getItem("currentLayout");
	clLib.loggi("current layout is >" +  currentLayout  + "<");
	var refreshTargets = elementConfig.refreshOnUpdate;
	if(
		currentLayout in elementConfig.refreshOnUpdate
	) {
		clLib.loggi(currentLayout + ">>" + JSON.stringify(refreshTargets));
		refreshTargets = elementConfig.refreshOnUpdate[currentLayout];
	} else {
		refreshTargets = elementConfig.refreshOnUpdate["default"] || {};
	}

	//	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
	$.each(refreshTargets, function(refreshTargetName, refreshOptions) {
		clLib.loggi("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			clLib.loggi("element " + "#" + refreshTargetName + " not found!");
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
	//alert("solely changing value of .." + $element.attr("id") + " to " + JSON.stringify(changeOptions));
	// avoid default onChange handler..
	clLib.UI.killEventHandlers($element, "change.clLib");
	clLib.UI.killEventHandlers($element, "change.clLibColour");
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
	
	$("#newRouteLog_commentText").val('');
};
	
clLib.UI.hideUIElement = function($element) {
	clLib.loggi("hiding element >" + $element.attr("id") + "< of type " + $element.prop("tagName") + ", display is >" + $element.css("display") + "<");

	$element.css('display', 'none').parent('div').parent('.ui-select').css('display', 'none');
	if($element.attr("tagName") == 'SELECT') {
		$element.selectmenu('refresh');
	}

};

clLib.UI.showUIElement = function($element) {
	clLib.loggi("showing element of type " + $element.prop("tagName") + ", display is >" + $element.css("display") + "<");

	$element.css('display', 'block').parent('div').parent().css('display', 'block');
	if($element.attr("tagName") == 'SELECT') {
		$element.selectmenu('refresh');
	}

};

/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "refresh.clLib" event can (and should) be used to re-populate such elements using the defined "refreshHandler" function.
*
*/
clLib.UI.fillUIelements = function(pageName) {
	// no special layout to apply? use default layout..
	var layout = localStorage.getItem("currentLayout") || "default";

	clLib.loggi("populating UI elements for page >" + pageName + "< and layout >" + layout + "<");

	if(!(layout in clLib.UI.pageElements[pageName])) {
		clLib.loggi("layout does not exists for page, using default layout..");
		layout = "default";
	}
	
// disabling of element not working on appery - disabling for now..
/*	
	$.each(clLib.UI.pageElements[pageName]["default"], function(idx, elementName) {
		clLib.loggi(elementName + " in " + JSON.stringify(clLib.UI.pageElements[pageName][layout])+ "?" + 
			(clLib.UI.pageElements[pageName][layout].hasValue(elementName))
		);
		if(!(clLib.UI.pageElements[pageName][layout].hasValue(elementName))) {
			var $element = $("#" + elementName);
			clLib.loggi("element is >" + $element.attr("id") + "<, hide it");
	
			// hide elements per default..
			clLib.UI.hideUIElement($element);
		} else {
			var $element = $("#" + elementName);
			clLib.loggi("element is >" + $element.attr("id") + "<, SHOW it");
	
			// hide elements per default..
			clLib.UI.showUIElement($element);
		}
	});
*/
	clLib.loggi("elements for page >" + pageName + "< hidden..");
	//alert("populating UI elements for page >" + pageName + "<");
	$.each(clLib.UI.pageElements[pageName][layout], function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];

		if(!elementConfig) {
			//alert("Can't find element >" + elementName + "<, breaking loop..");
			return;
		}

		clLib.loggi("adding events for  element >" + elementName + "<");
		var $element = $("#" + elementName);

		// Re-attach event handlers
		clLib.UI.killEventHandlers($element, "change.clLib");
		clLib.UI.killEventHandlers($element, "refresh.clLib");
		clLib.UI.killEventHandlers($element, "setSelectedValue.clLib");
		var changeHandler = elementConfig["changeHandler"] || clLib.UI.defaultChangeHandler;
		$element.bind("change.clLib", function() {
			changeHandler($element);
		});

		var setSelectedValueHandler = elementConfig["setSelectedValueHandler"] || clLib.UI.defaultSetSelectedValueHandler;
		//alert("setting setSelectedValueHandle for " + $element.attr("id"));
		$element.bind("setSelectedValue.clLib", function(event, changeOptions) {
			//alert("executing setSelectedValue handler for "+ $element.attr("id") + ">>>>" + JSON.stringify(changeOptions));
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
				clLib.loggi("not refreshing element " + elementName);
			}
			clLib.loggi("refresh element " + $(this).attr("id") + " with elementConfig " + JSON.stringify(elementConfig));
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

clLib.UI.buildWhereIfVisible = function(whereKeys2Elements) {
	var whereObj = {};
	$.each(whereKeys2Elements, function(key, $element) {
		clLib.loggi("$element is " + JSON.stringify($element));
		if(
			$element instanceof Object &&
			$element.is(":visible")
		) {
			whereObj[key] = $element.val();
		} else if(
		 	!($element instanceof Object) &&
			$element
		) {
			whereObj[key] = $element;
		}
	});
	return whereObj;
};"use strict";

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
		"newRouteLog_ratingSelect"
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
		},
		"refreshOnUpdate" : {
			default: {
				"newRouteLog_sectorSelect" : {}
				//,"newRouteLog_lineSelect": {}
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
//				,"Line" : $("#newRouteLog_lineSelect").val()
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
			clLib.loggi("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
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
			clLib.loggi("got LINE sectors for " + JSON.stringify(where) + ", " + results[0] + " +, >" + JSON.stringify(results));
			
			if(results.length == 1) {
				$sectorSelect.val(results[0]);
				$sectorSelect.selectmenu('refresh', true);

				clLib.loggi("sectorselect changed to " + results[0]);
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
			var distinctColumn, where, results;
			distinctColumn = "Colour";
			var routeWhereObj = {};
			
			var baseWhereObj;
			var currentLayout = localStorage.getItem("currentLayout");
			if(currentLayout == 'reduced') {
				// for reduced layout get ALL available colours..
				baseWhereObj = {};
			} else {
				baseWhereObj = clLib.UI.buildWhereIfVisible({
					"GradeType" : $("#newRouteLog_gradeTypeSelect"),
					"Grade" : $("#newRouteLog_gradeSelect"),
					"Area" : localStorage.getItem("currentlySelectedArea"),
					"Sector" : $("#newRouteLog_sectorSelect"),
					"Line" : $("#newRouteLog_lineSelect")
				});
			}
			where = clLib.getRoutesWhere(baseWhereObj);
			clLib.loggi("(colour:) Getting routes for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			clLib.loggi("got colours for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

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

"use strict";

clLib.REST = {};


/*
*	retrieve => need to encode where string
*	insert => do NOT encore obj props
*/
clLib.REST.executeRetrieve = function(uri, method, whereObj) {
	if(whereObj) {
		whereObj = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	}
	return clLib.REST.execute(uri, method, whereObj);
}

clLib.REST.executeInsert = function(uri, method, objData) {
	if(objData) {
		objData = JSON.stringify(objData);
	}
	return clLib.REST.execute(uri, method, objData);
}


clLib.REST.execute = function(uri, method, getParams) {
	var request = {
		async: false,
		url: uri,
		type: method,
		contentType: "application/json",
		accepts: "application/json",
		cache: true,
		dataType: 'json',
//		data: JSON.stringify("where=" + JSON.stringify(data)),
//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22+%3A+%22Kletterhalle+Wien%22%7D' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Host: api.appery.io' -H 'Origin: http://appery.io' -H 'Referer: http://appery.io/app/view/72918a4b-035e-44c2-ad30-c0740199fca3/startScreen.html' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f'

//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22%20:%20%22Kletterhalle%20Wien%22%7D' -H 'Host: api.appery.io' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate' -H 'DNT: 1' -H 'Content-Type: application/json' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f' -H 'Origin: null'

//		data: "where=" + encodeURIComponent("{\"Area\" : \"Kletterhalle Wien\"}"),
		data: getParams,
		beforeSend: function (xhr) {
//			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");
			xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
			xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
			xhr.setRequestHeader("Accept-Language", "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3");
			xhr.setRequestHeader("Connection", "keep-alive");
			xhr.setRequestHeader("DNT", "1");
//			xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0");
			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");
		},
		error: function(jqXHR) {
			alert("ajax error " + jqXHR.status);
		}
	};
	return $.ajax(request);
}

clLib.REST.getEntities = function(entityName, whereObj) {
	var uri = "https://api.appery.io/rest/1/db/collections/" + entityName;
	//clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
	var ajaxrequest = clLib.REST.executeRetrieve(uri, 'GET', whereObj);
	var returnObj = {};
	ajaxrequest.done(function(data) {
		//alert("retrieved data " + JSON.stringify(data));
		//clLib.UI.hideLoading();
		returnObj[entityName] = data;//.responseText;
		//alert("returning " + JSON.stringify(returnObj));
	});
	//alert("2returning " + JSON.stringify(returnObj));
	return returnObj;
}

clLib.REST.storeEntity = function(entityName, entityInstance) {
	var uri = "https://api.appery.io/rest/1/db/collections/" + entityName;
	//clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
	var ajaxrequest = clLib.REST.executeInsert(uri, 'POST', entityInstance);
	var returnObj = {};
	ajaxrequest.done(function(data) {
		returnObj = data;
	});
	alert("returning(storeEntity) " + JSON.stringify(returnObj));
	return returnObj;
}