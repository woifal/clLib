util = require("util");
var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');
var mailResource = require("./clMail.gmail.js");
var mailHandler = new mailResource.mail();

mailHandler.send(
{
	emailOptions: {
		//from: "support@kurt-climbing.com"
		//,
		template: {
			name: "initialEmail"
			,vars: {
				username: "wolfgang.dietersdorfer@drei.com"
				,initialToken: "12345"
			}
		}
		//,to: "wolfgang.dietersdorfer@drei.com"
	}
},
function(respObj) {
	util.log("Mail sent >" + JSON.stringify(respObj) + "<");
},
function(errObj) {
	util.log("MAIL ERROR >" + JSON.stringify(errObj) + "<");
}
);
