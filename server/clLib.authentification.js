
"use strict";

var util = require("util");
var URL = require('url');
var querystring = require('querystring');

var https = require('https');
var clCrypto = require("pwd");
var DBResource = require("./clLib.server.db.mongolab");
var serverResource = require("./server").server;
var DBHandler = new DBResource.DBHandler();

function auth(){};
exports.auth = auth;

var usersCollName = "Users";


var RESTServerURL;
RESTServerURL = "http://cllibserver.herokuapp.com";
//RESTServerURL = "http://localhost:1983";

var HTMLServerURL;
HTMLServerURL = "http://www.kurt-climbing.com";


/* 
*   Google OAuth2 objects.. 
*/  
var gApi = require('googleapis');
var gOAuth2 = gApi.auth.OAuth2;
var gCLIENT_ID = "366201815473-t9u61cghvmf36kh0dgtenahgitvsuea8.apps.googleusercontent.com";
var gCLIENT_SECRET = "vwccCUw-n8ufYFQYom9FIrX7";
var gREDIRECT_URL = RESTServerURL + "/verifyOAuth2Code";
var gOAuth2Client = new gOAuth2(gCLIENT_ID, gCLIENT_SECRET, gREDIRECT_URL);
// generates a url that allows offline access and asks permissions for Google+ scope.
var gScopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];


var fbOAuth2Client = {
    CLIENT_ID : "670107013062528"
    ,CLIENT_SECRET : "57c6d062add4e475d125cdf1b742b98d"
    ,REDIRECT_URL : RESTServerURL + "/verifyOAuth2Code"
    ,scopes : [
        "public_profile"
		,"user_friends"
        ,"email"
    ]
    ,generateAuthUrl : function() {
        var url = "";
        url += "https://www.facebook.com/dialog/oauth?";
        url += "client_id=" + this.CLIENT_ID;
        url += "&redirect_uri=" + this.REDIRECT_URL;
        url += "&response_type=" + "code";
        url += "&scope=" + this.scopes.join(',');
        return url;
    }
    ,getToken : function(code, callbackFunc) {
        var url = "";
        url += "https://graph.facebook.com/oauth/access_token?";
        url += "client_id=" + this.CLIENT_ID;
        url += "&redirect_uri=" + this.REDIRECT_URL;
        url += "&client_secret=" + this.CLIENT_SECRET;
        url += "&code=" + code;

        var xauth;
		util.log("xauthing..");
		xauth = new exports.auth();
		util.log("xauth2 is " + typeof(xauth));

		return xauth.REST.executeRequest(url, "GET", "" 
        ,function(resultObj) {
            return callbackFunc(null, resultObj);
        }
        ,function(errorObj) { 
            return callbackFunc(errorObj, null);
        });
    }
    ,getGraphInfo : function(path, access_token, callbackFunc, errorFunc) {
        var url = "";
        url += "https://graph.facebook.com" + path + "?";
        url += "access_token=" + access_token;

        var xauth;
		util.log("xauthing..");
		xauth = new exports.auth();
		util.log("xauth2 is " + typeof(xauth));

        return xauth.REST.executeRequest(url, "GET", "", callbackFunc, errorFunc);
    }
    ,getPictureInfo : function(path, access_token, callbackFunc, errorFunc) {
        var url = "";
        url += "https://graph.facebook.com" + path + "?";
        url += "access_token=" + access_token + "&redirect=0";

        var xauth;
		util.log("xauthing..");
		xauth = new exports.auth();
		util.log("xauth2 is " + typeof(xauth));

        return xauth.REST.executeRequest(url, "GET", "", callbackFunc, errorFunc);
    }
};




// Initialize runtime user token collection..
auth.prototype.userToken = {};

auth.prototype.hash = function(password, salt, callbackFunc, errorFunc) {
	util.log("hashing...");
	//callbackFunc(password);
	clCrypto.hash(password, salt, function(err, hash) {
		util.log("HASHED" + err + "," + hash);
		if(err) return errorFunc(err);
		callbackFunc(hash);
	});
}

