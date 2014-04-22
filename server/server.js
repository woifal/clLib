var util = require("util");

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

var clLib = {};
clLib.server = {};
clLib.server.runtime = {
	"sessionTokens" : {}
};
clLib.server.email = {};

exports.server = clLib.server;


//Define the port to listen to
var PORT = process.env.PORT || 1983;
//Include retify.js framework
var restify = require('restify');
var http = require('http');
 
var options = {
  serverName: 'My server',
  accept: [ 'application/json' ]
}
 
clLib.server.usersCollectionName = "Users";

clLib.server.defaults = {
	"errorFunc" : function(errorObj, res) {
		util.log("standard errorFunc: " + JSON.stringify(errorObj));
		var errorStr = "?";
		if(errorObj instanceof Error) {
			errorStr = JSON.stringify(errorObj.message);
		} 
		else {
			errorStr = JSON.stringify(errorObj);
		}
		res.send(500, "error >" + errorStr + "<");
	}
};


 
 
//Create the server
var server = restify.createServer(options);
 

 
//Use bodyParser to read the body of incoming requests
/*
?!?!?!?!?!
*/
//server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.fullResponse());
server.use(restify.gzipResponse());


function unknownMethodHandler(req, res) {
	if (req.method.toLowerCase() === 'options') {
		console.log('received an options method request');
		var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', "content-type,x-appery-database-id,x-appery-session-token,clUserName,DNT,accept-language,accept");
		res.header('Access-Control-Allow-Methods', 	res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		console.log("sending 204...\n\n\n");
		return res.send(204);
	} else {
		return res.send(new restify.MethodNotAllowedError());
	}
}

server.use(restify.queryParser()); 
server.use(restify.fullResponse());
server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(PORT, '0.0.0.0');
server.use(restify.CORS());
server.use(restify.fullResponse());
//server.use(restify.session());

util.log("listening "+PORT);
 

 
 //IMPORT RESOURCES
var eventsResource = require('./events');
var mailResource = require("./clMail.gmail");
var authResource = require("./clLib.authentification");
//var DBResource = require("./clLib.server.db.apperyREST.js");
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();
var mailHandler = new mailResource.mail();
var authHandler = new authResource.auth();

var statsResource = require("./clLib.statistics");
var statsHandler = new statsResource.stats();



var adminUserDetails = {};

	
var adminUserObj = {};
adminUserObj["username"] = "clAdmin";
adminUserObj["password"] = "foobar";
var adminDBSession;


var fooFunc = function() {
	return "";
};


adminDBSession = DBHandler.loginUser({
	data : adminUserObj,
	onSuccess : function(resultObj) {
		DBHandler.setAdminDBSession(resultObj.data);
		util.log("<----  LOGGED in .........");
	},
	onError: function(errorObj) {
		util.log("!!!!!! ERROR WHILE LOGGING IN:");
		util.log(fooFunc(errorObj));
	}
});

server.get("/login", function (req, res) {
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	console.log("authHandler.defaults : >" + JSON.stringify(authHandler.defaults) + "<");
	authHandler.authenticate({
		username : req.params["username"]
		,password :  req.params["password"]
		,plainPwd : req.params["plainPwd"]
	},
	function(userObj) {
		util.log("AUTHENTICATED!!! " + JSON.stringify(userObj));
		return res.send(userObj);
	},
	errHandler
	);

});

server.get("/deleteUser", function (req, res) {
	
	
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("putting.." + JSON.stringify(req.params));
	var entityName = clLib.server.usersCollectionName;
	var entityId = req.params.entityId;
	// verify user.
	DBHandler.updateEntity({
		entity : entityName, 
		id : entityId,
		data : {"deleted": 1}
	},
	function(resultObj) { 
		// upon success...
		util.log("updated entity(" + entityName + ")>" + JSON.stringify(resultObj) + "<"); 
		
		// User not found=
		if(!resultObj) {
			res.send(500, JSON.stringify({
			result: "Entity(" + entityName + ") not found: >" + entityId + "<"}));
		}
		res.send(JSON.stringify(resultObj));

	}
	, errHandler
	);


});

server.post("/signup", function (req, res) {
	util.log("authHandler.defaults : >" + JSON.stringify(authHandler.defaults) + "<");
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	
	var userObj = req.body;
	util.log("USEROBJ to insert " + JSON.stringify(userObj));
	var foo = this;
	
	var plainPwd = userObj.password;
	
	authHandler.hash(userObj.password, userObj.username, 
	function(hashpwd) {
		util.log("HASHPWD IS >" + hashpwd + "<");
		userObj.password = hashpwd;
		
		// verify user.
		DBHandler.insertEntity({
			entity : clLib.server.usersCollectionName, 
			values : userObj
		},
		// upon success...
		function(userObj) { 
			//userObj = userObj[0];
			util.log("Created user >" + JSON.stringify(userObj) + "<"); 

			// generate new verification token
			var initialToken = clLib.server.generateRandomToken();
			util.log("updating with token");
			DBHandler.updateEntity({
				entity : clLib.server.usersCollectionName,
				id : userObj["_id"],
				data : {"initialToken": initialToken}
			},
			function(resultObj) {
				util.log("updatied with token");
		
				util.log("Token >" + initialToken + "< stored at >" + resultObj + "<");
				
				userObj["initialToken"] = initialToken;
				
				var sendInitialEmail = false;
				if(!sendInitialEmail) {
					util.log("NO email sent!!!");
					util.log("AUTHENTICATED!!! " + JSON.stringify(userObj));
					res.send(userObj);
				}
				else {
					// send token to user..
					util.log("Sending email..");
					var options = {
						"template": {
							name: "initialEmail",
							vars: userObj
						},
						"to": userObj["email"]
					}
					
					mailHandler.send(
						{"emailOptions" : options}, 
						function(responseObj) {
							authHandler.authenticate({
								username : userObj["username"]
								,password :  plainPwd
							},
							function(userObj) {
								util.log("email sent!!! " + JSON.stringify(responseObj));
								util.log("AUTHENTICATED!!! " + JSON.stringify(userObj));
								res.send(userObj);
							}
							,errHandler
							);
						}
						, errHandler
					)
				}
			}
			, errHandler
			);
		},
		errHandler
		);
	}
	, errHandler
	);
});



server.get('/requestVerification', function(req, res) {
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("getting.." + JSON.stringify(req.params));
	var resText = [];
	var resCount = 0;
	// verify user.
	DBHandler.getEntities({
		entity : clLib.server.usersCollectionName, 
		where : {"username": req.params["username"]},
		requireResult: true
	}, 
	function(resultObj) { 
		// upon success...
		var userDetails = resultObj[0];
		util.log("Found user >" + fooFunc(userDetails) + "<"); 
		
		// User not found=
		if(!userDetails) {
			res.send(500, JSON.stringify({
			result: "User not found: >" + req.params["username"] + "<"}));
		}

		
		// store newly generated token
		var verificationToken = clLib.server.generateRandomToken();
		DBHandler.updateEntity({
			entity : clLib.server.usersCollectionName,
			id : userDetails["_id"],
			data : {"username": req.params["username"], "verificationToken": verificationToken}
		},
		function(resultObj) {
			util.log("Resultobj " + JSON.stringify(resultObj));
			util.log("Token >" + verificationToken + "< stored at >" + resultObj["_updatedAt"] + "<");
			
			userDetails["verificationToken"] = verificationToken;
			// send token to user..
			util.log("Sending email..");
			var options = {
				"template": {
					name: "verificationEmail",
					vars: userDetails
				},
				"to": userDetails["email"]
			}
			
			mailHandler.send(
				{"emailOptions" : options}, 
			function(responseObj) {
				util.log("email sent!!! " + JSON.stringify(responseObj));
				res.send("email sent >" + JSON.stringify(responseObj) + "<");
			}
			,errHandler
			);
		}
		,errHandler
		);
	});
});
	
	

server.get('/db/:entityName/:entityId', 
		authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("getting.." + JSON.stringify(req.params));
	var entityName = req.params.entityName;
	var entityId = req.params.entityId;
	if(typeof(entityId) == "string") {
		entityId = new BSON.ObjectID(entityId);
	}
	util.log("ENTITY ID IS " + entityId);
	

	// verify user.
	DBHandler.getEntities({
		entity : entityName, 
		where : {_id: entityId},
		requireResult: true
	},
	function(resultObj) { 
		// upon success...
		var entityDetails = resultObj[0];
		util.log("Found entity(" + entityName + ")>" + fooFunc(entityDetails) + "<"); 
		
		// User not found=
		if(!entityDetails) {
			res.send(500, JSON.stringify({
			result: "Entity(" + entityName + ") not found: >" + JSON.stringify(req.params["where"]) + "<"}));
			return;
		}
		res.send(JSON.stringify(resultObj));

	}
	, errHandler
	);
});
	
