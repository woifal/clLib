"use strict";
var util = require("util");

function clLib(){};
exports.clLib = clLib;

clLib.mailTemplates = {};
clLib.mailTemplates.verificationURI = "http://somehost/" + "?_id=[userId]&verificationToken=[verificationToken]"

clLib.prototype.mailTemplates = {
	options : {
	}
};
clLib.prototype.options = {
	"template" : {
		"verificationEmail": {
			"to": "kurtl+template+default@gmail.com, [email]"
//			,"cc" : "wolfgang.dietersdorfer+kurtl+templatecc+tokenrequest@gmail.com"
			,"subject" : "Forgot your password on Kurtl? Here is the verification token.."
			,"body" : "You asked to change your password for user <b>[username]</b> at <b>[email]</b>.<br>Here is your verification token: <b>[verificationToken]</b>."
		},
		"passwordChanged": {
			"to": "kurtl+template+default@gmail.com, [email]"
//			,"cc" : "wolfgang.dietersdorfer+templatecc+pwdchanged@gmail.com"
			,"subject" : "New password for Kurtl"
			,"body": "Your new password for <b>[username]</b> at <b>[email]</b> is [newPassword]."
		}
	}
};

clLib.prototype.extend = function(toExtend, extendFrom, templateOptions) {
	console.log("iterating object keys from >" + JSON.stringify(extendFrom) + "<(" + typeof(extendFrom) + ") in >" + JSON.stringify(toExtend) + "<");
	if(!extendFrom) {
		console.log("no - return");
		toExtend = this.replaceTemplateVars(toExtend, templateOptions);
		return;
	}
	util.log("yes -extendFrom is >" + JSON.stringify(extendFrom) + "<, continue..");
	var objKeys = Object.keys(extendFrom);
	
	for(var i = 0; i < objKeys.length; i++) {
		util.log("AAAAAAAAAAAAA");
		var curKey = objKeys[i];
		console.log("checking curKey " + curKey);
		// new array does not contain default's key..
		if(!toExtend[curKey]) {
            console.log("setting " + curKey + " to " + JSON.stringify(extendFrom[curKey]));
    		toExtend[curKey] = extendFrom[curKey];
			toExtend[curKey] = this.replaceTemplateVars(toExtend[curKey], templateOptions);
        } else {
        // new array contains default's key
            console.log("checking >" + curKey + "< for type " + typeof(toExtend[curKey]));
			// need recursion
            if(typeof(toExtend[curKey]) == 'object') {
                console.log("yes, object - recursing >" + toExtend[curKey] + "<,>" + extendFrom[curKey] + "<");
				//toExtend[curKey] = {};
                this.extend(toExtend[curKey], extendFrom[curKey]);
            } else {
			// replace templates in current leaf
				toExtend[curKey] = this.replaceTemplateVars(toExtend[curKey], templateOptions);
			}
		}
		
		util.log("\n\n objKeys is now >" + JSON.stringify(objKeys) + "< (" + objKeys.length + ")\n\n");
	}
	
	util.log("extend finsiehd - toExtend is now >" + JSON.stringify(toExtend) + "<");
};

clLib.prototype.processTemplate = function(options) {
	util.log("replacing >" + JSON.stringify(options) + "<");
	util.log("\n\n\n\nfor template:>" + JSON.stringify(this.options.template[[options["template"]["name"]]]) + "<\n\n\n\n\n");
	this.extend(options, this.options.template[[options["template"]["name"]]], options["template"]);
	util.log("replaced placeholders, result is >" + JSON.stringify(options) + "<");
	return options;
};	
	
clLib.prototype.replaceTemplateVars = function(targetObj, templateOptions) {
	util.log("replacing template vars in >" + JSON.stringify(targetObj) + "< with template options >" + JSON.stringify(templateOptions) + "<");
	if(typeof(targetObj) == "object") {
		util.log("object..");
		var keysToIterate = Object.keys(targetObj);
		for(var i = 0; i < keysToIterate.length; i++) {
			var key = keysToIterate[i];
			return this.replaceTemplateVars(targetObj[key], templateOptions);
		}
	}
	else {
		util.log("string(assuming..)");
		var varNames = Object.keys(templateOptions["vars"]);
		for(var i = 0; i < varNames.length; i++) {
			var key = varNames[i];
			var val = templateOptions["vars"][key];
			util.log("replacing >" + key + "< with >" + val + "<");
			targetObj = targetObj.replace("[" + key + "]", val);
			util.log("targetObj is now >" + JSON.stringify(targetObj) + "<");
		};
	}
	return targetObj;
};

	
	
	/*
var toExtend = {
	a: "an a",
	c: "a c",
	d: {
	   "d1" : "one d lever deeper"
	},
	e: {
	   "e1" : "one e lever deeper"
	}
};

var extendFrom =  {
	a: "another a",
	b: "another b",
	c: "another c",
   	e: {
	   "e1" : "aonther e lever deeper",
	   "e2" : {
	       "another e level deep(obj)" : {
	           "e21" : "another e21!!!!"
	       }
	   }
	},
   	f: {
	   "f1" : "aonther f lever deeper"
	}
};
*/

