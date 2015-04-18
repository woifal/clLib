var http = require('http');
var apn = require('apn');
var url = require('url');
var util = require('util');
 
var args = process.argv.splice(2);
var deviceId = args[0];
var msgText  = args[1];
var alertFlag = args[2];
var soundFlag = args[3];

util.log("msgText is >" + msgText + "<");

var myDevice = new apn.Device(deviceId);
 
var note = new apn.Notification();
note.badge = 1;
if(soundFlag == 1) {
    util.log("yes,sound.");
    note.sound = "notification-beep.wav";
}
if(alertFlag == 1) {
    util.log("yes,alert.");
    note.alert = { "body" : "message is: >" +msgText + "<", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
}
note.payload = {'kurtMessage': msgText};
note.device = myDevice;
 
var callback = function(errorNum, notification){
    util.log('Error is: %s', errorNum);
    util.log("Note " + notification);
}
var options = {
    gateway: 'gateway.sandbox.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
    errorCallback: callback,
    key:  '../APPLE_STUFF/PushChatKey.pem',
    cert: '../APPLE_STUFF/PushChatCert.pem',
    passphrase: 'kurt12345',                
    port: 2195,                      
    enhanced: true,                  
    cacheLength: 100                 
}
var apnsConnection = new apn.Connection(options);

apnsConnection.sendNotification(note);
//process.exit(1);