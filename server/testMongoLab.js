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

function testQuery(i) {
	util.log("i is " + i);
	if(i >= 10) {
		return;
	}
	conn.collection(tableName).find(whereObj).toArray(function(err, items) {
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));
		}
		
		util.log(JSON.stringify(items.length));
		testQuery(++i);
	});

};

testQuery(1);

util.log("Done");