server.get('/db/:entityName', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("2getting.." + JSON.stringify(req.params));
	var entityName = req.params.entityName;
	// verify user.
	DBHandler.getEntities({
		entity : entityName, 
		where : JSON.parse(req.params["where"])
	},
	function(resultObj) { 
		// upon success...
		var entityDetails = resultObj[0];
		util.log("Found entity(" + entityName + ")>" + fooFunc(entityDetails) + "<"); 
		
		// User not found=
		if(!entityDetails) {
			res.send(500, JSON.stringify({
			result: "Entity(" + entityName + ") not found: >" + JSON.stringify(req.params["where"]) + "<"}));
			return;
		}
		res.send(JSON.stringify(resultObj));

	}
	, errHandler
	);
});

server.put('/db/:entityName/:entityId', 
//		authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("putting.." + JSON.stringify(req.params));
	var entityName = req.params.entityName;
	var entityId = req.params.entityId;
	// verify user.
	DBHandler.updateEntity({
		entity : entityName, 
		id : entityId,
		data : req.body
	},
	function(resultObj) { 
		// upon success...
		util.log("updated entity(" + entityName + ")>" + JSON.stringify(resultObj) + "<"); 
		
		// User not found=
		if(!resultObj) {
			res.send(500, JSON.stringify({
			result: "Entity(" + entityName + ") not found: >" + entityId + "<"}));
		}
		res.send(JSON.stringify(resultObj));

	}
	, errHandler
	);
});

