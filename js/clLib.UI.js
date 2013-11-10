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
	//clLib.loggi("triggering setSelectedValue.clLib on " + $element.attr("id") + " with value " + JSON.stringify(newValue));
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

	// disable current onChange handler
	var elementName = clLib.UI.elementNameFromId(options.selectBoxElement.attr("id"));
	clLib.loggi("killing event handlers for  " + elementName + "," + options.selectBoxElement.attr("id"), 2);

	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");

	var needRefresh = clLib.populateSelectBox_plain(
		options.selectBoxElement,
		options.dataObj,
		options.selectedValue,
		options.preserveCurrentValue,
		options.additionalValue
	);

	var customChangeHandler = clLib.UI.elements[elementName]["changeHandler"];
	if(customChangeHandler) {
		//clLib.loggi("custom event handler for " + elementName + "found.." + customChangeHandler);
	}
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;

	options.selectBoxElement.bind("change.clLib", function(event, changeOptions) {
		changeHandler($(this), changeOptions);
	});

	
	if(needRefresh) {
		clLib.loggi("trigger change on " + options.selectBoxElement.attr("id"));
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

	clLib.loggi("oldValueFound? " + oldValueFound);
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
	
	//clLib.loggi(JSON.stringify(dataObj));
	if(hideOnSingleResult && dataObj.length == 1) {
		//clLib.loggi("single element found (" + dataObj[0] + "), hiding results..");
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
		//alert("seeting selectedresult to " + result);

		//alert("forElement is " + $forElement.attr("id"));
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
	//clLib.loggi($element.attr("id") + " was changed to: >" + $element.data("clLib.currentValue") + "<" + JSON.stringify(changeOptions));
	var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];
	//alert("elementConfig for " + $element.attr("id") + "(" + clLib.UI.elementNameFromId($element.attr("id")) + ") is " + JSON.stringify(elementConfig));
	
	//
	// consider currently chosen layout from now on..
	//
	var currentLayout = localStorage.getItem("currentLayout");
	clLib.loggi("current layout is >" +  currentLayout  + "<");
	var refreshTargets = elementConfig["refreshOnUpdate"];
	if(
		refreshTargets &&
		currentLayout in refreshTargets
	) {
		clLib.loggi($element.attr("id") + ", refreshing >>" + JSON.stringify(Object.keys(refreshTargets[currentLayout])));
		refreshTargets = refreshTargets[currentLayout];
	} else {
		refreshTargets = refreshTargets && refreshTargets["default"] || {};
	}

	clLib.loggi("refreshing dependent " + JSON.stringify(refreshTargets));
	//	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
	$.each(refreshTargets, function(refreshTargetName, refreshOptions) {
		clLib.loggi("refreshing dependent element " + refreshTargetName);
		var $refreshTarget = clLib.UI.byId$(refreshTargetName);
		if(!$refreshTarget[0]) {
			clLib.loggi("element " + "#" + refreshTargetName + " not found!");
		}

		$.extend(refreshOptions, changeOptions);
		
		$refreshTarget
			.trigger("refresh.clLib", 
				clLib.UI.addObjArr(refreshOptions, ["eventSourcePath"], clLib.UI.elementNameFromId($element.attr("id")))
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
	clLib.UI.killEventHandlers($element, "change.clLibCSSBackground");
	var newValue = changeOptions["value"];
	
	delete(changeOptions["value"]);
	// set desired value
	//alert("setting element " + $element.attr("id") + " to " + JSON.stringify(newValue));
	$element.val(newValue);
	$element.selectmenu('refresh', true);
	// restore onChange handler for further changes..
	var customChangeHandler = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))]["changeHandler"];
	var changeHandler = customChangeHandler || clLib.UI.defaultChangeHandler;
	$element.bind("change.clLib", function(event, changeOptions) {
		changeHandler($element, changeOptions);
	});
}
	

