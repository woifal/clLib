"use strict";

clLib.REST = {};

clLib.clException= function(name, message) {
   this.message = message;
   this.name = name;
};

clLib.REST.baseURI = "http://localhost:1983/db";
clLib.REST.baseURI = "http://cllibserver.herokuapp.com/db";
clLib.REST.baseCollectionsURI = clLib.REST.baseURI+ "/"; // + "/collections/";
clLib.REST.baseUsersURI = clLib.REST.baseURI + "/users";
clLib.REST.clLibServerURI = "http://localhost:1983";
clLib.REST.clLibServerURI = "http://cllibserver.herokuapp.com";



// prepare REST handler for appery.io results..
clLib.REST.appery = {};
clLib.REST.clNode = {};

clLib.REST.appery.dateStrToISOString = function(apperyDateStr) {
    //console.log("-----");
	var newStr = apperyDateStr;
		
	var datepattern = /(....)-(..)-(..)(.)(..):(..):(..)(\.*)(.*)/;
	//console.log("matching " + apperyDateStr);
	var	matches = apperyDateStr.match(datepattern);
	var year = matches[1],
	month = matches[2],
	day = matches[3],
	hour = matches[5],
	minute = matches[6],
	second = matches[7],
	milli = matches[9]
	;
    /*
    console.log ('year = ' + year);
    console.log ('month = ' + month);
    console.log ('day = ' + day);
    console.log ('hour = ' + hour);
    console.log ('minutes = ' + minute);
    console.log ('seconds = ' + second);
    console.log ('millis  = ' + milli);
		*/
    newStr = 
        year + "-" + month + "-" + day + 
        "T" + 
        hour + ":" + minute + ":" + second + 
        "." + clLib.rpad(milli, "0", 3) + "Z";
	//console.log("newStr " + newStr);

	return newStr;
};


// ApperyIO result:
// Remaps defined colums in AJAX result object(Array of rows(=>objects)
//
clLib.REST.appery.postAJAXprocessing = function(AJAXResult) {
	var colsToRemap ={
		"_createdAt": clLib.REST.appery.dateStrToISOString,
		"_updatedAt": clLib.REST.appery.dateStrToISOString
	};
	console.log("before:" + JSON.stringify(AJAXResult));
	$.each(AJAXResult, function(index, value) {
		$.each(colsToRemap, function(colName, remapFunc) {
			if(AJAXResult[index][colName]) {
				AJAXResult[index][colName]= remapFunc(AJAXResult[index][colName]);
			}
		});
	});
	console.log("after:" + AJAXResult.length);
	return AJAXResult;
};
clLib.REST.clNode.postAJAXprocessing = function(AJAXResult) {
	if(typeof(AJAXResult) == "string") {
		AJAXResult = JSON.parse(AJAXResult);
	}
	var colsToRemap ={
		"_createdAt": clLib.REST.appery.dateStrToISOString,
		"_updatedAt": clLib.REST.appery.dateStrToISOString
	};
	console.log("before:" + JSON.stringify(AJAXResult));
	if(AJAXResult instanceof Array) {
        $.each(AJAXResult, function(index, value) {
            $.each(colsToRemap, function(colName, remapFunc) {
                if(AJAXResult[index][colName]) {
                    AJAXResult[index][colName]= remapFunc(AJAXResult[index][colName]);
                }
            });
        });
    } 
    else if(typeof AJAXResult == "object") {
        $.each(colsToRemap, function(colName, remapFunc) {
            if(AJAXResult[colName]) {
                AJAXResult[colName]= remapFunc(AJAXResult[colName]);
            }
        });
    }
    
	console.log("after:" + JSON.stringify(AJAXResult));
	return AJAXResult;
};

clLib.REST.postAJAXprocessing = {
	"x": "y"
	,"https://api.appery.io/rest/1/db" : clLib.REST.appery.postAJAXprocessing
	,"http://localhost:1983/db" : clLib.REST.clNode.postAJAXprocessing
	,"http://cllibserver.herokuapp.com/db" : clLib.REST.clNode.postAJAXprocessing
};

