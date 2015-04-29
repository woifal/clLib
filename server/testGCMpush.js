var util = require('util');
 
var args = process.argv.splice(2);
var registrationId = args[0];
var msgText  = args[1];
var alertFlag = args[2];
var soundFlag = args[3];




var gcm = require('node-gcm');



var message = new gcm.Message();
var sender = new gcm.Sender('AIzaSyBjasfqinElJrzrPKpMnwhOEXmz11np9Mw');
var registrationIds = [];
 
message.addData('title','Kurt push');
message.addData('message',msgText);
message.addData('msgcnt','1');
message.collapseKey = 'demo';
message.delayWhileIdle = true;
message.timeToLive = 3;
 
// At least one token is required - each app will register a different token
registrationIds.push(registrationId);
 
/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (result) {
    util.log("message send results >" + JSON.stringify(result) + "<");
});
/** Use the following line if you want to send the message without retries
sender.sendNoRetry(message, registrationIds, function (result) { console.log(result); });
**/