"use strict";

clLib.UI = {
	"NOTSELECTED": {
		text : "UNKNOWN",
		value : "__UNKNOWN__"
	}
};


clLib.UI.killEventHandlers = function($element, eventName) {
	$element.die(eventName);
	$element.off(eventName);
	$element.unbind(eventName);
}


clLib.UI.setSelectedValue = function($element, newValue) {
	//alert("triggering setSelectedValue.clLib on " + $element.attr("id") + " with value " + JSON.stringify(newValue));
	$element.trigger("setSelectedValue.clLib", 
		{ "value": newValue }
	);
};



clLib.populateListView = function($list, dataObj, formatFunc){
	$list.empty();
	$.each(dataObj, function(index, value) {
		var itemValue;
		if(formatFunc) {
			itemValue = formatFunc(value);
		}
		else {
			itemValue = value;
		}
		var $listItem = $('<li></li>')
                .html(itemValue);
		$list.append($listItem);
	});
	$list.listview('refresh', true);
};


clLib.populateSelectBox = function(options) {
	var defaultOptions = {
		preserveCurrentValue : false
	};
	$.extend(defaultOptions, options);

/*
	var oldEventHandler = function() {clLib.loggi("undefined event handler");};
	clLib.loggi("oldEventHandler = " + options.selectBoxElement.attr("id") + ">" + JSON.stringify(options.selectBoxElement.data("events")));
	// remember current onChange Handler
	if(options.selectBoxElement.data("events")) {
		oldEventHandler = options.selectBoxElement.data("events")['change.clLib'][0].handler;
		clLib.loggi("oldEventHandler " + JSON.stringify(oldEventHandler));
*/
		// disable current onChange handler
	var selectBoxId = options.selectBoxElement.attr('id');
	clLib.loggi("killing event handlers for  " + selectBoxId);

	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");
/*
	}
*/
	var needRefresh = clLib.populateSelectBox_plain(
		options.selectBoxElement,
		options.dataObj,
		options.selectedValue,
		options.preserveCurrentValue,
		options.additionalValue
	);

	var customChangeHandler = clLib.UI.elements[selectBoxId]["changeHandler"];
	if(customChangeHandler) {
		//clLib.loggi("custom event handler for " + selectBoxId + "found.." + customChangeHandler);
	}
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;

	options.selectBoxElement.bind("change.clLib", function(event, changeOptions) {
		changeHandler($(this), changeOptions);
	});

	
	if(needRefresh) {
		options.selectBoxElement.trigger("change.clLib", options.changeOptions);
	}

};

clLib.populateSelectBox_plain = function($selectBox, dataObj, selectedValue, preserveCurrentValue, additionalValue){
	var oldValue = $selectBox.val();
	var oldValueFound = true;
	if(preserveCurrentValue && oldValue) {
		//clLib.loggi("preserving >" + oldValue + "<");
		selectedValue = oldValue;
		oldValueFound = false;
	}
	
	$selectBox.empty();
	if(additionalValue) {
		var $option = $('<option></option>');
		if(additionalValue instanceof Object) {
			$option
				.val(additionalValue["value"])
				.html(additionalValue["text"]);
		} else {
			$option
				.val(additionalValue)
				.html(additionalValue);
		}
		$selectBox.append($option);
	}
	
	if(dataObj instanceof Array && dataObj.length == 1) {
		clLib.loggi("Yes, array...take first element.." + JSON.stringify(dataObj));
		selectedValue = dataObj[0];
	} else if(dataObj instanceof Object && Object.keys(dataObj).length == 1) {
		clLib.loggi("Yes, object...take first element.." + JSON.stringify(dataObj));
		selectedValue = Object.keys(dataObj)[0];
	}

	var i = 0;
	$.each(dataObj, function(index, value) {
		//clLib.loggi("adding option " + value);
		var $option = $('<option></option>')
                .val(dataObj instanceof Array ? value : index)
                .html(value);
		//clLib.loggi("comp " + value + " + against " + selectedValue);
		if(value == selectedValue) {
			clLib.loggi("Found old value..");
			$option.attr("selected", "selected");
			oldValueFound = true;
		}
		$selectBox.append($option);
	});
	
	$selectBox.selectmenu('refresh', true);

	if(oldValueFound) {
		// no refresh necessary..
		return false;
	}

	// need to refresh
	return true;
	//clLib.loggi("Previous value >" + oldValue + "< is no longer present in the select list.");

};