auth.prototype.generateAuthURL = function(authObj) {
    var url;
    if(authObj["authType"] == "google") {
        //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        url = gOAuth2Client.generateAuthUrl({
            access_type: 'offline'
            ,scope: gScopes.join(" ") // space delimited string of scopes
        });
    } 
    else if(authObj["authType"] == "facebook") {
        url = fbOAuth2Client.generateAuthUrl();
    }
    else {
        url = HTMLServerURL;
    }
    return url;
}

auth.prototype.verifyOAuth2Code = function(code, req, res) {
    var stateParams = JSON.parse(req.params.state);
    if(stateParams.authType == "facebook") {
        return fbOAuth2Client.getToken(
            code,
            function(err, resultObj) {
                util.log("fb err >" + JSON.stringify(err) + "<");
                util.log("fb data >" + JSON.stringify(resultObj) + "<");

				var x = querystring.parse(resultObj.strData + "");
				util.log("x is " + JSON.stringify(x));
				var access_token = x.access_token;
				
                return fbOAuth2Client.getGraphInfo("/me", access_token, function(graphInfoObj) {
					var userObj = {};
					userObj = JSON.parse(graphInfoObj["strData"]);
					
					util.log("fb user >" + JSON.stringify(userObj) + "<");
                    
                    userObj["accessToken"] = access_token;
                    userObj["authType"] = "facebook";

                    util.log("fb user(incl. tokens) >" + JSON.stringify(userObj) + "<");

					return fbOAuth2Client.getPictureInfo("/me/picture", access_token, function(pictureInfoObj) {
						var pictureObj = {};
						var pictureObjData = {};
						pictureObj = JSON.parse(pictureInfoObj["strData"]);
						pictureObjData = pictureObj["data"];
						util.log("fb picturr >" + JSON.stringify(pictureObj) + "<");
						util.log("fb picturr data>" + JSON.stringify(pictureObjData) + "<");
                    
						userObj["image"] = {};
						userObj["image"]["url"] = pictureObjData["url"];

						util.log("222222222fb user(incl. tokens) >" + JSON.stringify(userObj) + "<");
                    
						var redirectURL = stateParams["clLib.redirectURL"];
						util.log("redirecting to >" + redirectURL);
						// redirect back to clLib app 
						res.header('Location', redirectURL + "?authObj=" + encodeURI(JSON.stringify(userObj)));
						res.send(302); 
                    
					}, function(e) {
						throw new Error("FACEBOOKERROR OF TYPE "  + e["name"] + " IS " + e["message"] + ": " + JSON.stringify(e) + " !!!"); 
					});
                }, function(e) {
				    throw new Error("FACEBOOKERROR OF TYPE "  + e["name"] + " IS " + e["message"] + ": " + JSON.stringify(e) + " !!!"); 
				});
            }
        );
    }
    else if(stateParams.authType == "google") {
        return gOAuth2Client.getToken(
            code, 
            function(err, tokens) {
                // contains an access_token and optionally a refresh_token.
                // save them permanently.
                util.log("got errors >" + JSON.stringify(err ) + "<");
                util.log("got params >" + JSON.stringify(Object.keys(tokens)) + "<");
                util.log("got tokens >" + JSON.stringify(tokens) + "<");
                util.log("got STATE params >" + JSON.stringify(stateParams) + "<");
                util.log("got STATE param keys >" + JSON.stringify(Object.keys(stateParams)) + "<");
                
                
                // Retrieve tokens via token exchange explaind above.
                // Or you can set them.
                gOAuth2Client.credentials = {
                  access_token: tokens.access_token,
                  refresh_token: tokens.refresh_token
                };

                util.log(">>>>" + JSON.stringify(gApi) + "<<<<<");

                // Verify token by trying to retrieve profile information..
                var plus = gApi.plus('v1');
                return plus.people.get({ userId: 'me', auth: gOAuth2Client }, function(err, user) {
                    util.log("google+ err >" + JSON.stringify(err) + "<");
                    util.log("google+ user >" + JSON.stringify(user) + "<");
                   
                    user["accessToken"] = tokens.access_token;
                    user["refreshToken"] = tokens.refresh_token;
                    user["authType"] = "google";

                    util.log("google+ user(incl. tokens) >" + JSON.stringify(user) + "<");
                    
                    delete(user["kind"]);
                    
                    var redirectURL = stateParams["clLib.redirectURL"];
                    util.log("redirecting to >" + redirectURL);
                    //a
                    // redirect back to clLib app 
//                            res.header('Location', HTMLServerURL + "/dist/index.html?authObj=" + encodeURI(JSON.stringify(user)));
                    res.header('Location', redirectURL + "?authObj=" + encodeURI(JSON.stringify(user)));
                    res.send(302); 
                })
                ;

                
            }
        );
    }
};

