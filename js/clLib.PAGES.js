"use strict";
clLib.PAGES = {
    settings : {
        authStrategy : "phoneGapAuth"
    }
};

/*
*	Remove local storage items no longer used:
*	- currentLayout
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
		function(e) { alert("error!! >" + JSON.stringify(e) + "<"); }
        ,pageId + "." + eventName
	);


};


clLib.PAGES.executeChainedFuncs = function(funcArray, successFunc, errorFunc, contextStr) {
	var idx = -1;
	return clLib.PAGES.executeChainedFunc(funcArray, idx, successFunc, errorFunc, contextStr);
};
clLib.PAGES.executeChainedFunc = function(funcArray, idx, successFunc, errorFunc, contextStr) {
	idx++;
	console.log("page >" + contextStr + "<, idx = " + idx); // POPO

	var curFunc = funcArray[idx];
	
	console.log("typeof successFunc is " + typeof(successFunc));
	// Reached end of chain..
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
                ,contextStr
            );
        }
	},
	errorFunc
	);
};

clLib.PAGES.handlers = {
	1 : 1
    ,"appIndex": {
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
                        //alert("changing to startscreen..");
                        clLib.PAGES.changeTo("clLib_startScreen.html", null, event, 2500);
//                    }
//                    ,2500);
	            }, {text: "Loading app.."});
                

//2DO:
//    why 2500?
//    500 does not work on phonegap/iphone
//
            }
            if(urlAuthObj) {
                //
                // Store auth object to be processed by clLib.login later on..
                //
                clLib.UI.execWithMsg(function() {
                    clLib.auth.processAuthObj(urlAuthObj);
	            }, {text: "Processing authentication.."});
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
	        clLib.UI.byId$("buddiesButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_buddies.html");
	        });
	        clLib.UI.byId$("gradeConversionButton", pageId).die("click").live("click", function () {
	            clLib.PAGES.changeTo("clLib_gradeConversion.html");
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

	, "buy": {
	    "pagebeforeshow": function (event, ui) {
			
			//alert("showing buy.html(with >" + JSON.stringify(window._urlData) + "<)");

			var errorFunc = function(e) {
				console.log("ERROR FUNC called for >" + e + "<");
				clLib.UI.showLoading({"text" : "ERROR while loading IAP >" + e + "<"});

				setTimeout(function() {
					clLib.UI.hideLoading();
					clLib.PAGES.changeTo("clLib_startScreen.html");
				}, 5000);
				return;
			}
			
			var successFunc = function(IAPstatus, msg) {
//				alert("successfunc called with status >" + IAPstatus + "< and msg >" + msg + "<");
				if(IAPstatus < clLib.IAP.RESTORED) {
					//alert("...waiting for restore(" + IAPstatus + ")");
					clLib.UI.showLoading({"text" : "...waiting for restore(" + IAPstatus + ") >" + msg + "<"});
					return;
				}
				else {
					console.log("Restored!!!" + msg);
					return clLib.IAP.hasFullVersion(
						// yes, full version
						function() {
							clLib.UI.showLoading({"text" : "Redirecting to FULLVERSION page >" +  JSON.stringify(window._urlData) + "<.."});
							setTimeout(function() {
								clLib.UI.hideLoading();
								clLib.PAGES.changeTo(window._urlData.targetPage);
							}, 3000);
							return;
						}, 
						// no, free version
						function() {
							$("#buy_buyButton").off("click").on("click", function() {
								console.log("buy!");
								return clLib.IAP.buy(
									clLib.IAP.fullVersionProductId
									,function() {
										alert("1Successful purchase! Cheers!!");
										alert("1going to " + window._urlData.targetPage);
										return clLib.PAGES.changeTo(window._urlData.targetPage);
									}
									,errorFunc
								);
							});
							clLib.UI.hideLoading();

						}
					);
				}

			};


			setTimeout(function() {
				clLib.UI.showLoading({text: "IAPing..."});
			}, 0);

			clLib.IAP.initialize(
				successFunc,
				errorFunc
			);

			//alert("XXXXshowing purchases..");
			$("#purchases_initButton").on("click", function (e) {
				clLib.IAP.initialize(
					successFunc,
					errorFunc
				);
				clLib.IAP.renderIAPs($("#purchases_info")[0]);
            });
			$("#purchases_restoreButton").on("click", function (e) {
				clLib.IAP.restore(
					successFunc,
					errorFunc
				);
				clLib.IAP.renderIAPs($("#purchases_info")[0]);
            });

			/*			$("#purchases_buyButton").on("click", function (e) {
				alert("buying..");
				clLib.IAP.buy('com.kurtclimbing.consumable', function(a,b,c) {
					alert("a:" + JSON.stringify(a));
					alert("b:" + JSON.stringify(b));
					alert("c:" + JSON.stringify(c));
				});

            });*/
			
		}
	}

	
	,"AGB" : {
	    "pagecreate": function () {
	    }
		, "pagebeforeshow": function (e, ui) {
		}

	}
	,"gradeConversion" : {
	    "pagecreate": function () {
	    }
		, "pagebeforeshow": function (e, ui) {
			clLib.UI.fillUIelements();

		}

	}
	,"feedback" : {
	    "pagecreate": function () {
	        $("#feedback_save").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                clLib.UI.save({additionalData: { dbEntity: "feedback" }}, function() {
						alert("feedback sent!");
						clLib.UI.resetUIelements();
						clLib.PAGES.changeTo("clLib_startScreen.html");						
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
//                alert("reset!");
				clLib.PAGES.changeTo("clLib_startScreen.html");
//                history.back();
            });

            $("#preferences_saveButton").die("click").live("click", function () {
                    clLib.UI.save({}, function() {
						clLib.PAGES.changeTo("clLib_startScreen.html");
					});
            });

            $("#preferences_currentUserReadOnly").on("click", function () {
                //alert("user input field clicked!");
                clLib.PAGES.changeTo("clLib_users.html");
            });

		}
        , "pagebeforeshow": function (e, ui) {
            var $prevElement = $(ui.prevPage);//.prev();
			var prevTag = $prevElement.prop("tagName");
			var prevId = $prevElement.attr("id");

			
			if (!prevId || !prevId.endsWith("-dialog")) {
				clLib.UI.fillUIelements();
			}
		}
	}
	,"startScreen": {
	    "pagecreate": function () {
			// pre-fetch newRouteLog page..
	        // $.mobile.loadPage("clLib_preferences.html");
			$("#startScreen_areaButton").die("click").click(function() {
				$("#startScreen_areaButton_a").click();
			});
			
			$("#startScreen_noAreaButton").die("click").click(function() {
				localStorage.setItem("currentlySelectedArea", "");
				clLib.UI.fillUIelements();
			});
			$("#startScreen_areaSearchButton").die("click").click(function() {
				clLib.UI.execWithMsg(function() {
					clLib.PAGES.changeTo("clLib_areaSearch.html");
				}, {text: "Loading areas.."});
			});
			
			
/*			
                $("#cameraOptions").val(JSON.stringify({'targetWidth': '250px', 'targetHeight': '250px'}));
                        
			$("#startScreen_cameraButton").die("click").click(function() {
                var cameraOptions = { 
                    quality: 100
                    //destinationType: Camera.DestinationType.FILE_URI 
                    ,'targetWidth': '250px'
                    ,'targetHeight': '250px'
                };
                var addOptions = JSON.parse($("#cameraOptions").val());
                cameraOptions = $.extend(cameraOptions, addOptions);
                clLib.alert(JSON.stringify(cameraOptions));   
                navigator.camera.getPicture(onSuccess, onFail, cameraOptions);

                function onSuccess(imageURI) {
                    var image = document.getElementById('myImage');
                    image.src = imageURI;
                }

                function onFail(message) {
                    clLib.alert('Failed because: ' + message);
                }
			});
*/	
			$("#startScreen_statsButton").die("click").click(function () {
				clLib.UI.execWithMsg(function() {
					clLib.PAGES.changeTo("clLib_stats.html");
				}, {text: "Loading statistics.."});
	        });

            $("#startScreen_gradeConversionButton").die("click").click(function () {
				clLib.UI.execWithMsg(function() {
					clLib.PAGES.changeTo("clLib_gradeConversion.html");
				}, {text: "Loading grade conversion.."});
	        });
	        // Link to New Route page..
	        $("#clLib_addRouteButton").on("click", function (e) {
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
					var newRouteLogURL = "clLib_newRouteLog_" + currentLayout + ".html";

					clLib.PAGES.changeTo(newRouteLogURL);
					//$.mobile.navigate(newRouteLogURL);
				}, {text: "Loading page.."});
	        });

	    }
        , "pagebeforeshow" : function() {
            // Fill UI elements..
//	        alert("filling ui elements..");
			clLib.UI.fillUIelements();
		}
	}
	, "areaSearch": {
	    "pagecreate": function () {
			//alert("init!");
		}
        , "pagebeforeshow": function (e, ui) {
/*
            var $prevElement = $(ui.prevPage);//.prev();
			var prevTag = $prevElement.prop("tagName");
			var prevId = $prevElement.attr("id");
			//alert("showing page!(prev:" + prevTag + " #" + prevId + ")");
			
			if (!prevId || !prevId.endsWith("-dialog")) {
*/
//            alert("filling elemnts for areashearch..");
            clLib.UI.fillUIelements();
/*
			}
*/
		}
	}


	, "newRouteLog_default": {
	    "pagecreate": function () {
			//alert("init!");
			clLib.UI.buildRatingRadio($("#newRouteLog_default_ratingSelectWrapper"), "newRouteLog_default");
	        $("#newRouteLog_default_layoutSelect").val(localStorage.getItem("currentLayout"));
	        $("#newRouteLog_default_layoutSelect").selectmenu("refresh");


            $("#newRouteLog_default_removePictureButton").die("click").click(function() {
                clLib.UI.byId$("removePictureButton").hide();
                clLib.UI.byId$("getPictureButton").addClass("clFullWidth");
                clLib.UI.byId$("routeImg").attr("src", "");
                clLib.UI.byId$("routeImgContainer").hide();
                window["tmpImgObj"] = null;
            });
            

            $("#newRouteLog_default_getPictureButton").die("click").click(function() {
				alert("1yes, get picture..");
                clLib.alert("2yes, get picture..");
                if(clLib.inPhoneGap()) {
					clLib.alert("yes, in phonegap..");
                    //var addOptions = JSON.parse($("#cameraOptions").val());
                    //cameraOptions = $.extend(cameraOptions, addOptions);
                    clLib.alert(JSON.stringify(clLib.images.getCameraOptions()));   
                    navigator.camera.getPicture(
                        clLib.images.phonegapSuccessHandler
                        ,clLib.images.uploadErrorHandler
                        ,clLib.images.getCameraOptions()
                    );
                }
                else {
                    clLib.alert("desktop clicked...");
                    var hiddenFileInput = $("#newRouteLog_default_hiddenFileInput");
                    hiddenFileInput.off("change").on("change", function(e) {
                        clLib.alert("file changed");
                        var file = this.files[0];
                        return clLib.images.desktopSuccessHandler(   
                            file
                        );
                    });
                    hiddenFileInput.trigger("click");
                }
            });
            
            $("#newRouteLog_default_colourSelect-button").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                $("newRouteLog_default_colourPopup").listview('refresh', true);

                //alert("colourSelect (select) clicked!!!");
                $("#newRouteLog_default_colourButton_a").click();
                clLib.addCSSBackground("newRouteLog_default_colourPopup", {addClasses: "clColourBg"});

                $("#newRouteLog_default_colourPopup a").off("click").on("click", function (e) {
                    //alert("colour clicked >" + $(this).html() + "<");
                    $("#newRouteLog_default_colourSelect-button span").html($(this).html());
                    $("#newRouteLog_default_colourSelect-button span").removeClass().addClass("clCSSBg " + $(this).html());
                    $("#newRouteLog_default_colourSelect").trigger("setSelectedValue.clLib", 
                        { "value": $(this).html() }
                    );
                    clLib.UI.setSelectedValue(clLib.UI.byId$("colourSelect"), $(this).html());

                    $("#newRouteLog_default_colourPopup").popup("close");
                });
                
            });
	        $("#newRouteLog_default_extraButton").on("click", function () {
				$("#newRouteLog_default_extraButton_a").click();
			});
			$("#newRouteLog_default_colourButton").on("click", function () {
				$("#newRouteLog_default_colourButton_a").click();
                clLib.addCSSBackground("newRouteLog_default_colourPopup", {addClasses: "clColourBg"});
                $("#" + clLib.UI.currentPage() + "_colourSelect-listbox-popup")
                    .find(".ui-btn.clCSSBg.more.clColourBg").click(function(e) {
                        $("#" + clLib.UI.currentPage() + "_colourSelect")
                            .trigger("refresh.clLib", 
                            {
                                dependingOnOverride:1
                            })
                            ;
                    });
			});
			
		   //alert("444isave handler..");
	        $("#newRouteLog_default_save_tick").on("click", function () {
                var errorFunc = function(error) {
                    alert("error >" + JSON.stringify(error));
                }

                clLib.UI.execWithMsg(function() {
                    clLib.loggi("before saving..");
	                clLib.UI.save({}, function() {
                        clLib.loggi("saved!..");
						
                        alert("check for updated routes....");
                        return clLib.wasOnlineCheck(
                            function(resultObj) {
                                // clear UI elements's content
                                clLib.UI.resetUIelements();
                                clLib.loggi("UI elements reset!");
                                // scroll to top
                                $.mobile.silentScroll(0);
                                
                                return 1;
                            }
                            ,function(e) {
                                return errorFunc(e);
                            }
                        );

					}
                    ,errorFunc
                    );
	            }, {text: "Saving route logs.."}, 200);
	        });

			$("#newRouteLog_default_tickType input[type='checkbox']")
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
				clLib.UI.fillUIelements();
			}
		}
	}

	, "newRouteLog_reduced": {
	    "pagecreate": function () {
			//alert("init!");
			clLib.UI.buildRatingRadio($("#newRouteLog_reduced_ratingSelectWrapper"), "newRouteLog_reduced");
	        $("#newRouteLog_reduced_layoutSelect").val(localStorage.getItem("currentLayout"));
	        $("#newRouteLog_reduced_layoutSelect").selectmenu("refresh");

            $("#newRouteLog_reduced_removePictureButton").die("click").click(function() {
                clLib.UI.byId$("removePictureButton").hide();
                clLib.UI.byId$("getPictureButton").addClass("clFullWidth");
                clLib.UI.byId$("routeImg").attr("src", "");
                clLib.UI.byId$("routeImgContainer").hide();
                window["tmpImgObj"] = null;
            });
            

            $("#newRouteLog_reduced_getPictureButton").die("click").click(function() {
                if(clLib.inPhoneGap()) {
                    //var addOptions = JSON.parse($("#cameraOptions").val());
                    //cameraOptions = $.extend(cameraOptions, addOptions);
                    alert(JSON.stringify(cameraOptions));   
                    navigator.camera.getPicture(
                        clLib.images.phonegapSuccessHandler
                        ,clLib.images.uploadErrorHandler
                        ,clLib.images.getCameraOptions()
                    );
                }
                else {
                    clLib.alert("desktop clicked...");
                    var hiddenFileInput = $("#newRouteLog_default_hiddenFileInput");
                    hiddenFileInput.off("change").on("change", function(e) {
                        clLib.alert("file changed");
                        var file = this.files[0];
                        return clLib.images.desktopSuccessHandler(   
                            file
                        );
                    });
                    hiddenFileInput.trigger("click");
                }
            });
            
            $("#newRouteLog_reduced_colourSelect-button").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                $("newRouteLog_reduced_colourPopup").listview('refresh', true);

                //alert("colourSelect (select) clicked!!!");
                $("#newRouteLog_reduced_colourButton_a").click();
                clLib.addCSSBackground("newRouteLog_reduced_colourPopup", {addClasses: "clColourBg"});

                $("#newRouteLog_reduced_colourPopup a").off("click").on("click", function (e) {
                    //alert("colour clicked >" + $(this).html() + "<");
                    $("#newRouteLog_reduced_colourSelect-button span").html($(this).html());
                    $("#newRouteLog_reduced_colourSelect-button span").removeClass().addClass("clCSSBg " + $(this).html());
                    $("#newRouteLog_reduced_colourSelect").trigger("setSelectedValue.clLib", 
                        { "value": $(this).html() }
                    );
                    $("#newRouteLog_reduced_colourPopup").popup("close");
                });
                
            });
	        $("#newRouteLog_reduced_extraButton").on("click", function () {
				$("#newRouteLog_reduced_extraButton_a").click();
			});
			$("#newRouteLog_reduced_colourButton").on("click", function () {
				$("#newRouteLog_reduced_colourButton_a").click();
                clLib.addCSSBackground("newRouteLog_reduced_colourPopup", {addClasses: "clColourBg"});
                $("#" + clLib.UI.currentPage() + "_colourSelect-listbox-popup")
                    .find(".ui-btn.clCSSBg.more.clColourBg").click(function(e) {
                        $("#" + clLib.UI.currentPage() + "_colourSelect")
                            .trigger("refresh.clLib", 
                            {
                                dependingOnOverride:1
                            })
                            ;
                    });
			});
			

			//alert("444isave handler..");
	        $("#newRouteLog_reduced_save_tick").on("click", function () {
				clLib.UI.execWithMsg(function() {
	                clLib.UI.save({}, function() {
						// clear UI elements's content
						clLib.UI.resetUIelements();
						// scroll to top
						$.mobile.silentScroll(0);
					});
	            }, {text: "Saving route logs.."}, 200);
	        });

			$("#newRouteLog_reduced_tickType input[type='checkbox']")
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
				clLib.UI.fillUIelements();
			}
		}
	}
	
	, "stats": {
	    "pagecreate": function () {
			$("#stats_allDiagram").on("click", function () {
                clLib.PAGES.changeTo("clLib_diagram.html");
            });
            $("#stats_statsBuddiesButton").off("click").on("click", function () {
                //alert("clicked");
                $("#stats_statsBuddiesPopup").off("popupafterclose").on( "popupafterclose", function( event, ui ) {
                    //alert("popup closed..");
                    clLib.UI.fillUIelements();
                } );
                $("#stats_statsBuddiesPopup").popup( "open");
			});
		}
        , "pagebeforeshow": function () {
			//alert("show!");
	        //clLib.UI.fillUIelements();
        }
        , "pageshow": function () {
			clLib.UI.execWithMsg(
                function() {}
                ,{text: "loading.."}
            );

            //alert("shown!");
	        clLib.UI.fillUIelements();
        }
	}
	, "buddies": {
	    "pagecreate": function () {
		}
        , "pagebeforeshow": function () {
			//alert("show!");
	        clLib.UI.fillUIelements();
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

		
		}
		, "pagebeforeshow": function () {
			//alert("showing diagram..");
			
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
	}	
	,"users_verification": {
	    "pagecreate"	: function () {
			localStorage.setItem("notification", "");
			var successHandler = function() {
				clLib.UI.fillUIelements();
			};
			
	        $("#users_verification_changePassword").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "setPwd" }}
					,function(returnObj) {
						//
                        //  Process returned user info..
                        //
                        return clLib.auth.processAuthObj(returnObj);
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements();
					}
					);
				}
				, {text: "trying to set new password.."});
			});



		}
        , "pagebeforeshow": function () {
			clLib.UI.fillUIelements();
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
                var resCode = window.device;
                //alert("resCode is >" + resCode + "<");
                return resCode;
//                return false;
            }
            clLib.detectChildURLChange = function(childRef, callbackFunc) {
                if(clLib.inPhoneGap()) {
                    clLib.loggi("yes phonegap!!", "20150429");
                    return childRef.addEventListener('loadstart', callbackFunc);
                }
                else {
                    clLib.loggi("no phonegap..trying anyway..", "20150429");
                    var oldUrl = "";
                    var checkUrl = function(windowRef) {
                        setTimeout(function() {
                            var newUrl = "";
                            try {
                                newUrl = windowRef.window.document.location.href;
                            }
                            catch(e) {
                                newUrl = oldUrl;
                                console.error("could not get newUrl >" + e + ">");
                            }
                            
                            console.log("child.window.href was >" + oldUrl);
                            console.log("child.window.href is >" + newUrl);
                            if(newUrl != oldUrl) {
                                console.log("ok, check for userObj..");
                                oldUrl = newUrl;

                                var dummyEvent = {};
                                dummyEvent.url = newUrl;

                                if(!callbackFunc(dummyEvent)) {
                                    console.log("no success, checking again....");
                                    return checkUrl(windowRef);
                                } else {
                                    console.log("success!!");
                                }
                            } else {
                                checkUrl(windowRef);
                            }
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
                var host = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                console.log(">" + location.protocol+'< //>'+location.hostname+ '<>' + (location.port ? ':'+location.port: '') + '<');
                if(clLib.inPhoneGap()) {

                    appEntryURL = "http://www.kurt-climbing.com/dist/authenticated.html";
                }
                else {
                    appEntryURL = host + "/authenticated.html";
                }
                console.log("appEntryUrl is >" + appEntryURL + "<");
                redirectURL = clLib.REST.clLibServerURI + "/getOAuth2URL?authType=" + authType + "&clLib.redirectURL=" + appEntryURL + "&redirectURL=" + appEntryURL+ "&redirect_uri=" + appEntryURL;
                //alert("changing to " + redirectURL);
                clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");

//                clLib.PAGES.changeTo(redirectURL);
                var ref = window.open(redirectURL, '_blank', 'location=no');
//                ref.addEventListener('loadstart', function(event) { 
                clLib.detectChildURLChange(ref, 
                function(event) { 
                    var childURL = event.url;
                    console.error('child url changed to: ' + event.url, "20150430"); 
                    /*
                        detect end of oauth2 process..
                    */
                    if(childURL.indexOf(appEntryURL) == 0) {
                        //alert("authenticated url detected!" + childURL.substr(0,30));
  
//                        alert("closing child window..");
                        ref.close(); 
//                        alert("closed chld window..");
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

                            //
                            //  Store authObj to be processed by clLib.login later on..
                            //
                            clLib.auth.processAuthObj(urlAuthObj);
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
	
			$("#users_clLoginButton").die("click").click(function () {
				clLib.PAGES.changeTo("clLib_users_clLogin.html");
			});
			$("#users_clRegisterButton").die("click").click(function () {
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
            clLib.UI.fillUIelements();
            //alert("showing users page..");
			//alert("refreshing displayName..");
            clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
            //alert("refreshed displayName..");
            
			var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            
        }
	}
	,"users_clLogin": {
	    "pagecreate" : function (event, ui, pageId) {
            $("#users_clLogin_loginButton").on("click", function () {
				//alert("login button clicked!");
	            clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "login", plainPwd : true}}
					,function(returnObj) {
                        //
                        //  Process returned user info..
                        //
						return clLib.auth.processAuthObj(JSON.stringify(returnObj));

					}
					, function(e) {
						//alert("error during login..");
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements();
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
					,function(returnObj) {
						//
                        //  Process returned user info..
                        //
                        return clLib.auth.processAuthObj(JSON.stringify(returnObj));
					}
					, function(e) {
						//alert("error " + JSON.stringify(e));
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements();
					}
					);
				}
				, {text: "creating user.."});
			});
			
	        $("#users_clLogin_forgotPwdButton").on("click", function () {
				clLib.UI.execWithMsg(function() {
					clLib.UI.save({ additionalData: { action: "requestPwd" }}
					,function() {
						clLib.setUIMessage(new ClInfo("Check your email account for instructions on how to set a new password."), true);
						clLib.UI.fillUIelements();
					}
					, function(e) {
						clLib.loginErrorHandler(e);
						clLib.UI.fillUIelements();
					}
					);
				}
				, {text: "requesting password.."});
			});
            
	    }
        , "pagebeforeshow": function (event, ui, pageId) {
            //alert("filling elements");
			
			clLib.UI.fillUIelements();
            //alert("elements filled");
			//alert("refreshing displayName..");
            clLib.UI.byId$("displayName", pageId).trigger("refresh.clLib");
            //alert("refreshed displayName..");
            
			var errorFunc = function(error) {
                alert("error >" + JSON.stringify(error));
            }
            


        }
	}

	
	
	};


var eventsToBind = "pagecreate pagebeforeshow pageshow";

// bind "pagecreate"/"pagebeforeshow" events for all pages..
$("div[data-role=page]").die(eventsToBind).live(eventsToBind, function (event, ui) {
    clLib.PAGES.defaultHandler(event, ui);
});

clLib.PAGES.changeTo = function(newURL, urlData, event, timeoutMillis) {
	console.log("changing to " + newURL);

//    clLib.UI.execWithMsg(function() {
        
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
            console.log("evaluating page requisites for >" + pageId + "< and event >" + eventName + "<");
			var requisiteFunctions = (clLib.UI.pageRequisites[pageId] && clLib.UI.pageRequisites[pageId][eventName]) || [];

            clLib.loggi("requisiteFunctions is " + requisiteFunctions.length);
            clLib.PAGES.executeChainedFuncs(requisiteFunctions, 
                function() { 
                    //alert("success!!" + pageId ); 
                    newURL = "#" + pageId;
					console.log("navigating to >" + newURL + "<");
					$.mobile.navigate(newURL, $.extend(urlData, {"fuck": "me"}));	
                }, 
                function(e) { 
					alert("clLib.changeTo(" + newURL + " @" + pageId + "." + eventName + ") => error: " + e + "!!" + "(" + JSON.stringify(e) + ")"); 
					alert("erro stack >" + e.stack + "<");
					return false;
				}
                ,pageId + "." + eventName// for debugging: add page name for current prerequisite functions
            );
            
        } else {
            clLib.loggi("navigating to " + newURL, "20150429");
            document.location.href = newURL;
            //$.mobile.navigate(newURL);	
        }

//    }, {text: "changing pagiii.."}, timeoutMillis);

	
};






