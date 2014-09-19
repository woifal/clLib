"use strict";
clLib.PAGES = {
    settings : {
        authStrategy : "phoneGapAuth"
    }
};

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
			if(clLib.PAGES.handlers[pageId] && clLib.PAGES.handlers[pageId][eventName]) {
                clLib.PAGES.handlers[pageId][eventName](event, ui, pageId);
            }
            else {
                console.log("No pagehandler defined for >" + pageId + "< and >" + eventName + "<");
            }

			clLib.loggi("calling " + pageId + " and " + eventName);
			if(clLib.PAGES.handlers["_COMMON_"] && clLib.PAGES.handlers["_COMMON_"][eventName]) {
                clLib.PAGES.handlers["_COMMON_"][eventName](event, ui, pageId);
            }
            else {
                console.log("No _COMMON_ pagehandler defined for >" + pageId + "< and >" + eventName + "<");
            }

        }, 
		function() { alert("error!!"); }
	);


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
	return curFunc(function(exitFlag) {
        console.log("executing next chained func? " + exitFlag);
		if(typeof(exitFlag) !== 'undefined' && exitFlag == true) {
            console.log("No!");
            return successFunc({"b" : "x"});
        } else {
            console.log("Yes!");
            return clLib.PAGES.executeChainedFunc(
                funcArray, idx, 
                successFunc, errorFunc
            );
        }
	},
	errorFunc
	);
};

