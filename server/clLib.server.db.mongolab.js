"use strict";
	


var mongo = require('mongoskin');
var BSON = require('bson').BSONPure


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

var mongodbUser = "@@mongodbUser";
var mongodbPwd = "@@mongodbPwd";
var mongodbHost = "@@mongodbHost";
var mongodbPort = "@@mongodbPort";
var mongodbDBName= "@@mongodbDBName";

clLib.mongolab.mongoURI = "mongodb://" + mongodbUser + ":" + mongodbPwd + "@" + mongodbHost + ":" + mongodbPort + "/" + mongodbDBName;

util.log("MONGO URI IS>" + clLib.mongolab.mongoURI + "<");

clLib.mongolab.conn = mongo.db(clLib.mongolab.mongoURI, {safe: true});

//clLib.mongolab.conn.collection("Users").ensureIndex( { "username": 1 }, { unique: true } );

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
	var geoPos = options["geoPos"];
	var limit = options["limit"];

	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = clLib.mongolab.conn;
	
	util.log("getting " + entityName + " with where >" + JSON.stringify(whereObj) + "<...");

	// geospatial query?
	if(geoPos) {
		db.command({ 
			geoNear : entityName
			,near : {
				type: "Point" ,
				coordinates: [
					geoPos["lat"], 
					geoPos["lng"]
				]
			}
			,num: parseInt(limit) || 30
			,spherical: true
			,minDistance: geoPos["minDistance"] + 0
			//,maxDistance : 10 
			//,distanceMultiplier: 6371
			,query: whereObj
		}
		,function(err, items) {  
			util.log(JSON.stringify("err: " + JSON.stringify(err)));
			//util.log(JSON.stringify("items: " + JSON.stringify(items)));
			if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null" ) {
				util.log("ERROR:" + JSON.stringify(err));	
				resultObj["error"] = JSON.stringify(err);
				return errorFunc(resultObj);
			}
			if (items.results[0].errmsg) {
				util.log("ERROR:" + JSON.stringify(items.results[0].errmsg) + "\n" + err);
				resultObj["error"] = JSON.stringify(items.results[0].errmsg);
				return errorFunc(resultObj);
			}

			if(options["requireResult"] && (!items.results || items.results.length == 0)) {
				err = "no items found";
				resultObj["error"] = JSON.stringify(err);
				return errorFunc(resultObj);
			}
			
			util.log("mongo results received.." + JSON.stringify(items.results.length));
			
			var resultArr = [];
			for(var i = 0; i < items.results.length; i++) {
				util.log(">" + i + "<: >" + items.results[i].obj.Name + "< @ >" + items.results[i].dis + "<");
				items.results[i].obj["dis"] = items.results[i].dis
				resultArr[i] = items.results[i].obj;
			}
			
			return callbackFunc(resultArr);
		});
		
	} 
	// "normal" query..
	else {
		db.collection(entityName).find(whereObj || null).toArray(function(err, items) {
			util.log(JSON.stringify("err: " + JSON.stringify(err)));
			//util.log(JSON.stringify("items: " + JSON.stringify(items)));
			if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
				util.log("ERROR:" + JSON.stringify(err));	
				resultObj["error"] = JSON.stringify(err);
				return errorFunc(resultObj);
			}
			util.log("a requireResults? >" + options["requireResult"] + "<");
            if(options["requireResult"] && (
                options["requireResult"] == "true" 
                || options["requireResult"] == true
              ) && (!items || items.length == 0)) {
				err = "no items found";
				resultObj["error"] = JSON.stringify(err);
				return errorFunc(resultObj);
			}
			
			util.log("mongo results received.." + JSON.stringify(items.length));
			
			if(callbackFunc) {
				util.log("Calling callback function, result OK(" + JSON.stringify(items.length) + ")!");
				return callbackFunc(items);
			}
		});
	}
};




