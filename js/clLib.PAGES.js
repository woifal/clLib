"use strict";
clLib.PAGES = {};

clLib.prefsCompleteCheck = function() {
};
clLib.wasOnlineCheck = function () {
};


clLib.PAGES.defaultHandler = function (event, eventName) {
    clLib.UI.preloadImages([
        "files/views/assets/image/star_rated.png"
        , "files/views/assets/image/star_unrated.png"
    ]);

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
        clLib.PAGES.handlers[pageId][eventName]();
//    }
};
clLib.PAGES.handlers = {
    "preferences": {
        "init": function() {
        }
        , "show": function () {
//		    $("#preferences_mobileHeader1").load("clLib_HEADER.html");
		    clLib.UI.fillUIelements("preferences", "preferences");
		}
	}
	,"startScreen": {
	    "init": function () {
	        // Link to preferences page..
	        $("#startScreen_preferencesButton").die("click").click(function () {
	            $.mobile.navigate("clLib_preferences.html");
	        });

	        // Link to New Route page..
	        $("#addRouteButton").die("click").bind("click", function (e) {
	            clLib.UI.showLoading("Loading page..");
	            var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
	            var newRouteLogURL = "clLib_newRouteLog." + currentLayout + ".html";

	            $.mobile.navigate(newRouteLogURL);

	        });

	        // refresh button(=> in page header)..
	        $("#startScreen_refreshRouteStorageButton").die("click").click(function () {
	            clLib.localStorage.refreshAllData();
	        });
	    }
        , "show" : function() {
            // Fill UI elements..
	        clLib.UI.fillUIelements("startScreen", "startScreen");
		}
	}
	,"newRouteLog": {
	    "init": function () {
	    }
        , "show": function () {
	            //alert("hiding");
		    clLib.UI.hideLoading();
		    //    $(document).on("pageshow", function () {
			clLib.UI.buildRatingRadio($("#newRouteLog_ratingSelectWrapper"));
			$("#newRouteLog_layoutSelect").val(localStorage.getItem("currentLayout"));
			$("#newRouteLog_layoutSelect").selectmenu("refresh");
			clLib.UI.fillUIelements("newRouteLog", "newRouteLog");
			//    });

			$("#newRouteLog_save_tick").die("click.clLib").bind("click.clLib", function(e) {
        		//alert("SAVING!!!");
				localStorage.setItem("currentJqmSlide", "newRouteLog");
        		//		localStorage.setItem("currentLayout", "default");
				clLib.UI.showLoading();

				clLib.UI.defaultSaveHandler(null,null,function () {});
				clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
				clLib.UI.hideLoading();
			});
		}
	}
};


clLib.PAGES.initHandler = function (event) {
    return clLib.PAGES.defaultHandler(event, "init");
};
clLib.PAGES.showHandler = function (event) {
    return clLib.PAGES.defaultHandler(event, "show");
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

$("#newRouteLog").die("pagesbeforehow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#startScreen").die("pagebeforeshow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#preferences").die("pagebeforeshow").live("pagebeforeshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});


$("#startScreen").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});
$("#preferences").die("pageinit").live("pageinit", function (event, ui) {
    clLib.PAGES.initHandler(event);
});


