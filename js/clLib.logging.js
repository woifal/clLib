


// define a new console
var console=(function(oldCons){
    return {
        log: function(text){
			if(localStorage.getItem("debugOutput") == "true") {
				oldCons.log(text);
			}
        },
        info: function (text) {
			if(localStorage.getItem("debugOutput") == "true") {
				oldCons.info(text);
			}
        },
        warn: function (text) {
			if(localStorage.getItem("debugOutput") == "true") {
				oldCons.warn(text);
			}
        },
        error: function (text) {
			if(localStorage.getItem("debugOutput") == "true") {
				oldCons.error(text);
			}
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;



clLib.origAlert = function(txt) {
	window.alert(txt);
}

clLib.origConsole = {
	log: function(txt) {
		window.console.log(txt);
	}
	,
	info: function(txt) {
		window.console.info(txt);
	}
	,
	error: function(txt) {
		window.console.error(txt);
	}
};

console = {
	log: function(txt) {
		if(localStorage.getItem("debugOutput") == "true") {
			clLib.origConsole.log(txt);
		}
	}
	,info: function(text) {
		if(localStorage.getItem("debugOutput") == "true") {
			clLib.origConsole.info(txt);
		}
	}
	,error: function(text) {
		if(localStorage.getItem("debugOutput") == "true") {
			clLib.origConsole.error(txt);
		}
	}
};

if(typeof(alert) !== 'undefined') {
	alert = function(text) {
		if(localStorage.getItem("debugOutput") == "true") {
			clLib.origConsole.error(txt);
		}
	};
} else {
	var alert = function(text) {};
}



/*
*	Setup logging/debugging options..
*/
if(!localStorage.getItem("debugOutput") == "true") {
	try {
	} catch(e) {
		console.log("could not override console...wtf..");
	}
}
else {
	if(typeof(alert) !== 'undefined') {
		1;
	} else {
		var alert = function(txt) {
			console.log("ALERT!!!! :" + txt);
		}
	}
}


clLib.alert = function(txt) {
	alert(txt);
}



