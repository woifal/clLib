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
	util.log(">" + JSON.stringify(Object.keys(resultObj)) + "<");
	util.log(".....now consolidated...");
	var i;
	var aggResultKeys = Object.keys(resultObj);
	for (var i = 0; i < aggResultKeys.length; i++) {
		util.log(">>>>>> KEY " + aggResultKeys[i] + "<<<<<<");
		util.log(JSON.stringify(resultObj[aggResultKeys[i]]));
	}

}
, function(e) {
	util.log("e(obj) " + e.message);
	util.log("e(json) " + JSON.stringify(e));
}
);
