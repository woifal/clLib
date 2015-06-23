
var googlechartsGraphHandler = {
    draw: function(options) {
        graphConfig = options.graphConfig;
        resultObj = options.resultObj;
        var graphTypes = graphConfig.graphType.split("|");


       console.log("resultOj is >" + JSON.stringify(resultObj) + "<");

        var allGraphLabels = {};
        var allGraphData = {
            datasets: []
        };
        var allData = {};
        var allUsers = Object.keys(resultObj).sort();
        $.each(resultObj, function(username, userResults) {
            $.each(userResults, function(key, values) {
                console.log("at >" + username + "< >" + key + "< >" + JSON.stringify(values) + "<");

                if(!allData[key]) {
                    allData[key] = {};
                }
                allData[key][username] = parseInt(values["score"]);
            });
        });

        console.log("allData is >" + JSON.stringify(allData) + "<");

        allGraphLabels = allUsers;

        var graphData = [];
        console.log("graphData is now >" + JSON.stringify(graphData) + "<");
        
        var sortFunction;
        if(graphConfig["displayOptions"]["keyType"] == "number") {
            sortFunction = function compareNumbers(a, b) {
                return a - b;
            }
        }
            
        var remappedKeys = {};
        
        $.each(Object.keys(allData).sort(sortFunction), function(idx, aValue) {
            var keyValue = aValue;
            //alert(graphConfig["displayOptions"]["keyType"]);
            if(graphConfig["displayOptions"]["keyType"] == "date") {
                //alert("yes, convert key to date..");
                keyValue = new Date(aValue);
            }
            else if(graphConfig["displayOptions"]["keyType"] == "number") {
                //alert("yes, convert key to date..");
                keyValue = parseInt(aValue);
            }
            remappedKeys[keyValue] = aValue;
            //alert("adding keyValue of >" + JSON.stringify(keyValue) + "<");
            graphData[idx] = [
                keyValue
            ];
           
            $.each(allUsers, function(userIdx, username) {
                graphData[idx].push(
                    allData[aValue] ? allData[aValue][username] || null : null
                );
                //alert("graphData[idx] is >" + JSON.stringify(graphData[idx]) + "<");
            });
        });
        
        console.log("graphData is >" + JSON.stringify(graphData) + "<");
        
        
        var $tableContainer = $("#tableContainer");
        $tableContainer.empty();
            
        

                            
                            
                            
                            
                            
        function drawChart() {
            console.log(3);
            var dataTable = graphData;
            
            console.log("dataTable is >" + JSON.stringify(dataTable) + "<");
                
            var gDataTable = new google.visualization.DataTable();
            var keyType = graphConfig["displayOptions"]["keyType"];
            var keyName = graphConfig["displayOptions"]["keyName"];
            //alert("keyType is >" + keyType + "<, keyName is >" + keyName + "<");        
            gDataTable.addColumn(keyType, "when");
            $.each(allUsers, function(idx, username) {
                gDataTable.addColumn('number', username);
            });
            
            gDataTable.addRows(dataTable);
      
        
            //gDataTable = gDataTable.concat(dataTable);
            console.log("gDataTAble is >" + JSON.stringify(gDataTable) + "<");
                
            
            //var data = google.visualization.arrayToDataTable(gDataTable);
            var data = gDataTable;
            
                
            var options = {
                title: graphConfig["displayName"] //'some foo graphs'
                ,hAxis: {
                    title: graphConfig["displayOptions"]["hAxisLabel"] || ''  
                    ,titleTextStyle: {color: '#FF0000'}
                    ,gridlines: {
                        count: graphConfig["displayOptions"]["keyGridCount"]
                    }
              //  ,ticks: [5,10,15,20]
                }
                ,vAxis: {
                    minValue: 0
                    ,gridlines: {
                        count: 10
                    }
                }
                ,interpolateNulls: true
            };
            var chartDiv = $(graphConfig.collection.containerSelector)[0];
            console.log("chartDiv is " + chartDiv.outerHTML);
            
            
            var chart;
            
            if(graphConfig.graphType.indexOf("line") > -1) {
                chart = new google.visualization.LineChart(chartDiv);
            } else
            if(graphConfig.graphType.indexOf("bar") > -1) {
                chart = new google.visualization.BarChart(chartDiv);
            }
            function selectHandler() {
                //alert("selected!");
                if(!(
                    chart.getSelection() && chart.getSelection()[0] && chart.getSelection()[0]["row"]
                )) {
                    if(!(
                        chart.getSelection() && chart.getSelection()[0] && chart.getSelection()[0]["column"]
                    )) {
                        alert("fucked up click. doing nothing.");
                        return;
                    }
                    else {
                        if(!graphConfig["displayOptions"]["showAllRoutesOnLegendClick"]) {
                            return false;
                        }
                
                        //Series Label
                        var series = data.getColumnLabel(chart.getSelection()[0].column);
                
                          var resultItems = [];
                            $.each(resultObj[series], function(idx, anX) {
                                $.each(resultObj[series][idx]["items"], function(idx2, item) {
                                    console.log(">" + idx + "< >" + idx2+ "<>" + JSON.stringify(item) + "<");
                                    resultItems.push(item);
                                });
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
                            
                            
                            
                            
                        
                        
                        
                        
                        

                        return;
                    }
                }
// --> PERFORMANCE KILLER::
                //console.error("selection: "+ JSON.stringify(chart.getSelection()));
//
                //X Axis
                var x = data.getValue(chart.getSelection()[0].row,0);

                //Y Axis
                var y = data.getValue(chart.getSelection()[0].row,chart.getSelection()[0].column);

                //Series Label
                var series = data.getColumnLabel(chart.getSelection()[0].column);
                
                console.log('The user selected >' + x + "<>" + y + "<>" + series + "<");

                
                
                var resultItems = [];
                $.each(resultObj[series][remappedKeys[x]]["items"], function(idx, item) {
                    console.log(">" + idx + "< >" + JSON.stringify(item) + "<");
                    resultItems.push(item);
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

            }

            if(graphConfig["displayOptions"]["showRoutesOnClick"]) {
                google.visualization.events.addListener(chart, 'select', selectHandler);  
            }
            chart.draw(data, options);
        }
              
              
        console.log(1);
        google.load('visualization', 1, {packages:['corechart'], callback: drawChart});
        google.setOnLoadCallback(drawChart);
        console.log(2);
               
        return 1;
    }
};