clLib.UI.resetUIelements = function(pageName, currentJqmSlide) {
	localStorage.setItem("currentJqmSlide", currentJqmSlide);
	// populate autoload elements
	$.each(clLib.UI.elementsToReset[pageName], function(idx, elementName) {
		var $element = clLib.UI.byId$(elementName);
		//alert(elementName + "->" + $element.attr("id"));
		if($element[0]) {
			var elementType = $element[0].tagName;
		}
		//alert("triggering reset/refresh for " + elementName + ", type:" + elementType);
//		if(elementType == "SELECT") {
			clLib.UI.setSelectedValue($element, clLib.UI.NOTSELECTED.value);
//		} else {
//			$element.val("");
//		}
		
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
clLib.UI.fillUIelements = function(pageName, currentJqmSlide) {
	localStorage.setItem("currentJqmSlide", currentJqmSlide);
		
	// no special layout to apply? use default layout..
	var layout = localStorage.getItem("currentLayout") || "default";

	clLib.loggi("populating UI elements for page >" + pageName + "< and layout >" + layout + "<", 2);

	if(!(layout in clLib.UI.pageElements[pageName])) {
		clLib.loggi("layout does not exists for page, using default layout..", 2);
		layout = "default";
	}
	
// disabling of element not working on appery - disabling for now..
//	$.each(clLib.UI.pageElements[pageName]["default"], function(idx, elementName) {
//		clLib.loggi(elementName + " in " + JSON.stringify(clLib.UI.pageElements[pageName][layout])+ "?" + 
//			(clLib.UI.pageElements[pageName][layout].hasValue(elementName))
//		);
//		if(!(clLib.UI.pageElements[pageName][layout].hasValue(elementName))) {
//			var $element = $("#" + elementName);
//			clLib.loggi("element is >" + $element.attr("id") + "<, hide it");
//	
//			// hide elements per default..
//			clLib.UI.hideUIElement($element);
//		} else {
//			var $element = $("#" + elementName);
//			clLib.loggi("element is >" + $element.attr("id") + "<, SHOW it");
//	
//			// hide elements per default..
//			clLib.UI.showUIElement($element);
//		}
//	});
//
	clLib.loggi("elements for page >" + pageName + "< hidden..");
	//clLib.loggi("populating UI elements for page >" + pageName + "<");
	$.each(clLib.UI.pageElements[pageName][layout], function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];

		if(!elementConfig) {
			clLib.loggi("Can't find element >" + elementName + "<, breaking loop..");
			return;
		}

		clLib.loggi("!!adding events for  element >" + elementName + "<", 2);
		clLib.loggi("elementConfig >" + JSON.stringify(elementConfig) + "<", 2);
		var $element = clLib.UI.byId$(elementName);
		clLib.loggi("element is " + $element.attr("id") + "<", 2);
		
		// Re-attach event handlers
		clLib.UI.killEventHandlers($element, "change.clLib");
		clLib.UI.killEventHandlers($element, "refresh.clLib");
		clLib.UI.killEventHandlers($element, "setSelectedValue.clLib");
		var changeHandler = elementConfig["changeHandler"] || clLib.UI.defaultChangeHandler;
		$element.bind("change.clLib", function() {
			clLib.loggi($(this).attr("id") + "was changed!");
			changeHandler($element);
		});

		var setSelectedValueHandler = elementConfig["setSelectedValueHandler"] || clLib.UI.defaultSetSelectedValueHandler;
		//clLib.loggi("setting setSelectedValueHandle for " + $element.attr("id"));
		$element.bind("setSelectedValue.clLib", function(event, changeOptions) {
			//clLib.loggi("executing setSelectedValue handler for "+ $element.attr("id") + ">>>>" + JSON.stringify(changeOptions));
			setSelectedValueHandler($element, changeOptions);
		});

		// populate current element..
		$element.bind("refresh.clLib", function(event, additionalOptions) {
			clLib.loggi("refreshing " + $(this).attr("id"));
			if(!additionalOptions) additionalOptions = {};
			//clLib.loggi("refreshing element " + elementName + " with " +  JSON.stringify(additionalOptions));
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
		clLib.loggi("triggering autoload for " + elementName, 2);
		clLib.loggi("html:" + clLib.UI.byId$(elementName).html(), 2);
		var optionObj = {};
		clLib.UI.byId$(elementName).trigger("refresh.clLib", 
			clLib.UI.addObjArr(optionObj,["eventSourcePath"], "AUTOLOAD")
		);
	});
};

clLib.UI.addObjArr = function(anObj, pathArray, objValue) {
	clLib.addObjArr(anObj,pathArray, objValue);
	return JSON.parse(JSON.stringify(anObj));
}

clLib.UI.showLoading = function(text, html) {
//clLib.loggi("shwoing..");
	$.mobile.loading( 'show', {
		text: text,
		textVisible: true,
		//theme: 'z',
		html: html
	});
	//clLib.loggi("showed..");

};

clLib.UI.hideLoading = function() {
	$.mobile.loading( "hide");
};



clLib.UI.showAllTodayScores = function(buddyNames, targetElement) {
	//clLib.loggi("buddies changed..refreshing todaysscore..");

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
		//clLib.loggi("buddys todays score(top10)" + buddyTodaysTopScore);
		var buddyTodayStr = buddyName + " => " + buddyTodaysTopScore;
		allTodaysScores.push(buddyTodayStr);
	});
	//clLib.loggi("allTodaysTopScore: " + JSON.stringify(allTodaysScores));
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


clLib.UI.getId$ = function(elementName) {
	var currentJqmSlide = localStorage.getItem("currentJqmSlide");
	var newSelector = "#" + currentJqmSlide + "_" + elementName;
	return newSelector;
};

clLib.UI.byId$ = function(elementName) {
	var newSelector = clLib.UI.getId$(elementName);
	//alert("returning selector >" + newSelector + "<");
	return $(newSelector);
};


clLib.UI.elementNameFromId = function(id) {
	var currentJqmSlide = localStorage.getItem("currentJqmSlide");
	var newId = id.replace(currentJqmSlide + "_", "");
	return newId;
};

clLib.UI.defaultRefreshHandler = function($element, additionalSelectBoxOptions) {
	//alert("refreshing " + $element.attr("id"));
	var currentLayout = localStorage.getItem("currentLayout") || "default";
	var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];

	var dependingPageElements = elementConfig["dependingOn"][currentLayout];
	var resultColName = elementConfig["dbField"];

	var results = clLib.UI.defaultEntitySearch(resultColName, dependingPageElements, true); //, additionalWhere);
	//alert("got results: " + JSON.stringify(results));

	var selectBoxOptions = {
		selectBoxElement : $element,
		dataObj : results,
		preserveCurrentValue : true,
		additionalValue : clLib.UI.NOTSELECTED
	};
	$.extend(selectBoxOptions, additionalSelectBoxOptions);
	clLib.populateSelectBox(selectBoxOptions);
}

clLib.UI.defaultRefreshHandler_old = function($element, resultColName, dependentPageElements) {

	results = clLib.UI.defaultEntitySearch(resultColName, dependentPageElements, true);
	clLib.loggi("got results for " + JSON.stringify(where) + ",>" + JSON.stringify(results));

	clLib.populateSelectBox({
		selectBoxElement : $element,
		dataObj : results,
		preserveCurrentValue : true,
		additionalValue : clLib.UI.NOTSELECTED
	});
}

clLib.UI.defaultEntitySearch = function(resultColName, dependentPageElements, distinctFlag, additionalWhereObj) {
	var baseWhere = {}, where, results, getFunc;
	$.each(dependentPageElements, function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];
		//alert("eaching " + idx + "," + elementName + "=>" + elementConfig["dbField"] + " to " + clLib.UI.getVal(elementName));
		baseWhere[elementConfig["dbField"]] = clLib.UI.getVal(elementName);
	});
	//alert("basewhere1 = " + JSON.stringify(baseWhere));
	if(additionalWhereObj) {
		$.extend(baseWhere, additionalWhereObj);
	}
	//alert("basewhere2 = " + JSON.stringify(baseWhere));
	where = clLib.getRoutesWhere(baseWhere);
	//alert("where = " + JSON.stringify(where));

	if(distinctFlag) {
		getFunc = clLib.localStorage.getDistinct;
		results = getFunc("Routes", where, resultColName, "routeStorage");
	} else {
		results = clLib.localStorage.getEntities("Routes", where, "routeStorage");
	}
	return results;

}


