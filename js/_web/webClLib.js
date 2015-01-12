"use strict";

//window.$ = jQuery;


var clLibWeb = {};
clLibWeb.rootURL = "/Joomla/STATIC";
clLibWeb.loginPageURL = "http://www.kurt-climbing.com/Joomla/index.php/cllib-users-cllogin";



clLibWeb.checkURLParams = function() {
	var errorFunc = function(error) {
		alert("error >" + JSON.stringify(error));
	}

	console.log("trying to get authObj from URL params");
	var urlAuthObj;

	if(document.location.href.indexOf("?authObj") != -1) {
		urlAuthObj = decodeURIComponent(
			document.location.href.substring(
				document.location.href.indexOf("?authObj") + 9
			)
		);
	}

	console.log("Got authObj from URL params");
	if(!urlAuthObj) {
		console.log("NO new external authentication info, proceeding standard way..");
		clLibWeb.loggedInCheck(function() { console.log("yeah, logged in man.."); }, function() { console.log("geh scheissen, not logged in!");});
	}
	if(urlAuthObj) {
		clLib.UI.execWithMsg(function() {
			clLib.PAGES.processAuthObj(urlAuthObj, function() {
				alert("Hello >" + clLib.getUserInfo()["displayName"] + "<");
				//document.location.href="http://www.kurt-climbing.com/Joomla";
				clLibWeb.loggedInCheck(function() { console.log("yeah, logged in man.."); }, function() { console.log("geh scheissen, not logged in!");});
			});
		}, {text: "Processing authentication.."});
	};

}

clLibWeb.showUserInfo = function($targetEl) {	
	var $currentUser;

	var imageURL = clLib.getUserInfo()["imageURL"];
	var displayName = clLib.getUserInfo()["displayName"] || "????";
	var authType = clLib.getUserInfo()["authType"];

	if(!imageURL) {
		imageURL = "http://www.kurt-climbing.com/Joomla/KURT/files/views/assets/image/splashLogoNoBorders.png";
	}
	
	$currentUser = $("<div>");
	if(imageURL) {
		$currentUser.append(
			$("<img>")
			.attr({
				"src" : imageURL
			})
			.css({
				border: "0px solid red"
				,float: "left"
				,width : "25px"
				,height : "25px"
			})
		)
	}
	$currentUser.append(
		$("<span>")
			.css({
				float: "left"
				,"margin-left": "10px"
				,"border": "0px solid red"
				,"font-size": "20px"
				,"font-weight": "bold"
			})
			.text(displayName)
	)
	;
	if(authType == 'facebook' || authType == 'google') {
		var authTypeImgURL = "";
		if(authType == "google") {
			authTypeImgURL = "files/views/assets/image/googleAuth.jpg";
		}
		else if(authType == "facebook") {
			authTypeImgURL = "files/views/assets/image/facebookAuth.png";
		} 
		$currentUser.append(
			$("<img>")
			.attr({
				"src" : authTypeImgURL
			})
			.css({
				width : "25px"
				,height : "25px"
				,float: "right"
			})
		);
	}

	console.log("emptying userinfo div..");
	$targetEl.empty();
	console.log("appending new user info.." + $currentUser.html());
	$targetEl.append($currentUser);
	var $mouseOverEl = $("<div style='width: 100px; height: 30px; border: 1px solid red; position: relative; top: 0px; left: 0px;' class='expanded' style='border: 1px solid red'>" );
/*
	var $clickable = $("<a style='padding: 0; margin: 0;'>Hello!<br>Hello!<br>Hello!<br>Hello!<br>Hello!<br></a>");
	$clickable.off("click").on("click", function(evt) {
//		evt.stopImmediatePropagation();
//		evt.preventDefault();
		alert("clicked!");
	});
	$mouseOverEl.append($clickable);
	$targetEl.on("mouseover", function() {
		console.log("mousedover...");
		$(this)
			.append($mouseOverEl);
	});	
	$targetEl.on("mouseleave", function() {
		console.log("mousedout...");
		
//		$(this).find(".expanded").remove();
	});	
*/
}


clLibWeb.loggedInCheck = function(successFunc, errorFunc) {
	var $menuDiv = $(".clMenuContainer");
	var $loginButton = $(".clUserInfo");

	var currentPage = clLib["currentPage"];
	if(!errorFunc) {
		errorFunc = function(e) {
			console.log("std error func. not doing anything..");
		};
	}
	if(!successFunc) {
		successFunc = function(e) {
			console.log("std success func. not doing anything..");
		};
	}
	clLib.loggedInCheck(
		function() {
			//alert("logged in!");
			$menuDiv.find(".loggedInOnly").removeClass("hidden");
			$loginButton.html('<a href="' + "#" + '">Logout</a>');
/*
			$loginButton.off().on("click", function(e) {
				localStorage.clear();
				document.location.href = "http://www.kurt-climbing.com/Joomla";
			});
*/
			clLibWeb.showUserInfo(
				$("a.clUserInfo"));
			return successFunc();
		}
		,function(e) {
			//alert("not logged in!");
			console.log("not logged in, hiding clMenu..");
			$menuDiv.find(".loggedInOnly").addClass("hidden");
			$loginButton.html('<a href="' + clLibWeb.loginPageURL + '">Login</a>');

			//alert("changing to login page...");
			//clLib.PAGES.changeTo(clLibWeb.loginPageURL, {web: true});
			return errorFunc();
		}
	);
};

document.addEventListener("DOMContentLoaded", function() {
	var $clMenuContainer = $("#fav-nav .navigation .moduletable .clMenuContainer");
	if($clMenuContainer.length < 1) {
		//alert("no clMenuContainer");
		$("#fav-nav .navigation .moduletable")
			.append(
				$('<div style="clear: both"></div>' + 
					'<ul class="nav menu clMenuContainer">' + 
						'<li class="current" style="float: left; width: 50%;"><a class="clUserInfo" href="#"></a></li>' + 
						'<li class="current loggedInOnly hidden"><a href="http://www.kurt-climbing.com/Joomla/index.php/cllib-stats">My Routes</a></li>' + 
						'<li class="current loggedInOnly hidden"><a href="http://www.kurt-climbing.com/Joomla/index.php/cllib-stats">My Statistics</a></li>' + 
	//					'<li class="current"><a href="#">Grade Conversion</a></li>' + 
	//					'<li class="current"><a href="#">Buddies</a></li>' + 
	//					'<li class="current"><a id="logoutButton" href="#">Logout</a></li>' + 
					'</ul>' + 
					''
				)
			)
		;
		//alert("appended!" + 	$("#fav-nav .navigation .moduletable").find(".clMenuContainer").length);
	}
	else {
		//alert("clMenuContainer exsists...");
	}
	
	//alert("webcllib check for login.");
	clLibWeb.checkURLParams();
//	clLibWeb.loggedInCheck(function() { alert("yeah, logged in man.."); }, function() { alert("geh scheissen, not logged in!");});

}
, false);



