'use strict';

clLib.IAP = {
	 purchases: {}
	,fullVersionProductId: "KurtNonConsumable20140725_3"
	,list: [ /*'com.kurtclimbing.consumable', */'KurtNonConsumable20140725_3' /*, '870172895', 'Kurt_FullVersion', 'kurt_FullVersion', 'kurt_fullVersion' */]
	,products : {}
	,status : -1
};

clLib.IAP.LOADED = 1;
clLib.IAP.RESTORED = 2;
clLib.IAP.PURCHASED = 3;


clLib.IAP.handleError = function(errCode, errorFunc, contextStr, successFunc) {
	var ERROR_CODES_BASE = 4983497; 
	var ERR_SETUP    = ERROR_CODES_BASE + 1; 
	var ERR_LOAD     = ERROR_CODES_BASE + 2; 
	var ERR_PURCHASE = ERROR_CODES_BASE + 3; 
	var ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4; 
	var ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5; 
	var ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6; 
	var ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7; 
	var ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8; 
	var ERR_UNKNOWN             = ERROR_CODES_BASE + 10; 
					
	console.log(errCode + "--" + storekit.ERR_UNKNOWN);
	var errText = "";
	switch (errCode) {
		case ERR_SETUP:
			errText = "Cannot setup the plugin.";
			break;
		case ERR_LOAD:
			errText = "Cannot load IAPs from Apple servers.";
			break;
		case ERR_PURCHASE:
			errText = "Failed to purchase the item";
			break;
		case ERR_LOAD_RECEIPTS:
			errText = "Cannot load receipts from Apple servers.";
			break;
		case ERR_CLIENT_INVALID:
			errText = "Client doesn't support in-app purchase. (eg Simulator)";
			break;
		case ERR_PAYMENT_CANCELLED:
			errText = "User cancelled the payment.";
			return successFunc(clLib.IAP.RESTORED, contextStr ? (contextStr + ">" +errText + "<") : errText);
			break;
		case ERR_PAYMENT_INVALID:
			errText = "Problem with payment.";
			break;
		case ERR_PAYMENT_NOT_ALLOWED:
			errText = "Payment not allowed.";
			break;
		case ERR_UNKNOWN:
			errText = "Unknown error.";
			return successFunc(clLib.IAP.RESTORED, contextStr ? (contextStr + ">" +errText + "<") : errText);
			break;
		default: 
			errText = "REALLY unknown error.";
			return successFunc(clLib.IAP.RESTORED, contextStr ? (contextStr + ">" +errText + "<") : errText);		
	}
	return errorFunc(contextStr ? (contextStr + ">" +errText + "<") : errText);
};

clLib.IAP.initialize = function (successFunc, errorFunc) {
    // Check availability of the storekit plugin
    if (!window.storekit) {
        clLib.IAP.alertAndLog('In-App Purchases not available', true);
		return errorFunc('In-App Purchases not available');
    } else {
		try {
			// Initialize
			storekit.init({
				debug: true
				,ready: function() {
					return clLib.IAP.onReady(successFunc, errorFunc);
				}
				,purchase: function(transactionId, productId, receipt) {
					return clLib.IAP.onPurchase(transactionId, productId, receipt, successFunc, errorFunc);
				}
				,restore: function(transactionId, productId) {
					return clLib.IAP.onRestore(transactionId, productId, successFunc, errorFunc);
				}
				,restoreFailed: function(errCode) {
					return clLib.IAP.handleError(errCode, errorFunc, "restoreFailed", successFunc);
				}
				,restoreCompleted: function(a,b) {
					setTimeout(function() {
						return successFunc(clLib.IAP.RESTORED, "all restored");
					},
					3000);
				}

				,error: function(errorCode, errorMessage) {
					return clLib.IAP.onError(errorCode, errorMessage, errorFunc);
				}
			});

		}
		catch(e) {
			clLib.IAP.alertAndLog("error during IAP initialization: " + e, true);
			return errorFunc("error during IAP initialization: " + e);
		}
    }
};

