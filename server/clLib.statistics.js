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
        ,entity: "RouteLog"
        ,startIdx: 0
        ,endIdx: 99999999
    };
    
    util.log("OPTIONS >" + JSON.stringify(options) + "<");
    var usersToFetchFor = [];
    util.log("TYPEOF buddies " + typeof(options["buddies"]));

    /* buddies */
    var buddiesStr = options["buddies"];
    var buddiesArr = buddiesStr ? buddiesStr.split(",") : [];
    
    $.each(buddiesArr, function(idx, buddyUsername) {
        usersToFetchFor.push(buddyUsername);
    });

    /* other users */
    var usersStr = options["users"];
    var usersArr = usersStr ? usersStr.split(",") : [];
    
    $.each(usersArr, function(idx, username) {
        usersToFetchFor.push(username);
    });


    util.log("1USERSTOFETCHFOR >" + usersToFetchFor + "<");
    //usersToFetchFor.push(options["where"]["username"]);
    util.log("2USERSTOFETCHFOR >" + usersToFetchFor + "<");
    util.log("3USERSTOFETCHFOR >" + usersToFetchFor.length + "<");
        
    var finalStatsResults = {};
    var currentUser = "";
    
    var getEntityStatsInnerFunc = function() {
        util.log("GETENTITYSTATSINNFERFUNC >>" + currentUser + "<<");
        // fetch routes for currently iterated user(and keep other where clauses)..
        var myWhere = {
            "$and": [
                options["where"]
                ,{
                    "username": currentUser
                }
            ]
        };
//        options["where"]["username"] = currentUser;
        return DBHandler.getEntities({
            entity : options.statsOptions.entity 
            ,where : myWhere 
            ,requireResult: false
        }, 
        function(resultObj) { 
            // upon success...
            util.log("Found " + options.statsOptions.entity  + "(s) >" + JSON.stringify(resultObj.length) + "<"); 
            util.log("options >" + JSON.stringify(Object.keys(options)) + "<");
            util.log("evaling >" + options.statsOptions.sortByFuncName+ "<");
            util.log("evaled >" + typeof(clStats[options.statsOptions.sortByFuncName]) + "<");
            var aggResultArr = [];
            
            var sortByFunc = clStats[options.statsOptions.sortByFuncName];
            
            clLib.loggi("sortDesc? " + options.statsOptions.sortDescFlag);
            if(sortByFunc) {
                clLib.loggi("sorting by " + typeof(sortByFunc));
                resultObj.sortBy(
                    function(entity) {
                    //    return "AAA";
                        clLib.loggi("in sortfunction for >" + JSON.stringify(entity) + "<");
                        var sortResult = sortByFunc(entity, options);
                        clLib.loggi("sortResult >" + sortResult + "<");
                        return sortResult;
                    }
                    , options.statsOptions.sortDescFlag
                );
                //clLib.loggi("sorted result " + JSON.stringify(resultObj));
                clLib.loggi("sorted result #" + JSON.stringify(resultObj.length));
            }
            // aggregate it!
            util.log("aggFunName >" + options.statsOptions["aggFuncName"] + "<" + typeof(options.statsOptions["aggFuncName"]));
            aggResultArr = clStats[options.statsOptions.aggFuncName](resultObj, options);
            //clLib.loggi("aggregatedResult >" + JSON.stringify(aggResultArr) + "<");
            util.log("XXXX aggregatedResult2 >" + JSON.stringify(aggResultArr.length) + "<");

            finalStatsResults[currentUser] = aggResultArr;
            util.log("calling executeAll");
            var foo = executeAll();
            util.log("returning foo");
            return foo;
        }
        , function(e) {
            util.log("e(obj) " + e.message);
            util.log("e(json) " + JSON.stringify(e));
        }
        );
        
    };
    
    var executeAll = function() {
        currentUser = usersToFetchFor.pop();
        util.log("CURRENTUSER >" + currentUser + "<");
        if(currentUser) {
            return getEntityStatsInnerFunc();
        }
        else {
            util.log("RETURNING FINAL RESULTS >" + JSON.stringify(Object.keys(finalStatsResults).length) + "<");
            return callbackFunc(finalStatsResults);
        }
    }
    
    return executeAll();


};

clStats.getDatePortionFunc = function(statsOptions) {
    //util.log("\n\n\n\n\n\n\n\n\nGetting date portion func ...>" + JSON.stringify(statsOptions) + "<\n\n\n\n\n\n\n\n");
    if(statsOptions["datePortion"]["funcName"]) {
        return clStats[statsOptions.datePortion.funcName];
    }
    else {
//        util.log("ok, trying to parse format..");   
            return function(dateISO, options) {
                //util.log("ok, tryging to format iso date..");
//                util.log("dateISO.." + JSON.stringify(dateISO));
                if(!dateISO) {
                    return (new Date());
                }
//                util.log("format.." + statsOptions.datePortion.format);
                
                var dateObj = clLib.formatISODateToDateObj(
                    dateISO
                    ,statsOptions.datePortion.format
                );
//                util.log("dataObj parsed >" + JSON.stringify(dateObj) + "<");
                return dateObj;
            };
    }
};


