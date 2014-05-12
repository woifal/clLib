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


clLib.PAGES.defaultHandler = function (event, ui, aPageId) {
	var eventName = event.type;
    var pageId;
	if(aPageId) {
		pageId = aPageId;
	} else {
		pageId = $(event.target).attr("id");
	}

	console.log("checking prerequisites for " + pageId + "." + eventName);
    var allTrue = false;
	var requisiteFunctions = (clLib.UI.pageRequisites[pageId] && clLib.UI.pageRequisites[pageId][eventName]) || {};

	clLib.loggi("requisiteFunctions is " + requisiteFunctions.length);
	clLib.PAGES.executeChainedFuncs(requisiteFunctions, 
		function() { 
			clLib.loggi("success!!"); 
			clLib.loggi("calling " + pageId + " and " + eventName);
			clLib.PAGES.handlers["_COMMON_"][eventName](event, ui);
			clLib.PAGES.handlers[pageId][eventName](event, ui);
		}, 
		function() { alert("error!!"); }
	);

/*
	
    $.each(requisiteFunctions, function (index, checkFunc) {
        //alert("executing " + index + " >" + JSON.stringify(checkFunc.name));
        if (checkFunc()) {
            //alert("checkfunc was true!");
			allTrue = true;
        } else {
            //alert("checkfunc was false!");
            allTrue = false;
        }
        if (!allTrue) {
            return false;
        }
    });
//    if (allTrue) {
//    }
*/
};


clLib.PAGES.executeChainedFuncs = function(funcArray, successFunc, errorFunc) {
	var idx = -1;
	return clLib.PAGES.executeChainedFunc(funcArray, idx, successFunc, errorFunc);
};
clLib.PAGES.executeChainedFunc = function(funcArray, idx, successFunc, errorFunc) {
	idx++;
	var curFunc = funcArray[idx];
	
	console.log("typeof successFunc is " + typeof(successFunc));
	// Reached end of chain..
	console.log("idx = " + idx);
	if(!curFunc) {
		return successFunc({"a": "b"});
	}
	
	// Call next function in chain..
	return curFunc(function() {
		return clLib.PAGES.executeChainedFunc(
			funcArray, idx, 
			successFunc, errorFunc
		);
	},
	errorFunc
	);
};

