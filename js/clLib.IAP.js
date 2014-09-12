'use strict';

clLib.IAP = {
	 purchases: {}
	,fullVersionProductId: "KurtNonConsumable20140725_2"
	,availability: false
	,list: [ /*'com.kurtclimbing.consumable', */'KurtNonConsumable20140725_2' /*, '870172895', 'Kurt_FullVersion', 'kurt_FullVersion', 'kurt_fullVersion' */]
	,products : {}
};

clLib.IAP.hasFullVersion = function(successFunc, errorFunc) {
	//alert("checking localStorage >" + localStorage.getItem("fullVersion") + "<");

	if(localStorage.getItem("fullVersion") == 'y') return successFunc();
	return errorFunc("No full version purchased.");
}

clLib.IAP.hasPurchased = function(productId, successFunc, errorFunc) {
	if(clLib.IAP.products[productId] && clLib.IAP.products[productId]["purchased"]) {
		return successFunc();
	}
	else {
		return errorFunc("Product >" + productId + "< not purchased.");
	}
}

clLib.IAP.initialize = function () {
    // Check availability of the storekit plugin
    if (!window.storekit) {
        clLib.IAP.alertAndLog('In-App Purchases not available');
        return;
    } else {
		try {
			// Initialize
			storekit.init({
				ready:    clLib.IAP.onReady,
				purchase: clLib.IAP.onPurchase,
				restore:  clLib.IAP.onRestore,
				error:    clLib.IAP.onError
			});

			clLib.IAP.availability = true;
			clLib.IAP.alertAndLog("IAP available!!", null, true);
		}
		catch(e) {
			clLib.IAP.alertAndLog("error during IAP initialization: " + e);
		}
		
    }

};

clLib.IAP.alertAndLog = function(text, elId, noAlert) {
	if(!elId) {
		elId = "purchases_debug";
	}
	if(!noAlert) {
		alert(text);
	}
	$("#" + elId).append(text + "<br>");
};

clLib.IAP.onReady = function () {
    clLib.IAP.alertAndLog("IAP ready..", null, true);
	// Once setup is done, load all product data.
    storekit.load(clLib.IAP.list, function (products, invalidIds) {
        clLib.IAP.alertAndLog('IAPs loading done:', "purchases_productIds", true);
        for (var j = 0; j < products.length; ++j) {
            var p = products[j];
            clLib.IAP.alertAndLog('Loaded IAP(' + j + '). title:' + p.title +
                        ' description:' + p.description +
                        ' price:' + p.price +
                        ' id:' + p.id
				, "purchases_productIds", true);
            clLib.IAP.products[p.id] = p;
        }
        clLib.IAP.loaded = true;
        for (var i = 0; i < invalidIds.length; ++i) {
            clLib.IAP.alertAndLog('Error: could not load ' + invalidIds[i]
			, "purchases_productIds"
			);
        }
    });
	clLib.IAP.restore();
	clLib.IAP.renderIAPs($("#purchases_info")[0]);

};

clLib.IAP.onPurchase = function (transactionId, productId/*, receipt*/) {
    clLib.IAP.alertAndLog("IAP purchase..", null ,true);
	
	clLib.IAP.products[productId]["purchased"] = transactionId;
    
	clLib.IAP.renderIAPs($("#purchases_info")[0]);
	
	if (clLib.IAP.purchaseCallback) {
        clLib.IAP.purchaseCallback(productId);
    }
};

clLib.IAP.onError = function (errorCode, errorMessage) {
    clLib.IAP.alertAndLog('IAP error: ' + errorMessage);
};

clLib.IAP.onRestore = function (transactionId, productId/*, transactionReceipt*/) {
    clLib.IAP.alertAndLog("IAP restored product id >" + productId + "<with transid " + transactionId + ".."
	, "purchases_restoredIds", true);
	clLib.IAP.products[productId]["purchased"] = transactionId;
	// TESTING: assume any restored purchase indicates the full version..
	//alert("setting localStorage to Y");
	localStorage.setItem("fullVersion", "y");
};

clLib.IAP.buy = function (productId, callback) {
    clLib.IAP.purchaseCallback = callback;
    storekit.purchase(productId);
	
};

clLib.IAP.restore = function () {
    clLib.IAP.alertAndLog("restoring IAPs..", null, true);
	try  {
		storekit.restore();
	}
	catch(e) {
		clLib.IAP.alertAndLog("error during IAP restore: " + e);
	}
};



clLib.IAP.renderIAPs = function (el) {
  //alert("rendering iaps..");
  if (clLib.IAP.loaded) {
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
