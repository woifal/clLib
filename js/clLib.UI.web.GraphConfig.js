"use strict";




clLib.graphConfig = {
	GraphConfigError: function (message) {
	  this.name = 'GraphConfigError';
	  this.message = message || 'Unknown reason';
	  alert("GraphConfigError " + JSON.stringify(this.message));
	  this.prototype = new Error();
	  this.prototype.constructor = clLib.UI.fc.GraphConfigError;
	}
	,GraphConfigCollection : function(graphConfigCollection) {
		this.graphConfigs = {};
		this.defaults = {
            collectionName : "_NO_FIELD_COLLECTION_DEFINED"
            ,containerSelector : false
		};
		this.add = function(graphConfigObj) {
			if(!(graphConfigObj instanceof clLib.graphConfig.GraphConfig)) {
				throw new clLib.UI.fc.GraphConfigError("trying to add invalid GraphConfig object.");
			}
			graphConfigObj.config.collection = this.config;
            this.graphConfigs[graphConfigObj.graphName] = graphConfigObj;
		}
		this.get = function(graphName) {
			if(!this.graphConfigs[graphName]) {
				clLib.loggi("graph >" + graphName + "< not found in collection.", "20150129");
				return {};
				//throw new clLib.UI.web.GraphConfigError("graph >" + graphName + "< not found in collection.");
			}
			return this.graphConfigs[graphName].config;
		}
		this.graphs = function() {
			return Object.keys(this.graphConfigs);
		}
		this.config = this.defaults;
		this.config = $.extend(true, this.config, graphConfigCollection);
		this.add = this.add.bind(this);
		
	}
	,GraphConfig : function(fieldConfig) {
		//alert("building field with config " + JSON.stringify(fieldConfig));
		this.graphName = fieldConfig["graphName"];
		this.defaults = {
			displayName : this.graphName
			,className : this.graphName
            ,graphType: "line"
            ,paging: true
            ,pagingSteps: 10
            ,graphLibHandler: googlechartsGraphHandler //chartJsGraphHandler //
            ,displayOptions: {
                keyType : "string"
                ,keyName: "??!??"
                ,keyFormat: ""
                ,keyGridCount: 5
                ,showRoutesOnClick: true
                ,showAllRoutesOnLegendClick: false
            }
            ,errorHandler : function(e) {
                alert("encountered error >" + e + "<(" + JSON.stringify(e) + ")");
            }
            ,getGraphData : function(options, successFunc, errorFunc) {
                console.log("getGraphData for options >" + JSON.stringify(options) + "<");
                //var statsOptions = $.extend(this.config["statsOptions"], options);
                options["statsOptions"] = this.config["statsOptions"];
                options["where"] = options["statsOptions"]["where"];
                console.error("stats options is >" + JSON.stringify(options) + "<");
                return clLib.REST.requestStatsNew(
                    options
                    ,successFunc
                    ,errorFunc
                );            
            }
            ,draw : function(options, successFunc) {
                if(!options) {
                    options = {};
                }
                if(!options["pagingStart"]) {
                    options["pagingStart"] = 0;
                }
                var graphConfig = this.config;
                return this.config.getGraphData(
                    options
                    ,function(resultObj) {
                        resultObj = JSON.parse(resultObj);
                        console.log("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));

                        var graphTypes = graphConfig.graphType.split("|");
                        
                        
                        if(
                            graphTypes.indexOf("bar") > -1 ||
                            graphTypes.indexOf("line") > -1 
                        ) {
                            graphConfig.graphLibHandler.draw({
                                graphConfig: graphConfig
                                ,resultObj: resultObj
                            });
                                

                        }
                        if(
                            graphTypes.indexOf("table") > -1
                        ) {
                        //alert("how the hell did I get here?!?!?!");
                        /*
                            var $tableContainer = $("#tableContainer");
                            var $filterContainer = $("#filterContainer");

                            var resultKeys = Object.keys(resultObj).sort();
                            var resultItems = [];
                            $.each(resultKeys, function(idx, resultKey) {
                                resultItems = resultItems.concat(resultObj[resultKey]["items"]);
                            });

                            $tableContainer.empty();
                            clLib.UI.web.createTable(
                                $tableContainer
                                ,{
                                    entity: "RouteLog"
                                    ,items: {"RouteLog": resultItems}
                                    ,where : null // {"username": "foo6@gmail.com"}
                                    ,readonly: true
                                }
                                ,function() {
                                    console.log("table builtttttttttttt!");
                                }
                                ,function(e) {
                                    alert("table build error >" + JSON.stringify(e) + "<");
                                }
                            );
                        */
                        }
                        
                    }
                    ,graphConfig.errorHandler
                );
            }
		}

		this.config = this.defaults;
		this.config = $.extend(true, this.config, fieldConfig);
        this.config.getGraphData = this.config.getGraphData.bind(this);
        this.config.draw = this.config.draw.bind(this);
    }
		
};

var GraphConfigCollection = clLib.graphConfig.GraphConfigCollection;
var GraphConfig = clLib.graphConfig.GraphConfig;
var GraphConfigError = clLib.graphConfig.GraphConfigError;


var routeLogConfig = new GraphConfigCollection({
    collectionName: "routeLogConfig"
    ,containerSelector: "#routeLogDiagramContainer"
});


routeLogConfig.add(new GraphConfig({
    graphName : "allSessionsByDay"
    ,displayName: "All Sessions (by day)"
    ,graphType: "line"
    ,displayOptions: {
        keyType : "date"
        ,keyFormat: "yyyy-MM-dd"
        ,showRoutesOnClick: true
        ,keyGridCount: 10
//        ,hAxisLabel: "Date"
    }
    ,statsOptions: {
        entity: "RouteLog"
        ,datePortion : {
//            format :   "yyyy-MM-dd"
            funcName : "localDayPortion"
        }
        ,aggFuncName:           "aggregateScoresByDatePortion"
        ,sortByFuncName:        "sort_localDayAndScore"
        ,aggTopX:               10
        ,sortDescFlag:          true
    }
}));
routeLogConfig.add(new GraphConfig({
    graphName : "allSessionsByMonth"
    ,displayName: "All Sessions (by month)"
    ,graphType: "line"
    ,displayOptions: {
        keyType : "date"
        ,keyFormat: "yyyy-MM"
        ,showRoutesOnClick: true
        ,keyGridCount: 10
//        ,hAxisLabel: "Date"
    }
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortion : {
            funcName : "localMonthPortion"
        }
        ,aggFuncName:           "aggregateScoresByDatePortion"
        ,sortByFuncName:        "sort_localDayAndScore"
        ,aggTopX:               10
        ,sortDescFlag:          true
    }
}));


