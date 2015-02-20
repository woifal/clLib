"use strict";
require("./clLib");
require("./clLib.gradeConfig");


var util = require("util");

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

function clStats(){};
exports.stats = clStats;

 //IMPORT RESOURCES
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();

//var clLib = {};

/**
*   "options" is as follows:
*       entity              the entity to fetch stats for, e.g. "RouteLog"
*       aggFuncName         an aggregation function to compute stats for, e.g. "clStats.aggregateScoresByDatePortion"
*       aggTopX             the number of aggregated results to show
*       datePortionFuncName a function to determine the date portion of instances
*       sortByFuncName      a sort function ("x(entityIntstance)") to use
*       sortDescFlag        sort desc or not!


            ,aggFuncName:           "clStats.aggregateScoresByDatePortion"
            ,aggTopX:               10
            ,datePortionFuncName:   "clStats.localDayPortion"
            ,sortByFuncName:        "clStats.sort_localDayAndScore"


*/
clStats.prototype.getEntityStats = function(options, callbackFunc, errorFunc) {
    var defaultStatsOptions = {
        sortDescFlag: true
    };
    
	DBHandler.getEntities({
		entity : options.statsOptions.entity 
		,where : options.where
		,requireResult: false
	}, 
	function(resultObj) { 
		// upon success...
		util.log("Found " + options.entity + "s >" + JSON.stringify(resultObj.length) + "<"); 
        util.log("options >" + JSON.stringify(Object.keys(options)) + "<");
        util.log("evaling >" + options.statsOptions.sortByFuncName+ "<");
		util.log("evaled >" + typeof(clStats[options.statsOptions.sortByFuncName]) + "<");
        
        var sortByFunc = clStats[options.statsOptions.sortByFuncName];
        
        util.log("sortDesc? " + options.statsOptions.sortDescFlag);
        if(sortByFunc) {
			util.log("sorting by " + typeof(sortByFunc));
			resultObj.sortBy(
                function(entity) {
                //    return "AAA";
                    util.log("in sortfunction for >" + JSON.stringify(entity) + "<");
                    var sortResult = sortByFunc(entity, options);
                    util.log("sortResult >" + sortResult + "<");
                    return sortResult;
                }
                , options.statsOptions.sortDescFlag
            );
			//util.log("sorted result " + JSON.stringify(resultObj));
			util.log("sorted result #" + JSON.stringify(resultObj.length));
		}
		// aggregate it!
		var aggResultArr = [];
        console.log("aggFunName >" + options.statsOptions["aggFuncName"] + "<" + typeof(options.statsOptions["aggFuncName"]));
		aggResultArr = clStats[options.statsOptions.aggFuncName](resultObj, options);
		//util.log("aggregatedResult >" + JSON.stringify(aggResultArr) + "<");
		util.log("aggregatedResult2 >" + JSON.stringify(aggResultArr.length) + "<");

		return callbackFunc(aggResultArr);
	}
    , function(e) {
        util.log("e(obj) " + e.message);
        util.log("e(json) " + JSON.stringify(e));
    }
	);
};


clStats.sort_localDayAndScore = function(routeLog, options) {
    util.log("sort_locaDayAndScore " + JSON.stringify(routeLog));
    util.log("2sort_locaDayAndScore " + JSON.stringify(options));
    var datePortionFunc = clStats[options.statsOptions.datePortionFuncName];
    
    var evalResult = datePortionFunc(routeLog["DateISO"]) + "_" + clLib.lpad(clLib.computeScore(routeLog), '0', 6);
    util.log("got evalResult >" + evalResult + "<");
    return evalResult;
};
clStats.sort_localScoreAndDay = function(routeLog, options) {
    util.log("sort_locaDayAndScore " + JSON.stringify(routeLog));
    util.log("2sort_locaDayAndScore " + JSON.stringify(options));
    var datePortionFunc = clStats[options.statsOptions.datePortionFuncName];
    var evalResult = clLib.lpad(clLib.computeScore(routeLog), '0', 6) + "_" + datePortionFunc(routeLog["DateISO"]);
    util.log("got evalResult >" + evalResult + "<");
    return evalResult;
};


