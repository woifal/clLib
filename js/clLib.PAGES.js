"use strict";
clLib.PAGES = {};

clLib.prefsCompleteCheck = function() {
};
clLib.wasOnlineCheck = function () {
};


clLib.PAGES.defaultHandler = function (event) {
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
        clLib.PAGES.handlers[pageId]["init"]();
//    }
};
clLib.PAGES.handlers = {
    "preferences": {
		"init" : function() {
//		    $("#preferences_mobileHeader1").load("clLib_HEADER.html");
		    clLib.UI.fillUIelements("preferences", "preferences");
		}
	}
	,"startScreen": {
		"init" : function() {
//		    $("#result").load("clLib.PAGES.html");
		    // Fill UI elements..
			//    $(document).live("pageshow", function () {
	        clLib.UI.fillUIelements("startScreen", "startScreen");
        	//    });

			// Link to preferences page..
		    $("#startScreen_preferencesButton").die("click").click(function() {
		        $.mobile.navigate("clLib_preferences.html");
	        });

        	// Link to New Route page..
			$("#addRouteButton").die("click").bind("click", function (e) {
				var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
				var newRouteLogURL = "clLib_newRouteLog." + currentLayout + ".html";
				
				$.mobile.navigate(newRouteLogURL);
			});

        	// refresh button(=> in page header)..
			$("#startScreen_refreshRouteStorageButton").die("click").click(function () {
			    clLib.localStorage.refreshAllData();
			});

		}
	}
	,"newRouteLog": {
		"init" : function() {
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
    return clLib.PAGES.defaultHandler(event);
};
clLib.PAGES.showHandler = function (event) {
    return clLib.PAGES.defaultHandler(event);
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
$("#newRouteLog").die("pageshow").live("pageshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#startScreen").die("pageshow").live("pageshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});
$("#preferences").die("pageshow").live("pageshow", function (event, ui) {
    clLib.PAGES.showHandler(event);
});