auth.prototype.requiredAuthentication = function(req, res, next) {
	util.log("req" + JSON.stringify(Object.keys(req)));
	util.log("header.." + JSON.stringify(req.headers));

	//var username = req.params.username;
	var userId = req.headers["clUserId"];
	var sessionId  = req.headers["clSessionToken"];
    
    
    
    
    
    
    
    /*
    *
    *    ??????????????????
    */
    var mySessionId = authHandler.checkUser(userId)["sessionId"];
    
    
    
    
    
    
	
    if(!(sessionId == mySessionId)) {
        res.send(500, JSON.stringify({
            result: "Request session id >" + sessionId + "< is not known"
        }));
    }
    else {
        // verify is session/accestoke is still valid..
        

        util.log("sessionToken >" + sessionId + "<for user >" + userId + "< is OK!");
        next();
    }

}

var $ = {};
$.extend = function(options, addOptions) {
    addOptions = addOptions || {};
    for(var aKey in Object.keys(addOptions)) { var aKey2 = Object.keys(addOptions)[aKey];
        //console.log("key" + aKey2); 
        options[aKey2] = addOptions[aKey2];
    };
    //console.log("options is >" + JSON.stringify(options) + "<");
    return options;
}

/*
*       MAIN AUTHENTIFICATION FUNCTION!!
*
*       Verify login info against the one stored on this server.
*
*/
auth.prototype.validateUser = function(userObj, callbackFunc, errorFunc, addOptions) {
    util.log("getUser getting user >" + JSON.stringify(userObj) + "<");
    var authHandler = this;
    var options = {
        create : true
    };
    $.extend(options, addOptions);
    util.log("options is >" + JSON.stringify(options) + "<");
    
    return DBHandler.getEntities({
        entity : usersCollName, 
        where : {"username": userObj["username"]},
        requireResult: false
    }
    ,function(resultObj) { 
        // upon success...
        var userDetails = resultObj[0];
        util.log("Found user >" + JSON.stringify(resultObj) + "<"); 
    
        // User not found=
        if(!userDetails) {
            return errorFunc("User not found>" + JSON.stringify(userObj) + "<");
        }
        else {
            util.log("found user..");
            // user was authenticated on client(google, facebook, ...)? 
            // save sessionToken to verify against in subsequent request..
            if(userObj.authType == "google" || userObj.authType == "facebook") {
                util.log("users is " + JSON.stringify(userObj));
                
                return authHandler.verifyAccessToken(userObj, function(newUserObj) {
                    util.log("ORIG USEROBJ >" + JSON.stringify(userObj) + "<");
                    util.log("GOOGLE USEROBJ >" + JSON.stringify(newUserObj) + "<");
                    newUserObj["sessionToken"] = userObj["accessToken"];
                    newUserObj["_id"] = newUserObj["id"];
                    newUserObj = $.extend(newUserObj, userObj);
                    util.log("\n\n\n\n COMBINED USEROBJ >" + JSON.stringify(newUserObj) + "<\n\n\n\n ");
                    return authHandler.addUser(
                        newUserObj
                        ,callbackFunc
                        ,errorFunc
                    );
                }
                , errorFunc
                );
            }
            // username/pwd kurtl authentication
            else {
                return authHandler.verifyPassword(userDetails, userObj, function(newUserObj) {
                    newUserObj["sessionToken"] = newUserObj["sessionToken"];
                    var hashedPassword = newUserObj["password"];
                    newUserObj = $.extend(newUserObj, userObj);
                    newUserObj["plainPwd"] = userObj["plainPwd"];
                    newUserObj["password"] = hashedPassword;
                    
                    util.log("newUserObj for KURTL authentification..");
                    util.log(JSON.stringify(newUserObj));
                    return authHandler.addUser(
                        newUserObj
                        ,callbackFunc
                        ,errorFunc
                    );
                }
                , errorFunc
                );
            }
        }
    }
    ,errorFunc
    );
};

