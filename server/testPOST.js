var https = require('https');
var util = require("util");
var executeRequest = function(host, path, method, params) {
	var httpOptions = {
		"Content-Type": 'application/json'
		,host: host
		,port: '443'
		,path: path
		,method: method
		,headers: {
			"X-Appery-Database-Id" : "52093c91e4b04c2d0a027d7f",
			"X-Appery-Session-Token": "5150855a-377c-4ac5-83a7-3e701a0a229f",
			"Content-Type": 'application/json'
		}
	};
	var req = https.request(httpOptions, function(res) {
		util.log("statusCode: " + res.statusCode);
		res.on('data', function(d) {
			util.log("received data:" + d);
		});
	});

	req.on('error', function(errorObj) {
		util.log("error:" + errorObj);
	});

	req.write(JSON.stringify(params)); //, "utf-8");
	req.end();
};

executeRequest("api.appery.io", "/rest/1/db/users", "POST", {username: "foo", password : "bar"});