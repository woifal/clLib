"use strict";
clLib.PAGES = {};


/*
*	Remove local storage items no longer used:
+	- currentLayout
*/
localStorage.removeItem("currentLayout");


clLib.UI.preloadImages([
    "files/views/assets/image/star_rated.png"
    , "files/views/assets/image/star_unrated.png"
]);


clLib.PAGES.defaultHandler = function (event, ui) {
	var eventName = event.type;
    var pageId = $(event.target).attr("id");

    var allTrue = false;
	var requisiteFunctions = clLib.UI.pageRequisites[pageId][eventName] || {};
    $.each(requisiteFunctions, function (index, checkFunc) {
        //alert("executing " + index + " >" + JSON.stringify(checkFunc.name));
        if (checkFunc()) {
            allTrue = true;
        } else {
            allTrue = false;
        }
        if (!allTrue) {
            return false;
        }
    });
//    if (allTrue) {
        clLib.loggi("calling " + pageId + " and " + eventName);
        clLib.PAGES.handlers[pageId][eventName](event, ui);
//    }
};
clLib.PAGES.handlers = {
    "preferences": {
        "pageinit": function() {
            //alert("444isave handler..");
            $("#preferences_cancelButton").on("click", function () {
                clLib.UI.fillUIelements("preferences", "preferences");
//                alert("reset!");
                history.back();
            });

            $("#preferences_saveButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
                    localStorage.setItem("currentJqmSlide", "preferences");
                    clLib.UI.save();
                    clLib.UI.resetUIelements("newRouteLog", "preferences");
                    setTimeout(function () { clLib.UI.hideLoading(); history.back(); }, 1500);
				}, {text: "Saving preferences..."});
            });

            $("#preferences_currentUserReadOnly").on("click", function () {
                //alert("user input field clicked!");
                $.mobile.navigate("clLib_users.html");
            });

			//clLib.UI.fillUIelements("preferences", "preferences");

		}
        , "pagebeforeshow": function (e, ui) {
            var $prevElement = $(ui.prevPage);//.prev();
			var prevTag = $prevElement.prop("tagName");
			var prevId = $prevElement.attr("id");
			clLib.loggi("showing page!(prev:" + prevTag + " #" + prevId + ")");
			
			if (!prevId || !prevId.endsWith("-dialog")) {
				clLib.UI.fillUIelements("preferences", "preferences");
			}
		}
	}
	,"startScreen": {
	    "pageinit": function () {
	        
			// pre-fetch newRouteLog page..
	        // $.mobile.loadPage("clLib_preferences.html");

	        // Link to preferences page..
	        $("#startScreen_preferencesButton").die("click").click(function () {
	            $.mobile.navigate("clLib_preferences.html");
	        });

	        // Link to New Route page..
	        $("#addRouteButton").on("click", function (e) {
				clLib.UI.execWithMsg(function() {
					// Only use default layout if selected area provides predefined route log data..
					var currentArea = clLib.localStorage.getEntities(
						"Area", 
						{"AreaName": localStorage.getItem("currentlySelectedArea")}
					);
					currentArea = currentArea[0]
					clLib.loggi("defaultLayout:" + currentLayout + ", area:" + JSON.stringify(currentArea));
					var routeLogAvailable = false;
					if (currentArea && currentArea["routeLogAvailable"]) {
						routeLogAvailable = true;
					}
					var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
					if(!routeLogAvailable) {
						currentLayout = "reduced";
					}
					
					clLib.loggi("navigating to " + localStorage.getItem("currentLayout") + "," + localStorage.getItem("defaultLayout")+ "=>" + currentLayout);
					

					clLib.loggi("currentLayout set to " + currentLayout);
					var newRouteLogURL = "clLib_newRouteLog." + currentLayout + ".html";

					$.mobile.navigate(newRouteLogURL);
				}, {text: "Loading page.."});
	        });

	        // refresh button(=> in page header)..
	        $("#startScreen_refreshRouteStorageButton").on("click", function () {
	            clLib.localStorage.refreshAllData();
	        });

            $("#startScreen_usersButton").on("click", function () {
                $.mobile.navigate("clLib_users.html");
            });
	    }
        , "pagebeforeshow" : function() {
            // Fill UI elements..
	        clLib.UI.fillUIelements("startScreen", "startScreen");
		}
	}
	, "newRouteLog": {
	    "pageinit": function () {
			//alert("init!");
	        clLib.UI.buildRatingRadio($("#newRouteLog_ratingSelectWrapper"));
	        $("#newRouteLog_layoutSelect").val(localStorage.getItem("currentLayout"));
	        $("#newRouteLog_layoutSelect").selectmenu("refresh");

	        //alert("444isave handler..");
	        $("#newRouteLog_save_tick").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                localStorage.setItem("currentJqmSlide", "newRouteLog");
	                clLib.UI.save();
	                clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	            }, {text: "Saving route logs.."});
	        });
	        $("#newRouteLog_refreshButton").on("click", function () {
	            clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	        });

	        clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));
	    }
        , "pagebeforeshow": function () {
			//alert("show!");
	        localStorage.setItem("currentJqmSlide", "newRouteLog");
        }
	}
	,"users_verification": {
	    "pageinit"	: function () {
			localStorage.setItem("notification", "");
			var userEntity = {
				"username" : localStorage.getItem("currentUser") 
			};
			var errorHandler = function(e) {
				alert("CAUGHT: " + JSON.stringify(e));
				var errorMsg = JSON.stringify(e);
		/*
				if(e.message && JSON.parse(e.message)["responseText"]) {
					errorMsg = JSON.parse(JSON.parse(e.message)["responseText"])["description"];
				}
		*/
				localStorage.setItem("notification", "Could not: " + errorMsg);
			};
			
			var successHandler = function() {
				clLib.UI.fillUIelements("users_verification", "users_verification");
			};
			

			$("#users_verification_requestTokenButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.REST.requestVerification({
						entityInstance : userEntity,
						onSuccess : successHandler, 
						onError : errorHandler
					});
				}, {text: "generating token"});
			});
			$("#users_verification_changePassword").on("click", function () {
	            clLib.UI.execWithMsg(function() {
					clLib.REST.changePassword({
						entityInstance : userEntity,
						onSuccess : successHandler, 
						onError : errorHandler
					});
				}, {text: "changing password"});
			});
		}
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users_verification", "users_verification");
        }
	}
	,"users": {
	    "pageinit"	: function () {

	        $("#users_loginButton").on("click", function () {
	            clLib.UI.execWithMsg(function() {
					clLib.UI.save(null, null, null, { action: "login" });
	                clLib.UI.fillUIelements("users", "users");
				}, {text: "logging in"});
			});
	        $("#users_logoutButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                clLib.UI.save(null, null, null, { action: "logout" });
	                clLib.UI.fillUIelements("users", "users");
	            }, {text: "logging out.."});
	        });
	        $("#users_newUserButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save(null, null, null, { action: "create" });
	                clLib.UI.fillUIelements("users", "users");
				}, {text: "creating user.."});
			});
	        $("#users_forgotPwdButton").on("click", function () {
				$.mobile.navigate("clLib_users_verification.html");
			});
	        
			$("#users_preferencesButton").die("click").click(function () {
				$.mobile.navigate("clLib_preferences.html");
			});
	    }
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users", "users");
        }
	}
};



var eventsToBind = "pageinit pagebeforeshow";

// bind "pageinit"/"pagebeforeshow" events for all pages..
$("div[data-role=page]").die(eventsToBind).live(eventsToBind, function (event, ui) {
    clLib.PAGES.defaultHandler(event, ui);
});