var nodemailer = require('nodemailer');

console.log("asdfasf");
function mail(){};
exports.mail = gmail;
mail.prototype.send = function(emailParams) {

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

	var fromAddress = 
		emailParams["from"] || "da kurtl";
	var toAddress = emailParams["to"];
	var ccAddress = 
		emailParams["cc"] || 'wolfgang.dietersdorfer+ccFromKurtl@gmail.com,kurtclimbing+cc@gmail.com';
	var subject = 
		emailParams["subject"] || 'kurtl mail..";
	var body = emailParams["body"] || 
		'<p><b>Kurtl sends emails:</b></p>'+
		'<p>Bald gibts hier einen link zum password reset.</p>' +
		'<p>Derweil - emails sent to: ' + toAddress + " (und " + ccAddress + ')</p>'
	;
	console.log("Sending mails >" + JSON.stringify(emailParams) + "<");

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

	console.log('Sending Mail');
	transport.sendMail(message, function(error){
		if(error){
			console.log('Error occured');
			console.log(error.message);
			return;
		}
		console.log('Message sent successfully!');

		// if you don't want to use this transport object anymore, uncomment following line
		//transport.close(); // close the connection pool
	});
};