clStats.prototype.getRouteLogScoreStats = function(options, callbackFunc, errorFunc) {
    return this.getEntityStats({
        entity: "RouteLog"
        ,statsOptions: {
            a: 1
            ,aggFuncName:           options["aggFuncName"] //"aggregateScoresByDatePortion"
            ,aggTopX:               options["aggTopX"] //10
            ,datePortionFuncName:   options["datePortionFuncName"] //"localDayPortion"
            ,sortByFuncName:        options["sortByFuncName"] //"sort_localDayAndScore"
        }
        ,where: options["where"]
        
    }
    ,callbackFunc
    ,errorFunc
    );
}

clStats.aggregateScoresByDatePortion = function(routeLogArr, options) {
// topX, datePortionFunc
	var aggResultObj = {};
	var aggResultArr = [];
	for(var i = 0; i < routeLogArr.length; i++) {
		var routeLog = routeLogArr[i];
		var datePortion = clStats[options.statsOptions["datePortionFuncName"]](routeLog["DateISO"]);
		if(datePortion) {
            util.log("datePortion is>" + datePortion + "<");
            if(!(datePortion in aggResultObj)) {
                aggResultObj[datePortion] = {
                    count : 0
                    ,score : 0
                    ,items : []
                };
            }
            
            if(aggResultObj[datePortion].count < options.statsOptions.aggTopX) {
                util.log("Adding score of >" + clLib.computeScore(routeLog) + "<");
                aggResultObj[datePortion].score += clLib.computeScore(routeLog);
                aggResultObj[datePortion].count++;
                aggResultObj[datePortion].items.push(routeLog);
            }
        }
	}
	JSON.stringify(aggResultObj);
	return aggResultObj;
};

clStats.aggregateHighScoreByDatePortion = function(routeLogArr, options) {
    try {
        util.log("in XXXXXX");
    // topX, datePortionFunc
        var aggResultObj = {};
        var aggResultArr = [];
        
        var datePortionFunc = clStats[options.statsOptions["datePortionFuncName"]];
        util.log("datePirtionFunc is type >" + typeof(datePortionFunc) + "<");
        var datePortions = {};
        for(var i = 0; i < routeLogArr.length; i++) {
            var routeLog = routeLogArr[i];
            util.log("at >" + i + "< out of >" + routeLogArr.length + "<");
            var datePortion = datePortionFunc(routeLog["DateISO"]);
            if(datePortion) {
                datePortions[datePortion] = true;
            }
        }
        util.log("Found discint date portions >" + JSON.stringify(datePortions) + "<");
        var datePortionsArr = Object.keys(datePortions);
        //datePortionsArr = ["2015-07-26", "2015-03-15"];
        for(var i = 0; i < datePortionsArr.sort().length; i++) {
            var datePortion = datePortionsArr[i];
            
            util.log("datePortion is>" + datePortion + "<");
            if(!(datePortion in aggResultObj)) {
                aggResultObj[datePortion] = {
                    count : 0
                    ,score : 0
                    ,items : []
                };
            }
            
            util.log("--------------------------------");
            util.log("--------------------------------");
            util.log("--------------------------------");
            util.log("--------------------------------");
            util.log("Computing high score...");
            // Compute high score in all given routes max 365 in the past to the 
            // currently processed date...
            var fooOptions = options;
            fooOptions["day"] = datePortion;
            fooOptions["daysBack"] = options.statsOptions["nrOfEligibleDays"];
            $.extend
            var highScore = clStats.computeHighScore(
                routeLogArr
                ,fooOptions
            );
            
            aggResultObj[datePortion] = highScore;
        }
        JSON.stringify("XXXXXXXXXXXXX" + aggResultObj);
        return aggResultObj;
    } catch(e)  {
        util.log("EXCEPTION!!!!!");
        util.log("2EXCEPTION!!!!!" + e);
    }
};