clLib.date = {};
clLib.date.getLastMonths = function(baseDate, numOfMonths, includeBaseDate) {
  var dateArr = [];
  var x = baseDate;
  for(var i = 0; i < numOfMonths; i++) {
    var y = new Date(x);
    y.setMonth(x.getMonth() -i);
    y.setDate(1);
    y.setHours(0);
    y.setMinutes(0);
    y.setSeconds(0);
    dateArr.push(y);
  }
  
  if(includeBaseDate) {
    dateArr.unshift({v: baseDate, f: ''});
  }
  return dateArr;
}

routeLogConfig.add(new GraphConfig({
    graphName : "highScoreByDay"
    ,displayName: "High Score (by day)"
    ,graphType: "line"
    ,displayOptions: {
        keyGridCount: 10
        //,hAxisLabel: "XXXXXXX"
        ,keyType: "date"
        ,hAxisTicks : clLib.date.getLastMonths(new Date(), 3, true)
        ,hAxisFormat: 'MMM'
    }
    ,statsOptions: {
        entity: "RouteLog"
        ,datePortion : {
            funcName : "localDayPortion"
        }
        ,aggFuncName:           "aggregateHighScoreByDatePortion"
        ,sortByFuncName:        "sort_localScoreAndDay"
        ,sortDescFlag:          true
        ,aggTopX:               10 // use top 10 results before day X 
        ,nrOfEligibleDays:      365 // use top 10 results "nrOfEligibleDays" before day X
        ,baseDate:              new Date()
        ,firstDate:             function() {
            var x = new Date();
            x.setMonth(x.getMonth() -3);
            return x;
        } ()
//        ,where: clLib.colBetweenDate("DateISO", new Date(2001,4,1), new Date(2015,7,1))
    }

}));
routeLogConfig.add(new GraphConfig({
    graphName : "top10AllTimes"
    ,displayName: "Top 10(ever)"
    ,graphType: "bar|table"
    ,displayOptions: {
        keyType : "number"
        ,keyGridCount: 10
        ,showAllRoutesOnLegendClick: true
    }
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortion : {
            funcName : null
        }
        ,aggFuncName:           "aggregateById"
        ,sortByFuncName:        "sort_score"
        ,aggTopX:               1
        ,sortDescFlag:          true
        ,nrOfEligibleDays:      9999
        ,startIdx:                 0
        ,endIdx:                   10
//        ,where: clLib.colBetweenDate("DateISO", new Date(2001,4,1), new Date(2015,7,1))

    }
}));
routeLogConfig.add(new GraphConfig({
    graphName : "top10LastYear"
    ,displayName: "Top 10(last year)"
    ,graphType: "bar|table"
    ,displayOptions: {
        keyType : "number"
        ,keyGridCount: 10
        ,showAllRoutesOnLegendClick: true
    }
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortion : {
            funcName : null
        }
        ,aggFuncName:           "aggregateById"
        ,sortByFuncName:        "sort_score"
        ,aggTopX:               1
        ,sortDescFlag:          true
        ,nrOfEligibleDays:      365
        ,startIdx:                 0
        ,endIdx:                   10
    }
}));
routeLogConfig.add(new GraphConfig({
    graphName : "top10_3months"
    ,displayName: "Top 10(last 3 months)"
    ,graphType: "bar|table"
    ,displayOptions: {
        keyType : "number"
        ,keyGridCount: 10
        ,showAllRoutesOnLegendClick: true
    }
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortion : {
            funcName : null
        }
        ,aggFuncName:           "aggregateById"
        ,sortByFuncName:        "sort_score"
        ,aggTopX:               1
        ,sortDescFlag:          true
        ,nrOfEligibleDays:      93
        ,startIdx:                 0
        ,endIdx:                   10
    }
}));


clLib.graphConfig["_routeLogConfig"] = routeLogConfig;
