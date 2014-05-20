"use strict";

clLib.UI = {
	"NOTSELECTED": {
		text : "?",
		value : "__UNKNOWN__"
	}
};
clLib.UI.list = {};
clLib.UI.elementConfig= {};


clLib.UI.varDefaults = {};
clLib.UI.varDefaults["selectedGradeSystems"] = "UIAA,French,Bleau";




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


clLib.UI.addListItems = function($list, dataObj, createItemFunc, count, startWithEmptyList) {
	//alert("adding list items for " + $list.attr("id") + ">" + JSON.stringify(dataObj) + "<");
	if(startWithEmptyList) {
		$list.empty();
		$list.data("itemsShown", 0);
	}
	createItemFunc = createItemFunc || clLib.UI.list.formatStandardRow;
	count = count || 2;
	var itemsShown = $list.data("itemsShown") || 0;
	//alert("old count: " + itemsShown);

	if(!dataObj || Object.keys(dataObj).length == 0) {
		dataObj = [];
	}
	$.each(dataObj.slice(itemsShown, itemsShown + count), function(index, dataRow) {
		var $itemsToAdd = createItemFunc(dataRow);

		/* 
			Add item to listview..
		*/
		if($itemsToAdd instanceof Array) {
			$.each($itemsToAdd, function(index, $item) {
				$list.append($item);
			});
		} else {
			$list.append($itemsToAdd);
		}
	});

	var $addMoreElement = $list.find(".addMore").remove();
	$addMoreElement = $("<li>")
		.addClass("addMore")
		.attr("data-role", "list-divider")
		.attr("data-theme", "c")
		.append("...")
		.css("text-align", "center")
		.click(function() {
			clLib.UI.addListItems($list, dataObj, createItemFunc, count);
		})
	;
	if(itemsShown + count < dataObj.length) {
		$list.append($addMoreElement);
	}
	
	$list.listview('refresh', false);

	$list
		.data(
			"itemsShown", 
			itemsShown + count
		)
	;
	//alert("new count: " + $list.data("itemsShown"));

};


clLib.UI.list.formatStandardRow = function(dataRow) {
	var $listItem = $('<li></li>')
        .append(dataRow);
	return $listItem;
};

clLib.UI.tickTypeSymbolFunc = function(tickTypeName, dataRow) {
	return clLib.UI.tickTypeSymbols[tickTypeName](dataRow);
};

clLib.UI.tickTypeSymbols = {
	tickType_redpoint : function(dataRow) {
		return $('<span><img style="margin-left: 5px; width:20px; height: 20px" src="files/views/assets/image/redpoint.png"></span>');
	}
	, tickType_flash : function(dataRow) {
		return $('<span><img style="margin-left: 5px; width:20px; height: 20px" src="files/views/assets/image/flash.png"></span>');
	}
	, tickType_attempt :function(dataRow) {
		return $('<span><img style="margin-left: 5px; width:20px; height: 20px" src="files/views/assets/image/try.png"></span>');
	}
	, tickType_toprope : function(dataRow) {
		return $('<span><img style="margin-left: 5px; width:20px; height: 20px" src="files/views/assets/image/toprope.png"></span>');
	}
	, tickType_delete : function(dataRow) {
		var aLink = $('<span style="text-align=\'right\'"><img style="margin-left: 13px; border: 0px solid red; width:10px; height: 10px" src="files/views/assets/image/delete-route.png"></span>');
		aLink.click(function() {
			clLib.localStorage.removeInstance("RouteLog", dataRow["_id"], "defaultStorage");
			clLib.UI.resetUIelements("newRouteLog", "newRouteLog");
		});
		return aLink;
	}
};

clLib.tickTypeSymbol = function(tickTypeName, tickTypeValue, dataRow) {
	if(tickTypeValue || tickTypeName == "tickType_delete") {
		return clLib.UI.tickTypeSymbolFunc(tickTypeName, dataRow);
	}
};

clLib.UI.list.formatRouteLogRow = function(dataRow) {
	var dataFormat = {
		header: {
			/*"GradeSystem" : null*/
			"Grade": null
			, "tickType_redpoint" : clLib.tickTypeSymbol 
			, "tickType_flash" : clLib.tickTypeSymbol 
			, "tickType_attempt" : clLib.tickTypeSymbol 
			, "tickType_toprope" : clLib.tickTypeSymbol 
		}
		,bubble: {
			"Score" : null
			, "tickType_delete" : clLib.tickTypeSymbol 
		,
		}
		,body: {
			header: "RouteName",
			items: ["deleted", "DateISO", "Sector", "Line", "Colour", "Comment"]
		}
	};
	
	// compute score
	dataRow.Score = clLib.computeScore(dataRow);
	
	//alert(JSON.stringify(dataRow));
	var headerText = $("<div></div>");
	var $bubble, $headerItem, $bodyItem, $bodyHeader;
	var listItems = [];

	/* 
		Clickable header item
	*/
	$.each(dataFormat["header"], function(headerName, headerFunc) {
		if(headerFunc) {
			headerText.append(
				headerFunc(headerName, dataRow[headerName], dataRow)
			);
		} else {
			//alert("no headerfunc foc " + headerName);
			headerText.append(dataRow[headerName]);
		}
	});

//	headerText = headerText.join(" ", headerText);
	
	$bubble = $("<span>")
		.addClass("ui-li-count")
//		.append(dataRow[dataFormat["bubble"]])
	;
	
	$.each(dataFormat["bubble"], function(headerName, headerFunc) {
		if(headerFunc) {
			$bubble.append(
				headerFunc(headerName, dataRow[headerName], dataRow)
			);
		} else {
			//alert("no headerfunc foc " + headerName);
			$bubble.append(dataRow[headerName]);
		}
	});	

	$headerItem = $("<li>")
		.attr("data-role", "list-divider")
		.append(headerText)
		.append($bubble)
	;
	listItems.push($headerItem);

	/* 
		Body contents..
	*/
	$bodyHeader = $("<h1>")
		.html(dataRow[dataFormat["body"]["header"]])
	;

	$bodyItem = $("<li>")
		.append($bodyHeader);
	;

	$.each(dataFormat["body"]["items"], function(index, keyName) {
		var $someStrong = $("<strong>")
			.html(keyName + ": ");
		var $someP = $("<p>")
			.append($someStrong)
			.append(dataRow[keyName])
		;
		$bodyItem
			.append($someP)
		;

	});


	// Hide body initially
	$bodyItem.hide();
	
	// Show body on header click
	$headerItem.click(function() {
		$bodyItem.toggle();
	});
	
	listItems.push($bodyItem);
	
	return listItems;

};