/*
*   Verify password against username for KURTL authentifications..
*/
auth.prototype.verifyPassword = function(userObj, authObj, callbackFunc, errorFunc) {
    var authHandler = this;

    util.log("VERIFIYING PASSWORD FOR >" + JSON.stringify(userObj) + "< and >" + JSON.stringify(authObj) + "<");
    var userName = userObj.username;
    var password = authObj["password"];
    var meMyselfAndI = this;
    
    if(!userName || userName == "") {
        return errorFunc("username is missing..");
    }

    util.log("!!!!!! Found user >" + JSON.stringify(userObj) + "<"); 

    //util.log(JSON.stringify(this));
    
    var realPwd = userObj["password"];
    
    function checkPassword(givenPwd, realPwd, callbackFunc, errorFunc) {
        util.log("comparing " + givenPwd + " and " + realPwd);
        // Password hashes match?
        if (givenPwd == realPwd) {
            util.log("passwords match!");
            var sessionToken = serverResource.generateRandomToken();
            // indicate in session that user was authenticated..
            userObj["sessionToken"] = sessionToken;
            return callbackFunc(userObj);     
        }
        // no, they don't..
        util.log('non-matching passwords..');
        //errorFunc("asdfasfd");
        return errorFunc(new Error('invalid password'));
    };

    util.log("plainPwd >" + authObj["plainPwd"] + "<, >" + (authObj["plainPwd"] != true) + "<");
    if(authObj["plainPwd"] == "true") {
        util.log("password is PLAIN! need to hash it..");
        return meMyselfAndI.hash(password, userName, 
        function (hash) {
            util.log("hash for password >" + password + "< is >" + hash + "<");
            return checkPassword(hash, realPwd, callbackFunc, errorFunc);
        },
        function(err) {
            util.log('could not generate hash for password..');
            return errorFunc(new Error('could not generate hash for password..'));
        }
        );
    } else {
        util.log("password is HASHED! use it..");
        return checkPassword(password, realPwd, callbackFunc, errorFunc);
    }
};


/*
* Adds newly authenticated user to server runtime collection..
*/
auth.prototype.addUser = function(userObj, callbackFunc, errorFunc) {
    var authHandler = this;
    
    userObj["LOGON_TIME"] = new Date();

    // Check for last known websocket id..
    if(clLib.server.runtime["connectedUsers"][userObj["_id"]]) {
        if(clLib.server.runtime["connectedUsers"][userObj["_id"]]["socketId"]) {
            userObj["socketId"] = clLib.server.runtime["connectedUsers"][userObj["_id"]]["socketId"];
        }
    }

    
    // Add user info to collection of currently authenticated users 
    clLib.server.runtime["connectedUsers"][userObj["_id"]] = userObj;

    return callbackFunc(userObj);
};

