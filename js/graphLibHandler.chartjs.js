var chartJsGraphHandler = {
    draw: function(options) {
        graphConfig = options.graphConfig;
        resultObj = options.resultObj;
                        var graphTypes = graphConfig.graphType.split("|");
        
                                    var graphOptions = {
                                animation: true
                                ,bezierCurve: false
                                ,datasetFill: false
                                ,showTooltips: true
                                ,legendTemplate : 
                                    "<div class=\"legendContent <%=name.toLowerCase()%>-legend\">" + 
                                        "<% for (var i=0; i<datasets.length; i++){%>" + 
                                                "<span style=\"background-color:<%=datasets[i].strokeColor%>\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;" +
                                                "<%if(datasets[i].label){%>" + 
                                                    "<%=datasets[i].label%>" + 
                                                "<%}%>" + 
                                            "<br>" + 
                                         "<%}%>" + 
                                     "</div>"
                            };
                            
                            

                                                        
                                                        
                            console.log("success!!" + JSON.stringify(Object.keys(resultObj)));


                            var dataSetStyles = [
                                {
                                    WTF : 1
                                    ,label: "ASFASDFASDF"
                                    ,fillColor : "#FF6666"
                                    ,strokeColor: "#FF6666"
                                    ,highlightFill: "#FF6666"
                                }
                                ,{
                                    WTF : 2
                                    ,fillColor : "#66FF66"
                                    ,strokeColor: "#66FF66"
                                    ,highlightFill: "#66FF66"
                                }
                                ,{
                                    WTF : 3
                                    ,fillColor : "#6666FF"
                                    ,strokeColor: "#6666FF"
                                    ,highlightFill: "#6666FF"
                                }
                                ,{
                                    WTF : 4
                                    ,fillColor : "#CCCCCC"
                                    ,strokeColor: "#CCCCCC"
                                    ,highlightFill: "#CCCCCC"
                                }
                                ,{
                                    WTF : 5
                                    ,fillColor : "#0F0F0F"
                                    ,strokeColor: "#0F0F0F"
                                    ,highlightFill: "#0F0F0F"
                                }
                                ,{
                                    WTF : 6
                                    ,fillColor : "#FF00FF"
                                    ,strokeColor: "#FF00FF"
                                    ,highlightFill: "#FF00FF"
                                }
                            ];


                            var allGraphLabels = {};
                            var allGraphData = {
                                datasets: []
                            };
                            var allData = {};
                            var allUsers = Object.keys(resultObj);
                            $.each(resultObj, function(username, userResults) {
                                $.each(userResults, function(key, values) {
                                    console.log("at >" + username + "< >" + key + "< >" + JSON.stringify(values) + "<");

                                    if(!allData[key]) {
                                        allData[key] = {};
                                    }
                                    allData[key][username] = parseInt(values["score"]);
                                });
                            });

                            util.log("allData is >" + JSON.stringify(allData) + "<");

                            allGraphLabels = Object.keys(allData).sort();
                            var allGraphDatasets = {};
                            $.each(allUsers, function(idx, username) {
                                $.each(allData, function(dataPoint, values) {
                                    util.log("Adding datapoint >" + dataPoint + "< with values >" + JSON.stringify(values) + "<");
                                    if(!allGraphDatasets[dataPoint]) {
                                        allGraphDatasets[dataPoint] = {};
                                    }
                                    
                                    allGraphDatasets[dataPoint][username] = 0 + allData[dataPoint][username];
                                });
                            });

                            util.log("allGraphDatasets is >" + JSON.stringify(allGraphDatasets) + "<");


                            var allGraphDatasetsArr = [];
                            var dataPoints = Object.keys(allGraphDatasets).sort();
                            util.log("dataPoints is >" + JSON.stringify(dataPoints) + "<");
                            $.each(dataPoints, function(dataPointIdx, dataPoint) {
//                            for (var dataPointIdx in dataPoints){
//                                var dataPoint = dataPoints[dataPointIdx];
                                util.log("add datapointIdx >" + dataPointIdx + "<, datapoint >" + dataPoint + "<");
                                $.each(allUsers, function(userIdx, username) {
                                    if(!allGraphDatasetsArr[userIdx]) {
                                        allGraphDatasetsArr[userIdx] = {};
                                        allGraphDatasetsArr[userIdx] = dataSetStyles[userIdx];
                                        
                                        allGraphDatasetsArr[userIdx]["label"] = username;
                                        allGraphDatasetsArr[userIdx]["data"] = [];
                                    }
                                    allGraphDatasetsArr[userIdx]["data"][dataPointIdx] = allGraphDatasets[dataPoint][username] || 0;
                                });
  //                          };
                            });
                                
                            console.log(">>" + JSON.stringify(allGraphDatasetsArr)+ "<<");



                            //Get the context of the canvas element we want to select
                            console.log("containerSelector 2 is >" + graphConfig.collection.containerSelector + "<");

                            var ctx = $(graphConfig.collection.containerSelector).find(".clCanvas")[0].getContext("2d");
                            console.log("ctx is >" + ctx + "<");
                            if(window.myNewChart) {
                                console.log("clearing old chart!", "20150131");
                                window.myNewChart.destroy();
                            }
                            else {
                                console.log("no chart yet..>" + window.myNewChart + "<", "20150131");
                            }

                            var $tableContainer = $("#tableContainer");
                            $tableContainer.empty();
                                
                            
          
                            
                            
                            
                            var data = {};
                            $.each(allGraphDatasetsArr, function(idx, aDataSetArr) {
                                console.log("at dataset >" + JSON.stringify(aDataSetArr) + "< with type >" + typeof(aDataSetArr) + "<");
                                allGraphDatasetsArr[idx]["data"] = aDataSetArr["data"].slice(-15);
                            });
                            data["datasets"] = allGraphDatasetsArr;
                            data["labels"] = allGraphLabels.slice(-15);
                            console.log("labels is >" + data["labels"] + "<");
                            
                            if(graphTypes.indexOf("bar") > -1) {
                                console.log("building new chart widht data >" + JSON.stringify(data) +"<..");
                                window.myNewChart = new Chart(ctx).Bar(data, graphOptions);
                            } else if(graphTypes.indexOf("line") > -1 ) {
                                console.log("building new chart widht data >" + JSON.stringify(data) +"<..");
                                window.myNewChart = new Chart(ctx).Line(data, graphOptions);
                            }
                            
 //                           return;
                            
                            
                            
                            
                            //then you just need to generate the legend
                            var legend = window.myNewChart.generateLegend();
                            console.log(legend);
                            
                            //and append it to your page somewhere
                            $('#legendContainer').empty().append(legend);
                            
                            
                            
           
                            
                            
                            
                            
                            

                            if(!options["noClick"]) {
                                $(graphConfig.collection.containerSelector + " .clCanvas")[0].onclick = function(evt){
                                    console.log("chart clicked! >" + JSON.stringify(Object.keys(evt)) + "< + >" + evt.pageX + "<");
                                    var activePoints;
                                    if(graphTypes.indexOf("line") > -1) {
                                        activePoints = window.myNewChart.getPointsAtEvent(evt);
                                    }
                                    else if(graphTypes.indexOf("bar") > -1) {
                                        activePoints = window.myNewChart.getBarsAtEvent(evt);
                                    }
                                    console.log("activePoints >" + JSON.stringify(activePoints) + "<");
                                    var resultItems = [];       
                                    Chart.helpers.each(activePoints, function(activePoint){
                                        var eachFunc;
                                        ;
                                        
                                        
                                        if(graphTypes.indexOf("bar") > -1) {
                                            eachFunc = window.myNewChart.eachBars;
                                        } else if(graphTypes.indexOf("line") > -1 ) {
                                            eachFunc = window.myNewChart.eachPoints;
                                        }
                                        
                                        eachFunc = eachFunc.bind(window.myNewChart);
                                        //eachPoints
                                        eachFunc(function(bar) {
                                            console.log("Restoring bar >" + JSON.stringify(bar) + "<");
                                            bar.restore(["fillColor"]);
                                            bar.strokeColor = "#EEEEEE";
                                            bar.fillColor = "#EEEEEE"; //rgba(220,220,220)";
                                            //bar.highlightFill = "#EEEEEE";
                                        });

                                        activePoint.strokeColor = "#063a72";
                                        activePoint.fillColor = "#063a72";
                                        //activePoint.highlightFill = "#00FF00";
                                        window.myNewChart.update();
                                        
                                        console.log("activePoint >" + JSON.stringify(activePoint) + "<");

                                        console.log("resultObj >", resultObj, "<");
                                        console.log("showing table for >" + activePoint["datasetLabel"] + "< at >" + activePoint["label"] + "<");
                                        if(!activePoint || !activePoint["datasetLabel"] || !allGraphDatasets[activePoint["label"]][activePoint["datasetLabel"]]) {
                                            return false;
                                        }
                                        $.each(resultObj[activePoint["datasetLabel"]][activePoint["label"]]["items"], function(idx, item) {
                                            //alert(">" + idx + "<");
                                            resultItems.push(item);
                                        });
                                        console.log("resultItems is now sized  >" + resultItems.length + "<");


                                        
                                    });

                                    var $tableContainer = $("#tableContainer");
                                    $tableContainer.empty();
                                    clLib.UI.web.createTable(
                                    $tableContainer
                                    ,{
                                        entity: "RouteLog"
                                        ,items: {"RouteLog": resultItems}
                                        ,where : null /*{"username": "foo6@gmail.com"}*/
                                        ,readonly: true
                                    }
                                    ,function() {
                                        console.log("table builtttttttttttt!");
                                    }
                                    ,function(e) {
                                        alert("table build error >" + JSON.stringify(e) + "<");
                                    }
                                    );

                                    // => activePoints is an array of points on the canvas that are at the same position as the click event.
                                    //alert("activePoints >" + JSON.stringify(activePoints) + "<");
                                };
                            }
    }
};