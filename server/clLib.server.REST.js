"use strict";
	
// We need this to build our post string
var async = require("async");
var querystring = require('querystring');
var https = require('https');
var URL = require('url');
var util = require("util");

function serverREST(){};
exports.serverREST = serverREST;
serverREST.prototype.setAdminDBSession = function(adminDBSession) {
	util.log("setting admin session to " + JSON.stringify(adminDBSession));
	this.adminDBSession = adminDBSession;
};

var clLib = {};
clLib.server = {};	
clLib.server.baseURI = "https://api.appery.io/rest/1/db";
clLib.server.baseCollectionsURI = clLib.server.baseURI + "/collections";
clLib.server.baseUsersURI = clLib.server.baseURI + "/users";

//clLib.localStorage.getEntities = function(entity, whereObj, storageName, sortKey, descSortFlag, limit) {

serverREST.prototype.loginUser = function (userInstance, callbackFunc, errorFunc, responseStream) {
    util.log("-----> LOGGING in .........");
	var uri = clLib.server.baseURI + "/login";
//	var returnObj = this.executeRequest(uri, "GET", JSON.stringify(userInstance));
	this.executeRequest(uri, "GET", "username=" + userInstance.username + "&password=" + userInstance.password, callbackFunc, errorFunc, responseStream);
};

serverREST.prototype.getEntities = function(entityName, whereObj, callbackFunc, errorFunc, responseStream) {
	//var uri = clLib.server.baseCollectionsURI + entityName;
	var uri = clLib.server.baseUsersURI;
	var returnObj = {};

//	var urlParams = "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
	util.log("THE ENTITY: " + JSON.stringify(entityName));
	util.log("THE WHEREOBJ: " + JSON.stringify(whereObj));
	var reqParams = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	util.log("THE REQ PARAMS:" + reqParams);
	var serverResult = this.executeRequest(uri, 'GET', reqParams, callbackFunc, errorFunc, responseStream	);
	//util.log("result first " + JSON.stringify(serverResult));
	//serverResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
	
};


serverREST.prototype.updateEntity = function(entityName, entityId, entityData, callbackFunc, errorFunc, responseStream) {
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
	
};


var fooException= function(name, message) {
   this.message = message;
   this.name = name;
};


serverREST.defaults = {
	"errorFunc" : function(resultObj, responseStream) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj) + "," + responseStream);
		responseStream.send(JSON.stringify(resultObj));
	}
};

serverREST.prototype.executeRequest = function(uri, method, params, callbackFunc, errorFunc, responseStream, contentLength) {
	var resultObj = {};
	
	var postData;
	
	if(!errorFunc) {
		errorFunc = serverREST.defaults["errorFunc"];
	}

	var URLObj = URL.parse(uri);
	var host = URLObj.host;
	var path = URLObj.pathname;
	if(method == "GET") {
		path += "?" + params;
	} else {
		postData = JSON.stringify(params);
		postData = "{'usernamesdf': 'asdfasf', 'password':'asdf'}";
		//	postData = ('{"asdfasfdsafusername": "asdfasf", "password":"asdf"}');
		//postData = "{\foo':'blerl'}";
		postData = "\{\"XXX\": 123\}";
		postData = JSON.stringify(params);
		util.log("POST DATA >" + postData + "<");
	}
	
	// An object of options to indicate where to post to
	var httpHeaders = {
		"X-Appery-Database-Id" : "52093c91e4b04c2d0a027d7f",
		"X-Appery-Master-Key": "14e89fa4-48ff-4696-83fc-c0d58fe10f49"
	};
	if(this.adminDBSession) {
		httpHeaders["X-Appery-Session-Token"] = this.adminDBSession["sessionToken"]
	}
	if(method != "GET") {
		httpHeaders['Accept'] = "application/json"; //, text/javascript, */*; q=0.01";
		httpHeaders['Accept-Encoding'] = "gzip, deflate";
		httpHeaders['Accept-Language'] = "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3";
		httpHeaders['Connection'] = "keep-alive";
		httpHeaders['DNT'] = "1";
		httpHeaders['User-Agent'] = "curl/7.32.0";
		httpHeaders['Host'] = "api.appery.io";
	}
	
	if(method != "GET") {
		httpHeaders['Content-Type'] = 'application/json';//; charset=UTF-8';
//		httpHeaders['Content-Length'] = 45; //contentLength; //postData.length - 45;
	}
	
	
	var httpOptions = {
		host: host //'api.appery.io',
//      port: '443',
		,path: path //// '/rest/1/db/collections/RouteLog?' + "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
		,method: method,
		headers: httpHeaders
	};

	util.log("httpOptions: " + JSON.stringify(httpOptions));
	// Set up the request */

	var req = https.request(httpOptions, function(res) {
		var statusCode = res.statusCode;
		util.log("checking response with status " + statusCode);
		//util.log("response keys:" + JSON.stringify(Object.keys(res)));
		//util.log("headers: ", res.headers);
		
		
		//res.setEncoding('utf8');
		res.on('data', function(d) {
			try {
				util.log('result received.');
				//process.stdout.write(d);
				resultObj["statusCode"] = statusCode;
				resultObj.data = JSON.parse(d);
				util.log("parsed result: " + JSON.stringify(resultObj).substr(0, 1000));
				
				//if(uri != clLib.server.baseURI + "/login") {
					//util.log("trying to throw errrors..");
					//throw new fooException("XXX", "YYY");
				//}
				
				if(statusCode == 200) {
					util.log("=> callbackFunc..");
					if(callbackFunc) {
						callbackFunc(resultObj, responseStream);
					}
				} else {
					util.log("=> errorFunc..");
					if(errorFunc) {
						errorFunc(resultObj, responseStream);
					} else {
						util.log("no errorFunc defined..");
					}
				}
			} catch(e) {
				throw new Error("ERROR OF TYPE "  + e.name + " IS " + e.message + " !!!");
			};
		
		});
	});

	req.on('error', function(errorObj) {
		errorFunc(errorObj, responseStream);
	});
	
	if(method != "GET") {
		//postData = "\"username\"";
		util.log("writing to request: >" + postData + "<");
		util.log("Content-length: >" + contentLength + "," + Buffer.byteLength(postData) + "<");
		req.write(postData); //, "utf-8");
	}
	
	req.end();

};