clStats.sort_localDayAndScore = function(routeLog, options) {
    clLib.loggi("sort_locaDayAndScore " + JSON.stringify(routeLog));
    clLib.loggi("2sort_locaDayAndScore " + JSON.stringify(options));
    var datePortionFunc;
    try {
        datePortionFunc = clStats.getDatePortionFunc(options.statsOptions);
    } catch(e) {
        util.log("error while getting datePortionFunc >" + e + "<");
        return "X";
    }
    var evalResult = datePortionFunc(routeLog["DateISO"]) + "_" + clLib.lpad(clLib.computeScore(routeLog), '0', 6);
    clLib.loggi("got evalResult >" + evalResult + "<");
    return evalResult;
};
clStats.sort_score = function(routeLog, options) {
    clLib.loggi("sort_score " + JSON.stringify(routeLog));
    clLib.loggi("2sort_score " + JSON.stringify(options));
    
    var evalResult = clLib.lpad(clLib.computeScore(routeLog), '0', 6);
    clLib.loggi("got evalResult >" + evalResult + "<");
    return evalResult;
};
clStats.sort_localScoreAndDay = function(routeLog, options) {
    clLib.loggi("sort_locaDayAndScore " + JSON.stringify(routeLog));
    clLib.loggi("2sort_locaDayAndScore " + JSON.stringify(options));
    var datePortionFunc = clStats.getDatePortionFunc(options.statsOptions);
    var evalResult = clLib.lpad(clLib.computeScore(routeLog), '0', 6) + "_" + datePortionFunc(routeLog["DateISO"]);
    clLib.loggi("got evalResult >" + evalResult + "<");
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
	var aggResultObj = {};
	var aggResultArr = [];
	for(var i = 0; i < routeLogArr.length; i++) {
		var routeLog = routeLogArr[i];
        var datePortionFunc;
        try{
            datePortionFunc = clStats.getDatePortionFunc(options.statsOptions);
        }
        catch(e) {
            util.error("Coudl not get dateportionfubc >" + e + "<");
            return false;   
            }
var datePortion = datePortionFunc(routeLog["DateISO"]);
		if(datePortion) {
            clLib.loggi("datePortion is>" + datePortion + "<");
            if(!(datePortion in aggResultObj)) {
                aggResultObj[datePortion] = {
                    count : 0
                    ,score : 0
                    ,items : []
                };
            }
            
            if(aggResultObj[datePortion].count < options.statsOptions.aggTopX) {
                clLib.loggi("Adding score of >" + clLib.computeScore(routeLog) + "<");
                aggResultObj[datePortion].score += clLib.computeScore(routeLog);
                aggResultObj[datePortion].count++;
                aggResultObj[datePortion].items.push(routeLog);
            }
        }
	}
	JSON.stringify(aggResultObj);
	return aggResultObj;
};

clStats.aggregateByNone= function(routeLogArr, options) {
    return clStats.aggregateById(routeLogArr, options);
}
clStats.aggregateById= function(routeLogArr, options) {
	var aggResultObj = {};
	var aggResultArr = [];
    var foundCount = 0;
	util.log(">>>>>>>>iterating routelogArr >" + JSON.stringify(routeLogArr) + "<");
    for(var i = 0; i < routeLogArr.length; i++) {
        util.log(">>>>>>>>at routelogArr[" + i + "] >" + JSON.stringify(routeLogArr[i]) + "<(endidx:" + options.statsOptions.endIdx + ")");
        
        if(foundCount < options.statsOptions.endIdx) {
            var routeLog = routeLogArr[i];
            var aggKey = 
                "" + 
                clLib.lpad(clLib.computeScore(routeLog), '0', 6)
                + "@"
                + routeLog["DateISO"];
            foundCount++;
            if(aggKey) {
                if(foundCount > options.statsOptions.startIdx) {
                    clLib.loggi("id is>" + aggKey + "<");
                    if(!(aggKey in aggResultObj)) {
                        aggResultObj[aggKey] = {
                            count : 0
                            ,score : 0
                            ,items : []
                        };
                    }
                    
                    if(aggResultObj[aggKey].count < options.statsOptions.aggTopX) {
                        clLib.loggi("Adding score of >" + clLib.computeScore(routeLog) + "<");
                        aggResultObj[aggKey].score += clLib.computeScore(routeLog);
                        aggResultObj[aggKey].count++;
                        aggResultObj[aggKey].items.push(routeLog);
                    }
                }
                
            }
        }
	}
    util.log("ASFASDFASDFSF" + JSON.stringify(aggResultObj));
	//JSON.stringify(aggResultObj);
    var newAggResultObj = {}
    var scoresAt = []
	try {
        $.each(Object.keys(aggResultObj).sort().reverse(), function(idx, key) {
            util.log("eaching..");
            var values = aggResultObj[key];
            var scorePortion = 
                parseInt(idx) + 1; // Add 1 to start with position 1 instead of 0
            //key.substring(0, 6);
            if(!scoresAt[scorePortion]) {
                scoresAt[scorePortion] = 0;
            }
            scoresAt[scorePortion]++;
            util.log("scorePortion >" + scorePortion + "<");
            if(newAggResultObj[scorePortion]) {
                scorePortion = scorePortion + "(" + scoresAt[scorePortion] + ")";
            }
            newAggResultObj[scorePortion] = values;
        });
        util.log("returning >" + JSON.stringify(newAggResultObj) + "<");
        return newAggResultObj;
    } catch(e) {
        util.log("ERRRORRRRRRRRRRR" + JSON.stringify(e) + "," + e);
    }
};

