var util = require("util");

var clLib = {};

//require("../../clLib/js/clLib.js");
//require("../../clLib/js/clLib.REST.js");


clLib.server = {};
clLib.server.email = {};

//Define the port to listen to
var PORT = process.env.PORT || 1983;
//Include retify.js framework
var restify = require('restify');
var http = require('http');
 
var options = {
  serverName: 'My server',
  accept: [ 'application/json' ]
}
 
//Create the server
var server = restify.createServer(options);
 

 
//Use bodyParser to read the body of incoming requests
server.use(restify.bodyParser({ mapParams: true }));


server.use(restify.fullResponse());
server.use(restify.fullResponse());
function unknownMethodHandler(req, res) {
	if (req.method.toLowerCase() === 'options') {
		console.log('received an options method request');
		var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', "content-type,x-appery-database-id");
		res.header('Access-Control-Allow-Methods', res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);
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

util.log("listening "+PORT);
 

 
 //IMPORT RESOURCES
var eventsResource = require('./events');
var mailResource = require("./clMail.gmail");
//var DBResource = require("./clLib.server.db.apperyREST.js");
var DBResource = require("./clLib.server.db.mongolab.js");
var DBHandler = new DBResource.DBHandler();
var mailHandler = new mailResource.mail();

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



server.get('/requestVerification', function(req, res) {
	util.log("getting.." + JSON.stringify(req.params));
	var resText = [];
	var resCount = 0;
	// verify user.
	DBHandler.getEntities({
		entity : "users", 
		where : {"username": req.params["username"]}, 
		responseStream : res,
		onSuccess : function(resultObj, responseStream) { 
			// upon success...
			var userDetails = resultObj.data[0];
			util.log("Found user >" + fooFunc(userDetails) + "<"); 
			
			// User not found=
			if(!userDetails) {
				responseStream.send(500, JSON.stringify({
				result: "User not found: >" + req.params["username"] + "<"}));
			}

			
			// store newly generated token
			var verificationToken = clLib.server.generateRandomToken();
			DBHandler.updateEntity({
				entity : "users",
				id : userDetails["_id"],
				data : {"username": req.params["username"], "verificationToken": verificationToken},
				responseStream : res,
				onSuccess : function(resultObj, responseStream) {
					util.log("Token >" + verificationToken + "< stored at >" + resultObj.data["_updatedAt"] + "<");
					
					userDetails["verificationToken"] = verificationToken;
					// send token to user..
					util.log("Sending email..");
					var options = {
						"template": {
							name: "verificationEmail",
							vars: userDetails
						},
						"to": userDetails["email"],
//						"subject": "token test...",
//						"body": "your token is >" + verificationToken + "<"
					}
					
					mailHandler.send({
						emailOptions : options, 
						onSuccess : function(mailRespMsg) {
							responseStream.send(JSON.stringify({
								result: "email sent:" + mailRespMsg
							}));
						},
						onError : function(mailRespMsg) {
							responseStream.send(500, JSON.stringify({
								result: "email sent:" + mailRespMsg
							}));
						}
					});
				}
			});
		}
	});
});
	

	
server.get('/setPassword', function(req, res) {
	// verify user.
	DBHandler.getEntities({
		entity : "users", 
		where : {"username": req.params["username"]}, 
		responseStream: res,
		onSuccess : function(resultObj, responseStream) { 
		// upon success...
			var userDetails = resultObj.data[0];
			util.log("Found user >" + fooFunc(userDetails) + "<"); 
			
			// store newly generated token
			var dbVerificationToken = userDetails["verificationToken"];
			util.log("verificationToken is >" + dbVerificationToken + "<");
			if(req.params["verificationToken"] == dbVerificationToken) {
				DBHandler.updateEntity({
					entity : "users",
					id : userDetails["_id"],
					data : {
						"verificationToken": "",
						"password": req.params["password"]
					},
					responseStream : res,
					onSuccess : function(resultObj, responseStream) {
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
						mailHandler.send({
							emailOptions : options, 
							onSuccess : function(mailRespMsg) {
								responseStream.send(JSON.stringify({
									result: "email sent:" + mailRespMsg
								}));
							},
							onError : function(mailRespMsg) {
								responseStream.send(500, JSON.stringify({
									result: "email sent:" + mailRespMsg
								}));
							}
						});
		
					}
				});
			} else {
				responseStream.send("tokens: >" + req.params["verificationToken"] + "< and >" + dbVerificationToken+ 	 "< do not match!");
			}
		}
	});
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