// $inElement = $("#startScreen_nameSearchResult").
// $forElement = Appery("nameSearchField");
clLib.populateSearchProposals = function($forElement, $inElement, dataObj, hideOnSingleResult) {
	
	//alert(JSON.stringify(dataObj));
	if(hideOnSingleResult && dataObj.length == 1) {
		//alert("single element found (" + dataObj[0] + "), hiding results..");
		var result = $.trim(dataObj[0]);

		clLib.loggi("seeting selectedresult to " + result);
		$inElement.hide();
		$forElement.trigger("setSelectedValue.clLib", {"value": result, noDependentRefresh : true});
		return;
	} else {
		//$forElement.val("");
	}
	
	clLib.populateListView($inElement, dataObj);

	$inElement.attr("data-theme", "c");
	$inElement.show();
	clLib.loggi("shown" + $inElement.children().length);

	$inElement.children().click(function() {
        clLib.loggi("this child;" + $(this).html());
		var result = $.trim($(this).html());
		clLib.loggi("seeting selectedresult to " + result);

		clLib.loggi("forElement is " + $forElement.attr("id"));
		$forElement.trigger("setSelectedValue.clLib", {"value": result});
		//$forElement.val(result);

		$(this).parent().hide();
		clLib.loggi("hidden");
		//$("#startScreen_mobilefooter1").html(result);
	});
};

clLib.UI.defaultChangeHandler = function($element, changeOptions) {
	// Store current value
	$element.data("clLib.currentValue", $element.val());
	//alert($element.attr("id") + " was changed to: >" + $element.data("clLib.currentValue") + "<" + JSON.stringify(changeOptions));
	var elementConfig = clLib.UI.elements[$element.attr("id")];
	//clLib.loggi("elementConfig for " + $element.attr("id") + " is " + JSON.stringify(elementConfig));
	
	//
	// consider currently chosen layout from now on..
	//
	var currentLayout = localStorage.getItem("currentLayout");
	clLib.loggi("current layout is >" +  currentLayout  + "<");
	var refreshTargets = elementConfig.refreshOnUpdate;
	if(
		currentLayout in elementConfig.refreshOnUpdate
	) {
		clLib.loggi($element.attr("id") + ", refreshing >>" + JSON.stringify(Object.keys(refreshTargets[currentLayout])));
		refreshTargets = elementConfig.refreshOnUpdate[currentLayout];
	} else {
		refreshTargets = elementConfig.refreshOnUpdate["default"] || {};
	}

	//	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
	$.each(refreshTargets, function(refreshTargetName, refreshOptions) {
		clLib.loggi("refreshing dependent element " + refreshTargetName);
		if(!$("#" + refreshTargetName)) {
			clLib.loggi("element " + "#" + refreshTargetName + " not found!");
		}

		$.extend(refreshOptions, changeOptions);
		
		$("#" + refreshTargetName)
			.trigger("refresh.clLib", 
				clLib.UI.addObjArr(refreshOptions, ["eventSourcePath"], $element.attr("id"))
		);
	});

}
	
clLib.UI.defaultSetSelectedValueHandler = function($element, changeOptions) {
	return clLib.UI.defaultChangeHandler($element, changeOptions);
}
	
clLib.UI.setSelectedValueOnlyHandler = function($element, changeOptions) {
	//alert("solely changing value of .." + $element.attr("id") + " to " + JSON.stringify(changeOptions));
	// avoid default onChange handler..
	clLib.UI.killEventHandlers($element, "change.clLib");
	clLib.UI.killEventHandlers($element, "change.clLibColour");
	var newValue = changeOptions["value"];
	
	delete(changeOptions["value"]);
	// set desired value
	$element.val(newValue);
	$element.selectmenu('refresh', true);
	// restore onChange handler for further changes..
	var customChangeHandler = clLib.UI.elements[$element.attr("id")]["changeHandler"];
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;
	$element.bind("change.clLib", function(event, changeOptions) {
		changeHandler($element, changeOptions);
	});
}
	

clLib.UI.resetUIelements = function(pageName) {

	// populate autoload elements
	$.each(clLib.UI.elementsToReset[pageName], function(idx, elementName) {
		//alert("triggering reset/refresh for " + elementName);
		var $element = $("#" + elementName);
		clLib.UI.setSelectedValue($element, clLib.UI.NOTSELECTED.value);
	});
	
	$("#newRouteLog_commentText").val('');
};
	
