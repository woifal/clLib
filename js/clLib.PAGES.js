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


clLib.PAGES.defaultHandler = function (event, ui, eventName) {
    var pageId = $(event.target).attr("id");
    //alert("SHOW page >" + pageId + "<");

    var allTrue = false;
    //alert("checking prerequisites for " + pageId);
    $.each(clLib.UI.pageRequisites[pageId], function (index, checkFunc) {
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
        "init": function() {
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
        , "show": function (e, ui) {
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
	    "init": function () {
	        
			// pre-fetch newRouteLog page..
	        $.mobile.loadPage("clLib_preferences.html");

	        // Link to preferences page..
	        $("#startScreen_preferencesButton").die("click").click(function () {
	            $.mobile.navigate("clLib_preferences.html");
	        });

	        // Link to New Route page..
	        $("#addRouteButton").on("click", function (e) {
				clLib.UI.execWithMsg(function() {
					var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
					clLib.loggi("navigating to " + localStorage.getItem("currentLayout") + "," + localStorage.getItem("defaultLayout")+ "=>" + currentLayout);
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
        , "show" : function() {
            // Fill UI elements..
	        clLib.UI.fillUIelements("startScreen", "startScreen");
		}
	}
	, "newRouteLog": {
	    "init": function () {
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
        , "show": function () {
			//alert("show!");
	        localStorage.setItem("currentJqmSlide", "newRouteLog");
        }
	}
	,"users": {
	    "init": function () {

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
	        
			clLib.UI.fillUIelements("users", "users");
	    }
        , "show": function () {
            
        }
	}
};


clLib.PAGES.initHandler = function (event, ui) {
    return clLib.PAGES.defaultHandler(event, ui, "init");
};
clLib.PAGES.showHandler = function (event, ui) {
    return clLib.PAGES.defaultHandler(event, ui, "show");
};

/*$("#newRouteLog").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});

$("#startScreen").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});
$("#preferences").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});*/

$("#startScreen").die("pagebeforeshow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#preferences").die("pagebeforeshow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event, ui);
});
$("#newRouteLog").die("pagebeforehow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#users").die("pagebeforehow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});


$("#startScreen").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});
$("#preferences").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event, ui);
});
$("#newRouteLog").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event, ui);
});
$("#users").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event, ui);
});


