"use strict";
clLib.PAGES = {};


/*
*	Remove local storage items no longer used:
+	- currentLayout
*/
localStorage.setItem("currentLayout", null);


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
                //alert(1);
                setTimeout(function () { clLib.UI.showLoading("11Saving preference(s)..."); }, 1);

                setTimeout(function () {
                    localStorage.setItem("currentJqmSlide", "preferences");
                    clLib.UI.save();
                    clLib.UI.resetUIelements("newRouteLog", "preferences");
                    setTimeout(function () { clLib.UI.hideLoading(); history.back(); }, 1500);
                });
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
			
			
if (!String.prototype.endsWith) {
	Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}
			
			
			if (!prevId || !prevId.endsWith("-dialog")) {
				clLib.UI.fillUIelements("preferences", "preferences");
			}
		}
	}
	,"startScreen": {
	    "init": function () {
	        setTimeout(function () { clLib.UI.showLoading("Starting....") }, 5);
	        // pre-fetch newRouteLog page..
	        $.mobile.loadPage("clLib_preferences.html");

	        // Link to preferences page..
	        $("#startScreen_preferencesButton").die("click").click(function () {
	            $.mobile.navigate("clLib_preferences.html");
	        });

	        // Link to New Route page..
	        $("#addRouteButton").on("click", function (e) {
//	            alert("loading page..");
	            setTimeout(function () {
	                //alert("1");
	                setTimeout(function () { clLib.UI.showLoading("Loading page.."); }, 5);
	                setTimeout(function () {
	                    //	            alert("loading page2..");
	                    var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
						//alert("navigating to " + localStorage.getItem("currentLayout") + "," + localStorage.getItem("defaultLayout"));
	                    var newRouteLogURL = "clLib_newRouteLog." + currentLayout + ".html";

	                    $.mobile.navigate(newRouteLogURL);
	                }, 5);
	            }, 1);
	        });

	        // refresh button(=> in page header)..
	        $("#startScreen_refreshRouteStorageButton").on("click", function () {
	            clLib.localStorage.refreshAllData();
	        });
	        setTimeout(function () { clLib.UI.showLoading("Ready!");  setTimeout(function() { clLib.UI.hideLoading(); }, 500) }, 5);
	        

	    }
        , "show" : function() {
            // Fill UI elements..
	        clLib.UI.fillUIelements("startScreen", "startScreen");
		}
	}
	, "newRouteLog": {
	    "init": function () {

	        clLib.UI.buildRatingRadio($("#newRouteLog_ratingSelectWrapper"));
	        $("#newRouteLog_layoutSelect").val(localStorage.getItem("currentLayout"));
	        $("#newRouteLog_layoutSelect").selectmenu("refresh");

	        //alert("444isave handler..");
	        $("#newRouteLog_save_tick").on("click", function () {
	            //alert(1);
	            setTimeout(function () { clLib.UI.showLoading("9999Saving route log(s)..."); }, 1);

	            setTimeout(function () {
	                localStorage.setItem("currentJqmSlide", "newRouteLog");
	                clLib.UI.save();
	                clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	                //clLib.UI.showLoading("Route log(s) saved!");
	                setTimeout(function () { clLib.UI.hideLoading(); }, 1500);
	            });
	        });
	        $("#newRouteLog_refreshButton").on("click", function () {
	            clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	        });
	        $("#foobut").on("click", function () {
	            clLib.UI.showLoading("33TEST LOADING!!!!");
	        });

	        clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));
	    }
        , "show": function () {

        }
	}
	,"users": {
	    "init": function () {

	        $("#users_loginButton").on("click", function () {
	            setTimeout(function () { clLib.UI.showLoading("logging in..."); }, 1);

	            setTimeout(function () {
	                clLib.UI.save(null, null, null, { action: "login" });
	                setTimeout(function () { clLib.UI.hideLoading(); }, 1500);
	            });
	        });
	        $("#users_logoutButton").on("click", function () {
	            setTimeout(function () { clLib.UI.showLoading("logging out..."); }, 1);
	            setTimeout(function () {
	                localStorage.removeItem("sessionToken");
	                setTimeout(function () { clLib.UI.hideLoading(); }, 1500);
	            });
	        });
	        $("#users_newUserButton").on("click", function () {
	            setTimeout(function () { clLib.UI.showLoading("creating user..."); }, 1);

	            setTimeout(function () {
	                clLib.UI.save(null, null, null, { action: "create" });
	                setTimeout(function () { clLib.UI.hideLoading(); }, 1500);
	            });
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


