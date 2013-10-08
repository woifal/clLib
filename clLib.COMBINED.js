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
	var $targetEl = $('#' + targetId);
	clLib.UI.killEventHandlers($targetEl, "change.clLibColour");
	
	// Add css class named option.value for every entry in #targetId
    $('option', $targetEl).each(function () {
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
	restrictionObj["GradeType"] = gradeType;
	restrictionObj["Grade"] = grade;
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
	
	restrictionObj[gradeType] = grade;
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








clLib.sortByScoreFunc = function(routeLog) {
	//alert("functon called!" + JSON.stringify(routeLog));
	return clLib.computeScore(routeLog);
};

















//})(jQuery)
;"use strict";

/*
*   Configuration object for grades.
*   Keys are the available gradeTypes.
*   For every gradeType column with the same name has to be present in the Routes collection.
*
*/
clLib.gradeConfig = {
	"UIAA" : {
		defaultGrade: "V+",
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
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
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
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
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
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
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
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
	delete(storageCache[storageItemsKey]);


	//alert("adding elements " + JSON.stringify(storageObj));
	console.log("adding elements " + Object.keys(storageObj).length);
	var allItems = {};
	for(var entityName in storageObj) {
		console.log("entity: " + entityName);
		var entityItems = {};
		for(var i = 0; i < storageObj[entityName].length; i++) {
			entityItems[storageObj[entityName][i]["_id"]] = storageObj[entityName][i];
		}
		allItems[entityName] = entityItems;
	}
	console.log("storing items");
	clLib.localStorage.setStorageItems(storageName, allItems);
	console.log("items stored");
	
	var indexedEntities = clLib.localStorage.indexes;
	var storageItems = clLib.localStorage.getStorageItems(storageName);
	
	var indexedItems = {};
	
	console.log("indexItems: " + tojson(indexedEntities));
	//console.log("allitems " + tojson(storageItems));
	// check all entities in storageObj for configured indexs..
	for(var entityName in indexedEntities) {
	//$.each(indexedEntities, function(entityName) {
		//console.log("working on indexedentity " + entityName);
		
		// iterate indexed entities from storageObj
		var currentEntityIndexes = indexedEntities[entityName];
		var currentEntityItems = storageItems[entityName];
		var currentEntityIdxItems = {};
		//console.log("working on currententityitems " + tojson(currentEntityItems));
		if(!currentEntityItems) {
			//console.log("no items for " + entityName + " in current collection..");
			return;
		}
		// Iterate all items of current entity(routes, areas, etc..)
		$.each(currentEntityItems, function(currentId, currentItem) {
		//for(var currentId in currentEntityItems) {
			var currentItem = currentEntityItems[currentId];
			// Resolve every index for current item
			for(var indexedCol in currentEntityIndexes) {
			//$.each(currentEntityIndexes, function(idx, indexedCol) {
				//console.log("!!Checking indexed column " + indexedCol);
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
			//console.log("3after adding row it is" + tojson(currentEntityIdxItems));
		//}
		});
		//console.log("setting index to " + tojson(currentEntityIdxItems));
		/*
		* Store indexed for current entity
		*/
		clLib.localStorage.setStorageIndexes(storageName, entityName, currentEntityIdxItems);
		
	}
	//);
	
	//console.log("initialized storage " + storageName);
	//console.log("storage now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_items")));
	//console.log("index now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_index_" + "routes")));
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

clLib.localStorage.getStorageItems = function(storageName) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	if(!storageCache[storageItemsKey]) {
		var jsonItems = clLib.localStorage.getItem(storageItemsKey);
		var storage	= JSON.parse(jsonItems);
		storageCache[storageItemsKey] = storage;
	}
	
	return storageCache[storageItemsKey];
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

clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
	clLib.localStorage.setItem(storageName + "_createdAt", tojson(new Date()));
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


/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName, sortKey, descSortFlag, limit) {
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		alert("no local store available => you need to refresh first.");
		return;
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		alert("no local data available => you need to refresh first.");
		return;
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}
	//console.log("storage keys: "+ Object.keys(storage));
	
	// Indexes?
/*
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//console.log("Indexes for queried entity: " + JSON.stringify(indexes));
	var remainingWhereObj = {};
	var foundIds = [];
	var indexFound = false;
	if(Object.keys(clLib.localStorage.indexes[entity]) > 0) {
		$.each(whereObj, function(keyName, condition) {
			console.log("check for index entries with key " + keyName + " in (" + typeof(clLib.localStorage.indexes[entity]) + ") " + JSON.stringify(clLib.localStorage.indexes[entity]));
			if(Object.keys(clLib.localStorage.indexes[entity]).indexOf(keyName) > -1) {
				//console.log("   found!");
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
				//console.log("   not found!");
			}
		});
	}
	//foundIds = foundIds.getUnique();
	//console.log("got unique ids " + JSON.stringify(foundIds));
	//console.log("remaining where clause " + JSON.stringify(remainingWhereObj));
	
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
		//console.log("remainigni items!!");
		var currentItem = storage[entity][id];
		//console.log("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
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
	//console.log("storage keys: "+ Object.keys(storage));
	
/*
	// indexes?
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//console.log("Indexes for queried entity: " + JSON.stringify(indexes));

	var remainingWhereObj = {};
	var foundValues = [];
	var indexFound = false;
	
	//console.log("Iterating where " + JSON.stringify(whereObj));
	$.each(whereObj, function(keyName, condition) {
		// Is there an index for the current where-column?
		//console.log("Checking for " + keyName + " in " + JSON.stringify(clLib.localStorage.indexes[entity]));
		if(
			clLib.localStorage.indexes[entity][keyName] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"].indexOf(colName) > -1
		) {
			//console.log("   found!");
			if(indexFound) {
				foundValues = foundValues.getIntersect(
					Object.keys(indexes[keyName][condition]["distinct"][colName])
				);
			} else{
				//console.log("indexsxxx" + JSON.stringify(indexes));
				//console.log("indeasfdas" + JSON.stringify(indexes[keyName][condition]["distinct"][colName]));
				foundValues = Object.keys(indexes[keyName][condition]["distinct"][colName]);
			}
			indexFound = true;
	
		} else {
			remainingWhereObj[keyName] = condition;
			console.log("   not found!");
		}
	});
	//foundValues = foundValues.getUnique();
	//console.log("got unique ids " + JSON.stringify(foundValues));
	//console.log("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundValues;
	}
*/	
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		alert("no local store available for storage " + storageName + " => you need to refresh first.");
		return {};
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		alert("no local data available for " + storageName + "[" + entity + "]=> you need to refresh first.");
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
		//console.log("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
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
	console.log("Got resultsobj" + JSON.stringify(resultsObj));
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
	//console.log("checking " + valueToTest + " against " + JSON.stringify(condition));
	if(!valueToTest) {
		return false;
	}
	
	var eligible = true;
	if(!(condition instanceof Object)) {
		//console.log("no object, comparing string values >" + valueToTest + "< against >" + condition + "<");
		if(valueToTest != condition) {
			eligible = false;
		}
	}
	else {
		//console.log("object condition, comparing advanced values");
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
					//console.log("found match!!" + valueToTest);
				}
			} 
			if(operator == "$starts-with"){
				if(!(valueToTest.indexOf(compValue) == 0)) {
					eligible = false;
				} else {
					console.log("found starting match!!" + valueToTest);
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
			"newRouteLog_sectorSelect" : {}
			//,"newRouteLog_lineSelect": {}
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
			

		},
		"refreshOnUpdate" : {
			"newRouteLog_colourSelect" : {}
			,"newRouteLog_lineSelect" : {}
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
			//alert("Getting lines for " + JSON.stringify(where));

			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			//alert("got lines for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

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
			}*/
/*			,"newRouteLog_searchRouteResults" : {
				hideOnSingleResult : true
			}
*/
			"newRouteLog_colourSelect" : {}
		}
		,"changeHandler" : function($this) {
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
				console.log("2013-10-07-WTF!?!?!? multiple sectors for line found - setting sector to the one of first result...");
				$sectorSelect.val(results[0]);     

				$sectorSelect.selectmenu('refresh', true);
			}

			clLib.UI.defaultChangeHandler($this);
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
		,"changeHandler" : function($this) {
			var $forElement = $("#newRouteLog_searchRoute");
			$forElement.val("");
			console.log("searchRoute set to ''");

			clLib.UI.defaultChangeHandler($this);
		}
	},
	"newRouteLog_searchRouteResults" : {
		"contentHandler" : function($this, options) { 
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
				"$starts-with" : $("#newRouteLog_searchRoute").val()	
			}
			console.log("Getting routes for " + JSON.stringify(where));
			results = clLib.localStorage.getDistinct("Routes", where, distinctColumn, "routeStorage");
			
			console.log("got routes " + JSON.stringify(results));


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
		"contentHandler" : function($this) { 
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

	options.selectBoxElement.bind("change.clLib", function() {
		var customChangeHandler = clLib.UI.elements[selectBoxId]["changeHandler"];
		if(customChangeHandler) {
			console.log("custom event handler for " + selectBoxId + "found.." + customChangeHandler);
		}
		var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;
		if(customChangeHandler) {
			console.log("custom event handler is now.." + changeHandler);
		}
		
		changeHandler($(this));
	});
	

	if(needRefresh) {
		options.selectBoxElement.trigger("change.clLib");
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
		console.log("single element found, hiding results..");
		$forElement.val(dataObj[0]);
		$inElement.hide();
		return;
	} else {
		$forElement.val("");
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
	//alert($element.attr("id") + " was changed(to: >" + $element.data("clLib.currentValue") + "<");
	var elementConfig = clLib.UI.elements[$element.attr("id")];
	//console.log("elementConfig for " + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
		console.log("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			console.log("element " + "#" + refreshTargetName + " not found!");
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
			//console.log("refreshing element " + elementName + " == " +  additionalOptions["noRefreshOn"]);
			if(
				typeof(additionalOptions) !== "undefined" &&
				additionalOptions["noRefreshOn"] == elementName
			) {
				console.log("not refreshing element " + elementName);
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


"use strict";

clLib.REST = {};

clLib.REST.execute = function(uri, method, whereObj) {
	var getParams;
	if(whereObj) {
		getParams = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	}
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
			console.log("ajax error " + jqXHR.status);
		}
	};
	return $.ajax(request);
}

clLib.REST.getEntities = function(entityName, whereObj) {
	var uri = "https://api.appery.io/rest/1/db/collections/" + entityName;
	//clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
	var ajaxrequest = clLib.REST.execute(uri, 'GET', whereObj);
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