clLib.UI.hideUIElement = function($element) {
	clLib.loggi("hiding element >" + $element.attr("id") + "< of type " + $element.prop("tagName") + ", display is >" + $element.css("display") + "<");

	$element.css('display', 'none').parent('div').parent('.ui-select').css('display', 'none');
	if($element.attr("tagName") == 'SELECT') {
		$element.selectmenu('refresh');
	}

};

clLib.UI.showUIElement = function($element) {
	clLib.loggi("showing element of type " + $element.prop("tagName") + ", display is >" + $element.css("display") + "<");

	$element.css('display', 'block').parent('div').parent().css('display', 'block');
	if($element.attr("tagName") == 'SELECT') {
		$element.selectmenu('refresh');
	}

};

/*
*
* Populates HTML UI elements for a page using the clLib.UI.elements configuration object.
* Configuration includes a function handle to populate each element and a list of dependent elements to refresh in case of changes.
* The "refresh.clLib" event can (and should) be used to re-populate such elements using the defined "refreshHandler" function.
*
*/
clLib.UI.fillUIelements = function(pageName) {
	// no special layout to apply? use default layout..
	var layout = localStorage.getItem("currentLayout") || "default";

	clLib.loggi("populating UI elements for page >" + pageName + "< and layout >" + layout + "<");

	if(!(layout in clLib.UI.pageElements[pageName])) {
		clLib.loggi("layout does not exists for page, using default layout..");
		layout = "default";
	}
	
// disabling of element not working on appery - disabling for now..
/*	
	$.each(clLib.UI.pageElements[pageName]["default"], function(idx, elementName) {
		clLib.loggi(elementName + " in " + JSON.stringify(clLib.UI.pageElements[pageName][layout])+ "?" + 
			(clLib.UI.pageElements[pageName][layout].hasValue(elementName))
		);
		if(!(clLib.UI.pageElements[pageName][layout].hasValue(elementName))) {
			var $element = $("#" + elementName);
			clLib.loggi("element is >" + $element.attr("id") + "<, hide it");
	
			// hide elements per default..
			clLib.UI.hideUIElement($element);
		} else {
			var $element = $("#" + elementName);
			clLib.loggi("element is >" + $element.attr("id") + "<, SHOW it");
	
			// hide elements per default..
			clLib.UI.showUIElement($element);
		}
	});
*/
	clLib.loggi("elements for page >" + pageName + "< hidden..");
	//alert("populating UI elements for page >" + pageName + "<");
	$.each(clLib.UI.pageElements[pageName][layout], function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];

		if(!elementConfig) {
			//alert("Can't find element >" + elementName + "<, breaking loop..");
			return;
		}

		clLib.loggi("adding events for  element >" + elementName + "<");
		var $element = $("#" + elementName);

		// Re-attach event handlers
		clLib.UI.killEventHandlers($element, "change.clLib");
		clLib.UI.killEventHandlers($element, "refresh.clLib");
		clLib.UI.killEventHandlers($element, "setSelectedValue.clLib");
		var changeHandler = elementConfig["changeHandler"] || clLib.UI.defaultChangeHandler;
		$element.bind("change.clLib", function() {
			changeHandler($element);
		});

		var setSelectedValueHandler = elementConfig["setSelectedValueHandler"] || clLib.UI.defaultSetSelectedValueHandler;
		//alert("setting setSelectedValueHandle for " + $element.attr("id"));
		$element.bind("setSelectedValue.clLib", function(event, changeOptions) {
			//alert("executing setSelectedValue handler for "+ $element.attr("id") + ">>>>" + JSON.stringify(changeOptions));
			setSelectedValueHandler($element, changeOptions);
		});

		// populate current element..
		$element.bind("refresh.clLib", function(event, additionalOptions) {
			if(!additionalOptions) additionalOptions = {};
			//alert("refreshing element " + elementName + " with " +  JSON.stringify(additionalOptions));
			if(
				typeof(additionalOptions) !== "undefined" &&
				additionalOptions["noRefreshOn"] == elementName
			) {
				clLib.loggi("not refreshing element " + elementName);
			}
			clLib.loggi("refresh element " + $(this).attr("id") + " with elementConfig " + JSON.stringify(elementConfig));
			elementConfig.refreshHandler($element, additionalOptions);
			$(this).trigger("change.clLib", additionalOptions);
		});
	});

	// populate autoload elements
	$.each(clLib.UI.autoLoad[pageName], function(idx, elementName) {
		//alert("triggering autoload for " + elementName);
		//alert($("#" + elementName).html());
		var optionObj = {};
		$("#" + elementName).trigger("refresh.clLib", 
			clLib.UI.addObjArr(optionObj,["eventSourcePath"], "AUTOLOAD")
		);
	});
};

