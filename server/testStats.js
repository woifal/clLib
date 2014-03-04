var util = require("util");

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

var statsResource = require("./clLib.statistics");
var statsHandler = new statsResource.stats();

statsHandler.getRouteLogScoreStats({
	//datePortionFunc : statsHandler.ISODayPortion
	//datePortionFunc : statsHandler.ISOMonthPortion
	//datePortionFunc : statsHandler.ISODayHourPortion
	datePortionFunc : statsHandler.ISOHourPortion
	
}
, function(resultObj) {
	util.log("retrieved result:");
	util.log(">" + JSON.stringify(resultObj) + "<");
	for (var i = 0; i < resultObj.length; i++) {
		util.log(JSON.stringify(resultObj[i]));
	}
}
, function(e) {
	util.log("e(obj) " + e.message);
	util.log("e(json) " + JSON.stringify(e));
}
);
