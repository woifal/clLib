var clLib = {};
clLib.gradeConfig = {
	"UIAA" : {
		defaultGrade: "V",
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
		grades : {
			"I-" : 10                 ,
			"I" : 15                  ,
			"I+" : 20                 ,
			"II-" : 25                ,
			"II" : 30                 ,
			"II+" : 35                ,
			"III-" : 40               ,
			"III" : 45                ,
			"III+" : 50               ,
			"III+/IV-" : 60           ,
			"IV-" : 70                ,
			"IV-/IV" : 80             ,
			"IV" : 90                 ,
			"IV+" : 100               ,
			"IV+/V-" : 125            ,
			"V-" : 150                ,
			"V-/V" : 175              ,
			"V" : 200                 ,
			"V/V+" : 225              ,
			"V+" : 250                ,
			"V+/VI-" : 275            ,
			"VI-" : 300               ,
			"VI-/VI" : 325            ,
			"VI" : 350                ,
			"VI/VI+" : 375            ,
			"VI+" : 400               ,
			"VI+/VII-" : 425          ,
			"VII-" : 450              ,
			"VII-/VII" : 475          ,
			"VII" : 500               ,
			"VII/VII+" : 525          ,
			"VII+" : 550              ,
			"VII+/VIII-" : 600        ,
			"VIII-" : 625             ,
			"VIII-/VIII" : 650        ,
			"VIII" : 700              ,
			"VIII/VIII+" : 750        ,
			"VIII+" : 775             ,
			"VIII+/IX-" : 800         ,
			"IX-" : 850               ,
			"IX-/IX" : 875            ,
			"IX" : 900                ,
			"IX/IX+" : 925            ,
			"IX+" : 950               ,
			"IX+/X-" : 1000           ,
			"X-" : 1050               ,
			"X-/X" : 1075             ,
			"X" : 1100                ,
			"X/X+" : 1125             ,
			"X+" : 1150               ,
			"X+/XI-" : 1200           ,
			"XI-" : 1225              ,
			"XI-/XI" : 1250           ,
			"XI" : 1300               ,
			"XI/XI+" : 1325           ,
			"XI+" : 1350              ,
			"XI+/XII-" : 1375         ,
			"XII-" : 1400             ,
			"XII-/XII" : 1450         
		}
	},
	"French" : {                        
		defaultGrade: "5",
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
		grades : {                    
			"1" : 10                  ,
			"1" : 15                  ,
			"1" : 20                  ,
			"2" : 25                  ,
			"2" : 30                  ,
			"2" : 35                  ,
			"3" : 40                  ,
			"3" : 45                  ,
			"3" : 50                  ,
			"3" : 60                  ,
			"3" : 70                  ,
			"3" : 80                  ,
			"4a" : 90                 ,
			"4a" : 100                ,
			"4a/4b" : 125             ,
			"4b" : 150                ,
			"4b/4c" : 175             ,
			"4c" : 200                ,
			"4c/5a" : 225             ,
			"5a" : 250                ,
			"5a/5b" : 275             ,
			"5b" : 300                ,
			"5b/5c" : 325             ,
			"5c" : 350                ,
			"5c/6a" : 375             ,
			"6a" : 400                ,
			"6a/6a+" : 425            ,
			"6a+" : 450               ,
			"6a+/6b" : 475            ,
			"6b" : 500                ,
			"6b/6b+" : 525            ,
			"6b+" : 550               ,
			"6c" : 600                ,
			"6c/6c+" : 625            ,
			"6c+" : 650               ,
			"7a" : 700                ,
			"7a/7a+" : 750            ,
			"7a+" : 775               ,
			"7b" : 800                ,
			"7b+" : 850               ,
			"7b+/7c" : 875            ,
			"7c" : 900                ,
			"7c/7c+" : 925            ,
			"7c+" : 950               ,
			"8a" : 1000               ,
			"8a+" : 1050              ,
			"8a+/8b" : 1075           ,
			"8b" : 1100               ,
			"8b/8b+" : 1125           ,
			"8b+" : 1150              ,
			"8c" : 1200               ,
			"8c/8c+" : 1225           ,
			"8c+" : 1250              ,
			"9a" : 1300               ,
			"9a/9a+" : 1325           ,
			"9a+" : 1350              ,
			"9a+/9b" : 1375           ,
			"9b" : 1400               ,
			"9b+" : 1450              
		}
	},
	"Bleau" : {                        
		defaultGrade: "Fb 5a",
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
		grades : {                     
			"Fb 1" : 10               ,
			"Fb 1" : 15               ,
			"Fb 1" : 20               ,
			"Fb 1" : 25               ,
			"Fb 1" : 30               ,
			"Fb 1" : 35               ,
			"Fb 1" : 40               ,
			"Fb 1" : 45               ,
			"Fb 1" : 50               ,
			"Fb 1" : 60               ,
			"Fb 1" : 70               ,
			"Fb 1" : 80               ,
			"Fb 2" : 90               ,
			"Fb 2" : 100              ,
			"Fb 2" : 125              ,
			"Fb 2" : 150              ,
			"Fb 2" : 175              ,
			"Fb 3" : 200              ,
			"Fb 3" : 225              ,
			"Fb 4a" : 250             ,
			"Fb 4a" : 275             ,
			"Fb 4b" : 300             ,
			"Fb 4b" : 325             ,
			"Fb 4b" : 350             ,
			"Fb 4c" : 375             ,
			"Fb 4c" : 400             ,
			"Fb 4c" : 425             ,
			"Fb 5a" : 450             ,
			"Fb 5a" : 475             ,
			"Fb 5b" : 500             ,
			"Fb 5b" : 525             ,
			"Fb 5c" : 550             ,
			"Fb 5c" : 600             ,
			"Fb 6a" : 625             ,
			"Fb 6a" : 650             ,
			"Fb 6a+" : 700            ,
			"Fb 6b" : 750             ,
			"Fb 6b+" : 775            ,
			"Fb 6c" : 800             ,
			"Fb 6c" : 850             ,
			"Fb 6c+" : 875            ,
			"Fb 7a" : 900             ,
			"Fb 7a" : 925             ,
			"Fb 7a+" : 950            ,
			"Fb 7a+" : 1000           ,
			"Fb 7b" : 1050            ,
			"Fb 7b" : 1075            ,
			"Fb 7b+" : 1100           ,
			"Fb 7b+" : 1125           ,
			"Fb 7c" : 1150            ,
			"Fb 7c" : 1200            ,
			"Fb 7c+" : 1225           ,
			"Fb 7c+" : 1250           ,
			"Fb 8a" : 1300            ,
			"Fb 8a+" : 1325           ,
			"Fb 8b" : 1350            ,
			"Fb 8b+" : 1375           ,
			"Fb 8c" : 1400            ,
			"Fb 8c+" : 1450           
		}
	},
	"USA" : {                      
		defaultGrade: "5.10a",
		tickTypeFactors : {
			"Red Point"       : 1,
			"Lead / rest"     : 2,
			"Top Rope"        : 3,
			"Top Rope / rest" : 4,
			"Project"         : 5
		},
		grades : {                    
			"5.0" : 10                ,
			"5.0" : 15                ,
			"5.0" : 20                ,
			"5.1" : 25                ,
			"5.1" : 30                ,
			"5.1" : 35                ,
			"5.1" : 40                ,
			"5.2" : 45                ,
			"5.2" : 50                ,
			"5.2" : 60                ,
			"5.2" : 70                ,
			"5.2" : 80                ,
			"5.3" : 90                ,
			"5.4" : 100               ,
			"5.4" : 125               ,
			"5.5" : 150               ,
			"5.5" : 175               ,
			"5.5" : 200               ,
			"5.6" : 225               ,
			"5.7" : 250               ,
			"5.7" : 275               ,
			"5.8" : 300               ,
			"5.8" : 325               ,
			"5,9" : 350               ,
			"5.9" : 375               ,
			"5.10a" : 400             ,
			"5.10a" : 425             ,
			"5.10b" : 450             ,
			"5.10c" : 475             ,
			"5.10d" : 500             ,
			"5.10d" : 525             ,
			"5.11a" : 550             ,
			"5.11b" : 600             ,
			"5.11b" : 625             ,
			"5.11c" : 650             ,
			"5.11c" : 700             ,
			"5.11d" : 750             ,
			"5.12a" : 775             ,
			"5.12b" : 800             ,
			"5.12c" : 850             ,
			"5.12c" : 875             ,
			"5.12d" : 900             ,
			"5.12d" : 925             ,
			"5.13a" : 950             ,
			"5.13b" : 1000            ,
			"5.13c" : 1050            ,
			"5.13c" : 1075            ,
			"5.13d" : 1100            ,
			"5.14a" : 1125            ,
			"5.14a" : 1150            ,
			"5.14b" : 1200            ,
			"5.14b" : 1225            ,
			"5.14c" : 1250            ,
			"5.14d" : 1300            ,
			"5.15a" : 1325            ,
			"5.15a" : 1350            ,
			"5.15b" : 1375            ,
			"5.15b" : 1400            ,
			"5.15c" : 1450            	
		}
	}
};