clLib.PAGES.handlers = {
	1 : 1
    ,"index": {
        "pagecreate": function (event, ui, pageId) {
            var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }

            console.log("showing index, setting timeout for move to startscreen..");

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
            //alert("NO external authentication, proceeding standard way..");
                clLib.UI.execWithMsg(function() {
//                    setTimeout(function() {
                        //console.log("changing to startscreen..");
                        clLib.PAGES.changeTo("clLib_startScreen.html", null, event, 2500);
//                    }
//                    ,2500);
	            }, {text: "Loading app.."}, 10);
                
/*
2DO:
    why 2500?
    500 does not work on phonegap/iphone
*/
            }
            if(urlAuthObj) {
                clLib.UI.execWithMsg(function() {
                    clLib.PAGES.processAuthObj(urlAuthObj);
	            }, {text: "Processing authentication.."}, 10);
            };

        }
    }
    ,"_COMMON_" : {
	    "pagecreate": function (event, ui, pageId) {
	        clLib.UI.byId$("purchasesButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_purchases.html");
	        });
	        clLib.UI.byId$("homeButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_startScreen.html");
	        });
	        clLib.UI.byId$("displayName", pageId).die("click").live("click", function () {
                clLib.PAGES.changeTo("clLib_users.html");
	        });
	        clLib.UI.byId$("preferencesButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_preferences.html");
	        });
	        clLib.UI.byId$("AGBButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_AGB.html");
	        });
	        clLib.UI.byId$("feedbackButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_feedback.html");
	        });
	        clLib.UI.byId$("refreshAllButton", pageId).die("click").live("click", function () {
				clLib.localStorage.refreshAllData(
				function(warnings) {
					if(typeof(warnings) == "object"  && warnings["warnings"] != "") {
						alert("warnings: " + JSON.stringify(warnings));
					}
					//alert("refreshed!");
				},
				function(e) {
					alert("could not refresh due to " + e.getMessage() + " >" + JSON.stringify(e));
				}
				);
	        });
            //alert("binding clinck handler for usersbutton");
			clLib.UI.byId$("usersButton", pageId).die("click").live("click", function () {
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
	            }, {text: "Saving route logs.."}, 100);
	        });
	        $("#newRouteLog_refreshButton").on("click", function () {
	            clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
	        });

	        //clLib.UI.fillUIelements("newRouteLog", "newRouteLog", localStorage.getItem("defaultLayout"));

			$("#newRouteLog_tickType input[type='checkbox']")
				.off("click")
				.on("click", function(e) {
				if($(this).is(":checked")) {
					//alert($(this).prop("id") + " is checked!");
					//alert($(this).parents(".ui-checkbox").siblings().size());
					$(this).parents(".ui-checkbox").siblings().find("label")
						.removeClass("ui-checkbox-on")
						.addClass("ui-checkbox-off")
					;
					$(this).parents(".ui-checkbox").siblings().find("input[type='checkbox']")
						.prop("checked", false)
					;
				} else {
					// Don't allow explicit un-checking.
					$(this).prop("checked", true);
				}
			});
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
	, "purchases": {
	    "pagebeforeshow": function () {
			//alert("XXXXshowing purchases..");
			$("#purchases_initButton").on("click", function (e) {
				//alert("re-init..");
				clLib.IAP.initialize();
				//alert("re-inited..");
//				clLib.IAP.restore();
//				alert("re-restored..");
//				clLib.IAP.renderIAPs($("#purchases_info")[0]);
            });
			$("#purchases_buyButton").on("click", function (e) {
				alert("buying..");
				clLib.IAP.buy('com.kurtclimbing.consumable', function(a,b,c) {
					alert("a:" + JSON.stringify(a));
					alert("b:" + JSON.stringify(b));
					alert("c:" + JSON.stringify(c));
				});

            });

			//alert("init..");
			clLib.IAP.initialize();
			//alert("inited..");
//			clLib.IAP.restore();
//			alert("restored..");
//			clLib.IAP.renderIAPs($("#purchases_info")[0]);
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
			var successHandler = function() {
				clLib.UI.fillUIelements("users_verification", "users_verification");
			};
			
	        $("#users_verification_changePassword").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "setPwd" }}
					,function(returnObj) {
						//alert("password changed(" + JSON.stringify(returnObj) + ")");

						// Override current user info with response from signup callback..
						returnObj = JSON.parse(returnObj);
						returnObj["name"] = returnObj["username"];
						returnObj["displayName"] = returnObj["username"];
						returnObj["id"] = returnObj["username"];
						returnObj["image"] = {};
						returnObj["image"]["url"] = "";

						return clLib.PAGES.processAuthObj(JSON.stringify(returnObj));
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_verification", "users_verification");
					}
					);
				}
				, {text: "trying to set new password.."});
			});



		}
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users_verification", "users_verification");
        }
	}
    ,"trickGoogle": {
	    "pagecreate" : function (event, ui, pageId) {
            alert("2creating trickGoogle page..");
            alert("2SETTTTT timeout..");
            setTimeout(function() {
                alert("clicking login button..");
                $("#trickGoogle_googleLoginButton").click();
                alert("clicked login button..");
            }, 5000);

            var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            $("#trickGoogle_googleLoginButton").on("click", function () {
                clLib.auth.login({authType: "google"}
                    ,function() {
                        clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
                        clLib.PAGES.changeTo("clLib_startScreen.html");
					}
                    ,errorFunc);
            });
        }
    }
	,"users": {
	    "pagecreate" : function (event, ui, pageId) {

            //clLib.IAP.buy("Kurt_FullVersion", function(productId) { alert("buying..." + productId); });
            
            var clientOnlyAuth = function(authType) {
                clLib.auth.login({authType: authType}
                    ,function() {
                        clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
                        clLib.PAGES.changeTo("clLib_startScreen.html");
					}
                    ,errorFunc);
            };
            var serverSideOnlyAuth = function(authType) {
                var redirectURL = "";
                var appEntryURL = "";
                alert(1);
                var protocol = window.location.protocol;
                var host = window.location.host;
                var path = window.location.pathname;

                alert("document.location.href:" + document.location.href);
                alert("protocol:" + protocol);
                alert("host:" + host);
                alert("path:" + path);
                if(protocol && protocol != "") {
                    appEntryURL += protocol + "//";
                }
                if(host && host != "") {
                    appEntryURL += host + "/";
                }
/*                if(path.indexOf("/") == 0) {
                    path = path.substr(1);
                }*/
                appEntryURL += path.substring(0, path.lastIndexOf("/"));
                appEntryURL += "/index.html";
                
                //redirectURL = clLib.REST.clLibServerURI + "/getOAuth2URL?authType=google&clLib.redirectURL=" + window.location.protocol + "//" + window.location.host + "/dist/index.html";
                redirectURL = clLib.REST.clLibServerURI + "/getOAuth2URL?authType=" + authType + "&clLib.redirectURL=" + appEntryURL;
                alert("changing to " + redirectURL);
                clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
                clLib.PAGES.changeTo(redirectURL);

            };
            
            var inPhoneGap = function() {
                //alert("checking for phonegap..");
                //var resCode = window._cordovaNative;
                //alert("resCode is >" + resCode + "<");
//                return resCode;
                return true;
            }
            clLib.detectChildURLChange = function(childRef, callbackFunc) {
                if(inPhoneGap()) {
                    return childRef.addEventListener('loadstart', callbackFunc);
                }
                else {
                    var oldUrl = "";
                    var checkUrl = function(windowRef) {
                        setTimeout(function() {
                            var newUrl = windowRef.window.document.location.href;
                            if(newUrl != oldUrl) {
                                oldUrl = newUrl;
                                alert("child.window.href is >" + newUrl);

                                var dummyEvent = {};
                                dummyEvent.url = newUrl;

                                if(!callbackFunc(dummyEvent)) {
                                    return checkUrl(windowRef);
                                }
                            }
                            checkUrl(windowRef);
                        }
                        , 500);
                    };      
// debug!!!
/*
                    setTimeout(function() {
                        childRef.window.document.location.href = "http://www.kurt-climbing.com/dist/popopo.html";
                    }, 10000);
*/
// debug end!!!

                    return checkUrl(childRef);
                }
            };
            var phoneGapAuth = function(authType) {
                // Default authentication type to "google"..
                if(!authType || authType == '') {
                    authType = "google";
                }
              
                var redirectURL = "";
                var appEntryURL = "";
                appEntryURL = "http://www.kurt-climbing.com/dist/authenticated.html"
                redirectURL = clLib.REST.clLibServerURI + "/getOAuth2URL?authType=" + authType + "&clLib.redirectURL=" + appEntryURL + "&redirectURL=" + appEntryURL+ "&redirect_uri=" + appEntryURL;
                //alert("changing to " + redirectURL);
                clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");

//                clLib.PAGES.changeTo(redirectURL);
                var ref = window.open(redirectURL, '_blank', 'location=no');
//                ref.addEventListener('loadstart', function(event) { 
                clLib.detectChildURLChange(ref, 
                function(event) { 
                    var childURL = event.url;
                    //alert('child url changed to: ' + event.url); 
                    /*
                        detect end of oauth2 process..
                    */
                    if(childURL.indexOf(appEntryURL) == 0) {
                        //alert("authenticated url detected!" + childURL.substr(0,30));
  
                        ref.close(); 
                        setTimeout(function() { 
                            
                            if(childURL.indexOf("?authObj") == -1) {
                                alert("could not parse authObj from child browser URL!!!");
                            }
                            
                            var urlAuthObj = decodeURIComponent(
                                childURL.substring(
                                    childURL.indexOf("?authObj") + 9
                                )
                            );
                            //alert("decoded >" + JSON.stringify(urlAuthObj) + "<");

                            clLib.PAGES.processAuthObj(urlAuthObj);
                        }
                        ,50
                        );
                        // valid OAuth2 callback URL detected..
                        return true;
                    }
                    else {
                        // no valid OAuth2 callback URL yet..proceed with polling of childRef URL
                        return false;
                    }
                });
/*
                ref.addEventListener('loadstop', function(event) { 
                    //alert('stop: ' + event.url); 
                });
                ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
//                ref.addEventListener('exit', function(event) { alert("exit " + event.type); });
*/                
            };
            var authFunc;
//            authFunc = clientOnlyAuth;
//            authFunc = serverSideOnlyAuth;
            authFunc = phoneGapAuth;

            var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            $("#users_googleLoginButton").on("click", function () {
                return authFunc("google");
            });

            $("#users_facebookLoginButton").on("click", function () {
                return authFunc("facebook");
            });
            
			
			$("#users_preferencesButton").die("click").click(function () {
				clLib.PAGES.changeTo("clLib_preferences.html");
			});
            
			$("#users_clLoginButton").die("click").click(function () {
				clLib.PAGES.changeTo("clLib_users_clLogin.html");
			});
            
			$("#users_clLogoutButton").die("click").click(function () {
				clLib.setUserInfo({}, true);
				localStorage.setItem("currentPassword", null);
				clLib.sessionToken = "";
				clLib.PAGES.changeTo("clLib_startScreen.html");
			});

			
            
	    }
        , "pagebeforeshow": function (event, ui, pageId) {
            //alert("showing users page..");
			//alert("refreshing displayName..");
            clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
            //alert("refreshed displayName..");
            
			var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            
            clLib.UI.fillUIelements("users", "users");
        }
	}
	,"users_clLogin": {
	    "pagecreate" : function (event, ui, pageId) {
            $("#users_clLogin_loginButton").on("click", function () {
				//alert("login button clicked!");
	            clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "login", plainPwd : true}}
					,function(returnObj) {
						//alert("password changed(" + JSON.stringify(returnObj) + ")");

						// Override current user info with response from signup callback..
						returnObj["name"] = returnObj["username"];
						returnObj["displayName"] = returnObj["username"];
						returnObj["id"] = returnObj["username"];
						returnObj["image"] = {};
						returnObj["image"]["url"] = "";
						return clLib.PAGES.processAuthObj(JSON.stringify(returnObj));

					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
					}
					); 
				}
				, {text: "logging in"});
				
			});
			
	        $("#users_clLogin_logoutButton").on("click", function () {
				clLib.PAGES.changeTo("clLib_startScreen.html");
	        });
			
			
			$("#users_clLogin_signupButton").on("click", function () {
				//alert("signup button clicked!");
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
                            clLib.PAGES.changeTo("clLib_users.html");
                        }
						);

					}
					, function(e) {
						//alert("error " + JSON.stringify(e));
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
					}
					);
				}
				, {text: "creating user.."});
			});
			
			$("#users_clLogin_deleteButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "delete" }}
					,function() {
						clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
					}
					);
				}
				, {text: "deleting user.."});
	        });
			
	        $("#users_clLogin_forgotPwdButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "requestPwd" }}
					,function() {
						localStorage.setItem("loginError", "Use the token send to you by email to change your password.")
						clLib.PAGES.changeTo("clLib_users_verification.html");
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
					}
					);
				}
				, {text: "requesting password.."});
			});
	        
			$("#users_preferencesButton").die("click").click(function () {
				clLib.PAGES.changeTo("clLib_preferences.html");
			});
            


            
            
	    }
        , "pagebeforeshow": function (event, ui, pageId) {
            //alert("refreshing displayName..");
            clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
            //alert("refreshed displayName..");
            
			var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            
            clLib.UI.fillUIelements("users_clLogin", "users_clLogin");
            


        }
	}

	
	
	};