clLib.IAP.onReady = function (successFunc, errorFunc) {
	try {
		clLib.IAP.alertAndLog("onReady called.."); //, true);
		// Once setup is done, load all product data.
		storekit.load(clLib.IAP.list, function (products, invalidIds) {
			clLib.IAP.alertAndLog('onReadyIAPs loading done:', false, clLib.UI.currentPage() + "_productIds");
			for (var j = 0; j < products.length; ++j) {
				var p = products[j];
				clLib.IAP.alertAndLog('onReady Loaded IAP(' + j + '). title:' + p.title +
							' description:' + p.description +
							' price:' + p.price +
							' id:' + p.id
					, false, clLib.UI.currentPage() + "_productIds");
				clLib.IAP.products[p.id] = p;
			}

			for (var i = 0; i < invalidIds.length; ++i) {
				clLib.IAP.alertAndLog('onReady Error: could not load ' + invalidIds[i]
				,true
				, clLib.UI.currentPage() + "_productIds"
				);
			}
			
			clLib.IAP.alertAndLog('onReady calling restore'); //, true);
			clLib.IAP.restore();

			return successFunc(clLib.IAP.LOADED, "onReady done");
		});
	} 
	catch(e) {
		return errorFunc("onReady >" + e + "<");
	}

};

clLib.IAP.onPurchase = function (transactionId, productId, receipt, successFunc, errorFunc) {
    try {
		clLib.IAP.alertAndLog("onPurchase IAP purchasing!-" + 
			typeof(transactionId) + '-' + 
			typeof(productId) + '-' + 
			typeof(receipt) + '-' + 
			typeof(successFunc) + '-' + 
			typeof(errorFunc) + '-'
		);
		
		//clLib.IAP.products[productId]["purchased"] = transactionId;
		
		//clLib.IAP.renderIAPs($("#purchases_info")[0]);

		if(productId == clLib.IAP.fullVersionProductId) {
			//alert("setting localStorage to Y!!!!");
			localStorage.setItem("fullVersion", "y");
		}
		
		return clLib.IAP.purchaseSuccessFunc();
	}
	catch(e) {
	

	return clLib.IAP.purchaseErrorFunc("onPurchase error >" + e + "<");
	}
};

clLib.IAP.onError = function (errorCode, errorMessage, errFunc) {
    clLib.IAP.alertAndLog('onError IAP error: ' + errorMessage, true);
	clLib.IAP.status = clLib.IAP.NOTHING;
	return errFunc("onError " + errorMessage);
};

clLib.IAP.onRestore = function (transactionId, productId, successFunc, errorFunc) {
	try {
		clLib.IAP.alertAndLog("onRestore IAP restored product id >" + productId + "< with transid " + transactionId + ".."
		, false , clLib.UI.currentPage() + "_restoredIds");
		
		//clLib.IAP.products[productId]["purchased"] = transactionId;
		
		if(productId == clLib.IAP.fullVersionProductId) {
			//alert("setting localStorage to Y!!!!");
			localStorage.setItem("fullVersion", "y");
		}
		return successFunc(clLib.IAP.LOADED, 'restored >' + productId + '<');
		//clLib.IAP.renderIAPs($("#purchases_info")[0]);
	}
	catch(e) {
		return errorFunc("onRestore error>" + e + "<");
	}
};

clLib.IAP.buy = function (productId, successFunc, errorFunc) {
    clLib.IAP.purchaseSuccessFunc = successFunc;
    clLib.IAP.purchaseErrorFunc = errorFunc;
    storekit.purchase(productId);
	
};

clLib.IAP.restore = function () {
    clLib.IAP.alertAndLog("restoring IAPs..");
	try  {
		storekit.restore();
	}
	catch(e) {
		clLib.IAP.alertAndLog("error during IAP restore: " + e);
	}
};



clLib.IAP.renderIAPs = function (el) {
  //alert("rendering iaps..");
  if (clLib.IAP.status = clLib.IAP.RESTORED) {
    var html = "<ul>";
    for (var id in clLib.IAP.products) {
      var prod = clLib.IAP.products[id];
      html += "<li>" + 
       "<h3>" + prod.title + "</h3>" +
       "<p>" + prod.description + "</p>" +
       "<button type='button' " +
       "onclick='clLib.IAP.buy(\"" + prod.id + "\")'>" +
       prod.price + "</button>" +
       "</li>";
    }
    html += "</ul>";
    el.innerHTML = html;
  }
  else {
    el.innerHTML = "In-App Purchases not available.";
  }
};

clLib.IAP.alertAndLog = function(text, withAlert, elId) {
	if(!elId) {
		elId = clLib.UI.currentPage() + "_debug";
	}
	if(withAlert) {
		alert(text);
	}
	console.log(">>" + text);
	$("#" + elId).append(text + "<br>");
	
};



clLib.IAP.hasFullVersion = function(successFunc, errorFunc) {

	//alert("checking localStorage >" + localStorage.getItem("fullVersion") + "<");

	if(localStorage.getItem("fullVersion") == 'y') return successFunc();
	return errorFunc("No full version purchased.");
}

