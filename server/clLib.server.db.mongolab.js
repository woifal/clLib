"use strict";
	


var mongo = require('mongoskin');
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

mongolab.prototype.loginUser = function(options) {
	var 
		userInstance = options["data"],
		callbackFunc = options["onSuccess"],
		errorFunc = options["onError"],
		responseStream = options["responseStream"]
	;
    util.log("-----> LOGGING in .........");
//	var uri = clLib.server.baseURI + "/login";
/*
	this.executeRequest(uri, "GET", "username=" + userInstance.username + "&password=" + userInstance.password, callbackFunc, errorFunc, responseStream);
*/	
};

mongolab.prototype.getEntities = function(options) {
	var entityName = options["entity"];
	var whereObj = options["where"];
	var callbackFunc = options["onSuccess"];
	var errorFunc = options["onError"] || mongolab.defaults["errorFunc"];
	var responseStream = options["responseStream"];
	
	var resultObj = {};
	util.log("getting " + entityName + " with where >" + JSON.stringify(whereObj) + "<...");
	clLib.mongolab.conn.collection(entityName).find(whereObj).toArray(function(err, items) {
		if(items.length == 0) {
			err = "no items found"
		}
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			errorFunc(resultObj, responseStream);
		}
		
		if(callbackFunc) {
			callbackFunc(items, responseStream);
		}
	});

};


mongolab.prototype.updateEntity = function(options) {
	var entityName = options["entity"];
	var entityId = options["id"];
	var entityData = options["data"];
	var callbackFunc = options["onSuccess"];
	var errorFunc = options["onError"];
	var responseStream = options["responseStream"];
/*	
	//var uri = clLib.server.baseCollectionsURI + "/" + entityName + "/" + entityId;
	var uri = clLib.server.baseUsersURI + "/" + entityId;
	
	var returnObj = {};

//	var urlParams = "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
	util.log("THE ENTITY: " + JSON.stringify(entityName));
	util.log("THE ENTITYDATA: " + JSON.stringify(entityData));
	var reqParams = entityData;
	util.log("THE REQ PARAMS:" + reqParams);
	var serverResult = this.executeRequest(uri, "PUT", reqParams, callbackFunc, errorFunc, responseStream, 3	);
	//util.log("result first " + JSON.stringify(serverResult));
	//serverResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
*/
};


var fooException= function(name, message) {
   this.message = message;
   this.name = name;
};


mongolab.defaults = {
	"errorFunc" : function(resultObj, responseStream) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj) + "," + responseStream);
		responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};


