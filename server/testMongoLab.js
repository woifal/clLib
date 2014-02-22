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

// bind method: db.user ===> db.collection('user')
conn.bind('Users');


function testQuery(i) {
	util.log("i is " + i);
	if(i >= 10) {
		return;
	}
	var coll = conn.collection(tableName);
	if(!coll) {
		util.log("NO coll " + tableName + "found..");
	}
	coll.find(whereObj).toArray(function(err, items) {
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));
		}
		
		util.log(JSON.stringify(items.length));
		testQuery(++i);
	});

};


function testUpdate(i) {
	util.log("i is " + i);
	if(i >= 10) {
		return;
	}
	var coll = conn.Users;
	if(!coll) {
		util.log("NO coll " + tableName + "found..");
	}
	coll.update({_id: "_a_A_a_5307f9dbaa0f221c19000001"}, {$set: {"password": 'haha update'}}, {safe: true, multi: true}, function(err, items) {
		if (err) {
			util.log("ERROR:" + err.message);
		}
		
		util.log(items);
		testUpdate(++i);
	});

};

testUpdate(1);
//testQuery(1);

util.log("Done");