/*
*	retrieve => need to encode where string
*	insert => do NOT encode obj props
*/
clLib.REST.executeRetrieve = function (uri, method, whereObj, successFunc, errorFunc) {
	var whereObj;
	if(whereObj) {
		whereObj = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	}
	var reqOptions = {};
	reqOptions["uri"] = uri;
	reqOptions["method"] = method;
	reqOptions["params"] = whereObj
	
	clLib.REST.execAJAXRequest(reqOptions, successFunc, errorFunc);
}
	

clLib.REST.executeInsert = function(uri, method, objData, successFunc, errorFunc) {
	if(objData) {
		objData = JSON.stringify(objData);
	}
	var reqOptions = {};
	reqOptions["uri"] = uri;
	reqOptions["method"] = method;
	reqOptions["params"] = objData

	clLib.REST.execAJAXRequest(reqOptions, successFunc, errorFunc);
}
		
//clLib.REST.execAJAXRequest = function (uri, method, params, allowNoSessionToken) {
clLib.REST.execAJAXRequest = function (options, successFunc, errorFunc) {
	var request = clLib.REST.buildAJAXRequest(
		options
		, successFunc
		, errorFunc
	);
	
	//alert("doing ajax");
	return $.ajax(request);
	console.log("should not get here!!! 123123");
	
};

		
clLib.REST.buildAJAXRequest = function(options, successFunc, errorFunc) {
	
	var request = {
		async: false,
		url: options["uri"],
		type: options["method"],
		contentType: "application/json",
		accepts: "application/json",
		cache: true,
		dataType: 'json',
//		data: JSON.stringify("where=" + JSON.stringify(data)),
//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22+%3A+%22Kletterhalle+Wien%22%7D' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Host: api.appery.io' -H 'Origin: http://appery.io' -H 'Referer: http://appery.io/app/view/72918a4b-035e-44c2-ad30-c0740199fca3/startScreen.html' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f'

//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22%20:%20%22Kletterhalle%20Wien%22%7D' -H 'Host: api.appery.io' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate' -H 'DNT: 1' -H 'Content-Type: application/json' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f' -H 'Origin: null'

//		data: "where=" + encodeURIComponent("{\"Area\" : \"Kletterhalle Wien\"}"),
		data: options["params"],
		beforeSend: function (xhr) {
//			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");
			xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
			xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
			xhr.setRequestHeader("Accept-Language", "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3");
			xhr.setRequestHeader("Connection", "keep-alive");
			xhr.setRequestHeader("DNT", "1");
//			xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0");
			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");

            if(!options["allowNoSessionToken"]) {
		        // only allow REST calls for authenticated users..
			    xhr.setRequestHeader("clSessionToken", clLib.sessionToken);
			    xhr.setRequestHeader("clUserName", clLib.getUserInfo()["username"]);
            }
			if (options["headerParams"]) {
			    $.each(options["headerParams"], function (paramName, paramValue) {
			        xhr.setRequestHeader(paramName, paramValue);
			    });
			};
		}
		,success: successFunc
        ,error: function(jqXHR, textStatus, errorThrown) {
			//alert("an error..." + textStatus);
			//return errorFunc(new clLib.clException("AJAX", JSON.stringify(data));
			return errorFunc(jqXHR || (textStatus + ">>" + errorThrown));
		}
//		,timeout: 200
	};
	clLib.loggi("request built..");
	return request;
}

clLib.REST.getEntities = function(entityName, whereObj, successFunc, errorFunc) {
	var uri = clLib.REST.baseCollectionsURI + entityName;

	clLib.REST.executeRetrieve(uri, 'GET', whereObj, 
	function(AJAXResult) {
		var returnObj = {};
		console.log("result first " + JSON.stringify(AJAXResult));
		//alert("postfunc for >" + clLib.REST.baseURI + "< is >" + clLib.REST.postAJAXprocessing[clLib.REST.baseURI] + "(" + clLib.REST.postAJAXprocessing + ")<");
		AJAXResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
		returnObj[entityName] = AJAXResult;
		clLib.loggi("return type "+ typeof(AJAXResult));
		
		//clLib.loggi("returning(getEntities) " + JSON.stringify(returnObj));
		successFunc(returnObj);
	}
	, errorFunc);
}