/*
*   Verify access token for OAUTH2 authentifications..
*/
auth.prototype.verifyAccessToken = function(userObj, callbackFunc, errorFunc) {
    if(userObj.authType == "google") {
        // Retrieve tokens via token exchange explaind above.
        // Or you can set them.
        gOAuth2Client.credentials = {
          access_token: userObj["accessToken"]
        };

        util.log("---------------> verifying accesstoken >" + userObj["accessToken"] + "<");
        // Verify token by trying to retrieve profile information..
        var plus = gApi.plus('v1');
        return plus.people.get({ userId: 'me', auth: gOAuth2Client }, function(err, response) {
            // handle err and response
            util.log("err >" + err + "<,>" + JSON.stringify(response) + "<");
            if(err) {
                return errorFunc(err);
            }
            return callbackFunc(response);
        });
    }
    else if(userObj.authType == "facebook") {
        return callbackFunc(userObj);
    }
    else {
        return callbackFunc(userObj);
    }
        

};


auth.prototype.authenticate = function(authObj, callbackFunc, errorFunc) {
    var authHandler = this;
	util.log('authenticating >' + JSON.stringify(authObj) + "<");
    return this.validateUser(authObj, callbackFunc, errorFunc);
};

auth.prototype.defaults = {
	"foo" : "vla",
	"errorFunc" : function(resultObj) {
		util.log("standard errorFunc: " + JSON.stringify(resultObj));
		//responseStream.send(500, new Error(JSON.stringify(resultObj)));
	}
};



auth.prototype.REST = {};
auth.prototype.REST.executeRequest = function(uri, method, params, callbackFunc, errorFunc) {
	var reqOptions = {};
	reqOptions["params"] =  params;

	var resultObj = {};
	
	if(!errorFunc) {
		errorFunc = this.defaults["errorFunc"];
	}

	var URLObj = URL.parse(uri);
	reqOptions["host"] = URLObj.host;
	reqOptions["path"] = URLObj.path;

	reqOptions["params"] =  params;

	var prepareFunc;
	if(method == "GET") {
		prepareFunc = this.prepareGETRequest;
	} else if(method == "POST") {
		prepareFunc = this.preparePOSTRequest;
	} else if(method == "PUT") {
		prepareFunc = this.preparePOSTRequest;
	}
	prepareFunc(reqOptions);
	
	reqOptions.host = reqOptions.host;
	reqOptions.port = '443';
	reqOptions.path = reqOptions.path;
	reqOptions.method = reqOptions.method;
	reqOptions.headers = reqOptions.httpHeaders;

	util.log("reqOptions: " + JSON.stringify(reqOptions));
	
	// Set up the request */
	var req = https.request(reqOptions, 
    function(res) {
		var statusCode = res.statusCode;
		util.log("checking response with status " + statusCode);
		util.log("response keys:" + JSON.stringify(Object.keys(res)));
		
		//res.setEncoding('utf8');
		res.on('data', function(d) {
//			try {
				resultObj["statusCode"] = statusCode;
				util.log('result received(' + statusCode + ').');
				util.log('data received:' + d);
				//process.stdout.write(d);
				resultObj["strData"] = d;
				util.log("parsed result: " + Object.keys(resultObj));
				
				if(statusCode == 200) {
					return callbackFunc(resultObj);
				} else {
                    return errorFunc(resultObj);
				}
//			} catch(e) { throw new Error("ERROR OF TYPE "  + e.name + " IS " + e.message + " !!!"); };
		
		});
	});

	req.on('error', function(errorObj) {
		return errorFunc(errorObj);
	});
	
	if(method != "GET") {
		util.log("writing to request: >" + reqOptions.postData + "<");
		util.log("Content-length: >" + contentLength + "," + Buffer.byteLength(reqOptions.postData) + "<");
		req.write(reqOptions.postData); //, "utf-8");
	}
	
	req.end();
};


auth.prototype.REST.prepareGETRequest = function(options) {
	util.log("OLD path >" + JSON.stringify(options.path) + "<");
	//options.path += "?" + options.params;
	util.log("NEW path >" + JSON.stringify(options.path) + "<");
}
	
auth.prototype.REST.preparePOSTRequest = function(options) {
	options.postData = JSON.stringify(options.params);
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


