"use strict";
require("./clLib");

var util = require("util");

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

function clPush(){};
exports.clPush = clPush;

 //IMPORT RESOURCES
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();

var apnResource = require("./clLib.push.apn");
var apnHandler = new apnResource.clPushApn;

var gcmResource = require("./clLib.push.gcm");
var gcmHandler = new gcmResource.clPushGcm;

var ioSocketResource = require("./clLib.webSockets.js");
var ioSocketHandler = new ioSocketResource.webSockets();


clPush.prototype = {
    connected : false
    ,options : {
    }
    ,connect: function() {
        // Connect APN
        // Connect GCM
        // Connect socket.io
        this.connected = true;
    }
    ,pushNotification: function(options, successFunc, errorFunc) {
        try {
            util.log("userId is >" + options["_id"] + "<");
            util.log("text is >" + options["msgText"] + "<");
            util.log("aaaaname is >" + options["name"] + "<");
    
            util.log(">>>>" + JSON.stringify(clLib.server.runtime["connectedUsers"]) + "<<<");
            util.log("2>>>>" + JSON.stringify(Object.keys(clLib.server.runtime["connectedUsers"])) + "<<<");
            
            // fetch user info from runtime colleciton..
            var runtimeUserObj = clLib.server.runtime["connectedUsers"][options["_id"]];

            util.log("pushType is >" + runtimeUserObj["pushType"] + "<");
            var pushFunc;
            // GCM?
            if(runtimeUserObj["pushType"] == 'GCM') {
                util.log("GCM..");
                pushFunc = gcmHandler.push;
            }
            else if(runtimeUserObj["pushType"] == 'APN') {
                util.log("APN..");
                pushFunc = apnHandler.push;
            }
            else  if(runtimeUserObj["pushType"] == 'webSocket') {
                util.log("socket.io..");
                pushFunc = ioSocketHandler.push;
            }
            else {
                return errorFunc("unknown pushtype >" + runtimeUserObj["pushType"] + "<");
            }
            
            return ioSocketHandler.push(
                options
                ,function(resultObj) {
                    res.send({"result" : JSON.stringify(resultObj)});
                }
                ,errorFunc
            );


            if(!this.connected) {
                return errorFunc("Push module is not connected.");
            }

        } catch(e) {
            util.log("Error while sending push message...");
            util.log("Error while sending push message >" + JSON.stringify(e) + "<, >" + e + "<...");
            return errorFunc(e);
        }
    } 
};    
    
    
    