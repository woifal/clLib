var util = require("util");

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

/*
*
* Global client/server shared .js files..
* Object shared in global scope is "clLib".
*
*/
require("./clLib");
require("./clLib.gradeConfig");

util.log("\n\n>>>>>>" + JSON.stringify(clLib.gradeConfig) + "<<<<<<<<<\n\n\n\n");

//clLib = {};
clLib.server = {};
clLib.server.runtime = {
	"sessionTokens" : {}
};
clLib.server.email = {};


//Define the port to listen to
var PORT = process.env.PORT || 1983;
//Include retify.js framework
var restify = require('restify');
var socketIO = require("socket.io");
var http = require('http');
 
var options = {
  serverName: 'My server',
  accept: [ 'application/json' ]
}
 
clLib.server.usersCollectionName = "Users";

clLib.server.defaults = {
	"errorFunc" : function(errorObj, res) {
		util.log("standard errorFunc(" + typeof(errorObj) + "): " + JSON.stringify(errorObj));

		var errorStr = "?";
		if(errorObj instanceof Error) {
			util.log("instance is ERROR obj(" + JSON.stringify(errorObj.toString()) + ")");
			errorStr = errorObj.message;
		} 
		else if(typeof(errorObj) == "string") {
			util.log("instance is string!!");
			errorStr = errorObj;
		}
		else {
			util.log("assume errorObj is object!");
			errorStr = JSON.stringify(errorObj);
		}
		util.log("error is" + errorStr);
		res.send(500, errorStr);
	}
};
 
 
//Create the server
var server = restify.createServer(options);
 

//clLib.server = server;


 
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
        if (res.methods.indexOf('PUT') === -1) res.methods.push('PUT');
        if (res.methods.indexOf('POST') === -1) res.methods.push('POST');
        if (res.methods.indexOf('DELETE') === -1) res.methods.push('DELETE');

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', "content-type,x-appery-database-id,clSessionToken,clUserName,DNT,accept-language,accept,Access-Control-Allow-Origin");
        util.log("header.methods >" + res.methods.join(', ') + "<");
		res.header('Access-Control-Allow-Methods', 	res.methods.join(', '));
        util.log("header.origin >" + req.headers.origin + "<");
        res.header('Access-Control-Allow-Origin', req.headers.origin);
		//res.header('Access-Control-Allow-Origin', "*");
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

exports.server = clLib.server;
exports.socketIO = socketIO;

 //IMPORT RESOURCES
var eventsResource = require('./events');
var mailResource = require("./clMail.gmail");
var authResource = require("./clLib.authentification");
//var DBResource = require("./clLib.server.db.apperyREST.js");
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();
clLib.server.DBHandler = DBHandler;
var mailHandler = new mailResource.mail();
var authHandler = new authResource.auth();

var statsResource = require("./clLib.statistics");
var statsHandler = new statsResource.stats();

var io = socketIO.listen(server.server); //Note server.server instead of just server


var ioSocketResource = require("./clLib.webSockets.js");
var ioSocketHandler = new ioSocketResource.webSockets();

util.log("1");
ioSocketHandler.connect(io);
 


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

	try {
        req.params["username"] = req.params["username"].toLowerCase();
        
        console.log("authHandler.defaults : >" + JSON.stringify(authHandler.defaults) + "<");
		return authHandler.authenticate(
			req.params
			,function(userObj) {
				util.log("AUTHENTICATED!!! " + JSON.stringify(userObj));
                res.header('Access-Control-Allow-Origin', "*");
                return res.send(userObj);
			}
			,errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}
});