clLib.populateGradeTypes = function($gradeTypeSelect, preselectedGradeType){
	alert("refreshing list for preselected gradetype " + preselectedGradeType);
	$gradeTypeSelect.html("");

	$.each(clLib.gradeConfig, function(index, value) {
		alert(">"+ index + "<>" + value + "<");
		var $option = $('<option></option>').val(index).html(index) /*.attr(selected, selected)*/
		var selected = "";
		if(index == preselectedGradeType) {
			selected = "selected";
		}
		//alert("selected? >" + selected + "<");
		if(selected) {
			$option.attr(selected, selected);
		}
		$gradeTypeSelect.append($option);
	});
	//alert("33" + JSON.stringify($gradeSelect.html()));
	$gradeTypeSelect.selectmenu('refresh', true);
};

clLib.populateGrades = function($gradeSelect, selectedGradeType) {
	//alert("refreshing list for gradetype " + selectedGradeType);
	//var $gradeSelect = Appery("grade_select_menu");
	//alert(JSON.stringify($gradeSelect.html()));
	$gradeSelect.html("");

	$.each(clLib.gradeConfig[selectedGradeType]["grades"], function(index, value) {
		alert(">"+ index + "<>" + value + "<");
		var $option = $('<option></option>').val(index).html(index) /*.attr(selected, selected)*/
		var selected = "";
		if(index == clLib.gradeConfig[selectedGradeType]["defaultGrade"]) {
			selected = "selected";
		}
		//alert("selected? >" + selected + "<");
		if(selected) {
			$option.attr(selected, selected);
		}
		$gradeSelect.append($option);
	});
	//alert("33" + JSON.stringify($gradeSelect.html()));
	$gradeSelect.selectmenu('refresh', true);
};

