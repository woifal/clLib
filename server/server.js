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
//server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.queryParser()); 
server.listen(PORT, '0.0.0.0');
util.log("listening "+PORT);
 

 
 //IMPORT RESOURCES
var eventsResource = require('./events');
var mailResource = require("./clMail.gmail");
var RESTResource = require("./clLib.server.REST.js");
var RESTHandler = new RESTResource.serverREST();
var mailHandler = new mailResource.mail();

var adminUserDetails = {};

	
var adminUserObj = {};
adminUserObj["username"] = "clAdmin";
adminUserObj["password"] = "foobar";
var adminDBSession;


adminDBSession = RESTHandler.loginUser(adminUserObj, function(resultObj) {
	RESTHandler.setAdminDBSession(resultObj.data);
	util.log("<----  LOGGED in .........");
},
function(errorObj) {
	util.log("!!!!!! ERROR WHILE LOGGING IN:");
	util.log(JSON.stringify(errorObj));
});


server.get('/requestVerification', function(req, res) {
	var resText = [];
	var resCount = 0;
	// verify user.
	RESTHandler.getEntities(
		"users", 
		{"username": req.params["username"]}, 
		function(resultObj, responseStream) { 
		// upon success...
			var userDetails = resultObj.data[0];
			util.log("Found user >" + JSON.stringify(userDetails) + "<"); 
			
			// store newly generated token
			var verificationToken = clLib.server.generateRandomToken();
			RESTHandler.updateEntity( 
				"users",
				userDetails["_id"],
				//{"verificationToken": verificationToken},
				{"username": req.params["username"], "verificationToken": verificationToken},
				function(resultObj, responseStream) {
					util.log("Token >" + verificationToken + "< stored at >" + resultObj.data["_updatedAt"] + "<");
					
					userDetails["verificationToken"] = verificationToken;
					// send token to user..
					util.log("Sending email..");
					emailOptions = {
						"template": {
							name: "verificationEmail",
							vars: userDetails
						},
						"to": userDetails["email"],
//						"subject": "token test...",
//						"body": "your token is >" + verificationToken + "<"
					}
					mailHandler.send(emailOptions, function(responseStream) {
						responseStream.send(JSON.stringify({
							result: "email sent:"// + JSON.stringify(msgSent)
						}));
					});
					
			
	
				},
				null, 
				res
				
			);
					
		},
		null,
		res
	);
});
	

server.get('/setPassword', function(req, res) {
	// verify user.
	RESTHandler.getEntities(
		"users", 
		{"username": req.params["username"]}, 
		function(resultObj, responseStream) { 
		// upon success...
			var userDetails = resultObj.data[0];
			util.log("Found user >" + JSON.stringify(userDetails) + "<"); 
			
			// store newly generated token
			var dbVerificationToken = userDetails["verificationToken"];
			util.log("verificationToken is >" + dbVerificationToken + "<");
			if(req.params["verificationToken"] == dbVerificationToken) {
				
				RESTHandler.updateEntity( 
					"users",
					userDetails["_id"],
					{
						"verificationToken": "",
						"password": req.params["password"]
					},
					function(resultObj, responseStream) {
						util.log("Token updated, password stored at >" + resultObj.data["_updatedAt"] + "<");
						
						// send token to user..
						util.log("Sending email..");

						
						userDetails["newPassword"] = req.params["password"];
						emailOptions = {
							"template": {
								name: "passwordChanged",
								vars: userDetails
							},
							"to": userDetails["email"]
						}
						mailHandler.send(emailOptions, function(responseStream) {
							responseStream.send(JSON.stringify({
								result: "email sent:"// + JSON.stringify(msgSent)
							}));
						});
		
					},
					null, 
					res
					
				);
			} else {
				responseStream.send("tokens: >" + req.params["verificationToken"] + "< and >" + dbVerificationToken+ 	 "< do not match!");
			}
		},
		null,
		res
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
   util.log("GET request:" + JSON.stringify(req.params));
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


server.get('/test', function(req, res) {
	var verificationToken = clLib.server.generateRandomToken();

	var resText = [];
	var resCount = 0;
	RESTHandler.getEntities(
		"users", 
		{"username": req.params["username"]}, 
		function(resultObj, responseStream) { 
		// upon success...
			var userDetails = resultObj.data;
			util.log(resCount + " callback " + userDetails[0]["_id"] + " saves: " + JSON.stringify(userDetails[0])); //._id);
			resText[resCount++] = "#" + resCount + "-->" + userDetails[0]["_id"];
			util.log("resText is now " + JSON.stringify(resText));
			
			RESTHandler.getEntities(
				"users", 
				{"username": "woifal"}, 
				function(resultObj2) {
				// upon further success
					var userDetails2 = resultObj2.data;
					util.log(resCount + " callback " + userDetails2[0]["_id"] + " saves: " + JSON.stringify(userDetails2[0])); //._id);
					resText[resCount++] = "#" + resCount + "-->" + userDetails2[0]["_id"];
					util.log("resText is now " + JSON.stringify(resText));
					
					responseStream.send("callbackresults: " + JSON.stringify(resText));
					// close callback loop..
				}
			);
		},
		null, // errorHandler
		res
	);
	util.log("Request performed. Waiting for response.");
	
});
