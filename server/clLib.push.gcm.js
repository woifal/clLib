"use strict";
require("./clLib");

var util = require("util");
var gcm = require('node-gcm');

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

function clPushGcm(){};
exports.clPushGcm = clPushGcm;

 //IMPORT RESOURCES
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();

clPushGcm.prototype = {
    connected: false
    ,sender : null
    ,options : {
    }
    ,regristrationIds: {
    }
    ,connect: function() {
        this.sender  = new gcm.Sender('AIzaSyBjasfqinElJrzrPKpMnwhOEXmz11np9Mw');
        this.connected = true;
    }
    ,getRegistrationId: function(deviceId) {
        if(!this.registrationIds[deviceId]) {
            this.registrationIds[deviceId] = new apn.Device(deviceId);
        }
        return this.registrationIds[deviceId];
    }
    ,push: function(options, successFunc, errorFunc) {
        try {
            util.log("msgText is >" + options["msgText"] + "<");

            if(!this.connected) {
                return errorFunc("GCM is not connected.");
            }

            // get user's device id from runtime colleciton of collected users..
            var deviceId = clLib.server.runtime["connectedUsers"][options["_id"]]["deviceId"];

            var myRegistrationId = this.getRegistrationId(deviceId);
            
            var registrationIds = [];
             
            message.addData('title','Kurt push');
            message.addData('message',options["msgText"]);
            message.addData('msgcnt','1');
            message.collapseKey = 'demo';
            message.delayWhileIdle = true;
            message.timeToLive = 3;
             
            // At least one token is required - each app will register a different token
            registrationIds.push(registrationId);
             
            /**
             * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
             */
            return this.sender.send(message, registrationIds, 4, function (result) {
                util.log("message send results >" + JSON.stringify(result) + "<");
                return successFunc({"messageStatus": "sent"});
            });
        } catch(e) {
            util.log("Error while sending gcm message...");
            return errorFunc(e);
        }
    } 
};    
    
    
    