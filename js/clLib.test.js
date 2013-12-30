"use strict";
var clLib = {};
clLib.UI = {};

clLib.UI.execWithMsg = function(func, spinnerParams) {
	//setTimeout(function() {clLib.UI.showLoading("doing...");}, 0);
	clLib.UI.showLoading(spinnerParams);
	setTimeout(function() {
		func();
		clLib.UI.hideLoading();
	},10);
	
};

var longFunc = function() {
	var i= 0;
	while(i++ < 30000) {
		if(i % 1000 == 0) {
			$("#progress").append(i);
		}
		else {
			$("#progress").html("y");				
		}
	};

};

var testBeforeShow = function(event, ui) {
	//alert("444isave handler..");
	$("#testButton").on("click", function () {
		clLib.UI.execWithMsg(longFunc, {text: "doing something useless..."});
	});
};
	

clLib.UI.showLoading = function(params) {
        //clLib.loggi("shwoing..");
        $.mobile.loading('show', {
            text: params["text"],
            textVisible: true,
            theme: 'e',
            html: params["html"]
        });
        //clLib.loggi("showed..");
};

clLib.UI.hideLoading = function() {
	$.mobile.loading( "hide");
};