clStats.aggregateHighScoreByDatePortion = function(routeLogArr, options) {
    try {
        clLib.loggi("in XXXXXX");
        var aggResultObj = {};
        var aggResultArr = [];
        
        var datePortionFunc = clStats.getDatePortionFunc(options.statsOptions);
        clLib.loggi("datePirtionFunc is type >" + typeof(datePortionFunc) + "<");
        var datePortions = {};
        for(var i = 0; i < routeLogArr.length; i++) {
            var routeLog = routeLogArr[i];
            clLib.loggi("at >" + i + "< out of >" + routeLogArr.length + "<");
            var datePortion = datePortionFunc(routeLog["DateISO"]);
            if(datePortion) {
                datePortions[datePortion] = true;
            }
        }
        clLib.loggi("Found discint date portions >" + JSON.stringify(datePortions) + "<");
        var datePortionsArr = Object.keys(datePortions);
        //datePortionsArr = ["2015-07-26", "2015-03-15"];
        for(var i = 0; i < datePortionsArr.sort().length; i++) {
            var datePortion = datePortionsArr[i];
            
            clLib.loggi("datePortion is>" + datePortion + "<");
            if(!(datePortion in aggResultObj)) {
                aggResultObj[datePortion] = {
                    count : 0
                    ,score : 0
                    ,items : []
                };
            }
            
            clLib.loggi("--------------------------------");
            clLib.loggi("--------------------------------");
            clLib.loggi("--------------------------------");
            clLib.loggi("--------------------------------");
            clLib.loggi("Computing high score...");
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
    var datePortionFunc = clStats.getDatePortionFunc(options.statsOptions);
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
                clLib.loggi("Adding score of >" + clLib.computeScore(routeLog) + "<");
                aggScores += clLib.computeScore(routeLog);
                eligRouteLogs.push(routeLog);
                count++
            } else {
                i = 9999999;
            }
        }
	}
	clLib.loggi("Returning high score for date >" + JSON.stringify(aggScores) + "<");
	return {
        score: aggScores,
        "items": eligRouteLogs
    };
};

clStats.dateOlderThanDays = function(currentDateStr, dateToCheckStr, numDays){
    var currentDate = clStats.dateObjFromDateStr(currentDateStr);
    var dateToCheck = clStats.dateObjFromDateStr(dateToCheckStr);
    var daysDiff = clStats.daydiff(currentDate, dateToCheck);
    clLib.loggi("Calculated days of >" + daysDiff + "> between >" + currentDate + "< and >" + dateToCheck + "<");
    return ((numDays > daysDiff) && (daysDiff >= 0));
};



clStats.dateObjFromDateStr = function(dateStr) {
	//var dateStr =  "2014-05-19 23:36:13";
    var _year,_month,_day,_hour,_min,_sec;
    _year = dateStr.substring(0, 4);
    _month = dateStr.substring(5,7) || '00';
    _day = dateStr.substring(8, 10) || '00';

    var dateObj = new Date();
    dateObj.setFullYear(_year);
    dateObj.setMonth(_month - 1);
    dateObj.setDate(_day);
    
    clLib.loggi("returnig >" + dateObj + "<");
    return dateObj;
};

clStats.daydiff = function(first, second) {
    return Math.round((second-first)/(1000*60*60*24), 2);
}


clStats.prototype.ISODayPortion = function(ISODateStr) {
	//clLib.loggi("ISODayPortion for " + JSON.stringify(ISODateStr));
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

