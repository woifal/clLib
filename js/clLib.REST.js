"use strict";

clLib.REST = {};

clLib.REST.execute = function(uri, method, whereObj) {
	var getParams;
	if(whereObj) {
		getParams = "where=" + encodeURIComponent(JSON.stringify(whereObj));
	}
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
		},
		error: function(jqXHR) {
			console.log("ajax error " + jqXHR.status);
		}
	};
	return $.ajax(request);
}

clLib.REST.getEntities = function(entityName, whereObj) {
	var uri = "https://api.appery.io/rest/1/db/collections/" + entityName;
	//clLib.UI.showLoading("Loading " + entityName + " from server...", "xyxyx");
	var ajaxrequest = clLib.REST.execute(uri, 'GET', whereObj);
	var returnObj = {};
	ajaxrequest.done(function(data) {
		//alert("retrieved data " + JSON.stringify(data));
		//clLib.UI.hideLoading();
		returnObj[entityName] = data;//.responseText;
		//alert("returning " + JSON.stringify(returnObj));
	});
	//alert("2returning " + JSON.stringify(returnObj));
	return returnObj;
}