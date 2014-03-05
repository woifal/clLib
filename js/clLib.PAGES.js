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
                    clLib.UI.save({}, function() {
						clLib.UI.resetUIelements("newRouteLog", "preferences");
						setTimeout(function () { clLib.UI.hideLoading(); history.back(); }, 1500);
					});
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
			
			$("#startScreen_statsButton").die("click").click(function () {
	            $.mobile.navigate("clLib_stats.html");
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

					$.mobile.navigate(newRouteLogURL);
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
	                clLib.UI.save({}, function() {
						clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
					});
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

	
	
	
	
	
	
	
	
	

	,"stats": {
	    "pageinit"	: function () {
//	4 Mar 22:22:21 - >{"13":{"count":2,"score":1275},"14":{"count":1,"score":400},"20":{"count":10,"score":3750},"21":{"count":2,"score":700},"22":{"count
//":1,"score":350},"23":{"count":8,"score":2800}}<


			var formatObjItem = function(itemObj, exprs) {
				var tmpStr = "";
				for(var i = 0; i < exprs.length; i++) {
					if(clLib.isFunction(exprs[i])) {
						tmpStr += exprs[i](itemObj);
					}
					else {
						tmpStr += itemObj[exprs[i]];
					}
				}
				return tmpStr;
			};

			var formatObj = function(resultObj, exprs) {
				//alert("formatting obj " + JSON.stringify(resultObj));
				var newArr =  [];
				for(var i = 0; i < resultObj.length; i++) {
					newArr.push(formatObjItem(resultObj[i], exprs));
				}
				//alert("returning formatted obj " + JSON.stringify(newArr));
				return newArr;
			};

			var formatObjInt = function(resultObj, exprs) {
				//alert("formatting obj " + JSON.stringify(resultObj));
				var newArr =  [];
				for(var i = 0; i < resultObj.length; i++) {
					newArr.push(parseInt(formatObjItem(resultObj[i], exprs)));
				}
				//alert("returning formatted obj " + JSON.stringify(newArr));
				return newArr;
			};



			var getObjValues = function(resultObj) {
				var values = [];
				for(var key in resultObj) {
					values.push(resultObj[key]);
				}
				//alert("values are " + JSON.stringify(values));
				return values;
			};


			var successHandler = function(resultObj) {
				resultObj = JSON.parse(resultObj);
				//alert("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));
				
				var graphLabels = formatObj(Object.keys(resultObj), [function(x) { return "__" + x + "__";}]);
				
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
							data : formatObjInt(getObjValues(resultObj), [function(x) { return parseInt(x.score); }])
						}
/*						,{
							fillColor : "rgba(151,187,205,0.5)",
							strokeColor : "rgba(151,187,205,1)",
							pointColor : "rgba(151,187,205,1)",
							pointStrokeColor : "#fff",
							data : [28,48,40,19,96,27,100]
						}*/
					]
				};
				
				//Get the context of the canvas element we want to select
				var ctx = document.getElementById("statsChart").getContext("2d");
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
	    "pageinit"	: function () {
			localStorage.setItem("notification", "");
			var userEntity = {
				"username" : localStorage.getItem("currentUser") 
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
	,"users_signup": {
	    "pageinit"	: function () {
			localStorage.setItem("notification", "");
			var successHandler = function() {
				clLib.UI.fillUIelements("users_signup", "users_signup");
			};
			

			$("#users_signupButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "create" }}
					, function(returnObj) {
						//clLib.UI.fillUIelements("users_signup", "users_signup");
					
						alert("got login response " + JSON.stringify(returnObj));
						localStorage.setItem("currentUser", returnObj["username"]);
						localStorage.setItem("currentPassword", returnObj["password"]);

						// login..
						clLib.login(function() {
						// ..and return to startPAge..
						alert("Successfully signed up!");
						$.mobile.navigate("clLib_startScreen.html");
						}
						, function(e) {
							clLib.loginErrorHandler(e);
							clLib.UI.fillUIelements("users_signup", "users_signup");
						}
						);

					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements("users_signup", "users_signup");
					}
					);
				}
				, {text: "creating user.."});
			});

		}
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements("users_signup", "users_signup");
        }
	}
	,"users": {
	    "pageinit"	: function () {

	        $("#users_loginButton").on("click", function () {
	            clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "login", plainPwd : true }}
					,function() {
						clLib.UI.fillUIelements("users", "users");
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
	        $("#users_newUserButton").on("click", function () {
				$.mobile.navigate("clLib_users_signup.html");
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








var graphOptions = {
				
	//Boolean - If we show the scale above the chart data			
	scaleOverlay : false,
	//Boolean - If we want to override with a hard coded scale
	scaleOverride : false,
	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps : null,
	//Number - The value jump in the hard coded scale
	scaleStepWidth : null,
	//Number - The scale starting value
	scaleStartValue : null,
	//String - Colour of the scale line	
	scaleLineColor : "rgba(0,0,0,.1)",
	//Number - Pixel width of the scale line	
	scaleLineWidth : 1,
	//Boolean - Whether to show labels on the scale	
	scaleShowLabels : true,
	//Interpolated JS string - can access value
	scaleLabel : "<%=value%>",
	//String - Scale label font declaration for the scale label
	scaleFontFamily : "'Arial'",
	//Number - Scale label font size in pixels	
	scaleFontSize : 12,
	//String - Scale label font weight style	
	scaleFontStyle : "normal",
	//String - Scale label font colour	
	scaleFontColor : "#666",	
	//Boolean - Whether grid lines are shown across the chart
	scaleShowGridLines : true,
	//String - Colour of the grid lines
	scaleGridLineColor : "rgba(0,0,0,.05)",
	//Number - Width of the grid lines
	scaleGridLineWidth : 1,	
	//Boolean - Whether the line is curved between points
	bezierCurve : true,
	//Boolean - Whether to show a dot for each point
	pointDot : true,
	//Number - Radius of each point dot in pixels
	pointDotRadius : 3,
	//Number - Pixel width of point dot stroke
	pointDotStrokeWidth : 1,
	//Boolean - Whether to show a stroke for datasets
	datasetStroke : true,
	//Number - Pixel width of dataset stroke
	datasetStrokeWidth : 2,
	//Boolean - Whether to fill the dataset with a colour
	datasetFill : true,
	//Boolean - Whether to animate the chart
	animation : true,
	//Number - Number of animation steps
	animationSteps : 60,
	//String - Animation easing effect
	animationEasing : "easeOutQuart",
	//Function - Fires when the animation is complete
	onAnimationComplete : null
};
			