server.get("/deleteUser", function (req, res) {
	
	
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
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
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

server.post("/signup", function (req, res) {
	util.log("authHandler.defaults : >" + JSON.stringify(authHandler.defaults) + "<");
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	
	try {
		var userObj = req.body;
	
        // ALL usernames should be lower case!!
        userObj.username = userObj.username.toLowerCase();

        util.log("USEROBJ to insert " + JSON.stringify(userObj));
		var foo = this;
		
		var plainPwd = userObj.password;
		
		return authHandler.hash(userObj.password, userObj.username, 
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
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});



server.get('/requestVerification', function(req, res) {
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
		util.log("getting.." + JSON.stringify(req.params));
		var resText = [];
		var resCount = 0;
		
        // ALL usernames should be lower case!!
        req.params["username"] = req.params["username"].toLowerCase();

        
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
				return;
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
		},
		errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});
	
	

server.get('/db/:entityName/:entityId', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
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
			requireResult: req.params["requireResult"] || true
		},
		function(resultObj) { 
			// upon success...
			var entityDetails = resultObj[0];
			// entity not found=
			if(!entityDetails && (
                options["requireResult"] == true ||
                options["requireResult"] == "true"
            )) {
                util.log("!!!!!!NO RESUTL!!");
				res.send(500, JSON.stringify({
				result: "2Entity(" + entityName + ") not found: >" + JSON.stringify(req.params["where"]) + "<"}));
				return;
			}
            util.log("3 sending result..");
			res.send(JSON.stringify(resultObj));

		}
		, errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});
	
server.get('/db/:entityName', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	
	try {
		util.log("2getting.." + JSON.stringify(req.params));
		var entityName = req.params.entityName;
		// verify user.
		DBHandler.getEntities({
			entity : entityName
			,where : JSON.parse(req.params["where"])
			,geoPos : req.params["geoPos"] ? JSON.parse(req.params["geoPos"]) : null
			,limit: req.params["limit"]
            ,requireResult : req.params["requireResult"] || true
		},
		function(resultObj) { 
			// upon success...
			var entityDetails = resultObj[0];
            util.log("c2 Found entity(" + entityName + ")>" + fooFunc(entityDetails) + "<"); 
			
            util.log("b requireResult? >" + 
                (
                    options["requireResult"] == true ||
                    options["requireResult"] == "true"
                )
            + "<");

			// User not found=
            if(options["requireResult"] && (
                options["requireResult"] == "true" 
                || options["requireResult"] == true
            ) && (!entityDetails || entityDetails.length == 0)) {

				res.send(500, JSON.stringify({
				result: "Entity(" + entityName + ") not found: >" + JSON.stringify(req.params["where"]) + "<"}));
				return;
			}
			res.send(JSON.stringify(resultObj));

		}
		, errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

server.get('/db/distinct/:entityName/:fieldName', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	
	try {
		util.log("2getting.." + JSON.stringify(req.params));
		var entityName = req.params.entityName;
		var fieldName = req.params.fieldName;
		// verify user.
		DBHandler.getDistinct({
			entity : entityName
			,field: fieldName
			,where : JSON.parse(req.params["where"])
			,limit: req.params["limit"]
		},
		function(distinctValues) { 
			// upon success...
			util.log("Found entity(" + entityName + ", " + fieldName + ")>" + fooFunc(distinctValues) + "<"); 
			
			// User not found=
			if(!distinctValues) {
				res.send(500, JSON.stringify({
				result: "Entity(" + entityName + "," + fieldName + ") not found: >" + JSON.stringify(req.params["where"]) + "<"}));
				return;
			}
			res.send(JSON.stringify(distinctValues));

		}
		, errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});


server.put('/db/:entityName/:entityId', 
//		authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
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
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}
	
});

server.post('/db/:entityName', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
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
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

server.get('/verifyToken', function(req, res) {
	var errHandler = function(errorObj) {
		var tmpURL = 
			"http://www.kurt-climbing.com/dist/clLib_users_verification_error_WEB.html?errorMsg=" + JSON.stringify(errorObj); 
		res.header('Location', tmpURL);
		res.send(302); 
	}
	
	
    // ALL usernames should be lower case!!
    req.params["username"] = req.params["username"].toLowerCase();

    
    try {
		// verify user.
		DBHandler.getEntities({
			entity : clLib.server.usersCollectionName, 
			where : {"username": req.params["username"]},
			requireResult : true
		},
		function(resultObj) { 
		// upon success...
			util.log("Found resultObj >" + JSON.stringify(resultObj) + "<"); 
			
			var userDetails = resultObj[0];
			util.log("Found user >" + JSON.stringify(userDetails) + "<"); 
			
			// store newly generated token
			var dbVerificationToken = userDetails["verificationToken"];
			util.log("verificationToken is >" + dbVerificationToken + "<");
			
			if(req.params["verificationToken"] == dbVerificationToken) {
				var tmpURL = 
					"http://www.kurt-climbing.com/dist/clLib_users_verification_WEB.html?username=" + req.params["username"] + 
					"&verificationToken=" + req.params["verificationToken"]; 
				res.header('Location', tmpURL);
				res.send(302); 
			}
			else {
				util.log("invalid token >" + req.params["verificationToken"] + "< != >" + dbVerificationToken + "<");
				return errHandler("invalid token");
			}
		}
		,errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});
	
server.get('/setPassword', function(req, res) {
	var errHandler;
	var IE8Redirect = req.params["IE8Redirect"];
	
	if(IE8Redirect == "1") {
		errHandler = function(errorObj) {
			var tmpURL = 
				"http://www.kurt-climbing.com/dist/clLib_users_verification_error_WEB.html?errorMsg=" + JSON.stringify(errorObj); 
			res.header('Location', tmpURL);
			res.send(302); 
		}
	}
	else {
		errHandler = function(errorObj) {
			return clLib.server.defaults.errorFunc(errorObj, res);
		}
	}
	
	try {
        // ALL usernames should be lower case!!
        req.params["username"] = req.params["username"].toLowerCase();

        // verify user.
		DBHandler.getEntities({
			entity : clLib.server.usersCollectionName, 
			where : {"username": req.params["username"]},
			requireResult : true
		},
		function(resultObj) { 
		// upon success...
			util.log("Found resultObj >" + JSON.stringify(resultObj) + "<"); 
			
			var userDetails = resultObj[0];
			util.log("Found user >" + JSON.stringify(userDetails) + "<"); 
			
			// store newly generated token
			var dbVerificationToken = userDetails["verificationToken"];
			util.log("verificationToken is >" + dbVerificationToken + "<");
			if(req.params["verificationToken"] == dbVerificationToken) {
				return authHandler.hash(req.params["password"], userDetails.username, 
					function(hashpwd) {
						util.log("HASHPWD IS >" + hashpwd + "<");
			
						return DBHandler.updateEntity({
							entity : clLib.server.usersCollectionName,
							id : userDetails["_id"],
							data : {
								"verificationToken": "",
								"password": hashpwd
							},
						}
						, function(resultObj) {
							util.log("Token updated, password stored.");
							
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
								userDetails["password"] = hashpwd;
								util.log("RETURNING " + JSON.stringify(userDetails));
								
								if(IE8Redirect == "1") {
									var tmpURL = 
										"http://www.kurt-climbing.com/dist/clLib_users_verification_thanks_WEB.html"; 
									res.header('Location', tmpURL);
									res.send(302); 								} 
								else {
									res.send(JSON.stringify(userDetails));
								}
							}
							,errHandler
							);
						}
						, errHandler
						);
					}
					, errHandler
				);
			} else {
				return errHandler("tokens: >" + req.params["verificationToken"] + "< and >" + dbVerificationToken+ 	 "< do not match!");
			}
		}
		,errHandler
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});
	
server.get('/stats', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		util.log("ERROR CAUGHT:\n>>>\n" + JSON.stringify(errorObj) + "\n<<<<<\n\n");
        //return clLib.server.defaults.errorFunc(errorObj, res);
	}

//	try {
		
		util.log("2getting.." + JSON.stringify(req.params));
		var options = req.params;
        util.log("got options >" + JSON.stringify(options) + "<");
        
		var whereObj = options["where"] || "{}";
        whereObj = JSON.parse(whereObj);

		whereObj["deleted"] = {"$ne" : 1};
		util.log("§33");
        options["where"] = whereObj;
        
        util.log("2got options >" + JSON.stringify(options) + "<");
        
/*
		statsHandler.getRouteLogScoreStats({
			//datePortionFunc : statsHandler.localDayPortion
            //datePortionFunc : statsHandler.ISODayPortion
			//datePortionFunc : statsHandler.ISOMonthPortion
			//datePortionFunc : statsHandler.ISODayHourPortion
			//datePortionFunc : statsHandler.ISOHourPortion
			where: whereObj
		}
*/
        statsHandler.getEntityStats(
            options
            , function(resultObj) {
                util.log("2retrieved result:" + Object.keys(resultObj).length);
                //util.log(">" + JSON.stringify(resultObj) + "<");
                for (var i = 0; i < resultObj.length; i++) {
                    //util.log(JSON.stringify(resultObj[i]));
                }
                util.log("sending response..");
                res.send(JSON.stringify(resultObj));
            }
            , errHandler
		);
//	} catch(e) {
//		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
//	}


});


clLib.server.generateRandomToken = function() {
	var tokenBase = ("" + Date.now());
	var token = tokenBase.substring(tokenBase.length-5, tokenBase.length);
	return token;
};

// send emails as per emailParams
server.get('/sendmail', function(emailParams, res) {
	try {
		util.log("sending gmail..");
		
		var mailHandler = new mailResource.mail() ;
		mailHandler.send(emailParams);

		util.log("sent mail..");

		res = ["sent mail to >" + emailParams["to"] + "<"];
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

//DEFINE THE URIs THE SERVER IS RESPONDING TO
server.get('/events', function(req, res) {
	try {
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
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}
 
});


	
server.get('/sleep/:seconds', 
		//authHandler.requiredAuthentication, 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

	try {
		util.log("2getting.." + JSON.stringify(req.params));
		var seconds = req.params.seconds;
		setTimeout(function() {
				res.send({"result" : "slept " + seconds + " seconds"});
			}
			, seconds * 1000
		);
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

/* 
* - Generate URL to authenticate via google OAuth2 at
* - Redirect to this url..
*/
server.get('/getOAuth2URL', 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}

    try {
		var authType;
		if(req.params.authType) {
			authType = req.params.authType;
		} else {
			// default to google auth..
			authType = "google";
		}
		var authURL = authHandler.generateAuthURL({
			"authType": authType
		});
		
		
		util.log("-");
		util.log("AUTH URL IS >" + authURL + "<");
		util.log("REDIRECT URL IS >" + req.params.redirectURL + "<");
		util.log("-");
		//res.header('clLib.redirectURL', req.params.redirectURL);
		res.header('Location', authURL + "&state=" + JSON.stringify(req.params));
		res.send(302); 
	} catch(e) {
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

	
server.get('/verifyOAuth2Code', 
		function(req, res) 
{
	var errHandler = function(errorObj) {
		return clLib.server.defaults.errorFunc(errorObj, res);
	}
	try {
		util.log("OAuth2 verifying.." + JSON.stringify(req.params));
		
		return authHandler.verifyOAuth2Code(
			req.params.code
			,req
			,res
		);
	} catch(e) {
		util.log(">>>>> ----------------");
		util.log(e.stack);
		util.log("----------------");
		errHandler(new Error("UNHANDLED SERVER ERROR "  + e.name + " IS " + e.message + " !!!"));
	}

});

