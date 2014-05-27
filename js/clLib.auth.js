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
};

console.log("clLib.auth is >" + JSON.stringify(clLib.auth) + "<");
