"use strict";
clLib.PAGES = {};

clLib.PAGES.handlers = {
	"preferences": {
		"init" : function() {
			clLib.UI.fillUIelements("preferences", "preferences");
		}
	}
	,"startScreen": {
		"init" : function() {
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
				clLib.UI.showLoading("refreshing from server..");

		        //alert("previous refresh:" +clLib.localStorage.getLastRefreshDate("routeStorage"));

				var userRoutes = clLib.REST.getEntities("Routes");
				console.log("GOT: "  +JSON.stringify(userRoutes));
				clLib.localStorage.initStorage("routeStorage", userRoutes);

        		var userRouteLogs = clLib.REST.getEntities("RouteLog", clLib.getRouteLogWhereToday());
				console.log("GOT: " +JSON.stringify(userRouteLogs));
				clLib.localStorage.initStorage("routeLogStorage", userRouteLogs);

				clLib.UI.fillUIelements("startScreen", "startScreen");

				//alert("new refresh:" + clLib.localStorage.getLastRefreshDate("routeStorage"));
				clLib.UI.hideLoading();
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

				clLib.UI.defaultSaveHandler();
				/*
					var saveObj= {
							"Area": localStorage.getItem("currentlySelectedArea"),
							"GradeSystem": $("#newRouteLog_gradeTypeSelect").val(),
							"Grade": $("#newRouteLog_gradeSelect").val(),
							"Sector": $("#newRouteLog_sectorSelect").val(),
							"Colour": $("#newRouteLog_colourSelect").val(),
							"Line": $("#newRouteLog_lineSelect").val(),
							"TickType": $("#newRouteLog_tickType").val(),
							"RouteName": $("#newRouteLog_searchRoute").val(),
							"userName": localStorage.getItem("currentUser"),
							"Rating": $("#newRouteLog_ratingSelectRadio" + ":checked").val(),
							"Date": new Date()
						};
				//		clLib.REST.storeEntity("RouteLog", saveObj);
		
						clLib.localStorage.addInstance("RouteLog", saveObj, "routeLogStorage");
				*/
				clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
				clLib.UI.hideLoading();
			});
		}
	}
};


clLib.PAGES.initHandler = function(event) {
	var pageId = $(event.target).attr("id");
	//alert("INIT page >" + pageId + "<");
	clLib.PAGES.handlers[pageId]["init"]();
};

$("#newRouteLog").die("pageinit").live("pageinit", function (event, ui) {
	clLib.PAGES.initHandler(event);
});

$("#startScreen").die("pageinit").live("pageinit", function(event, ui) {
	clLib.PAGES.initHandler(event);
});
$("#preferences").die("pageinit").live("pageinit", function (event, ui) {
	clLib.PAGES.initHandler(event);
});

$("#startScreen").die("pageshow").live("pageshow", function(event, ui) {
	console.log("SHOWING startScreen...")
});



