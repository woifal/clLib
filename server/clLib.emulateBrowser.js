// browser-like "window" object
var window = {};

// handle "console.log" etc..
var console = util;
window.console = console;

// handle "alert"
var alert = function(txt) {
	util.log("!!! ALERT !! " + txt);
}
window.alert = alert;

console.log("FAKING localstorage...");
var localStorage = {
	items: {}
	,getItem(itemName) {
		if(itemName in this.items) {
			return this.items[itemName];
		}
		else {
			return "";
		}
	}
	,setItem(itemName, itemValue) {
		this.items[itemName] = itemValue;
	}
}



global.window = window;
global.console = console;
global.alert = alert;
global.localStorage = localStorage;

var $ = {};
$.each = function(object, callback) {
	var objKeys = Object.keys(object);
	var i;
	for(i = 0; i < objKeys.length; i++) {
		callback(objKeys[i], object[objKeys[i]]);
	}
};

try {
    global.$ = $;
} catch(e) {
}

