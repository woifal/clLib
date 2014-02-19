"use strict";
	
// We need this to build our post string
var async = require("async");
var querystring = require('querystring');
var https = require('https');
var URL = require('url');
var util = require("util");

var fooFunc = function() {
	return "";
};
function apperyREST(){};
exports.DBHandler = apperyREST;
apperyREST.prototype.setAdminDBSession = function(adminDBSession) {
	util.log("setting admin session to " + JSON.stringify(adminDBSession));
	this.adminDBSession = adminDBSession;
};

var clLib = {};
clLib.server = {};	
clLib.server.baseURI = "https://api.appery.io/rest/1/db";
clLib.server.baseCollectionsURI = clLib.server.baseURI + "/collections";
clLib.server.baseUsersURI = clLib.server.baseURI + "/users";

apperyREST.prototype.loginUser = function(options) {
	var 
		userInstance = options["data"],
		callbackFunc = options["onSuccess"],
		errorFunc = options["onError"],
		responseStream = options["responseStream"]
	;
    util.log("-----> LOGGING in .........");
	var uri = clLib.server.baseURI + "/login";
//	var returnObj = this.executeRequest(uri, "GET", JSON.stringify(userInstance));
	this.executeRequest(uri, "GET", "username=" + userInstance.username + "&password=" + userInstance.password, callbackFunc, errorFunc, responseStream);
};

apperyREST.prototype.getEntities = function(options) {
	var entityName = options["entity"];
	var whereObj = options["where"];
	var callbackFunc = options["onSuccess"];
	var errorFunc = options["onError"];
	var responseStream = options["responseStream"];
	
	//var uri = clLib.server.baseCollectionsURI + entityName;
	var uri = clLib.server.baseUsersURI;
	var returnObj = {};

//	var urlParams = "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
	util.log("THE ENTITY: " + JSON.stringify(entityName));
	util.log("THE WHEREOBJ: " + JSON.stringify(whereObj));
	var reqParams = "where=" + encodeURIComponent(JSON.stringify(whereObj));
/*
	util.log("TYPEOF" + typeof(reqParams));
	if(typeof(reqParams) == "string") {
		util.log("THE REQ PARAMS:" + JSON.stringify(reqParams));
	} else {
		util.log("THE REQ PARAMS:" + JSON.stringify(Object.keys(reqParams)));
	};
*/
	var serverResult = this.executeRequest(uri, 'GET', reqParams, callbackFunc, errorFunc, responseStream	);
	//util.log("result first " + JSON.stringify(serverResult));
	//serverResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
	
};


apperyREST.prototype.updateEntity = function(options) {
	var entityName = options["entity"];
	var entityId = options["id"];
	var entityData = options["data"];
	var callbackFunc = options["onSuccess"];
	var errorFunc = options["onError"];
	var responseStream = options["responseStream"];
	
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


apperyREST.defaults = {
	"errorFunc" : function(resultObj, responseStream) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj) + "," + responseStream);
		responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};

apperyREST.prototype.executeRequest = function(uri, method, params, callbackFunc, errorFunc, responseStream, contentLength) {
	var reqOptions = {};
	reqOptions["params"] =  params;

	var resultObj = {};
	
	if(!errorFunc) {
		errorFunc = apperyREST.defaults["errorFunc"];
	}

	var URLObj = URL.parse(uri);
	reqOptions["host"] = URLObj.host;
	reqOptions["path"] =  URLObj.pathname;

	reqOptions.httpHeaders = {
		"X-Appery-Database-Id" : "52093c91e4b04c2d0a027d7f",
		"X-Appery-Master-Key": "14e89fa4-48ff-4696-83fc-c0d58fe10f49"
	};
//	if(this.adminDBSession) {
//		reqOptions.httpHeaders["X-Appery-Session-Token"] = this.adminDBSession["sessionToken"]
//	}

	var prepareFunc;
	if(method == "GET") {
		prepareFunc = this.prepareGETRequest;
	} else if(method == "POST") {
		prepareFunc = this.preparePOSTRequest;
	} else if(method == "PUT") {
		prepareFunc = this.preparePOSTRequest;
	}
	prepareFunc(reqOptions);
	
	reqOptions.host = reqOptions.host; //'api.appery.io',
	reqOptions.port = '443';
	reqOptions.path = reqOptions.path; //// '/rest/1/db/collections/RouteLog?' + "where=" + encodeURIComponent(JSON.stringify({"Grade": "VIII"}))
	reqOptions.method = reqOptions.method;
	reqOptions.headers = reqOptions.httpHeaders;


	//util.log("reqOptions: " + JSON.stringify(reqOptions));
	util.log("reqOptions: " + reqOptions);
	
	// Set up the request */
	var req = https.request(reqOptions, function(res) {
		var statusCode = res.statusCode;
		util.log("checking response with status " + statusCode);
		util.log("response keys:" + JSON.stringify(Object.keys(res)));
		//util.log("headers: ", res.headers);
		
		
		//res.setEncoding('utf8');
		res.on('data', function(d) {
//			try {
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
//			} catch(e) {
//				throw new Error("ERROR OF TYPE "  + e.name + " IS " + e.message + " !!!");
//			};
		
		});
	});

	req.on('error', function(errorObj) {
		errorFunc(errorObj, responseStream);
	});
	
	if(method != "GET") {
		//postData = "\"username\"";
		util.log("writing to request: >" + reqOptions.postData + "<");
		util.log("Content-length: >" + contentLength + "," + Buffer.byteLength(reqOptions.postData) + "<");
		req.write(reqOptions.postData); //, "utf-8");
	}
	
	req.end();

	
};


apperyREST.prototype.prepareGETRequest = function(options) {
	util.log("OLD path >" + JSON.stringify(options.path) + "<");
	options.path += "?" + options.params;
	util.log("NEW path >" + JSON.stringify(options.path) + "<");
}
	
apperyREST.prototype.preparePOSTRequest = function(options) {
	options.postData = JSON.stringify(options.params);
	options.postData = "{'usernamesdf': 'asdfasf', 'password':'asdf'}";
	//	postData = ('{"asdfasfdsafusername": "asdfasf", "password":"asdf"}');
	//postData = "{\foo':'blerl'}";
	options.postData = "\{\"XXX\": 123\}";
	options.postData = JSON.stringify(options.params);
	util.log("POST DATA >" + options.postData + "<");

	options.httpHeaders['Accept'] = "application/json"; //, text/javascript, */*; q=0.01";
	options.httpHeaders['Accept-Encoding'] = "gzip, deflate";
	options.httpHeaders['Accept-Language'] = "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3";
	options.httpHeaders['Connection'] = "keep-alive";
	options.httpHeaders['DNT'] = "1";
	options.httpHeaders['User-Agent'] = "curl/7.32.0";
	options.httpHeaders['Host'] = "api.appery.io";
	options.httpHeaders['Content-Type'] = 'application/json';//; charset=UTF-8';

};


