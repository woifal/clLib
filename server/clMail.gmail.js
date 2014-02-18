var util = require("util");

var clLib = {};

var nodemailer = require('nodemailer');
var mailTemplates = require('./clLib.mailTemplates');
clLib.mailTemplates = new mailTemplates.clLib();

console.log("initializing gmail handler..");

function mail(){};
exports.mail = mail;

var fooFunc = function() {
	return "";
};


//mail.prototype.send = function(options, successFunc, errorFunc) {
mail.prototype.send = function(options) {

	// Create a SMTP transport object
	var transport = nodemailer.createTransport("SMTP", {
			service: 'Gmail', // use well known service.
								// If you are using @gmail.com address, then you don't
								// even have to define the service name
			auth: {
				user: "kurtclimbing@gmail.com",
				pass: "blerl1la"
			}
		});

	console.log('SMTP Configured');
	var emailOptions = options["emailOptions"];
	util.log("email options: >" + JSON.stringify(emailOptions) + "<");

	emailOptions = clLib.mailTemplates.processTemplate(emailOptions);
	
	util.log("\n\nNEW emailOptions: >" + JSON.stringify(emailOptions) + "<\n\n");
	var fromAddress = emailOptions["from"];
	var toAddress = emailOptions["to"];
	var ccAddress = emailOptions["cc"];
	var subject = emailOptions["subject"];
	var body = emailOptions["body"];
	console.log("Sending mails >" + JSON.stringify(emailOptions) + "<");

		// Message object
	var message = {
		headers: { 'X-Laziness-level': 1000 },

		from: fromAddress,
		to: toAddress,
		cc: ccAddress,
		subject: subject,
		html: body, 
	/*
			 // An array of attachments
		attachments:[

			// String attachment
			{
				fileName: 'notes.txt',
				contents: 'Some notes about this e-mail',
				contentType: 'text/plain' // optional, would be detected from the filename
			},

			// Binary Buffer attachment
			{
				fileName: 'image.png',
				contents: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
									 '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
									 'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),

				cid: 'note@node' // should be as unique as possible
			},

			// File Stream attachment
			{
				fileName: 'nyan cat ✔.gif',
				filePath: __dirname+"/nyan.gif",
				cid: 'nyan@node' // should be as unique as possible
			}
		]
	*/
	};

	console.log('Sending Mail' + message);
	var msgCopy = message;
	transport.sendMail(message, function(error, response){
		if(error){
			console.log('Error occured');
			console.log(error.message);
			if(options["onError"]) {
				options["onError"](error.message);
			}
			else {
				options["onSuccess"](error.message);
			}
		} else {
			console.log('Message sent successfully!');
			util.log("Msg sent: " + message.to);
			util.log("Msg sent: " + message.cc);
			util.log("Msg sent: " + message.subject);
			util.log("Msg sent: " + message.html);
			util.log("2Msg sent: " + message);
			options["onSuccess"](response);
		}	
		// if you don't want to use this transport object anymore, uncomment following line
		transport.close(); // close the connection pool
	});
		
	
	return message;
};