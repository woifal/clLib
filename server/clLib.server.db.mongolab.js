"use strict";
	


var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

var util = require("util");
var async = require("async");

var fooFunc = function() {
	return "";
};

function mongolab(){};
exports.DBHandler = mongolab;
mongolab.prototype.setAdminDBSession = function(adminDBSession) {
	util.log("setting admin session to " + JSON.stringify(adminDBSession));
	this.adminDBSession = adminDBSession;
};

var clLib = {};
clLib.mongolab = {};
clLib.mongolab.mongoURI = "mongodb://clAdmin:blerl1la@ds053438.mongolab.com:53438/climbinglog";
clLib.mongolab.conn = mongo.db(clLib.mongolab.mongoURI, {safe: false});

clLib.mongolab.conn.collection("Users").ensureIndex( { "username": 1 }, { unique: true } );

mongolab.prototype.loginUser = function(options, callbackFunc, errorFunc) {
	var userInstance = options["data"];
    util.log("-----> LOGGING in .........");
//	var uri = clLib.server.baseURI + "/login";
};

mongolab.prototype.getEntities = function(options, callbackFunc, errorFunc) {
	util.log("getting entitites >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var whereObj = options["where"];

	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = clLib.mongolab.conn;
	
	util.log("getting " + entityName + " with where >" + JSON.stringify(whereObj) + "<...");
	db.collection(entityName).find(whereObj || null).toArray(function(err, items) {
		util.log(JSON.stringify("items: " + JSON.stringify(items).substring(0,100)));
		if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			errorFunc(resultObj);
		}
		if(!items || items.length == 0) {
			err = "no items found";
			resultObj["error"] = JSON.stringify(err);
			errorFunc(resultObj);
		}
		
		util.log("mongo results received.." + JSON.stringify(items.length));
		
		if(callbackFunc) {
			util.log("Calling callback function, result OK!");
			callbackFunc(items);
		}
	});
};

mongolab.prototype.insertEntity = function(options, callbackFunc, errorFunc) {
	util.log("inserting entity >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var entityValues = options["values"];

	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = clLib.mongolab.conn;
	
	util.log("inserting into " + entityName + "");
	var userColl = db.collection(entityName);
	userColl.insert(entityValues, function(err) {
		if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			errorFunc(resultObj);
		}
		util.log("inserted >" + JSON.stringify(entityValues));

		if(callbackFunc) {
			util.log("Calling callback function, result OK!");
			callbackFunc(entityValues);
		}
	});
};



mongolab.prototype.updateEntity = function(options, callbackFunc, errorFunc) {
	util.log("updating entity >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var entityId = options["id"];
	if(typeof(entityId) == "string") {
		entityId = new BSON.ObjectID(options["id"]);
	}

	var entityData = options["data"];
	
	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	//var db = clLib.mongolab.conn;
	var db = mongo.db(clLib.mongolab.mongoURI, {safe: true});
	
	// only update fields mentioned in entityData..
	var updateObj = {"$set": entityData};

	util.log("1updating " + entityName + " with id " + entityId + " and values >" + JSON.stringify(updateObj) + "<");
	db.collection(entityName).update({"_id" : entityId}, updateObj, {safe: true}, function(err, rowCount) {
		util.log("x" + JSON.stringify(err));
		util.log("ERROR(" + rowCount + ")?" + JSON.stringify(err));
		if (JSON.stringify(err) != "undefined" && JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			return errorFunc(resultObj);
		}
		util.log("updated >" + rowCount + "< rows.");

		if(callbackFunc) {
			util.log("Calling callback function, result OK!");
			callbackFunc(entityData);
		}
	});

};

mongolab.prototype.defaults = {
	"errorFunc" : function(resultObj) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj));
//		responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};