clLib.PAGES.handlers = {
	1 : 1
	,"_COMMON_" : {
	    "pagecreate": function () {
	        // Link to preferences page..
	        $("#_COMMON__preferencesButton").die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_preferences.html");
	        });
	        $("#_COMMON__AGBButton").die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_AGB.html");
	        });
	        $("#_COMMON__feedbackButton").die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_feedback.html");
	        });
	        $("#_COMMON__refreshAllButton").die("click").live("click", function () {
				clLib.localStorage.refreshAllData(
				function(warnings) {
					if(typeof(warnings) == "object"  && warnings["warnings"] != "") {
						alert("warnings: " + JSON.stringify(warnings));
					}
					alert("refreshed!");
				},
				function(e) {
					alert("could not refresh due to " + e.getMessage() + " >" + JSON.stringify(e));
				}
				);
	        });
            //alert("binding clinck handler for usersbutton");
			$("#_COMMON__usersButton").die("click").live("click", function () {
				clLib.PAGES.changeTo("clLib_users.html");
            });
	    }
		, "pagebeforeshow": function (e, ui) {
		}

	}
	,"AGB" : {
	    "pagecreate": function () {
	    }
		, "pagebeforeshow": function (e, ui) {
		}

	}
	,"feedback" : {
	    "pagecreate": function () {
	        $("#feedback_save").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                localStorage.setItem("currentJqmSlide", "feedback");
	                clLib.UI.save({additionalData: { dbEntity: "feedback" }}, function() {
						alert("feedback sent!");
						clLib.UI.resetUIelements("feedback", "feedback");
					});
	            }, {text: "Sending feedback.."});
	        });
		}
		, "pagebeforeshow": function (e, ui) {
		}

		
		
	}
	,"preferences": {
        "pagecreate": function() {
            //alert("444isave handler..");
            $("#preferences_cancelButton").die("click").live("click", function () {
                clLib.UI.fillUIelements("preferences", "preferences");
//                alert("reset!");
                history.back();
            });

            $("#preferences_saveButton").die("click").live("click", function () {
//				clLib.UI.execWithMsg(function() {
                    localStorage.setItem("currentJqmSlide", "preferences");
                    clLib.UI.save({}, function() {
						clLib.UI.resetUIelements("newRouteLog", "preferences");
						clLib.UI.hideLoading(); 
							//alert("going back.."); 
							//history.back(); 
						clLib.PAGES.changeTo("clLib_startScreen.html");
					});
	//			}, {text: "Saving preferences..."});
            });

            $("#preferences_currentUserReadOnly").on("click", function () {
                //alert("user input field clicked!");
                clLib.PAGES.changeTo("clLib_users.html");
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
	    "pagecreate": function () {
	        
			// pre-fetch newRouteLog page..
	        // $.mobile.loadPage("clLib_preferences.html");

	        // Link to preferences page..
	        $("#startScreen_preferencesButton").die("click").click(function () {
	            clLib.PAGES.changeTo("clLib_preferences.html");
	        });
			
			$("#startScreen_statsButton").die("click").click(function () {
	            clLib.PAGES.changeTo("clLib_stats.html");
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
					//alert("routelog avail at >" + currentArea + "< ? >" + currentArea["routeLogAvailable"] + "<");
					var routeLogAvailable = false;
					if (currentArea && currentArea["routeLogAvailable"] != "false") {
						routeLogAvailable = true;
					}
					//alert("routeLogAvailable? " + routeLogAvailable);
					var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
					if(!routeLogAvailable) {
						currentLayout = "reduced";
					}
					
					clLib.loggi("navigating to " + localStorage.getItem("currentLayout") + "," + localStorage.getItem("defaultLayout")+ "=>" + currentLayout);
					

					clLib.loggi("currentLayout set to " + currentLayout);
					var newRouteLogURL = "clLib_newRouteLog." + currentLayout + ".html";

					clLib.PAGES.changeTo(newRouteLogURL);
					//$.mobile.navigate(newRouteLogURL);
				}, {text: "Loading page.."});
	        });

	        // refresh button(=> in page header)..
	        $("#startScreen_refreshRouteStorageButton").on("click", function () {
	            //alert("refreshing all data..");
				clLib.localStorage.refreshAllData(
				function(warnings) {
					if(typeof(warnings) == "object"  && warnings["warnings"] != "") {
						alert("warnings: " + JSON.stringify(warnings));
					}
				},
				function(e) {
					alert("could not refresh due to " + e.getMessage() + " >" + JSON.stringify(e));
				}
				);
	        });

            $("#startScreen_usersButton").on("click", function () {
                clLib.PAGES.changeTo("clLib_users.html");
            });
	    }
        , "pagebeforeshow" : function() {
            // Fill UI elements..
	        clLib.UI.fillUIelements("startScreen", "startScreen");
		}
	}
	, "newRouteLog": {
	    "pagecreate": function () {
			//alert("init!");
	        clLib.UI.buildRatingRadio($("#newRouteLog_ratingSelectWrapper"));
	        $("#newRouteLog_layoutSelect").val(localStorage.getItem("currentLayout"));
	        $("#newRouteLog_layoutSelect").selectmenu("refresh");

	        //alert("444isave handler..");
	        $("#newRouteLog_save_tick").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                localStorage.setItem("currentJqmSlide", "newRouteLog");
	                clLib.UI.save({}, function() {
						clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
					});
	            }, {text: "Saving route logs.."});
	        });
	        $("#newRouteLog_refreshButton").on("click", function () {
	            clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	        });

	        //clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));
	    }
        , "pagebeforeshow": function (e, ui) {
            var $prevElement = $(ui.prevPage);//.prev();
			var prevTag = $prevElement.prop("tagName");
			var prevId = $prevElement.attr("id");
			//alert("showing page!(prev:" + prevTag + " #" + prevId + ")");
			
			if (!prevId || !prevId.endsWith("-dialog")) {
				localStorage.setItem("currentJqmSlide", "newRouteLog");
				clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));
			}
		}
	}

	, "stats": {
	    "pagecreate": function () {
	        //clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));
			$("#stats_todaysDiagram h3").on("click", function (e) {
				clLib.PAGES.changeTo("clLib_diagram.html");
            });
			$("#stats_monthsDiagram").on("click", function () {
                clLib.PAGES.changeTo("clLib_diagram.html");
            });
		}
        , "pagebeforeshow": function () {
			//alert("show!");
	        localStorage.setItem("currentJqmSlide", "stats");
	        clLib.UI.fillUIelements("stats", "stats", localStorage.getItem("defaultLayout"));
        }
	}

	,"diagram": {
	    "pagecreate"	: function () {
//	4 Mar 22:22:21 - >{"13":{"count":2,"score":1275},"14":{"count":1,"score":400},"20":{"count":10,"score":3750},"21":{"count":2,"score":700},"22":{"count
//":1,"score":350},"23":{"count":8,"score":2800}}<
			var successHandler = function(resultObj) {
				resultObj = JSON.parse(resultObj);
				//alert("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));
				
				var graphLabels = clLib.formatArr(Object.keys(resultObj), [function(x) { return "__" + x + "__";}]);
				
				var data = {
					//labels : ["January","February","March","April","May","June","July"],
					labels : graphLabels
					,datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							pointColor : "rgba(220,220,220,1)",
							pointStrokeColor : "#fff",
							//data : [2800,48,40,19,96,27,100]
							data : clLib.formatArrInt(clLib.getObjValues(resultObj), [function(x) { return parseInt(x.score); }])
						}
					]
				};
				
				//Get the context of the canvas element we want to select
				var ctx = document.getElementById("diagramChart").getContext("2d");
				var myNewChart = new Chart(ctx).Line(data, graphOptions);//, options);
					

			};

			clLib.REST.requestStats({
			},
			successHandler, 
			function(e) {
				alert(clLib.formatError(e));
			}
			);

		
		}
		, "pagebeforeshow": function () {
			
		}
	}	
	,"users_verification": {
	    "pagecreate"	: function () {
			localStorage.setItem("notification", "");
			var userEntity = {
				"username" : clLib.getUserInfo()["username"]
            };
			var successHandler = function() {
				clLib.UI.fillUIelements("users_verification", "users_verification");
			};
			

			$("#users_verification_requestTokenButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.REST.requestVerification({
							entityInstance : userEntity
						},
						successHandler, 
						clLib.requestAuthHandler
					);
				}, {text: "generating token"});
			});
			$("#users_verification_changePassword").on("click", function () {
	            clLib.UI.execWithMsg(function() {
					clLib.REST.changePassword({
							entityInstance : userEntity
						},
						successHandler, 
						clLib.requestAuthHandler
					);
				}, {text: "changing password"});
			});
		}
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users_verification", "users_verification");
        }
	}

	,"users": {
	    "pagecreate"	: function () {

            $("#users_googleLoginButton").on("click", function () {
	        
                googleAuth.checkAuth(
                    function(userObj) {
                        alert("success!");
                        alert("with >" + JSON.stringify(userObj));
                        clLib.setUserInfo(userObj);
                        $("#_COMMON__displayName").trigger("refresh");
                    }
                    ,function(error) {
                        alert("error!");
                        alert("with >" + JSON.stringify(error));
                    }
                );
            });
            
            
            $("#users_loginButton").on("click", function () {
	            clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "login", plainPwd : true }}
					,function() {
						clLib.PAGES.changeTo("clLib_startScreen.html");
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users", "users");
					}
					); 
				}
				, {text: "logging in"});
			});
			
	        $("#users_logoutButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "logout" }}
					,function() {
						clLib.UI.fillUIelements("users", "users");
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users", "users");
					}
					);
				}
				, {text: "logging out.."});
	        });
			
			
			$("#users_signupButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "create" }}
					, function(returnObj) {
						//alert("got login response " + JSON.stringify(returnObj));
						// Override current user info with response from signup callback..
                        clLib.setUserInfo(returnObj, true);

						// login..
						clLib.login(function() {
							// ..and return to startPAge..
							//alert("Successfully signed up!");
							clLib.PAGES.changeTo("clLib_startScreen.html");
						}
						, function(e) {
							clLib.loginErrorHandler(e);
							clLib.UI.fillUIelements("users", "users");

						}
						);

					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users", "users");
					}
					);
				}
				, {text: "creating user.."});
			});
			
			$("#users_deleteButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "delete" }}
					,function() {
						clLib.UI.fillUIelements("users", "users");
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users", "users");
					}
					);
				}
				, {text: "deleting user.."});
	        });
			
	        $("#users_forgotPwdButton").on("click", function () {
				clLib.PAGES.changeTo("clLib_users_verification.html");
			});
	        
			$("#users_preferencesButton").die("click").click(function () {
				clLib.PAGES.changeTo("clLib_preferences.html");
			});
	    }
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users", "users");
        }
	}
};



