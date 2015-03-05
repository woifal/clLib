"use strict";

var origProcessAuthObj = clLib.PAGES.processAuthObj;
clLib.PAGES.processAuthObj = function(urlAuthObj, successFunc) {
	console.log("OVERRIDDEN PROCESSAUTHOBJ!!!!" + parent.document.location.href);
//	if(!successFunc) {
		successFunc = function() {
			if(parent.document.location.href == 'http://www.kurt-climbing.com/index.php/cllib-users-cllogin') {
				console.log("changing to front page...");
				parent.document.location.href = 'http://www.kurt-climbing.com';
			}
		}
//	}
	return origProcessAuthObj(urlAuthObj, successFunc);
};
