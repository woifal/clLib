"use strict"; 

function loadjscssfile(filename, filetype, successFunc, errorFunc, relativeURLPrefix){
	//alert("relalitvURLPrefix >" + relativeURLPrefix + "<");
	if(!(filename.indexOf("http://") == 0)) {
		if(relativeURLPrefix && relativeURLPrefix != "") {
			filename = relativeURLPrefix + "/" + filename;
		}
	}
	if (filetype=="js"){ //if filename is a external JavaScript file
		console.log("loading file " + filename);

		if(jQuery('script[src="' + filename + '"]').length > 0) {
			console.log("script >" + filename + "> was already loaded..");
			return successFunc();
		}
		else {
			console.log("script >" + filename + "> was not loaded yet..");
			
		}
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.onload = successFunc;
		fileref.setAttribute("src", filename)
		fileref.onerror = function(e) {
			console.log("could not load >" + filetype + "< file >" + filename + "< due to >" + e.message + "<");
			return successFunc();
		} 
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
		fileref.onload = successFunc;
		fileref.onerror = function(e) {
			console.log("could not load >" + filetype + "< file >" + filename + "< due to >" + e.message + "<");
			return successFunc();
		} 
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

}

var htmlFind =  function(html, tagName, propName) {
	var matches = [];
	
	if(propName) {

		var re = new RegExp("<" + tagName + "\\b(.*)" + propName + "=\"(.*?)\"(.*)>", "gm");

		var match = re.exec(html);
		while (match) {
			var scriptName = match[2];
			matches.push(scriptName);
			match = re.exec(html);
		}
		console.log("Done");
	}
	else {
		var regexpText = "<" + tagName + "(.*?)>([^]*?)<\/" + tagName + ">";
		console.log("regexpText is >" + regexpText + "<");
		var re = new RegExp(regexpText, "gm");

		var match = re.exec(html);
		while (match) {
			var htmlContent = match[2];
			matches.push(htmlContent);
			match = re.exec(html);
		}
		console.log("Done");
		
	}
	return matches;
};

var runForAll = function(matches, processFunc, errorFunc, nextFunc, currentIdx) {
	currentIdx = currentIdx || 0;
	if(currentIdx>= matches.length) {
		return nextFunc();
	}
	console.log("currentIdx " + currentIdx + "," + matches.length + ">" + matches[currentIdx]);
	
	return processFunc(matches[currentIdx], function() {
		return runForAll(matches, processFunc, errorFunc, nextFunc, currentIdx + 1);
	});
};

var loadPageIntoDOM = function(url, $targetEl, options) {
	console.log("loading into dom...");
	var successFunc = options["successFunc"];
	var errorFunc = options["errorFunc"];
	var relativeURLPrefix = options["relativeURLPrefix"];
	
	if(!errorFunc) {
		errorFunc = function(e) {
			alert("FUCK: " + e);
		};
	}
	
	
	
	var xSuccessFunc = function( html ) {
	//
	// load JS files
	// 
		var matches = htmlFind(html, "script", "src");
		console.log("GOT MATCHES >" + JSON.stringify(matches) + "<");
		runForAll(
			matches
			,function(fileName, successFunc, errorFunc) {
				loadjscssfile(fileName, "js", successFunc, errorFunc, relativeURLPrefix);
			}
			,errorFunc
			,function() {
	//
	// load CSS files
	// 
				var matches = htmlFind(html, "link", "href");
				console.log("GOT MATCHES >" + JSON.stringify(matches) + "<");
				runForAll(
					matches
					,function(fileName, successFunc, errorFunc) { 
						loadjscssfile(fileName, "css", successFunc, errorFunc, relativeURLPrefix)
					}
					,errorFunc
					,function() {
	//
	// load HTML content
	// 
						var matches = htmlFind(html, "body");
						$targetEl.append(matches[0]);
					}
				);
			}
		)
		;
	}
	//alert("loading url >" + url + "<");
	$.ajax({
		url: url
		,crossdomain: true
		,success: xSuccessFunc
		,error: function(e) {
			alert("Could not load external page: " + JSON.stringify(e));
		}
		,dataType: "html"
	});
/*	$.get(
		url
		,xSuccessFunc	
		,"html"
	)
	.fail(function(e) {
		alert("Could not load external page: " + JSON.stringify(e));
	});*/
}


