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
            ,graphType: "bar"
            ,paging: true
            ,pagingSteps: 200
            ,errorHandler : function(e) {
                alert("encountered error >" + e + "<(" + JSON.stringify(e) + ")");
            }
            ,getGraphData : function(options, successFunc, errorFunc) {
                //alert("getGraphData for options >" + JSON.stringify(options) + "<");
                //var statsOptions = $.extend(this.config["statsOptions"], options);
                options["statsOptions"] = this.config["statsOptions"];
                console.error("stats options is >" + JSON.stringify(options) + "<");
                return clLib.REST.requestStatsNew(
                    options
                    ,successFunc
                    ,errorFunc
                );            
            }
            ,draw : function(options) {
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
                        console.error("success!!" + typeof(resultObj) + "-" + JSON.stringify(resultObj));

                        var graphPoints = Object.keys(resultObj).sort();
                        var graphLabels = graphPoints;
                        //var graphLabels = clLib.formatArr(Object.keys(resultObj).sort(), [function(x) { return "" + x + "";}]);
                        //graphLabels = graphLabels.sort();
                        var graphData =  clLib.objToSortedArray(
                            resultObj
                            ,graphPoints
                            ,function(x) { return parseInt(x["score"]); }
                        );
                        //var graphData = clLib.formatArrInt(clLib.getObjValues(resultObj, true), [function(x) { return parseInt(x.score); }]);
                        graphData = graphData.slice(options["pagingStart"], graphConfig.pagingSteps);
                        graphLabels = graphLabels.slice(options["pagingStart"], graphConfig.pagingSteps);
                        util.log("graphData >" + JSON.stringify(graphData) + "<");
                        util.log("graphLabels >" + JSON.stringify(graphLabels) + "<");
                        var graphOptions = {
                            animation: false
                            ,bezierCurve: false
                            ,datasetFill: false
                        };
                        var data = {
                            labels : graphLabels
                            ,datasets : [
                                {
                                    fillColor : "none"
                                    ,strokeColor: "black"
                                    ,data : graphData
                                }
                            ]
                        };

                        //Get the context of the canvas element we want to select
                        var ctx = $(graphConfig.collection.containerSelector).find(".clCanvas")[0].getContext("2d");
                        if(window.myNewChart) {
                            clLib.loggi("clearing old chart!", "20150131");
                            window.myNewChart.destroy();
                        }
                        else {
                            clLib.loggi("no chart yet..>" + window.myNewChart + "<", "20150131");
                        }

                        if(graphConfig.graphType == "bar") {
                            window.myNewChart = new Chart(ctx).Bar(data, graphOptions);
                        } else if(graphConfig.graphType == "line") {
                            window.myNewChart = new Chart(ctx).Line(data, graphOptions);
                        }

                        $(graphConfig.collection.containerSelector)[0].onclick = function(evt){
                            //alert("chart clicked!");
                            var activePoints;
                            if(graphConfig.graphType == "line") {
                                activePoints = window.myNewChart.getPointsAtEvent(evt);
                            }
                            else if(graphConfig.graphType == "bar") {
                                activePoints = window.myNewChart.getBarsAtEvent(evt);
                            }
                            $.each(activePoints, function(idx, data) {
                                //alert("clicked point >" + data["label"] + "<");
                            });
                            // => activePoints is an array of points on the canvas that are at the same position as the click event.
                            //alert("activePoints >" + JSON.stringify(activePoints) + "<");
                        };
                        
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
    ,graphType: "bar"
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortionFuncName :   "localDayPortion"
        ,aggFuncName:           "aggregateScoresByDatePortion"
        ,sortByFuncName:        "sort_localDayAndScore"
        ,aggTopX:               10
        ,sortDescFlag:          true
    }
}));
routeLogConfig.add(new GraphConfig({
    graphName : "allSessionsByMonth"
    ,displayName: "All Sessions (by month)"
    ,graphType: "bar"
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortionFuncName :   "localMonthPortion"
        ,aggFuncName:           "aggregateScoresByDatePortion"
        ,sortByFuncName:        "sort_localDayAndScore"
        ,aggTopX:               10
        ,sortDescFlag:          true
    }
}));
routeLogConfig.add(new GraphConfig({
    graphName : "highScoreByDay"
    ,displayName: "High Score (by day)"
    ,graphType: "line"
    ,statsOptions: {
        entity:                 "RouteLog"
        ,datePortionFuncName :   "localDayPortion"
        ,aggFuncName:           "aggregateHighScoreByDatePortion"
        ,sortByFuncName:        "sort_localScoreAndDay"
        ,aggTopX:               10
        ,sortDescFlag:          true
        ,nrOfEligibleDays:      365
    }
}));


clLib.graphConfig["_routeLogConfig"] = routeLogConfig;