clLib.UI.getVal = function(elementName) {
	var elementConfig = clLib.UI.elements[elementName];
	var elementValue;
	if(elementConfig["customVal"]) {
		elementValue = elementConfig["customVal"]();
	} else {
		elementValue = clLib.UI.byId$(elementName).val();
	}
	return elementValue;
}

clLib.UI.defaultSaveHandler = function(currentJqmSlide, currentLayout) {
	var saveObj = {};
	if(!currentJqmSlide) {
		currentJqmSlide = localStorage.getItem("currentJqmSlide");
	}
	if(!currentLayout) {
		currentLayout = localStorage.getItem("currentLayout");
	} 
	
	$.each(clLib.UI.pageElements[currentJqmSlide][currentLayout], function(idx, elementName) {
		//alert("eaching " + idx + " and " + elementName);
		var elementConfig = clLib.UI.elements[elementName];
		if(!elementConfig) {
			alert("will not save " + elementName + ", no config found!");
		} else {
			saveObj[elementConfig["dbField"]] = clLib.UI.getVal(elementName);
		}
	});
	//alert("saveObj is " + JSON.stringify(saveObj));
	clLib.localStorage.addInstance("RouteLog", saveObj, "routeLogStorage");
}



clLib.addCSSBackground = function(targetId) {
	//clLib.loggi("adding CSS bg to " + targetId);
	var $targetEl = $('#' + targetId);
	clLib.UI.killEventHandlers($targetEl, "change.clLibCSSBackground");
	
	// Add css class named option.value for every entry in #targetId
    $('option', $targetEl).each(function () {
        var ind = $(this).index();
        // fetch current option element
        var entry = $('#' + targetId + '-menu').find('[data-option-index=' + ind + ']');
        // set corresponding css class
        //clLib.loggi("adding class" + entry.find("a").html());
        entry
            .addClass("clCSSBg")
            .addClass(entry.find("a").html());
    });
    
	// Set currently selected color in collapsed select menu 
    var last_style; // remembers last color chosen
    
	$targetEl.on('change.clLibCSSBackground', function () {
		var last_style = $(this).data("cllast_style");
		// Get currently selected element
        var selection = $(this).find(':selected').html();
        //alert("last_style " + last_style + ",changing to " + selection);

        // Remove CSS class for previously selected color
        if (last_style) {
            $(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
        }
        // Set currently selected color
        $(this).closest('.ui-select').find('.ui-btn').addClass(selection);
        // Remember currently selected color
        $(this).data("cllast_style", selection);
        //alert("remembering last_style " + selection);
		//$(this).change();
    });

	// Update jqm generated widget
	$('#' + targetId).trigger('change.clLibCSSBackground');
//	$('#' + targetId).trigger('change');
 	
};