var eventsToBind = "pagecreate pagebeforeshow";

// bind "pagecreate"/"pagebeforeshow" events for all pages..
$("div[data-role=page]").die(eventsToBind).live(eventsToBind, function (event, ui) {
    clLib.PAGES.defaultHandler(event, ui);
});


clLib.PAGES.changeTo = function(newURL, urlData, event, timeoutMillis) {
	console.log("changing to " + newURL);

    clLib.UI.execWithMsg(function() {
        
        // If event is passed in, stop propagating it..
        if(event) {
            event.stopPropagation();
        }
        if(newURL.indexOf("clLib_") != -1) {
            var pageId = "";
            //alert(newURL.indexOf("clLib_") + 6);
            //alert(newURL.indexOf(".") - newURL.indexOf("clLib_"));
            
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
                    window.urlData = urlData;
                    $.mobile.navigate(newURL, urlData);	
                }, 
                function(e) { 
					alert("clLib.changeTo => error: " + e + "!!"); 
					return false;
				}
            );
            
        } else {
            alert("navigating to " + newURL);
            document.location.href = newURL;
            //$.mobile.navigate(newURL);	
        }

    }, {text: "changing pagiii.."}, timeoutMillis);

	
};





clLib.PAGES.processAuthObj = function(urlAuthObj) {
    var errorFunc = function(error) {
        alert("error >" + JSON.stringify(error));
    }

//    alert("Getting VALID authObj from URL params >" + urlAuthObj + "<");
    var authObj = JSON.parse(urlAuthObj);
//    alert("GOT VALID authObj from URL params");
	console.log("authObj:" + JSON.stringify(authObj));
    
    if(authObj) {
		try {
			//alert("authObj found...trying to process OAuth2 results..");
			//alert("authObj found(" + typeof(authObj) + "...trying to process OAuth2 results..");
			//alert("authObj keys: " + Object.keys(authObj));
			//alert("authObj >" + JSON.stringify(authObj) + "<");
	//                console.log("authObj2 >" + JSON.stringify(JSON.parse(decodeURI(authObj))) + "<");
			
			var userObj = {};
			userObj["password"] = authObj["password"];
			userObj["authType"] = authObj["authType"];
			userObj["accessToken"] = authObj["accessToken"];
			//alert("checking for displayname..");
			if(userObj["authType"] == 'google') {
				userObj["displayName"] = authObj.name.givenName || authObj.displayName;
			} else {
				userObj["displayName"] = authObj.name;
			}
			
			//alert("checking for image urll.");
			userObj["imageURL"] = authObj.image.url;
			userObj["username"] = authObj.id;
			
	//        alert("got userObj of >" + JSON.stringify(userObj) + "<");
			
			clLib.setUserInfo(userObj);
	//       alert("userinfo was set..");
			return clLib.login(
			function() {
	//                alert("12312312312logged in to " + userObj["authType"] + "..");
	//                clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");

	//                alert("changing to startscreen..");
					clLib.PAGES.changeTo("clLib_startScreen.html");
	//                alert("changed to startscreen..");
			}
			,errorFunc);
		} catch(e) { alert("ERROR OF TYPE "  + e.name + " IS " + e.message + " !!!"); };
    }
    else {
        alert("something weird happened, proceeding to start screen");
        setTimeout(function() {
            //console.log("changing to startscreen..");
            clLib.PAGES.changeTo("clLib_startScreen.html");
        }
        ,2000);
    }
};
