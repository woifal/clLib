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

var exitCallBack = function() {
	process.exit();
}




function testQuery(nextFunc) {
	var coll = conn.collection(tableName);
	if(!coll) {
		util.log("NO coll " + tableName + "found..");
	}
	coll.find(whereObj).toArray(function(err, items) {
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));
		}
		else {
			util.log(JSON.stringify(items.length));
			util.log(JSON.stringify(items));
		}
	});

};

function testCommand(nextFunc) {
	conn.executeDbCommand({ geoNear : tableName, near : [48.209933,16.370447], spherical: true, maxDistance : 10, distanceMultiplier: 6371}, function(err, items) { // do something with results here}); 
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));
		}
		else {
			//util.log(JSON.stringify(items.length));
			util.log(JSON.stringify(items.documents[0].results));
		}
	});
}




testQuery(1);
testCommand(1);
util.log("Done");