clLib.calculateScore = function(routeLogs) {
	var totalScore = 0;
	for (var i = 0; i < routeLogs.length; i++) {
		var routeLog = routeLogs[i];
		totalScore += clLib.computeScore(routeLog);
	}
	console.log("Total score is " + totalScore);
};

clLib.computeScore = function(routeLogObj) {
	if(!(routeLogObj.GradeSystem in clLib.gradeSystem)) {
		console.log("unknown gradeType " + routeLogObj.GradeSystem);
		return 0;
	}
	var gradeTypeScore = clLib.gradeSystem[routeLogObj.GradeSystem];
	if(!(routeLogObj.Grade in gradeTypeScore.grades)) {
		console.log("unknown grade " + routeLogObj.Grade);
		return 0;
	}
	if(!(routeLogObj.TickType in gradeTypeScore.tickTypeFactors)) {
		console.log("unknown ticktype " + routeLogObj.TickType);
		return 0;
	}
	
	var score =
		gradeTypeScore["grades"][routeLogObj.Grade]+ 0
		+ gradeTypeScore["tickTypeFactors"][routeLogObj.TickType] + 0
	;
	console.log("computed score for route " + JSON.stringify(routeLogObj));
	console.log("score = " + score);
	return score;
};

clLib.today = function() {
	var current = new Date();
	current.setHours(0,0,0,0);
	return current;
};