server.post('/db/:entityName', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("posting.." + JSON.stringify(req.body));
	var entityName = req.params.entityName;
	DBHandler.insertEntity({
		entity : entityName,
		values : req.body
	},
	function(resultObj) { 
		// upon success...
		util.log("insertED entity(" + entityName + ")>" + JSON.stringify(resultObj) + "<"); 
		
		// User not found=
		if(!resultObj) {
			res.send(500, JSON.stringify({
			result: "Entity(" + entityName + ") not found: >" + entityId + "<"}));
		}
		res.send(JSON.stringify(resultObj));

	}
	,errHandler);
});
	
server.get('/setPassword', function(req, res) {
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	
	// verify user.
	DBHandler.getEntities({
		entity : clLib.server.usersCollectionName, 
		where : {"username": req.params["username"]},
		requireResult : true
	},
	function(resultObj) { 
	// upon success...
		var userDetails = resultObj[0];
		util.log("Found user >" + fooFunc(userDetails) + "<"); 
		
		// store newly generated token
		var dbVerificationToken = userDetails["verificationToken"];
		util.log("verificationToken is >" + dbVerificationToken + "<");
		if(req.params["verificationToken"] == dbVerificationToken) {
			DBHandler.updateEntity({
				entity : clLib.server.usersCollectionName,
				id : userDetails["_id"],
				data : {
					"verificationToken": "",
					"password": req.params["password"]
				},
			}
			, function(resultObj) {
				util.log("Token updated, password stored at >" + resultObj.data["_updatedAt"] + "<");
				
				// send token to user..
				util.log("Sending email..");

				
				userDetails["newPassword"] = req.params["password"];
				var options = {
					"template": {
						name: "passwordChanged",
						vars: userDetails
					},
					"to": userDetails["email"]
				}
				mailHandler.send(
					{"emailOptions" : options}, 
				function(responseObj) {
					util.log("email sent!!! " + JSON.stringify(responseObj));
					res.send("email sent >" + JSON.stringify(responseObj) + "<");
				}
				,errHandler
				);
			}
			, errHandler
			);
		} else {
			res.send("tokens: >" + req.params["verificationToken"] + "< and >" + dbVerificationToken+ 	 "< do not match!");
		}
	}
	,errHandler
	);
});
	
server.get('/stats', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	util.log("2getting.." + JSON.stringify(req.params));


	statsHandler.getRouteLogScoreStats({
		datePortionFunc : statsHandler.ISODayPortion
		//datePortionFunc : statsHandler.ISOMonthPortion
		//datePortionFunc : statsHandler.ISODayHourPortion
		//datePortionFunc : statsHandler.ISOHourPortion
	}
	, function(resultObj) {
		util.log("2retrieved result:");
		util.log(">" + JSON.stringify(resultObj) + "<");
		for (var i = 0; i < resultObj.length; i++) {
			util.log(JSON.stringify(resultObj[i]));
		}
		util.log("sending response..");
		res.send(JSON.stringify(resultObj));
	}
	, errHandler
	);


});


clLib.server.generateRandomToken = function() {
	var tokenBase = ("" + Date.now());
	var token = tokenBase.substring(tokenBase.length-5, tokenBase.length);
	return token;
};

// send emails as per emailParams
server.get('/sendmail', function(emailParams, res) {
	util.log("sending gmail..");
	var mailHandler = new mailResource.mail() ;
	mailHandler.send(emailParams);

	util.log("sent mail..");

	res = ["sent mail to >" + emailParams["to"] + "<"];

});

//DEFINE THE URIs THE SERVER IS RESPONDING TO
server.get('/events', function(req, res) {
	util.log("GET request:" + fooFunc(req.params));
	var events = new eventsResource.Events() ;
   
	//Get all events from DB
	events.getAllEvents(req.params, function(result){
     
    var allEvents = result;
 
    //If no events exist return 200 and and empty JSON
    if(allEvents.length == 0) {
		res.send(200, []);
		return;
    }else res.send(200, result);
  });   
 
});