clLib.REST.updateEntity = function (entityName, entityInstance, successFunc, errorFunc) {
    var uri = clLib.REST.baseCollectionsURI + entityName + "/" + entityInstance["_id"];
	delete(entityInstance["_id"]);
    clLib.REST.executeInsert(uri, 'PUT', entityInstance, 
	function(AJAXResult) {
		AJAXResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
		successFunc(AJAXResult);
	}
	, errorFunc);
}


clLib.REST.storeEntity = function (entityName, entityInstance, successFunc, errorFunc) {
    var uri = clLib.REST.baseCollectionsURI + entityName;
    console.log("!!inserting " + JSON.stringify(entityInstance));
    clLib.REST.executeInsert(uri, 'POST', entityInstance, 
	function(AJAXResult) {
        console.log("inserted at >" + uri + "< and got result >" + JSON.stringify(AJAXResult) + "<");
		AJAXResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
		successFunc(AJAXResult);
	}
	, errorFunc);
}


clLib.REST.createUser = function (userInstance, successFunc, errorFunc) {
	var uri = clLib.REST.clLibServerURI + "/signup";

    clLib.REST.executeInsert(uri, 'POST', userInstance, successFunc, errorFunc);
}


clLib.REST.loginUser = function (userInstance, successFunc, errorFunc) {
    var reqOptions = {};
	reqOptions["uri"] = clLib.REST.clLibServerURI + "/login";
	reqOptions["method"] = "GET";
	reqOptions["params"] = userInstance;
	reqOptions["allowNoSessionToken"] = true;
	clLib.REST.execAJAXRequest(reqOptions
        ,function(userObj) {
            alert("success login with >" + JSON.stringify(userObj) + "<");
            return successFunc(userObj);
        }
        ,errorFunc);
}

clLib.REST.deleteUser = function (userInstance, successFunc, errorFunc) {
    var reqOptions = {};
	reqOptions["uri"] = clLib.REST.clLibServerURI + "/deleteUser";
	reqOptions["method"] = "GET";
	reqOptions["params"] = userInstance;
	reqOptions["allowNoSessionToken"] = true;
	clLib.REST.execAJAXRequest(reqOptions, successFunc, errorFunc);
}

clLib.REST.changePassword = function (options, callbackFunc, errorFunc) {
	options.uri = clLib.REST.clLibServerURI + "/setPassword";
	clLib.REST.execGET(options, callbackFunc, errorFunc);
}

clLib.REST.requestVerification = function(options, callbackFunc, errorFunc) {
	options.uri = clLib.REST.clLibServerURI + "/requestVerification";
	clLib.REST.execGET(options, callbackFunc, errorFunc);
};

clLib.REST.requestStats = function(options, callbackFunc, errorFunc) {
	var uri = clLib.REST.clLibServerURI + "/stats";

	clLib.REST.executeRetrieve(uri, 'GET', options.where, 
	function(AJAXResult) {
		console.log("result first " + JSON.stringify(AJAXResult));
		//AJAXResult = clLib.REST.postAJAXprocessing[clLib.REST.baseURI](AJAXResult);
		
		//clLib.loggi("returning(getEntities) " + JSON.stringify(returnObj));
		callbackFunc(AJAXResult);
	}
	, errorFunc);
};

clLib.REST.execGET = function(options, callbackFunc, errorFunc) {
	var reqOptions = {};
	reqOptions["uri"] = options.uri;
	reqOptions["method"] = "GET";
	reqOptions["params"] = options.entityInstance;
	reqOptions["allowNoSessionToken"] = true;
	
	clLib.REST.execAJAXRequest(reqOptions, callbackFunc, errorFunc);
};
