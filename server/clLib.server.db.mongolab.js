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

mongolab.prototype.loginUser = function(options, callbackFunc, errorFunc) {
	var userInstance = options["data"];
    util.log("-----> LOGGING in .........");
//	var uri = clLib.server.baseURI + "/login";
};

mongolab.prototype.getEntities = function(options, callbackFunc, errorFunc) {
	util.log("getting entitites >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var whereObj = JSON.parse(options["where"]);

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
			callbackFunc({data : items});
		}
	});
};


mongolab.prototype.updateEntity = function(options, callbackFunc, errorFunc) {
	var entityName = options["entity"];
	var entityId = options["id"];
	var entityData = options["data"];
	
	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
/*	
	//var uri = clLib.server.baseCollectionsURI + "/" + entityName + "/" + entityId;
	var uri = clLib.server.baseUsersURI + "/" + entityId;
	
	var returnObj = {};

//	var urlParams = "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
	util.log("THE ENTITY: " + JSON.stringify(entityName));
	util.log("THE ENTITYDATA: " + JSON.stringify(entityData));
	var reqParams = entityData;
	util.log("THE REQ PARAMS:" + reqParams);
	var serverResult = this.executeRequest(uri, "PUT", reqParams, callbackFunc, errorFunc);
	//util.log("result first " + JSON.stringify(serverResult));
	//serverResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
*/
};

mongolab.prototype.defaults = {
	"errorFunc" : function(resultObj) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj));
//		responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};


