"use strict";
clLib.auth = {};

clLib.auth = {
    iam : "here"
    ,login: function(authOptions, successFunc, errorFunc) {
        if(authOptions["authType"] == "google") {
            return googleAuth.checkAuth(
                function(userObj) {
                    console.log("success with >" + JSON.stringify(userObj));
                    clLib.setUserInfo(userObj);
                    return clLib.login(function() {
                        console.log("logged in to " + authOptions["authType"] + "..");
                        return successFunc();
                    }, errorFunc);
                    
                }
                ,errorFunc
            );
        }
        if(authOptions["authType"] == "facebook") {
            return facebookAuth.checkAuth(
                function(userObj) {
                    console.log("success with >" + JSON.stringify(userObj));
                    clLib.setUserInfo(userObj);
                    clLib.login(function() {
                        console.log("logged in to " + authOptions["authType"] + "..");
                        return successFunc();
                    }, errorFunc);
                }
                ,errorFunc
            );
        }
    }
    ,storeAuthObj: function(authObj) {
        clLib.auth.authObj = authObj;
    }
    ,processAuthObj: function(urlAuthObj, successFunc, noLogin) {
        var errorFunc = function(error) {
            alert("error >" + JSON.stringify(error));
        }

        console.log("Getting VALID authObj from URL params >" + urlAuthObj + "<");
        //
        // Strip off trailing "#_=_" in case of redirect from facebook oauth2
        //
        if(urlAuthObj.indexOf("#_=_") > -1) {
            urlAuthObj = urlAuthObj.substring(0, urlAuthObj.indexOf("#_=_"));
        }

        var authObj = JSON.parse(urlAuthObj);
    //    alert("GOT VALID authObj from URL params");
        console.log("authObj:" + JSON.stringify(authObj));
        
        if(authObj) {
            try {
                //alert("authObj found...trying to process OAuth2 results..");
                //alert("authObj found(" + typeof(authObj) + "...trying to process OAuth2 results..");
                console.log("authObj keys: " + Object.keys(authObj));
                console.log("authObj >" + JSON.stringify(authObj) + "<");
        //                console.log("authObj2 >" + JSON.stringify(JSON.parse(decodeURI(authObj))) + "<");
                
                var userObj = {};
                // Override current user info with response from signup callback..

                userObj["authType"] = authObj["authType"];
                userObj["accessToken"] = authObj["accessToken"];
                userObj["sessionToken"] = authObj["sessionToken"] + "xx";
                //alert("checking for displayname..");
                // Google logins
                if(userObj["authType"] == 'google') {
                    userObj["displayName"] = authObj.name.givenName || authObj.displayName;
                    userObj["imageURL"] = authObj.image.url;
                    userObj["username"] = authObj.id;
                    userObj["_id"] = authObj["_id"];
                    userObj["sessionToken"] = userObj["accessToken"];
                } 
                // Facebook logins
                else if(userObj["authType"] == "facebook") {
                    console.error("facebook userObj >" + JSON.stringify(userObj) + "<");
                    userObj["displayName"] = authObj.name;
                    userObj["imageURL"] = authObj.image.url;
                    userObj["username"] = authObj.id;
                    userObj["_id"] = authObj["_id"];
                    userObj["sessionToken"] = userObj["accessToken"];
                    console.error("facebook userObj parsed..");
                } 
                // KURT logins
                else {
                    userObj["name"] = authObj["username"];
                    userObj["displayName"] = authObj["username"];
                    userObj["_id"] = authObj["_id"];
                    userObj["image"] = {};
                    userObj["image"]["url"] = "";
                    userObj["password"] = authObj["password"];
                    userObj["username"] = authObj["username"];
                    
                }
                
                console.log("built userObj of >" + JSON.stringify(userObj) + "<");
                
                clLib.setUserInfo(userObj);
                
        //       alert("userinfo was set..");
                if(!successFunc) {
                    successFunc = function() {
                        clLib.PAGES.changeTo("clLib_startScreen.html");
                    };
                }
                
                if(noLogin) {
                    return successFunc();
                }
                
                return clLib.login(
                    successFunc
                    ,errorFunc
                );
            } catch(e) { alert("ERROR OF TYPE "  + e.name + " IS " + e.message + " !!!"); };
        }
        else {
            alert("something weird happened, proceeding to start screen");
            setTimeout(function() {
                //console.log("changing to startscreen..");
                clLib.PAGES.changeTo("clLib_startScreen.html");
            }
            ,2000);
        }
    }
};

console.log("clLib.auth is >" + JSON.stringify(clLib.auth) + "<");
