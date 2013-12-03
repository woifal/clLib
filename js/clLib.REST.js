"use strict";

clLib.REST = {};

clLib.clException= function(name, message) {
   this.message = message;
   this.name = name;
};

clLib.REST.baseURI = "https://api.appery.io/rest/1/db";
clLib.REST.baseCollectionsURI = clLib.REST.baseURI + "/collections/";
clLib.REST.baseUsersURI = clLib.REST.baseURI + "/users";

/*
*	retrieve => need to encode where string
*	insert => do NOT encore obj props
*/
clLib.REST.executeRetrieve = function (uri, method, whereObj, allowNoSessionToken) {
	if(whereObj) {
		whereObj = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	}
	var returnObj = clLib.REST.execAJAXRequest(uri, method, whereObj);
	return returnObj;
}
	

clLib.REST.executeInsert = function(uri, method, objData, allowNoSessionToken) {
	if(objData) {
		objData = JSON.stringify(objData);
	}
	var returnObj = clLib.REST.execAJAXRequest(uri, method, objData);
	return returnObj;
}
		
clLib.REST.execAJAXRequest = function (uri, method, params, allowNoSessionToken) {
	var request = clLib.REST.buildAJAXRequest(uri, method, params, null, allowNoSessionToken);

	var returnObj = {};
	$.ajax(request)
		.done(function(data) {
			clLib.loggi("ajax done " + JSON.stringify(data));
			returnObj = data;
		})
		.error(function(data) {
			throw new clLib.clException("AJAX", JSON.stringify(data));
			returnObj = null;
		})
	;

	clLib.loggi("returing returoIbj of " + JSON.stringify(returnObj));
	return returnObj;
	
};

		
clLib.REST.buildAJAXRequest = function(uri, method, getParams, headerParams, allowNoSessionToken) {
	var request = {
		async: false,
		url: uri,
		type: method,
		contentType: "application/json",
		accepts: "application/json",
		cache: true,
		dataType: 'json',
//		data: JSON.stringify("where=" + JSON.stringify(data)),
//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22+%3A+%22Kletterhalle+Wien%22%7D' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Host: api.appery.io' -H 'Origin: http://appery.io' -H 'Referer: http://appery.io/app/view/72918a4b-035e-44c2-ad30-c0740199fca3/startScreen.html' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f'

//curl 'https://api.appery.io/rest/1/db/collections/RouteLog?where=%7B%22Area%22%20:%20%22Kletterhalle%20Wien%22%7D' -H 'Host: api.appery.io' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate' -H 'DNT: 1' -H 'Content-Type: application/json' -H 'X-Appery-Database-Id: 52093c91e4b04c2d0a027d7f' -H 'Origin: null'

//		data: "where=" + encodeURIComponent("{\"Area\" : \"Kletterhalle Wien\"}"),
		data: getParams,
		beforeSend: function (xhr) {
//			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");
			xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
			xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
			xhr.setRequestHeader("Accept-Language", "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3");
			xhr.setRequestHeader("Connection", "keep-alive");
			xhr.setRequestHeader("DNT", "1");
//			xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0");
			xhr.setRequestHeader("X-Appery-Database-Id", "52093c91e4b04c2d0a027d7f");

            if(!allowNoSessionToken) {
		        // only allow REST calls for authenticated users..
			    xhr.setRequestHeader("X-Appery-Session-Token", localStorage.getItem("sessionToken"));
            }
			if (headerParams) {
			    $.each(headerParams, function (paramName, paramValue) {

			        xhr.setRequestHeader(paramName, paramValue);
			    });
			};
		},
		error: function(jqXHR) {
			clLib.loggi("ajax error " + jqXHR.status);
		}
	};
	return request;
}

clLib.REST.getEntities = function(entityName, whereObj) {
	var uri = clLib.REST.baseCollectionsURI + entityName;
	//clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
	var returnObj = {};
	returnObj[entityName] = clLib.REST.executeRetrieve(uri, 'GET', whereObj);

	clLib.loggi("returning(getEntities) " + JSON.stringify(returnObj));
	return returnObj;
}

clLib.REST.storeEntity = function (entityName, entityInstance) {
    var uri = clLib.REST.baseCollectionsURI + entityName;
    //clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
    var returnObj = clLib.REST.executeInsert(uri, 'POST', entityInstance);

    clLib.loggi("returning(storeEntity) " + JSON.stringify(returnObj));
    return returnObj;
}


clLib.REST.createUser = function (entityName, entityInstance) {
    var uri = clLib.REST.baseUsersURI;
    //alert("creating user >" + JSON.stringify(entityInstance) + "<");
    //clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
    var returnObj = clLib.REST.executeInsert(uri, 'POST', entityInstance, true);

    //alert("returning(storeEntity) " + JSON.stringify(returnObj));

    return returnObj;
}


clLib.REST.loginUser = function (entityName, entityInstance) {
    var uri = clLib.REST.baseURI + "/login";
    ;
    //alert("logging in >" + JSON.stringify(entityInstance) + "<");
    //clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
    var returnObj = clLib.REST.execAJAXRequest(uri, "GET", entityInstance, true);

    //alert("returning(storeEntity) " + JSON.stringify(returnObj));
    return returnObj;
}





