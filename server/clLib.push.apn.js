"use strict";
require("./clLib");

var util = require("util");
var apn = require('apn');

var mongo = require('mongoskin');
var BSON = mongo.BSONPure;

function clPushApn(){};
exports.clPushApn = clPushApn;

 //IMPORT RESOURCES
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();

clPushApn.prototype = {
    connected: false
    ,apnsConnection : null
    ,options : {
        connect: {
            gateway: 'gateway.sandbox.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
            errorCallback: function(errorNum, notification){
                if(errorNum) {
                    this.connected = false;
                }
                util.log("Error is: >" + errorNum + "<");
                util.log("Note " + notification);
            }
            ,key:  'appCertificates/PushChatKey.pem'
            ,cert: 'appCertificates/PushChatCert.pem'
            ,passphrase: 'kurt12345'
            ,port: 2195
            ,enhanced: true
            ,cacheLength: 100                 
        }
    }
    ,devices: {
    }
    ,connect: function() {
        this.apnsConnection = new apn.Connection(this.options.connect);
        this.connected = true;
    }
    ,getDevice: function(deviceId) {
        if(!this.devices[deviceId]) {
            this.devices[deviceId] = new apn.Device(deviceId);
        }
        return this.devices[deviceId];
    }
    ,push: function(options, successFunc, errorFunc) {
        try {
            util.log("msgText is >" + options["msgText"] + "<");

            if(!this.connected) {
                return errorFunc("APN is not connected.");
            }
            
            var myDevice = this.getDevice(options["deviceId"]);
             
            var note = new apn.Notification();
            note.badge = 1;
            if(options["soundFlag"] == 1) {
                util.log("yes,sound.");
                note.sound = "notification-beep.wav";
            }
            if(options["alertFlag"] == 1) {
                util.log("yes,alert.");
                note.alert = { "body" : "message is: >" +options["msgText"] + "<", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
            }
            note.payload = {'kurtMessage': options["msgText"]};
            note.device = myDevice;
        
            this.apnsConnection.sendNotification(note);
            return successFunc({"messageStatus": "sent"});
        } catch(e) {
            util.log("Error while sending apn message...");
            return errorFunc(e);
        }
    } 
};    
    
    
    