clLib.tomorrow = function() {
	var today = clLib.today();
	today.setDate(today.getDate()+1);
	return today;
};

clLib.colBetweenDate = function(colName, startDate, endDate) {
	var whereObj = {};
	whereObj.colName = {
		"$gte": startDate, 
		"$lt": endDate
	};
	alert(JSON.stringify(whereObj));
	return whereObj;
};

//clLib.addColorBackground("startScreen_colorSelectMenu"); 

/*
*  Adds css classes (with the same name as the _values_) to the options
*  from the specified select box (with id _targetId_).
*  Currently selected option(=color) is set as class of the currently selected
*  element.
*
*  _targetId_ is expected to be a select menu rendered by jqm.
*
*/
clLib.addColorBackground = function(targetId) {
	console.log("adding colors to " + targetId);
    // Add css class named option.value for every entry in #targetId
    $('#' + targetId + ' option').each(function () {
        var ind = $(this).index();
        // fetch current option element
        var entry = $('#' + targetId + '-menu').find('[data-option-index=' + ind + ']');
        // set corresponding css class
        console.log("adding class" + entry.find("a").html());
        entry.addClass("clColorBg");
        entry.addClass(entry.find("a").html());
    });
    // Set currently selected color in collapsed select menu 
    var last_style; // remembers last color chosen
    $('#' + targetId).on('change', function () {
        // Get currently selected element
        var selection = $(this).find(':selected').html();
        // Remove CSS class for previously selected color
        if (last_style) {
            $(this).closest('.ui-select').find('.ui-btn').removeClass(last_style);
        }
        // Set currently selected color
        $(this).closest('.ui-select').find('.ui-btn').addClass(selection);
        // Remember currently selected color
        last_style = selection;
        //$(this).change();
    });
	
    // Update jqm generated widget
    $('#' + targetId).change();
};

clLib.buildSimpleWhere = function(whereCol, whereVal) {
	console.log("building where >" + whereCol + "< = >" + whereVal + "<");
    var whereObj = {};
	whereObj[whereCol] = whereVal;
    console.log("returning where " + JSON.stringify(whereObj));
	return JSON.stringify(whereObj);
};


// $inElement = $("#startScreen_nameSearchResult").
// $forElement = Appery("nameSearchField");
clLib.populateSearchProposals = function($forElement, $inElement) {
	$inElement.attr("data-theme", "c");
	$inElement.show();
	console.log("shown");

	$inElement.children().click(function() {
        console.log("this child;" + $(this).children().first().html());
		var result = $.trim($(this).children().first().text());
		console.log("seeting selectedresult to " + result);
		$forElement.val(result);
		$(this).parent().hide();
		console.log("hidden");
		//$("#startScreen_mobilefooter1").html(result);
	});
};


clLib.getSectorsWhere = function(gradeType, grade, area) {
	var whereObj = {};
	clLib.extendIfDefined(whereObj, gradeType, grade);
	clLib.extendIfDefined(whereObj, "Area", area);
	return JSON.stringify(whereObj);
};

/*
* build a mongodb where clause to use for "routes" queries based on
*	- gradeType
*	- grade
*	- area
*	- sector
* colums.
* Restrictions are only used if the value to search the colum for contains
* a not-null value.
*/
clLib.getRoutesWhere = function(gradeType, grade, area, sector) {
	var whereObj = {};
	whereObj[gradeType] = grade;
	clLib.extendIfDefined(whereObj, gradeType, grade);
	clLib.extendIfDefined(whereObj, "Area", area);
	clLib.extendIfDefined(whereObj, "Sector", sector);
	return JSON.stringify(whereObj);
};