clLib.createRadioButtons = function(options) {
	// disable current onChange handler
	var elementName = clLib.UI.elementNameFromId(options.selectBoxElement.attr("id"));
	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");

	var needRefresh = clLib.populateRadioButtons_plain(
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

clLib.createCheckboxGroup = function(options) {
	// disable current onChange handler
	var elementName = clLib.UI.elementNameFromId(options.selectBoxElement.attr("id"));
	clLib.UI.killEventHandlers(options.selectBoxElement, "change.clLib");

	var needRefresh = clLib.populateCheckboxes_plain(
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

clLib.populateCheckboxes_plain = function($selectBox, dataObj, selectedValue, preserveCurrentValue, additionalValue){
//	alert("populating checkboxes..");	
	var oldValue = clLib.UI.getVal(clLib.UI.elementNameFromId($selectBox.attr("id")));
	var oldValueFound = true;
	if(preserveCurrentValue && oldValue) {
		clLib.loggi("preserving >" + oldValue + "<");
		selectedValue = oldValue;
		oldValueFound = false;
	}
	

	var buttonCount = 0;
	
	$selectBox.controlgroup("container").empty();
	if(additionalValue) {
		var $option = $('<input data-theme="c" type="checkbox"></input>');
		$option.attr("name", $selectBox.attr("id") + "_radio");
		$option.attr("id", $selectBox.attr("id") + "_" + buttonCount);

		var $label = $('<label data-theme="c" for="' + $selectBox.attr("id") + "_" + buttonCount + '"></label>');
		
		if(additionalValue instanceof Object) {
			$option
				.val(additionalValue["value"])
			;
			$label
				.html(additionalValue["text"]);
		} else {
			$option
				.val(additionalValue)
			;
			$label
				.html(additionalValue);
		}
		$selectBox.controlgroup("container").append($option);
		$selectBox.controlgroup("container").append($label);
		buttonCount++;
	}
	
	if(dataObj instanceof Array && dataObj.length == 1) {
		clLib.loggi("Yes, array...take first element.." + JSON.stringify(dataObj));
		selectedValue = dataObj[0];
	} else if(dataObj instanceof Object && Object.keys(dataObj).length == 1) {
		clLib.loggi("Yes, object...take first element.." + JSON.stringify(dataObj));
		selectedValue = Object.keys(dataObj)[0];
	}

	var i = 0;
	//alert("dataObj to each >" + JSON.stringify(dataObj) + "<");
	$.each(dataObj, function(index, value) {
		clLib.loggi("adding option " + value);
		var $option = $('<input data-theme="c" type="checkbox"></input>');
		$option.attr("name", $selectBox.attr("id") + "_radio");
		$option.attr("id", $selectBox.attr("id") + "_" + buttonCount);

		var $label = $('<label data-theme="c" for="' + $selectBox.attr("id") + "_" + buttonCount + '"></label>');
		
		$option
			.val(dataObj instanceof Array ? value : index)
		;
		$label
			.html(value);

			//clLib.loggi("comp " + value + " + against " + selectedValue);
		if(selectedValue.indexOf(value) != -1) {
			clLib.loggi("Found old value..");
			$option.attr("checked", "checked");
			oldValueFound = true;
		}
		$selectBox.controlgroup("container").append($option);
		$selectBox.controlgroup("container").append($label);
		buttonCount++;
	});
	
	
	//alert("created selectbox group " + $selectBox.html());
	
	$selectBox
		.enhanceWithin()
		.controlgroup("refresh");
	//alert("populated radio buttoins.." + $selectBox.attr("id"));
	
	//alert("created selectbox group " + $selectBox.html());
	
	clLib.loggi("oldValueFound? " + oldValueFound);
	if(oldValueFound) {
		// no refresh necessary..
		return false;
	}

	// need to refresh
	return true;
	//clLib.loggi("Previous value >" + oldValue + "< is no longer present in the select list.");

};

clLib.populateRadioButtons_plain = function($selectBox, dataObj, selectedValue, preserveCurrentValue, additionalValue){
	//alert("populating radio buttons..");	
	var oldValue = clLib.UI.getVal(clLib.UI.elementNameFromId($selectBox.attr("id")));
	var oldValueFound = true;
	if(preserveCurrentValue && oldValue) {
		clLib.loggi("preserving >" + oldValue + "<");
		selectedValue = oldValue;
		oldValueFound = false;
	}
	

	var buttonCount = 0;
	
	$selectBox.controlgroup("container").empty();
	if(additionalValue) {
		var $option = $('<input type="radio"></input>');
		$option.attr("name", $selectBox.attr("id") + "_radio");
		$option.attr("id", $selectBox.attr("id") + "_" + buttonCount);

		var $label = $('<label for="' + $selectBox.attr("id") + "_" + buttonCount + '"></label>');
		
		if(additionalValue instanceof Object) {
			$option
				.val(additionalValue["value"])
			;
			$label
				.html(additionalValue["text"]);
		} else {
			$option
				.val(additionalValue)
			;
			$label
				.html(additionalValue);
		}
		$selectBox.append($option);
		$selectBox.append($label);
		buttonCount++;
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
		clLib.loggi("adding option " + value);
		var $option = $('<input type="radio"></input>');
		$option.attr("name", $selectBox.attr("id") + "_radio");
		$option.attr("id", $selectBox.attr("id") + "_" + buttonCount);

		var $label = $('<label for="' + $selectBox.attr("id") + "_" + buttonCount + '"></label>');
		
		$option
			.val(dataObj instanceof Array ? value : index)
		;
		$label
			.html(value);

			//clLib.loggi("comp " + value + " + against " + selectedValue);
		if(value == selectedValue) {
			clLib.loggi("Found old value..");
			$option.attr("checked", "checked");
			oldValueFound = true;
		} 
		
		$selectBox.controlgroup("container").append($option);
		$selectBox.controlgroup("container").append($label);
		buttonCount++;
	});
	
	$selectBox
		.enhanceWithin()
		.controlgroup("refresh");
		
	//alert("populated radio buttoins.." + $selectBox.attr("id"));
	
	clLib.loggi("oldValueFound? " + oldValueFound);
	if(oldValueFound) {
		// no refresh necessary..
		return false;
	}

	// need to refresh
	return true;
	//clLib.loggi("Previous value >" + oldValue + "< is no longer present in the select list.");

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
		clLib.loggi("preserving >" + oldValue + "<");
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

	//alert("??? dataObj to each >" + JSON.stringify(dataObj) + "<");
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
	
	//alert("refreshing " + $selectBox.attr("id"));
	$selectBox.selectmenu('refresh', true);
	//alert("refreshed " + $selectBox.attr("id"));
	
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
	
	$inElement.attr("data-theme", "c");
	$inElement.show();


	clLib.UI.addListItems($inElement, dataObj, function(dataRow) {
		var $listItem = clLib.UI.list.formatStandardRow(dataRow);
		$listItem.click(function() {
			clLib.loggi("this child;" + $(this).html());
			var result = $.trim($(this).html());
			//alert("setting selectedresult to " + result);

			//alert("forElement is " + $forElement.attr("id"));
			$forElement.trigger("setSelectedValue.clLib", {"value": result});
			//$forElement.val(result);

			$(this).parent().hide();
			clLib.loggi("hidden");
		});
		return $listItem;
	},
	2, 
	true
	);

	clLib.loggi("shown" + $inElement.children().length);

};

clLib.UI.defaultChangeHandler = function($element, changeOptions) {
	// Store current value
	$element.data("clLib.currentValue", $element.val());
	//clLib.loggi($element.attr("id") + " was changed to: >" + $element.data("clLib.currentValue") + "<" + JSON.stringify(changeOptions));
	var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];
	
	if(!elementConfig) {
		alert("1no element config for element with id " + $element.attr("id") + " and name " + clLib.UI.elementNameFromId($element.attr("id")) + " found..");
		alert("currentJqmSlide = " + localStorage.getItem("currentJqmSlide"));
		
	}
	//alert("elementConfig for " + $element.attr("id") + "(" + clLib.UI.elementNameFromId($element.attr("id")) + ") is " + JSON.stringify(elementConfig));
	
	//
	// consider currently chosen layout from now on..
	//
	var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
	clLib.loggi("current layout is >" +  currentLayout  + "<");
	var refreshTargets = elementConfig["refreshOnUpdate"];
	//alert("getting dependent " + JSON.stringify(refreshTargets));

	if (
		refreshTargets &&
		currentLayout in refreshTargets
	) {
		clLib.loggi($element.attr("id") + ", refreshing >>" + JSON.stringify(Object.keys(refreshTargets[currentLayout])));
		refreshTargets = refreshTargets[currentLayout];
	} else {
	    if (refreshTargets) {
	        refreshTargets = refreshTargets["default"] || {};
	    } else {
    	    refreshTargets = {};
	    }
	}

	//alert("refreshing dependent " + JSON.stringify(refreshTargets));
	//	$.each(elementConfig.refreshOnUpdate, function(refreshTargetName, refreshOptions) {
	$.each(refreshTargets, function(refreshTargetName, refreshOptions) {
		//alert("refreshing dependent element " + refreshTargetName);
		var $refreshTarget = clLib.UI.byId$(refreshTargetName);
		if(!$refreshTarget[0]) {
			console.log("element " + "#" + refreshTargetName + " not found!");
		}

		$.extend(refreshOptions, changeOptions);
		
		//alert("triggering refresh on " + $refreshTarget.attr("id"));
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
		clLib.loggi("triggering reset/refresh for " + elementName + ", type:" + elementType);
//		if(elementType == "SELECT") {
			clLib.UI.setSelectedValue($element, clLib.UI.NOTSELECTED.value);
//		} else {
//			$element.val("");
//		}
		
	});
	
//	hardcoded reset for <textarea> element...
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
clLib.UI.fillUIelements = function(pageName, currentJqmSlide, layout) {
    localStorage.setItem("currentJqmSlide", currentJqmSlide);
		
	// no special layout to apply? use default layout..
	var layout = layout || localStorage.getItem("currentLayout") || "default";

	clLib.loggi("populating UI elements for page >" + pageName + "< and layout >" + layout + "<", 2);

	if(!(layout in clLib.UI.pageElements[pageName])) {
		clLib.loggi("layout does not exists for page, using default layout..", 2);
		layout = "default";
	}

	// Create page elements..
	var curPageElements;
	curPageElements = clLib.UI.pageElements[pageName][layout];
	clLib.UI.createElements(curPageElements, currentJqmSlide);

	curPageElements = clLib.UI.pageElements["_COMMON_"][layout];
	//alert("!!!!!!!!!!!!!!!!!!creating common " + JSON.stringify(curPageElements));
	clLib.UI.createElements(curPageElements, currentJqmSlide);

//	curPageElements.push.apply(curPageElements, clLib.UI.pageElements["_COMMON_"][layout]);
	
    //alert("noew autoloading...");
	// Autoload elements
	var curPageAutoload = 
	curPageAutoload = clLib.UI.autoLoad[pageName];
	if(curPageAutoload) {
		curPageAutoload = clLib.UI.autoLoad[pageName][layout];
	}
	clLib.UI.autoloadElements(curPageAutoload, currentJqmSlide);

	curPageAutoload = clLib.UI.autoLoad["_COMMON_"];
	if(curPageAutoload) {
		curPageAutoload = clLib.UI.autoLoad["_COMMON_"][layout];
	}
	//alert("autoloading common " + JSON.stringify(curPageAutoload));
	clLib.UI.autoloadElements(curPageAutoload, currentJqmSlide);
	
	localStorage.setItem("currentJqmSlide", currentJqmSlide);
	
//	curPageAutoload.push.apply(curPageAutoload, clLib.UI.autoLoad["_COMMON_"][layout]);

};


clLib.UI.autoloadElements = function(curPageAutoload, currentJqmSlide) {
	localStorage.setItem("currentJqmSlide", currentJqmSlide);
	console.log("autoloading...." + JSON.stringify(curPageAutoload) + "," + currentJqmSlide);
	if(curPageAutoload) {
		$.each(curPageAutoload, function(idx, elementName) {
			//alert("triggering autoload for " + elementName, 2);
			clLib.loggi("html(" + elementName + "):" + clLib.UI.byId$(elementName, currentJqmSlide).html(), 2);
			var optionObj = {};
			//alert("byId is " + clLib.UI.byId$(elementName).attr("id"));
			clLib.UI.byId$(elementName, currentJqmSlide).trigger("refresh.clLib", 
				clLib.UI.addObjArr(optionObj,["eventSourcePath"], "AUTOLOAD")
			);
		});
	}
};

clLib.UI.createElements = function(curPageElements, currentJqmSlide) {
	localStorage.setItem("currentJqmSlide", currentJqmSlide);
	//alert("populating UI elements for page >" + currentJqmSlide + "<");
	$.each(curPageElements, function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];
		
		if(!elementConfig) {
			alert("Can't find element >" + elementName + "<, breaking loop..");
			return;
		}

		//alert("!!adding events for  element >" + elementName + "<", 2);
		//alert("elementConfig >" + JSON.stringify(elementConfig) + "<", 2);
		var $element = clLib.UI.byId$(elementName, currentJqmSlide);
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

    //alert("created element.."); 
};

clLib.UI.addObjArr = function(anObj, pathArray, objValue) {
	clLib.addObjArr(anObj,pathArray, objValue);
	return JSON.parse(JSON.stringify(anObj));
}

/*
*
*	Executes function "func" and displays spinner with "spinnerParams" while executing..
*
*/
clLib.UI.execWithMsg = function(func, spinnerParams) {
	clLib.UI.showLoading(spinnerParams);
	setTimeout(function() {
		func();
		clLib.UI.hideLoading();
	},10);
	
};

clLib.UI.showLoading = function(spinnerParams) {
        //clLib.loggi("shwoing..");
        $.mobile.loading('show', {
            text: spinnerParams["text"],
            textVisible: true,
            theme: 'e',
            html: spinnerParams["html"]
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
	buddyArray.push(clLib.getUserInfo()["username"]);
	$.each(buddyArray, function(idx, buddyName) {
		// build where clause for today's routelogs
		var buddyWhere = clLib.getRouteLogWhereToday({userName: buddyName});
		// retrieve today's top scored routelogs
		var buddyTodaysTopRouteLogs = clLib.localStorage.getEntities("RouteLog", buddyWhere, "defaultStorage", 
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
	clLib.UI.addListItems(targetElement, allTodaysScores);
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
".ratingSelect > label  {                                                                                                                                                " +
"    float: left;                                                                                                                                                             " +
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


clLib.UI.getId$ = function(elementName, pageId) {
	var currentJqmSlide = pageId || localStorage.getItem("currentJqmSlide");
	var newSelector = "#" + currentJqmSlide + "_" + elementName;
	return newSelector;
};

clLib.UI.byId$ = function(elementName, pageId) {
	var newSelector = clLib.UI.getId$(elementName, pageId);
	//alert("returning selector >" + newSelector + "<");
	return $(newSelector);
};


clLib.UI.elementNameFromId = function(id) {
	var currentJqmSlide = localStorage.getItem("currentJqmSlide");
	var newId = id.replace(currentJqmSlide + "_", "");
	newId = newId.replace("_COMMON_" + "_", "");
	return newId;
};

clLib.UI.localStorageRefreshHandler = function($element, additionalOptions) {
	clLib.loggi("refreshing " + $element.attr("id"));
	var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
	var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];

	
	var results;
	//alert("additional strDataObj" + JSON.stringify(additionalOptions["strDataObj"]));
	if(additionalOptions["strDataObj"]) {
		//alert("processing addoptions " + additionalOptions["strDataObj"]);
		console.log("addoptions BEFORE: " + JSON.stringify(additionalOptions["strDataObj"]));
		results = additionalOptions["strDataObj"].split(",");
		console.log("addoptions AFTER: " + JSON.stringify(results));
	} 
	else {
		//alert("getting localstorage for " + additionalOptions["localStorageVar"]);
		console.log("local var BEFORE: " + JSON.stringify(localStorage.getItem(additionalOptions["localStorageVar"])));
		var localStorageVarValue = localStorage.getItem(additionalOptions["localStorageVar"]);
		if(!localStorageVarValue) {
			if(clLib.UI.varDefaults[additionalOptions["localStorageVar"]]) {
				localStorageVarValue = clLib.UI.varDefaults[additionalOptions["localStorageVar"]];
			} 
			else {
				localStorageVarValue = "";
			}
		}
		results = localStorageVarValue.split(",");
		console.log("local var AFTER: " + JSON.stringify(results));
		//alert("getting localstorage for " + additionalOptions["localStorageVar"]);
	}

	var elContentOptions = {
		selectBoxElement : $element,
		dataObj : results,
		preserveCurrentValue : true,
		// additionalValue : clLib.UI.NOTSELECTED
		additionalValue : {
			 //text: clLib.UI.elementNameFromId($element.attr("id"))
			text: clLib.UI.getLabelForElement($element) + "?"
			,value: "__UNKNOWN__"
		}
	};
	$.extend(elContentOptions, additionalOptions);
	
	// Assume controlgroups consist of radio buttons..
	if($element.attr("data-role") == 'controlgroup') {
		//alert("cl-data-type ="+ $element.attr("cl-data-type"));
		if($element.attr("cl-data-type") == 'checkbox') {
			//alert("creating checkbox group...");
			clLib.createCheckboxGroup(elContentOptions);
		} 
		else {
			clLib.createRadioButtons(elContentOptions);
		}
	} 
	else {
		//console.log("?!?! populating select " + JSON.stringify(elContentOptions));
		//alert("?!?!");
		clLib.populateSelectBox(elContentOptions);
	}
}


clLib.UI.defaultRefreshHandler = function($element, additionalOptions) {
	clLib.loggi("refreshing " + $element.attr("id"));
	var currentLayout = localStorage.getItem("currentLayout") || localStorage.getItem("defaultLayout") || "default";
	var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];

	
	var dependingPageElements = [];
	if(elementConfig["dependingOn"]) {
		dependingPageElements = elementConfig["dependingOn"][currentLayout] || elementConfig["dependingOn"]["default"];
	}
	
	clLib.loggi($element.attr("id") + " depends on " + JSON.stringify(dependingPageElements)); 
	var resultColName = elementConfig["dbField"];

	var entityName = elementConfig["refreshFromEntity"] || "Routes";
	
	var results = clLib.UI.defaultEntitySearch(entityName, resultColName, dependingPageElements, true, null);
	clLib.loggi("got results: " + JSON.stringify(results));

	var elContentOptions = {
		selectBoxElement : $element,
		dataObj : results,
		preserveCurrentValue : true,
		// additionalValue : clLib.UI.NOTSELECTED
		additionalValue : {
			 //text: clLib.UI.elementNameFromId($element.attr("id"))
			text: clLib.UI.getLabelForElement($element) + "?"
			,value: "__UNKNOWN__"
		}
	};
	//alert("elContentOptions are " + JSON.stringify(additionalOptions));
	$.extend(elContentOptions, additionalOptions);
	
	

	// Assume controlgroups consist of radio buttons..
	if($element.attr("data-role") == 'controlgroup') {
		//alert("cl-data-type ="+ $element.attr("cl-data-type"));
		if($element.attr("cl-data-type") == 'checkbox') {
			//alert("creating checkbox group...");
			clLib.createCheckboxGroup(elContentOptions);
		} 
		else {
			clLib.createRadioButtons(elContentOptions);
		}
	} 
	else {
		clLib.populateSelectBox(elContentOptions);
	}
}

clLib.UI.getLabelForElement = function($element) {
	return $element.parents("td").find("label[for=" + $element.attr("id") + "]").html();
};

clLib.UI.defaultEntitySearch = function(entityName, resultColName, dependentPageElements, distinctFlag, additionalWhereObj, storageName) {
	var baseWhere = {}, where, results;
	clLib.loggi("searching for entity " + entityName + " in storage " + storageName);
	$.each(dependentPageElements, function(idx, elementName) {
		var elementConfig = clLib.UI.elements[elementName];
		//alert("eaching " + idx + "," + elementName + "=>" + elementConfig["dbField"] + " to " + clLib.UI.getVal(elementName));
		var aValue = clLib.UI.getVal(elementName);
		if(aValue) {
			baseWhere[elementConfig["dbField"]] = aValue;
		}
	});
	//alert("basewhere1 = " + JSON.stringify(baseWhere));
	if(additionalWhereObj) {
		$.extend(baseWhere, additionalWhereObj);
	}
	//alert("basewhere2 = " + JSON.stringify(baseWhere));
	if(entityName == "Routes" || entityName == "RouteLog") {
		where = clLib.getRoutesWhere(baseWhere);
	} else {
		where = baseWhere;
	}
	//alert("where = " + JSON.stringify(where));

	if(distinctFlag) {
		results = clLib.localStorage.getDistinct(entityName, where, resultColName, "defaultStorage");
	} else {
		results = clLib.localStorage.getEntities(entityName, where, "defaultStorage");
	}
	return results;

}


clLib.UI.getVal = function(elementName) {
	var elementConfig = clLib.UI.elements[elementName];
	var elementValue;
	if(elementConfig["customVal"]) {
		//alert("customval for " + elementName);
		elementValue = elementConfig["customVal"](clLib.UI.byId$(elementName));
	} else {
		elementValue = clLib.UI.byId$(elementName).val();
	}
	return elementValue;
}

clLib.UI.save = function (options, successFunc, errorFunc) {
	var currentJqmSlide = options["currentJqmSlide"];
	var currentLayout = options["currentLayout"];
	var additionalData = options["additionalData"];
	
    var saveHandler;

    if (!options["currentJqmSlide"]) {
        options["currentJqmSlide"] = localStorage.getItem("currentJqmSlide");
    }

    if (!(saveHandler = clLib.UI.saveHandlers[options["currentJqmSlide"]])) {
        alert("no save handler defined for page >" + options["currentJqmSlide"] + "<");
        return;	
    }

    saveHandler(options, successFunc, errorFunc);
}



clLib.UI.localStorageSaveHandler = function (options, successFunc, errorFunc) {
    var saveObj = {};

	var currentJqmSlide = options["currentJqmSlide"];
	var currentLayout = options["currentLayout"];
	
    if (!currentJqmSlide) {
        currentJqmSlide = localStorage.getItem("currentJqmSlide");
    }
    if (!currentLayout) {
        currentLayout = localStorage.getItem("currentLayout") || "default";
    }

    $.each(clLib.UI.pageElements[currentJqmSlide][currentLayout], function (idx, elementName) {
        //alert("eaching " + idx + " and " + elementName);
        var elementConfig = clLib.UI.elements[elementName];
        if (!elementConfig) {
            alert("will not save " + elementName + ", no config found!");
        } else {
			//alert("setting localstorage " + (elementConfig["dbField"] || elementName) + " to " + clLib.UI.getVal(elementName));
            localStorage.setItem(
                elementConfig["localVarField"] || elementConfig["dbField"] || elementName, 
                clLib.UI.getVal(elementName)
            );
        }
    });
    //alert("local storage updated!");
    successFunc();
}



clLib.UI.RESTSaveHandler = function (options, successFunc, errorFunc) {
    var saveObj = {};
	var currentJqmSlide = options["currentJqmSlide"];
	var currentLayout = options["currentLayout"];
	
    if (!currentJqmSlide) {
        currentJqmSlide = localStorage.getItem("currentJqmSlide");
    }
    if (!currentLayout) {
        currentLayout = localStorage.getItem("currentLayout") || "default";
    }

    $.each(clLib.UI.pageElements[currentJqmSlide][currentLayout], function (idx, elementName) {
		console.log("eaching " + idx + " and " + elementName);
        var elementConfig = clLib.UI.elements[elementName];
		var dbField = elementConfig["dbField"] || elementName;
        if (!elementConfig) {
            alert("will not save " + elementName + ", no config found!");
        } else {
            saveObj[dbField] = clLib.UI.getVal(elementName);
        }
    });
    console.log("saveObj is " + JSON.stringify(saveObj));
	var dbEntity = "RouteLog";
	//alert("options " + JSON.stringify(options));
	if(options["additionalData"] && options["additionalData"]["dbEntity"]) {
		dbEntity = options["additionalData"]["dbEntity"];
	}
    clLib.localStorage.addInstance(dbEntity, saveObj, "defaultStorage");
    successFunc();
}


clLib.validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


clLib.UI.userHandler = function (options, successFunc, errorFunc) {
    var userObj = {};
	var currentJqmSlide = options["currentJqmSlide"];
	var currentLayout = options["currentLayout"];
	var additionalData = options["additionalData"];
	
    if (!currentJqmSlide) {
        currentJqmSlide = localStorage.getItem("currentJqmSlide");
    }
    if (!currentLayout) {
        currentLayout = localStorage.getItem("currentLayout") || "default";
    }

    $.each(clLib.UI.pageElements[currentJqmSlide][currentLayout], function (idx, elementName) {
        //alert("eaching " + idx + " and " + elementName);
        var elementConfig = clLib.UI.elements[elementName];
        if (!elementConfig) {
            alert("will not save " + elementName + ", no config found!");
        } else {
            userObj[elementConfig["dbField"]] = clLib.UI.getVal(elementName);
        }
    });
    $.each(additionalData, function (elementName, elementValue) {
        //alert("2eaching " + elementName + " and " + elementValue);
        userObj[elementName] = elementValue;
    });    
	var returnObj = {};
	var userAction = additionalData["action"];

	// validate that username is an email address..
	if(!clLib.validateEmail(userObj["username"])) {
		return errorFunc(new Error("Username must be a valid email address!"));
	}
	
	if (userAction == "create") {
		return clLib.REST.createUser(userObj, 
		function(returnObj) {
			// Clear any "old" error messages 
			localStorage.removeItem("loginError");

			var sessionToken = returnObj["sessionToken"];
			//alert("retrieved sessionToken >" + sessionToken + "<");
			clLib.sessionToken = sessionToken;
			
			return successFunc(returnObj);
		}
		, errorFunc);
	}
	else if (userAction == "login") {
		return clLib.REST.loginUser(userObj, 
		function(returnObj) {
			// Clear any "old" error messages 
			localStorage.removeItem("loginError");

			//alert("got login response " + JSON.stringify(returnObj));
			var sessionToken = returnObj["sessionToken"];
			//alert("retrieved sessionToken >" + sessionToken + "<");
			clLib.sessionToken = sessionToken;
			localStorage.setItem("currentPassword", returnObj["password"]);
			
			return successFunc(returnObj);
		}
		, errorFunc);
	}
	else if (userAction == "logout") {
		localStorage.removeItem("currentPassword");
		clLib.sessionToken = null;
		returnObj["sessionToken"] = null;
		return successFunc();
	}
	else if (userAction == "delete") {
		return clLib.REST.deleteUser(userObj, 
		function(returnObj) {
			// Clear any "old" error messages 
			localStorage.removeItem("loginError");

			localStorage.removeItem("currentPassword");
			clLib.sessionToken = null;
			returnObj["sessionToken"] = null;
			return successFunc(returnObj);
		}
		, errorFunc);
	}
	else {
		// could not login - alert error and return false
        clLib.sessionToken = null;
		localStorage.setItem("loginError", "Could not login user: " + JSON.parse(JSON.parse(e.message)["responseText"])["description"]);
		return errorFunc(
				new clLib.clException("CORE", 
					"unknown operation >" + userAction + "< - don't know what to do for user.."));
	}
	alert("should not get here..?!!?!?!?");
}


/*
*  Adds css classes (with the same name as the _values_) to the options
*  from the specified select box (with id _targetId_).
*  Currently selected option(=color) is set as class of the currently selected
*  element.
*
*  _targetId_ is expected to be a select menu rendered by jqm.
*
*/
clLib.addCSSBackground = function(targetId, options) {
	//alert("adding CSS bg to " + targetId);
	var $targetEl = $('#' + targetId);
	clLib.UI.killEventHandlers($targetEl, "change.clLibCSSBackground");

	var classForText = null;
	var elName = clLib.UI.elementNameFromId(targetId);
	if (clLib.UI.cssBackgrounds[elName]) {
	    classForText = {};
	    $.each(clLib.UI.cssBackgrounds[elName], function (text, className) {
	        //alert("adding class " + className + " for text " + text);
	        classForText[text] = className;
	    });
	}


	// Add css class named option.value for every entry in #targetId
    $('option', $targetEl).each(function () {
        var ind = $(this).index();
        // fetch current option element
        var entry = $('#' + targetId + '-menu').find('[data-option-index=' + ind + ']');
        // set corresponding css class
        //clLib.loggi("adding class" + entry.find("a").html());
        var className = entry.find("a").html();
        //alert("checking for class for text " + entry.find("a").html());

        if (classForText && classForText[entry.find("a").html()]) {
            className = classForText[entry.find("a").html()];
        }
        entry
			.find("a")
            .addClass("clCSSBg")
            .addClass(className);
		//entry.find("a").css("background-color", "red");
		if(options && options["iconOnly"]) {
			entry
				.find("a")
				.addClass("clCSSBgIconOnly");
		}
	});
	
	if(options && options["iconOnly"]) {
		$targetEl.parents("div.ui-select").addClass("clCSSBgIconOnly");
	}
    
	// Set currently selected color in collapsed select menu 
    var last_style; // remembers last color chosen
    
	$targetEl.on('change.clLibCSSBackground', function () {
		var last_style = $(this).data("cllast_style");
		// Get currently selected element

	    var className = $(this).find(':selected').html();
		//alert("found selected element >" + className + "<");
	    if (classForText && classForText[className]) {
            className = classForText[className];
        }
	    //alert("last_style " + last_style + ",changing to " + className);

	    // Remove CSS class for previously selected color
        if (last_style) {
            $(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
        }
		//alert("setting laststyle to >" + className + "<");
        // Set currently selected color
        $(this).closest('.ui-select').find('.ui-btn').addClass(className);
        // Remember currently selected color
        $(this).data("cllast_style", className);
        //alert("remembering last_style " + selection);
		//$(this).change();
    });

	// Update jqm generated widget
	$('#' + targetId).trigger('change.clLibCSSBackground');
//	$('#' + targetId).trigger('change');
 	
};


clLib.UI.preloadImages = function (imageURLs) {
    $.each(imageURLs, function (idx, imageURL) {
        var img = new Image();
        img.src = imageURL;
    });
};



clLib.UI.elementConfig.localVarSaveImmediately = {
    "refreshHandler": function ($this) {
		var elementName = clLib.UI.elementNameFromId($this.attr("id"));
        //if(elementName == "defaultLayoutMenuSwitch") {
		//	alert("refreshing element " + elementName); //defaultLayoutMenuSwitch
		//}

		var $element = $this;

		var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];
		
		if(!elementConfig) {
			alert("2no element config for element with id " + $element.attr("id") + " and name " + clLib.UI.elementNameFromId($element.attr("id")) + " found..");
			alert("currentJqmSlide = " + localStorage.getItem("currentJqmSlide"));
			return;
		}

		var localVarName = elementConfig["localVar"] || elementName;
		
        var localVarValue = localStorage.getItem(localVarName);
		//if(elementName == "defaultLayoutMenuSwitch") {
		//	alert("AAAA setting element " + elementName + " to " + localStorage.getItem(localVarName	));
        //}
		
		//$this.val(localVarValue).attr('selected', true).siblings('option').removeAttr('selected');
        //$this.selectmenu("refresh", true);
        
		var jqmDataRole = $this.attr("data-role");
        //alert("jqmDataRole is " + jqmDataRole);
		if (jqmDataRole == "button") {
            //alert("button - " + $this.attr("id") + " setting txt to " + localVarValue);
            $this.text(localVarValue);
//            $this.find(".ui-btn-text").text(localVarValue);
            $this.button("refresh");
        } 
		else if (jqmDataRole == "flipswitch") {
            $this.val(localVarValue);
            $this.flipswitch("refresh");
        } 
		else {
            $this.val(localVarValue);
        }
        //alert("set value to " + localVarValue);
    }
    , "changeHandler": function ($this, changeOptions) {
        //alert("changed " + $this.attr("id"));
        var elementName = clLib.UI.elementNameFromId($this.attr("id"));
        var localVarValue;

        var jqmDataRole = $this.attr("data-role");
        if (jqmDataRole == "button") {
            localVarValue = $this.text();
            //alert("1" + localVarValue);
//			localVarValue = $this.find(".ui-btn-text").text();
//            alert("2" + localVarValue);
        } else {
            localVarValue = $this.val();
          //alert("button - " + $this.attr("id") + " changing txt to " + localVarValue);
//
			var $element = $this;
			//alert("checking elementConfig for " + clLib.UI.elementNameFromId($element.attr("id")) );

			var elementConfig = clLib.UI.elements[clLib.UI.elementNameFromId($element.attr("id"))];
			if(!elementConfig) {
				alert("no element config for element with id " + $element.attr("id") + " and name " + clLib.UI.elementNameFromId($element.attr("id")) + " found..");
				alert("currentJqmSlide = " + localStorage.getItem("currentJqmSlide"));
				return;
			}
			var localVarName = elementConfig["localVar"] || elementName;
		}
		//alert("setting localvar " + localVarName);
		localStorage.setItem(localVarName, localVarValue);
        //clLib.UI.setSelectedValue($this, localVarValue);
    }
};

clLib.UI.elementConfig.localVar = {
    "refreshHandler": function ($this) {
        var elementName = clLib.UI.elementNameFromId($this.attr("id"));
		
		if(elementName == "currentUserReadOnly") {
			elementName = "currentUser";
		}
        //alert("Getting localstorage " + elementName);
		var localVarValue = localStorage.getItem(elementName);
        //$this.val(localVarValue).attr('selected', true).siblings('option').removeAttr('selected');
        //$this.selectmenu("refresh", true);
        var jqmDataRole = $this.attr("data-role");
        clLib.loggi($this.attr("id") + " is a >" + jqmDataRole + "< - setting it to " + localVarValue);

        if (jqmDataRole == "button") {
            $this.text(localVarValue);
//            $this.find(".ui-btn-text").text(localVarValue);
            $this.button("refresh");
        } 
		else if (jqmDataRole == "select" || $this.prop("tagName") == "SELECT") {
            $this.val(localVarValue);
			//alert("jqmDataRole:" + jqmDataRole + ", $this.prop(tagName) " + $this.prop("tagName") );
			if(jqmDataRole != 'flipswitch') {
				$this.selectmenu("refresh");
			} else {
				$this.flipswitch("refresh");
			}
		}	
		else if($this.prop("tagName") == "SPAN") {
			$this.html(localVarValue);
		}		
		else {
			//alert($this.attr("id") + " is not a button >" + jqmDataRole + "< - setting txt to " + localVarValue);
            $this.val(localVarValue);
        }
        //alert("set value to " + localVarValue);
    }
};

clLib.UI.elementConfig.plainElement = {
    "refreshHandler": function ($this) {
    }
};


clLib.prefsCompleteCheck = function (successFunc, errorFunc) {
    //alert("pref complete?");
	var prefsComplete = false;
    if (clLib.getUserInfo()["username"]) {
        return successFunc();
    }
	else {
		localStorage.setItem("loginError", "No username specified.");
		return clLib.PAGES.changeTo("clLib_users.html", {noRedirectFlag: false});
	}
};

clLib.tryLogin = function(successFunc, errorFunc, noRedirectFlag) {
	console.log("trying login with " + typeof(noRedirectFlag) + ":" + noRedirectFlag);
    // offline? no need to try to login..
	if(!clLib.isOnline()) {
		return errorFunc();
	}
	return clLib.loggedInCheck(
	successFunc,
	function(e) {
		alert("&/&/&/&/&/&/!!handling error >" + !(noRedirectFlag == true) + "< " + JSON.stringify(e));
        clLib.loginErrorHandler(e);
        if((noRedirectFlag == true) == false) {
            console.log("no login success, redirecting to users page...");
            return clLib.PAGES.changeTo("clLib_users.html");
		}
        // return with exitFlag=true => to not evaluate subsequent chained funcs..
        return successFunc(true);
	}
	);
};




clLib.UI.addCollapsible = function(options) {
	var $container = options["collapsibleSet"];
	var titleText = options["titleText"];
	var listItems = options["listItems"];
	var clearCurrentItems = options["clearCurrentItems"];
	
	//alert("building collapsible");
	clLib.loggi("refreshing listItems..");

	var $newList = $("<ul>")
		.attr({
			"data-role" : "listview"
			,"data-theme" : "c"
			,"adata-divider-theme" : "d"
			,"data-inset" : "true"
		})
	;
	

	var $newColl =
		$("<div>")
			.attr({
				"data-role" : "collapsible"
				,"data-collapsed": "true"
				,"data-inset" : "true"
			})
			.append(
				$("<h2>")
					.html(titleText)
			)
			.append($newList)
	;
	
	if(clearCurrentItems) {
		$container.children().remove();
	}
	$container.append($newColl);
	$container.trigger("create");
	
	clLib.UI.addListItems($newList, listItems, clLib.UI.list.formatRouteLogRow, 2, true);
	

};