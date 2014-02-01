var gmailsResource = require('./clMail.gmail');

//Events object
function Events(){};
//exported through exports.Events
exports.Events = Events;
 
//GET ALL EVENTS!
Events.prototype.getAllEvents = function(emailParams, callback){
   var allEvents = []; 

		console.log("sending gmail..");
		console.log("gmail: " + JSON.stringify(gmailsResource));
		var gmails = new gmailsResource.mail() ;
	
		gmails.send(emailParams);
		console.log("sent gmail..");
		callback(["sent mail to >" + emailParams["to"] + "<"]);
}