var eventsToBind = "pagecreate pagebeforeshow";

// bind "pagecreate"/"pagebeforeshow" events for all pages..
$("div[data-role=page]").die(eventsToBind).live(eventsToBind, function (event, ui) {
    clLib.PAGES.defaultHandler(event, ui);
});


clLib.PAGES.changeTo = function(newURL) {
	clLib.loggi("changing to " + newURL);

    if(newURL.indexOf("clLib_") != -1) {
        var pageId = "";
        alert(newURL.indexOf("clLib_") + 6);
        alert(newURL.indexOf(".") - newURL.indexOf("clLib_"));
        
        pageId = newURL.substring(
            newURL.indexOf("clLib_") + 6, 
            newURL.indexOf(".") - newURL.indexOf("clLib_")
           );

        var eventName = "clBeforeChange";
        var requisiteFunctions = (clLib.UI.pageRequisites[pageId] && clLib.UI.pageRequisites[pageId][eventName]) || {};

        clLib.loggi("requisiteFunctions is " + requisiteFunctions.length);
        clLib.PAGES.executeChainedFuncs(requisiteFunctions, 
            function() { 
                clLib.loggi("success!!"); 
                $.mobile.navigate(newURL);	
            }, 
            function() { alert("error!!"); }
        );
        
    } else {
        $.mobile.navigate(newRouteLogURL);	
    }
	
};




