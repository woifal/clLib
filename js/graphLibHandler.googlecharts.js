
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
//                if(graphConfig["statsOptions"]["sortDescFlag"] == true) {
//                    alert("yes, sort descending..");
//                    return a - b;
//                }
//                else {
                    return a-b;
//                }
            }
        }
            
        var remappedKeys = {};
        
        $.each(Object.keys(allData).sort(sortFunction), function(idx, aValue) {
            var keyValue = aValue;
            //alert(graphConfig["displayOptions"]["keyType"]);
            if(graphConfig["displayOptions"]["keyType"] == "date") {
                //alert("yes, convert key to date..>" + aValue + "<");
                keyValue = new Date(aValue);
                //alert("keyValue is now >" + keyValue + "<");
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
            
        

                            
                            
                            
        var getMinValue = function(graphData) {
            var minVal = 100000;
            $.each(graphData, function(idx, dataRow) {
                for(var i = 1; i < dataRow.length; i++) {
                    if(dataRow[i] > 0) {
                        minVal = Math.min(minVal, dataRow[i]);
                    }
                }
            });
            console.log("minVal is >" + minVal + "<");
            return minVal;
        }
        var getMaxValue = function(graphData) {
            var maxVal = 0;
            $.each(graphData, function(idx, dataRow) {
                for(var i = 1; i < dataRow.length; i++) {
                    maxVal = Math.max(maxVal, dataRow[i]);
                }
            });
            console.log("maxVal is >" + maxVal + "<");
            return maxVal;
        }
                            
        function drawChart() {
            console.log(3);
            var dataTable = graphData;
            
            var minValue = getMinValue(graphData);
            var maxValue = getMaxValue(graphData);
            console.log("minValue is >" + minValue + "<");
            console.log("maxValue is >" + maxValue + "<");
            
            console.log("dataTable is >" + JSON.stringify(dataTable) + "<");
            
            var gDataTable = new google.visualization.DataTable();
/*
            if(graphConfig["displayOptions"]["showAllRoutesOnLegendClick"]) {
                // Add custom tooltips for links to datatables displayed below..
                var dataTable2 = [];
                $.each(dataTable, function(idx, values) {
                    var newIdx2 = 0;
                    dataTable2[idx] = [];
                    $.each(values, function(idx2, values2) {

                        dataTable2[idx][newIdx2] = dataTable[idx][idx2];
                        if(idx2 > 0) {
                            newIdx2++;
                            // Use custom HTML content for the domain tooltip.
                            dataTable2[idx][newIdx2] =  function() { 
                                    //alert("allUsers >" + JSON.stringify(allUsers) + "<");

                                var $tooltip = $("<div>");
                                $tooltip.append($("<p>")
                                    .append(
                                        "user:" + allUsers[idx2-1]
                                    )
                                    .append(
                                        "points:" + dataTable[idx][idx2]
                                    )
                                );
                                $tooltip.click(function(e) {
                                    var resultItems = [];
                                    var series = idx2 - 1;
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
                                        ,where : null //{"username": "foo6@gmail.com"}
                                        ,readonly: true
                                    }
                                    ,function() {
                                        console.log("table builtttttttttttt!");
                                    }
                                    ,function(e) {
                                        alert("table build error >" + JSON.stringify(e) + "<");
                                    }
                                    );  
                                    
                                                                        
                                });
                                
                                return $tooltip.;
                            }(); 
                        }
                        newIdx2++;
                    });
                });
                dataTable = dataTable2;
            }
*/
            
            //console.error("2dataTable is >" + JSON.stringify(dataTable) + "<");
//            alert("typeof  is >" + typeof(dataTable[0][0]) + "<");
            
            var keyType = graphConfig["displayOptions"]["keyType"];
            var keyName = graphConfig["displayOptions"]["keyName"];
            //alert("keyType is >" + keyType + "<, keyName is >" + keyName + "<");        
            gDataTable.addColumn(keyType, "when");

            
            $.each(allUsers, function(idx, username) {
                gDataTable.addColumn('number', username);
//                gDataTable.addColumn({'type': 'string', 'role': 'tooltip'}); //, 'p': {'html': true}});
            });
            
            
            gDataTable.addRows(dataTable);
      
        
            //gDataTable = gDataTable.concat(dataTable);
            console.log("gDataTAble is >" + JSON.stringify(gDataTable) + "<");
                
            
            //var data = google.visualization.arrayToDataTable(gDataTable);
            var data = gDataTable;



            var options = {
                title: graphConfig["displayName"] //'some foo graphs'
                 // This line makes the entire category's tooltip active.
                ,focusTarget: 'datum'
                ,tooltip: { isHtml: true }
                ,pointSize: 1 //7
                ,legend: 'right' // none
                ,chartArea: {width: '60%'} // 70% => if legend==none
                ,hAxis: {
 //                   textPosition : 'in'  
//                    ,
                    title: (graphConfig["displayOptions"]["hAxisLabel"]) || ''  
                    ,titleTextStyle: {color: '#FF0000'}
/*                    ,gridlines: {
                        count: graphConfig["displayOptions"]["keyGridCount"]
                    }*/
                    ,ticks: graphConfig["displayOptions"]["hAxisTicks"] || null
                    ,slantedText: true
                    ,slantedTextAngle: 30
                    ,format: graphConfig["displayOptions"]["hAxisFormat"] || null
                }
                ,vAxis: {
                    minValue: minValue
                    ,maxValue: maxValue + 500
                    ,gridlines: {
                        count: graphConfig["displayOptions"]["vAxisGridLines"] || 10
                    }
                }
                ,interpolateNulls: true
                ,tooltip: { trigger: 'both' }
                ,series: {
                    0: { color: '#FF8080' },
                    1: { color: '#80FF80' },
                    2: { color: '#8080FF' }
                }
    
            };

            if(graphConfig.graphType.indexOf("line") > -1) {
                options["vAxis"]["viewWindow"] = {
                    min: minValue // - 500
                };
            }
            
            var chartDiv = $(graphConfig.collection.containerSelector)[0];
            console.log("chartDiv is " + chartDiv.outerHTML);
            
            
            var chart;
            
            if(graphConfig.graphType.indexOf("line") > -1) {
                chart = new google.visualization.LineChart(chartDiv);
            } else
            if(graphConfig.graphType.indexOf("bar") > -1) {
                chart = new google.visualization.BarChart(chartDiv);
            }
/*

            chart.setAction({
                id: 'details',
                //text: '',
                action: function() {
alert(111);                   
                   data.setCell(chart.getSelection()[0].row, 1,
                        data.getValue(chart.getSelection()[0].row, 1)); // + 20);
                    chart.draw(data, options);


                                    var resultItems = [];
                                    var series = chart.getSelection()[0].row;
                                    var seriesAt = chart.getSelection()[0].column;
                                    alert("clicked series at >" + seriesAt + "<");
                                    
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
                                        ,where : null //{"username": "foo6@gmail.com"}
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
            });


*/







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
                    console.log("table built!");
                }
                ,function(e) {
                    alert("table build error >" + JSON.stringify(e) + "<");
                }
                );  

            }

            if(graphConfig["displayOptions"]["showRoutesOnClick"]) {
                google.visualization.events.addListener(chart, 'select', selectHandler);  
            }
            console.error("options are >" + JSON.stringify(options) + "<");
            chart.draw(data, options);
        }
              
              
        console.log(1);
        google.load('visualization', 1, {packages:['corechart'], callback: drawChart});
        google.setOnLoadCallback(drawChart);
        console.log(2);
               
        return 1;
    }
};