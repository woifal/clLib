
"use strict";

var util = require("util");
var clCrypto = require("pwd");
var DBResource = require("./clLib.server.db.mongolab");
var serverResource = require("./server").server;
var DBHandler = new DBResource.DBHandler();

function auth(){};
exports.auth = auth;

auth.prototype.hash = function(password, salt, callbackFunc, errorFunc) {
	util.log("hashing...");
	//callbackFunc(password);
	clCrypto.hash(password, salt, function(err, hash) {
		util.log("HASHED" + err + "," + hash);
		if(err) return errorFunc(err);
		callbackFunc(hash);
	});
}

auth.prototype.requiredAuthentication = function(req, res, next) {
	util.log("req" + JSON.stringify(Object.keys(req)));
	util.log("header.." + JSON.stringify(req.headers));

	//var username = req.params.username;
	var username = req.headers["clUserName"];
	var sessionToken = req.headers["x-appery-session-token"];
	//var sessionToken = req.params.sessionToken;
	var cachedSession = serverResource.runtime["sessionTokens"][username] || {};
	
	var userSessionToken = cachedSession["token"] ;
	var userSessionExpiry = cachedSession["expires"];
	var currentTime = "" + Date.now();
	if(sessionToken == null || userSessionToken == null) {
		res.send(500, JSON.stringify({
			result: "Request session token >" + sessionToken+ "< is not defined or server session token >" + userSessionToken + "< does not exist."
		}));
	} 
	else if(sessionToken == userSessionToken) {
        if(currentTime > userSessionExpiry) {
			util.log("Session for user '" + username + "' expired (" + userSessionExpiry + " < " + currentTime + ")");
			delete serverResource.runtime["sessionTokens"][username];
			res.send(500, JSON.stringify({
				result: "Session for user '" + username + "' expired (" + userSessionExpiry + " < " + currentTime + ")"
			}));
		}
		util.log("sessionToken >" + sessionToken + "<for user >" + username + "< is OK!");
		next();
    } else {
		res.send(500, JSON.stringify({
			result: "Session verification failed: >" + userSesionToken + "< is not equal to >" + sessionToken + "<"
		}));
    }
}


auth.prototype.authenticate = function(authObj, callbackFunc, errorFunc) {
    util.log('authenticating >' + JSON.stringify(authObj) + "<");

	var userName = authObj.username;
	var password = authObj.password;
	var meMyselfAndI = this;
	
	// verify user.
	DBHandler.getEntities({
		entity : serverResource.usersCollectionName, 
		where : {"username": authObj["username"]}
		, requireResult: true
	},
	// upon success...
	function(userObj) { 
		userObj = userObj[0];
		util.log("Found user >" + JSON.stringify(userObj) + "<"); 

		//util.log(JSON.stringify(this));
		meMyselfAndI.hash(password, userName,
		function (hash) {
			util.log("comparing " + hash + " and " + userObj["password"]);
			// Password hashes match?
			if (hash == userObj["password"]) {
				util.log("passwords match!");
				var sessionToken = serverResource.generateRandomToken();
				// indicate in session that user was authenticated..
				userObj["sessionToken"] = sessionToken;
				serverResource.runtime["sessionTokens"][userObj["username"]] = sessionToken;
				
				return callbackFunc(userObj);
			}
			// no, they don't..
			util.log('non-matching passwords..');
			//errorFunc("asdfasfd");
			return errorFunc(new Error('invalid password'));
		},
		function(err) {
			util.log('could not generate hash for password..');
			return errorFunc(new Error('could not generate hash for password..'));
		});
	}
	,errorFunc
	);
};

auth.prototype.defaults = {
	"foo" : "vla",
	"errorFunc" : function(resultObj) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj));
		//responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};