clStats.computeHighScore = function(routeLogArr, options) {
    var daysBack = options.daysBack;
	var day = options.day;
    var datePortionFunc = clStats[options.statsOptions["datePortionFuncName"]];
    var count = 0;
    var aggScores = 0;
    var eligRouteLogs = [];
    
    for(var i = 0; i < routeLogArr.length; i++) {
        var routeLog = routeLogArr[i];
		if(clStats.dateOlderThanDays(
            datePortionFunc(routeLog["DateISO"])
            ,day
            ,daysBack
        )) {
            if(count < options.statsOptions.aggTopX) {
                util.log("Adding score of >" + clLib.computeScore(routeLog) + "<");
                aggScores += clLib.computeScore(routeLog);
                eligRouteLogs.push(routeLog);
                count++
            } else {
                i = 9999999;
            }
        }
	}
	util.log("Returning high score for date >" + JSON.stringify(aggScores) + "<");
	return {
        score: aggScores,
        "eligRouteLogs": eligRouteLogs
    };
};

clStats.dateOlderThanDays = function(currentDateStr, dateToCheckStr, numDays){
    var currentDate = clStats.dateObjFromDateStr(currentDateStr);
    var dateToCheck = clStats.dateObjFromDateStr(dateToCheckStr);
    var daysDiff = clStats.daydiff(currentDate, dateToCheck);
    util.log("Calculated days of >" + daysDiff + "> between >" + currentDate + "< and >" + dateToCheck + "<");
    return ((numDays > daysDiff) && (daysDiff >= 0));
};

clStats.dateObjFromDateStr = function(dateStr) {
	//var dateStr =  "2014-05-19 23:36:13";
    var _year,_month,_day,_hour,_min,_sec;
    _year = dateStr.substring(0, 4);
    _month = dateStr.substring(5,7) || '00';
    _day = dateStr.substring(8, 10) || '00';

    var isoDate = new Date();
    isoDate.setFullYear(_year);
    isoDate.setMonth(_month - 1);
    isoDate.setDate(_day);
    
    util.log("returnig >" + isoDate + "<");
    return isoDate;
};

clStats.daydiff = function(first, second) {
    return Math.round((second-first)/(1000*60*60*24), 2);
}


clStats.prototype.ISODayPortion = function(ISODateStr) {
	//util.log("ISODayPortion for " + JSON.stringify(ISODateStr));
	ISODateStr = ISODateStr || "";
	return ISODateStr.substring(0, 10);
};
clStats.prototype.ISOMonthPortion = function(ISODateStr) {
	return ISODateStr.substring(0, 7);
};
clStats.prototype.ISODayHourPortion = function(ISODateStr) {
	return ISODateStr.substring(0, 13);
};
clStats.prototype.ISOHourPortion = function(ISODateStr) {
	return ISODateStr.substring(11, 13);
};


clStats.localDayPortion = function(ISODateStr) {
	ISODateStr = ISODateStr || "";
    var localDateStr = clLib.ISOStrToDate(ISODateStr);
    return localDateStr.substring(0, 10);
};
clStats.localMonthPortion = function(ISODateStr) {
	ISODateStr = ISODateStr || "";
    var localDateStr = clLib.ISOStrToDate(ISODateStr);
	return localDateStr.substring(0, 7);
};
clStats.prototype.localDayHourPortion = function(ISODateStr) {
	ISODateStr = ISODateStr || "";
    var localDateStr = clLib.ISOStrToDate(ISODateStr);
	return localDateStr.substring(0, 13);
};
clStats.prototype.localHourPortion = function(ISODateStr) {
	ISODateStr = ISODateStr || "";
    var localDateStr = clLib.ISOStrToDate(ISODateStr);
	return localDateStr.substring(11, 13);
};

var $ = {};
$.each = function(object, callback) {
	var objKeys = Object.keys(object);
	var i;
	for(i = 0; i < objKeys.length; i++) {
		callback(objKeys[i], object[objKeys[i]]);
	}
};

try {
    global.$ = $;
} catch(e) {
}

