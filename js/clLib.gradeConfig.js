"use strict";

/*
*   Configuration object for grades.
*   Keys are the available grade systems.
*   For every grade system a column with the same name has to be present in the Routes collection.
*
*/

/*
Red Point
Onsight: + 145 points (based on Red Pointing)
Flash: +53 points (based on Red Pointing)
Top Rope: - 150 points (based on Red Pointing)
Attempt: 0 points

*/
clLib.defaultTickTypeFactors = {
	"tickType_redpoint" : "+0",
	"tickType_flash" : "+53",
	"tickType_attempt" : "*0",
	"tickType_toprope" : "-150"
};

//
// Compiles and returns compiled grade config (to be used DB-like via clLib.localStorage..)
//
clLib.compileGradeConfig = function() {
	var compiledGradeConfig = [];
	var dummyId = 1;
	$.each(clLib.gradeConfig, function(gradeSystem, gradeSystemConfig) {
		$.each(gradeSystemConfig.grades, function(grade, score) {
			compiledGradeConfig.push({ 
				"_id": dummyId++, 
				GradeSystem: gradeSystem, 
				Grade: grade, 
				Score: score 
			});
		});
	});
	return {"Grades": compiledGradeConfig};
};

clLib.gradeConfig = {
	"UIAA" : {
		defaultGrade: "V+",
		tickTypeFactors : clLib.defaultTickTypeFactors,
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
		defaultGrade: "5b",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"1" : 10                  ,
			"2" : 25                  ,
			"3" : 40                  ,
			"4a" : 90                 ,
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
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                     
			"Fb 1" : 10               ,
			"Fb 2" : 90               ,
			"Fb 3" : 225              ,
			"Fb 4a" : 275             ,
			"Fb 4b" : 350             ,
			"Fb 4c" : 375             ,
			"Fb 5a" : 450             ,
			"Fb 5b" : 500             ,
			"Fb 5c" : 550             ,
			"Fb 6a" : 625             ,
			"Fb 6a+" : 700            ,
			"Fb 6b" : 750             ,
			"Fb 6b+" : 775            ,
			"Fb 6c" : 800             ,
			"Fb 6c+" : 875            ,
			"Fb 7a" : 900             ,
			"Fb 7a+" : 950            ,
			"Fb 7b" : 1050            ,
			"Fb 7b+" : 1100           ,
			"Fb 7c" : 1150            ,
			"Fb 7c+" : 1225           ,
			"Fb 8a" : 1300            ,
			"Fb 8a+" : 1325           ,
			"Fb 8b" : 1350            ,
			"Fb 8b+" : 1375           ,
			"Fb 8c" : 1400            ,
			"Fb 8c+" : 1450           
		}
	}
	/*,
	"USA" : {                      
		defaultGrade: "5.10a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"5.0" : 10                ,
			"5.1" : 25                ,
			"5.2" : 45                ,
			"5.3" : 90                ,
			"5.4" : 100               ,
			"5.5" : 150               ,
			"5.6" : 225               ,
			"5.7" : 250               ,
			"5.8" : 300               ,
			"5,9" : 350               ,
			"5.9" : 375               ,
			"5.10a" : 400             ,
			"5.10b" : 450             ,
			"5.10c" : 475             ,
			"5.10d" : 500             ,
			"5.11a" : 550             ,
			"5.11b" : 600             ,
			"5.11c" : 650             ,
			"5.11d" : 750             ,
			"5.12a" : 775             ,
			"5.12b" : 800             ,
			"5.12c" : 875             ,
			"5.12d" : 900             ,
			"5.13a" : 950             ,
			"5.13b" : 1000            ,
			"5.13c" : 1050            ,
			"5.13d" : 1100            ,
			"5.14a" : 1125            ,
			"5.14b" : 1200            ,
			"5.14c" : 1250            ,
			"5.14d" : 1300            ,
			"5.15a" : 1325            ,
			"5.15b" : 1375            ,
			"5.15c" : 1450            	
		}
	}*/
};

