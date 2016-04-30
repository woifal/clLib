"use strict";

var mongo = require('mongoskin');
var util = require("util");
var async = require("async");

var mongoURI ="";
mongoURI = "mongodb://clAdmin:blerl1la@ds053438.mongolab.com:53438/climbinglog";
var conn = mongo.db(mongoURI, {safe: false});

var args = process.argv.splice(2);
var tableName = args[0];
var whereObj = JSON.parse(args[1]);
var myLat = parseFloat(args[2]);
var myLng = parseFloat(args[3]);

var exitCallBack = function() {
    util.log("DONNNN");
	process.exit();
}



function testCommand(nextFunc) {
	util.log("myLat >" + myLat + "<");
	util.log("myLng >" + myLng + "<");
	conn.command({
		geoNear : tableName, 
		near : {
			type: "Point" ,
			//48.209933,16.370447
			coordinates: [
				myLat, myLng
			]
			,minDistance: parseFloat(600)
		}
		,num: 5
		,spherical: true 
		,maxDistance : 25000 
		,query: whereObj
	}
	,function(err, items) { // do something with results here}); 
		util.log("err >" + JSON.stringify(err) + "<,>" + JSON.stringify(items) + "<");
        if (err || items.results[0].errmsg) {
			util.log("ERROR:" + JSON.stringify(err || items.results[0].errmsg) + "\n" + err);
		}
		else {
			util.log(">>>>>" + JSON.stringify(items));
			var resultArr = [];
			for(var i = 0; i < items.results.length; i++) {
				util.log(">" + i + "<: >" + items.results[i].obj.Name + "< @ >" + items.results[i].dis + "<(" + JSON.stringify(items.results[i].obj.geoPos) + ")");
				resultArr[i] = items.results[i].obj;
			}
			
			//util.log("final results >" + JSON.stringify(resultArr) + "<");
			return typeof(nextFunc) == 'function' ? nextFunc() : 1;
		}
	});
}



testCommand(exitCallBack);
util.log("Done");

// node testMongoGeoNear.js AreaRaw3 '{"City Code": 1010, "geoPos": {"$near": [48.2034218, 16.3750996] }}'
// node testMongoGeoNear.js AreaRaw3 '{ "geoPos": {"$near": [48.2034218, 16.3750996] }}'