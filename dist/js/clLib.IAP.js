'use strict';

clLib.IAP = {
	 purchases: {}
	,fullVersionProductId: "com.kurtclimbing.consumable"
	,availability: false
	,list: [ 'com.kurtclimbing.consumable' /*, '870172895', 'Kurt_FullVersion', 'kurt_FullVersion', 'kurt_fullVersion' */]
	,products : {}
};

clLib.IAP.hasFullVersion = function(successFunc, errorFunc) {
	return clLib.IAP.hasPurchased(clLib.IAP.fullVersionProductId, successFunc, errorFunc);
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
		}
		catch(e) {
			clLib.IAP.alertAndLog("error during IAP initialization: " + e);
		}
		
		clLib.IAP.availability = true;
		clLib.IAP.alertAndLog("IAP available!!");
    }

};

clLib.IAP.alertAndLog = function(text, elId) {
	if(!elId) {
		elId = "purchases_debug";
	}
	alert(text);
	$("#" + elId).append(text);
};

clLib.IAP.onReady = function () {
    // Once setup is done, load all product data.
    storekit.load(clLib.IAP.list, function (products, invalidIds) {
        clLib.IAP.alertAndLog('IAPs loading done:', "purchases_productIds");
        for (var j = 0; j < products.length; ++j) {
            var p = products[j];
            clLib.IAP.alertAndLog('Loaded IAP(' + j + '). title:' + p.title +
                        ' description:' + p.description +
                        ' price:' + p.price +
                        ' id:' + p.id
				, "purchases_productIds");
            clLib.IAP.products[p.id] = p;
        }
        clLib.IAP.loaded = true;
        for (var i = 0; i < invalidIds.length; ++i) {
            clLib.IAP.alertAndLog('Error: could not load ' + invalidIds[i]
			, "purchases_productIds"
			);
        }
    });
};

clLib.IAP.onPurchase = function (transactionId, productId/*, receipt*/) {
    clLib.IAP.products[productId]["purchased"] = transactionId;
    
	if (clLib.IAP.purchaseCallback) {
        clLib.IAP.purchaseCallback(productId);
    }
};

clLib.IAP.onError = function (errorCode, errorMessage) {
    clLib.IAP.alertAndLog('Error: ' + errorMessage);
};

clLib.IAP.onRestore = function (transactionId, productId/*, transactionReceipt*/) {
    clLib.IAP.alertAndLog("restored product id >" + productId + "<" + "with transid " + transactionId + ".."
	, "purchases_restoredIds");
	clLib.IAP.products[productId]["purchased"] = transactionId;
};

clLib.IAP.buy = function (productId, callback) {
    clLib.IAP.purchaseCallback = callback;
    storekit.purchase(productId);
};

clLib.IAP.restore = function () {
    clLib.IAP.alertAndLog("restoring..");
	try  {
		storekit.restore();
	}
	catch(e) {
		clLib.IAP.alertAndLog("error during IAP initialization: " + e);
	}
		
    
};



clLib.IAP.renderIAPs = function (el) {
  alert("rendering iaps..");
  if (clLib.IAP.loaded) {
    var html = "<ul>";
    for (var id in clLib.IAP.products) {
      var prod = clLib.IAP.products[id];
      html += "<li>" + 
       "<h3>" + prod.title + "</h3>" +
       "<p>" + prod.description + "</p>" +
       "<button type='button' " +
       "onclick='IAP.buy(\"" + prod.id + "\")'>" +
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