clLib.UI.addObjArr = function(anObj, pathArray, objValue) {
	clLib.addObjArr(anObj,pathArray, objValue);
	return JSON.parse(JSON.stringify(anObj));
}

clLib.UI.showLoading = function(text, html) {
//alert("shwoing..");
	$.mobile.loading( 'show', {
		text: text,
		textVisible: true,
		//theme: 'z',
		html: html
	});
	//alert("showed..");

};

clLib.UI.hideLoading = function() {
	$.mobile.loading( "hide");
};



clLib.UI.showAllTodayScores = function(buddyNames, targetElement) {
	//alert("buddies changed..refreshing todaysscore..");

	var allTodaysScores = [];
	var buddyArray = (buddyNames && buddyNames.split(",")) || [];
	buddyArray.push(localStorage.getItem("currentUser"));
	$.each(buddyArray, function(idx, buddyName) {
		// build where clause for today's routelogs
		var buddyWhere = clLib.getRouteLogWhereToday({userName: buddyName});
		// retrieve today's top scored routelogs
		var buddyTodaysTopRouteLogs = clLib.localStorage.getEntities("RouteLog", buddyWhere, "routeLogStorage", 
			clLib.sortByScoreFunc,
			true, 10);
		// calculate today's score
		var buddyTodaysTopScore = clLib.calculateScore(buddyTodaysTopRouteLogs);
		//alert("buddys todays score(top10)" + buddyTodaysTopScore);
		var buddyTodayStr = buddyName + " => " + buddyTodaysTopScore;
		allTodaysScores.push(buddyTodayStr);
	});
	//alert("allTodaysTopScore: " + JSON.stringify(allTodaysScores));
	// show buddies todays' score
	clLib.populateListView(targetElement, allTodaysScores);
};



clLib.UI.buildRatingRadio = function($element) {
	$element.children().remove();
	$element.html("" + 
"                                                                                                                                                                               " +
"<style>                                                                                                                                                                        " +
".ratingSelect {                                                                                                                                                                " +
"	border: 0px solid red;                                                                                                                                                      " +
"	padding: 0px 0px 0px 0px;                                                                                                                                                   " +
"	margin: 0px 0px 0px 0px;                                                                                                                                                    " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label > input {                                                                                                                                                " +
"    display: none;                                                                                                                                                             " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label > .img {                                                                                                                                                 " +
"	float: left;                                                                                                                                                                " +
"	width: 20px;                                                                                                                                                                " +
"	height: 20px;                                                                                                                                                               " +
"	border: none;                                                                                                                                                               " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
".ratingSelect > label.rated > .img {                                                                                                                                           " +
"	background-image: url(\"files/views/assets/image/star_rated.png\"); /* no-repeat;*/                                                                                                             " +
"	background-size: 100% 100%;                                                                                                                                                 " +
"}                                                                                                                                                                              " +
".ratingSelect > label.unrated > .img { 	                                                                                                                                    " +
"	background-image: url(\"files/views/assets/image/star_unrated.png\"); /* no-repeat; */                                                                                                          " +
"	background-size: 100% 100%;                                                                                                                                                 " +
"}                                                                                                                                                                              " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"</style>                                                                                                                                                                       " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"                                                                                                                                                                               " +
"			<div data-role=\"none\" class=\"ratingSelect\" id=\"newRouteLog_ratingSelect\">                                                                                           " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"1\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"2\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"3\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"4\"/><div class=\"img\"></div></label>  " +
"					<label data-role=\"none\" class=\"unrated\"><input data-role=\"none\" name=\"foo\" type=\"radio\" id=\"newRouteLog_ratingSelectRadio\" value=\"5\"/><div class=\"img\"></div></label>  " +
"				</div>                                                                                                                                                          " +
"	                                                                                                                                                                            " +
""
	);

};

clLib.UI.buildWhereIfVisible = function(whereKeys2Elements) {
	var whereObj = {};
	$.each(whereKeys2Elements, function(key, $element) {
		clLib.loggi("$element is " + JSON.stringify($element));
		if(
			$element instanceof Object &&
			$element.is(":visible")
		) {
			whereObj[key] = $element.val();
		} else if(
		 	!($element instanceof Object) &&
			$element
		) {
			whereObj[key] = $element;
		}
		clLib.loggi("whereObj is now " + JSON.stringify(whereObj));

	});
	return whereObj;
};