clLib.getRouteLogWhere = function(dateWhere) {
	var whereObj = {};
	$.extend(whereObj, dateWhere);
	$.extend(clLib.extendIfDefined(whereObj, "username", localStore.getItem("currentUser"));
	return JSON.stringify(whereObj);
};

clLib.getRouteLogWhereToday = function() {
	return getRouteLogWhereAtDay(clLib.today())
	);
}

clLib.getRouteLogWhereAtDay = function(dateObj){
	return getRouteLogWhere(
		clLib.colBetweenDate(clLib.dayBegin(dateObj), clLib.dayEnd(dateObj))
	);
};

clLib.getRouteLogWhereCurrentScoreRange =  function() {
	if(localStorage.getItem("scoreRange") == 'today') {
		return clLib.getRouteLogWhereToday();
	}
	else if(localStorage.getItem("scoreRange") == 'customRange') {
		var fromDate = localStorage.getItem("scoreRangeFrom");
		var toDate = localStorage.getItem("scoreRangeTo");
		return clLib.getRouteLogWhere(
				clLib.colBetweenDate(
						fromDate, toDate
				)
		);
	}
};

clLib.dayBegin = function(dateObj) {
	dateObj.setHours(0, 0, 0, 0);
};

clLib.dayEnd = function(dateObj) {
	var dateTomorrow = dateObj.setDate(dateObj.getDate()+1);
	return dateTomorrow.dayBegin();
};

/*
* build a mongodb where clause to use for "route" queries based on
*	- gradeType
*	- grade
*	- area
* colums.
*/
clLib.getColoursWhere = function(gradeType, grade, area) {
	var whereObj = {};
	whereObj[gradeType] = grade;
	clLib.extendIfDefined(whereObj, gradeType, grade);
	clLib.extendIfDefined(whereObj, "Area", area);
	return JSON.stringify(whereObj);
};

/*
*	Extends "targetObj" with "value" at "key" 
*		IF value is defined
*/
clLib.extendIfDefined = function(targetObj, key, value) {
	if(value) {
		targetObj[key] = value;
	}
}
;





/*
*
*
*
*
*	experimental: localStorage alternative to REST service
*
*
*
*/



/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName) {
	var storageName = storageName || localStorage.getItem("defaultStorage");
	var storage = JSON.parse(localStorage.getItem(storageName));
	var resultsObj = [];
	$.each(storage[entity], function(index, value) {
		var currentEntity = storage[entity][index];
		var eligible = false;
		alert(">"+ index + "<>" + value + "<");
		// value is the current row to iterate
		$.each(whereObj, function(keyName, condition) {
			eligible = clLib.localStorage.evalCondition(currentEntity[keyName], condition);
		});
		if(eligible) {
			resultsObj.add(currentEntity);
		}
	});
	
	return resultsObj;
}

/*
*	{
*		"area": "x"
*	}
*			OR
*	{
*		"area" : {
*			"$gte": 1,
*			"$lt": 3
*		}
*	}
*
*
*/

clLib.localStorage.evalCondition = function(valueToTest, condition) {
	var eligible = true;
	if(instanceof(condition) !== Object) {
		if(valueToTest != condition) {
			elibible = false;
		}
	}
	else {
		$.each(condition, function(operator, compValue) {
			if(operator == "$gte"){
				if(!(valueToTest >= compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$gt"){
				if(!(valueToTest > compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$lt") {
				if(!(valueToTest < compValue)) {
					eligible = false;
				};
			} else 
			if(operator == "$lt"){
				if(!(valueToTest < compValue)) {
					eligible = false;
				}
			} 
		});
	};
};


clLib.knownQueries = {
	"routes": {
		"x": "y"
	}
};

clLib.localStorage.initStorage = function(storageName, storageObj) {
	localStorage.setItem(storageName, storageObj);
	// 2DO: Optimize for known queries...
};