mongolab.prototype.getMax = function(options, callbackFunc, errorFunc) {
	util.log("getting max value for entities >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var fieldName = options["field"];
	var whereObj = options["where"];
	
	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = clLib.mongolab.conn;
	
	util.log("getting max >" + fieldName + "< >" + entityName + "< with where >" + JSON.stringify(whereObj) + "<...");

    var sortObj = {};
    sortObj[fieldName] = -1;
    util.log("whereObj is >" + JSON.stringify(whereObj) + "<");
    util.log("sortObj is >" + JSON.stringify(sortObj) + "<");
    //whereObj = JSON.parse(whereObj);
    
    try {
    db.collection(entityName).find(whereObj, null, {sort: sortObj, limit: 1}).toArray(function(err, items) {
		util.log(JSON.stringify("err: " + JSON.stringify(err)));
		//util.log(JSON.stringify("items: " + JSON.stringify(items)));
		if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			return errorFunc(resultObj);
		}
		if(options["requireResult"] && (!items || items.length == 0)) {
			err = "no items found";
			resultObj["error"] = JSON.stringify(err);
			return errorFunc(resultObj);
		}
		
		util.log("mongo results received.." + JSON.stringify(items.length));
		util.log("2mongo results received.." + JSON.stringify(items));
		
		if(callbackFunc) {
			util.log("Calling callback function, result OK(" + JSON.stringify(items.length) + ")!");
			// 2016-04-10: take care of users with NO routelogs YET
			if(items.length == 0) {
				return callbackFunc("111");
			}

			return callbackFunc(items[0][fieldName]);
		}
	});
    } catch(e) {
		util.log("Exception caught: " + e + "(" + JSON.stringify(e) + ")");
		return errorFunc(e);
	}

};



mongolab.prototype.getDistinct = function(options, callbackFunc, errorFunc) {
	util.log("getting distinct entitites >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var whereObj = options["where"];
	var fieldName = options["field"];
	var limit = options["limit"];

	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = clLib.mongolab.conn;
	
	util.log("getting " + entityName + " with where >" + JSON.stringify(whereObj) + "<...");


	db.collection(entityName).distinct(fieldName, whereObj || null, function(err, items) {
		util.log(JSON.stringify("err: " + JSON.stringify(err)));
		//util.log(JSON.stringify("items: " + JSON.stringify(items)));
		if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			resultObj["error"] = JSON.stringify(err);
			return errorFunc(resultObj);
		}
		if(options["requireResult"] && (!items || items.length == 0)) {
			err = "no items found";
			resultObj["error"] = JSON.stringify(err);
			return errorFunc(resultObj);
		}
		
		util.log("mongo results received.." + JSON.stringify(items.length));
		
		if(callbackFunc) {
			util.log("Calling callback function, result OK(" + JSON.stringify(items.length) + ")!");
			return callbackFunc(items);
		}
	});
};

mongolab.prototype.insertEntity = function(options, callbackFunc, errorFunc) {
	util.log("inserting entity >"+ JSON.stringify(options) + "<");
	var resultObj = {}, errorStr = "";
	var entityName = options["entity"];
	var entityValues = options["values"];

	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	var db = mongo.db(clLib.mongolab.mongoURI, {safe: true});

    entityValues[this.defaults["lastModField"]] = Date.now();
    
	util.log("inserting into " + entityName + "");
	util.log("inserting values " + JSON.stringify(entityValues) + "");
	util.log("inserting value keys " + JSON.stringify(Object.keys(entityValues)) + "");
	var aCollection = db.collection(entityName);
	return aCollection.insert(entityValues, function(err) {
		if (JSON.stringify(err) != "{}" && JSON.stringify(err) != "null") {
			util.log("ERROR:" + JSON.stringify(err));	
			if(err["err"].indexOf("E11000") == 0) {
				errorStr = entityName + " already exists!";
			}
			else {
				errorStr = JSON.stringify(err);
			}
			return errorFunc(errorStr);
		}
		util.log("inserted >" + JSON.stringify(entityValues));

		if(callbackFunc) {
			util.log("Calling callback function, result OK!");
			return callbackFunc(entityValues);
		}
	});
};



mongolab.prototype.updateEntity = function(options, callbackFunc, errorFunc) {
	util.log("updating entity >"+ JSON.stringify(options) + "<");
	var resultObj = {};
	var entityName = options["entity"];
	var entityId = options["_id"];
	if(typeof(entityId) == "string") {
		entityId = new BSON.ObjectID(options["_id"]);
	}

	var entityData = options["data"];
    entityData[this.defaults["lastModField"]] = Date.now();
	
	if(!errorFunc) errorFunc = this.defaults["errorFunc"];
	
	//var db = clLib.mongolab.conn;
	var db = mongo.db(clLib.mongolab.mongoURI, {safe: true});
	
	// only update fields mentioned in entityData..
	var updateObj = {"$set": entityData};

    
	util.log("1updating " + entityName + " with id " + entityId + " and values >" + JSON.stringify(updateObj) + "<");
	try {
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
				util.log("Calling callback function with >" + JSON.stringify(entityData) + "<, result OK!");
				return callbackFunc(entityData);
			}
		});
	} catch(e) {
		util.log("Exception caught: " + e + "(" + JSON.stringify(e) + ")");
		return errorFunc(e);
	}
};

mongolab.prototype.defaults = {
	"errorFunc" : function(resultObj) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj));
//		responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
    ,"lastModField": "_updatedAt"
};


