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
		defaultGrade: "VI+",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"I-" : 10 ,
			"I" : 15 ,
			"I+" : 20 ,
			"II-" : 25 ,
			"II" : 30 ,
			"II+" : 35 ,
			"III-" : 40 ,
			"III" : 45 ,
			"III+" : 50 ,
			"III+/IV-" : 60 ,
			"IV-" : 70 ,
			"IV-/IV" : 80 ,
			"IV" : 90 ,
			"IV+" : 100 ,
			"IV+/V-" : 125 ,
			"V-" : 150 ,
			"V-/V" : 175 ,
			"V" : 200 ,
			"V/V+" : 225 ,
			"V+" : 250 ,
			"V+/VI-" : 275 ,
			"VI-" : 300 ,
			"VI-/VI" : 325 ,
			"VI" : 350 ,
			"VI/VI+" : 375 ,
			"VI+" : 400 ,
			"VI+/VII-" : 425 ,
			"VII-" : 450 ,
			"VII-/VII" : 475 ,
			"VII" : 500 ,
			"VII/VII+" : 525 ,
			"VII+" : 550 ,
			"VII+/VIII-" : 600 ,
			"VIII-" : 625 ,
			"VIII-/VIII" : 650 ,
			"VIII" : 700 ,
			"VIII/VIII+" : 750 ,
			"VIII+" : 775 ,
			"VIII+/IX-" : 800 ,
			"IX-" : 850 ,
			"IX-/IX" : 875 ,
			"IX" : 900 ,
			"IX/IX+" : 925 ,
			"IX+" : 950 ,
			"IX+/X-" : 1000 ,
			"X-" : 1050 ,
			"X-/X" : 1075 ,
			"X" : 1100 ,
			"X/X+" : 1125 ,
			"X+" : 1150 ,
			"X+/XI-" : 1200 ,
			"XI-" : 1225 ,
			"XI-/XI" : 1250 ,
			"XI" : 1300 ,
			"XI/XI+" : 1325 ,
			"XI+" : 1350 ,
			"XI+/XII-" : 1375 ,
			"XII-" : 1400 ,
			"XII-/XII" : 1450
		}
	},
	"French" : {                        
		defaultGrade: "6a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"1" :	10 ,
			"2" :	25 ,
			"3" :	40 ,
			"4a" :	90 ,
			"4a/4b" :	125 ,
			"4b" :	150 ,
			"4b/4c" :	175 ,
			"4c" :	200 ,
			"4c/5a" :	225 ,
			"5a" :	250 ,
			"5a/5b" :	275 ,
			"5b" :	300 ,
			"5b/5c"	: 325 ,
			"5c" :	350 ,
			"5c/6a" :	375 ,
			"6a" :	400 ,
			"6a/6a+" :	425 ,
			"6a+" :	450 ,
			"6a+/6b" :	475 ,
			"6b" :	500 ,
			"6b/6b+" :	525 ,
			"6b+" :	550 ,
			"6b+/6c" :	600 ,
			"6c" :	612 ,
			"6c/6c+" :	625 ,
			"6c+" :	650 ,
			"6c+/7a" :	675 ,
			"7a" :	700 ,
			"7a/7a+" :	750 ,
			"7a+" :	775 ,
			"7a+/7b" :	775 ,
			"7b" :	800 ,
			"7b/7b+" :	825 ,
			"7b+" :	850 ,
			"7b+/7c"	: 875 ,
			"7c" :	900 ,
			"7c/7c+" :	925 ,
			"7c+"	: 950 ,
			"7c+/8a" :	975 ,
			"8a" :	1000 ,
			"8a/8a+" :	1025 ,
			"8a+" :	1050 ,
			"8a+/8b" :	1075 ,
			"8b" :	1100  ,
			"8b/8b+" :	1125 ,
			"8b+" :	1150 ,
			"8b+/8c" :	1175 ,
			"8c" :	1200 ,
			"8c/8c+" :	1225 ,
			"8c+" :	1250,
			"8c+/9a" :	1275,
			"9a" :	1300,
			"9a/9a+" :	1325,
			"9a+" :	1350,
			"9a+/9b" :	1375,
			"9b" :	1400,
			"9b/9b+" :	1425,
			"9b+" :	1450
		}
	},
	"Bleau" : {                        
		defaultGrade: "Fb 5a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                     
			"Fb 1" :	10 ,
			"Fb 2" :	90 ,
			"Fb 3" :	200 ,
			"Fb 4a" :	250 ,
			"Fb 4b" :	300 ,
			"Fb 4c" :	375 ,
			"Fb 5a" :	450 ,
			"Fb 5b" :	500 ,
			"Fb 5c" :	550 ,
			"Fb 6a" :	625 ,
			"Fb 6a+" :	700 ,
			"Fb 6b" :	750 ,
			"Fb 6b+" :	775 ,
			"Fb 6c" :	800 ,
			"Fb 6c+" :	875 ,
			"Fb 7a" :	900 ,
			"Fb 7a+" :	950 ,
			"Fb 7b" :	1050 ,
			"Fb 7b+" :	1100 ,
			"Fb 7c" :	1150 ,
			"Fb 7c+" :	1225 ,
			"Fb 8a" :	1300 ,
			"Fb 8a+" :	1325 ,
			"Fb 8b"	: 1350 ,
			"Fb 8b+" :	1375 ,
			"Fb 8c" :	1400 ,
			"Fb 8c+" :	1450
		}
	}
	,"USA" : {                      
		defaultGrade: "5.10a",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {                    
			"5.0" : 10 ,
			"5.1" : 25 ,
			"5.2" : 45 ,
			"5.3" : 90 ,
			"5.4" : 100 ,
			"5.5" : 150 ,
			"5.6" : 225 ,
			"5.7" : 250 ,
			"5.8" : 300 ,
			"5,9" : 350 ,
			"5.9" : 375 ,
			"5.10a" : 400 ,
			"5.10b" : 450 ,
			"5.10c" : 475 ,
			"5.10d" : 500 ,
			"5.11a" : 550 ,
			"5.11b" : 600 ,
			"5.11c" : 650 ,
			"5.11d" : 750 ,
			"5.12a" : 775 ,
			"5.12b" : 800 ,
			"5.12c" : 875 ,
			"5.12d" : 900 ,
			"5.13a" : 950 ,
			"5.13b" : 1000 ,
			"5.13c" : 1050 ,
			"5.13d" : 1100 ,
			"5.14a" : 1125 ,
			"5.14b" : 1200 ,
			"5.14c" : 1250 ,
			"5.14d" : 1300 ,
			"5.15a" : 1325 ,
			"5.15b" : 1375 ,
			"5.15c" : 1450
		}
	}
	,"US-Boulder" : {
		defaultGrade: "V2",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"VB-" :	10 ,
			"VB" :	200 ,
			"V0-" :	250 ,
			"V0" :	350 ,
			"V0+" :	450 ,
			"V1" :	500 ,
			"V2" :	600 ,
			"V3" :	700 ,
			"V4" :	775 ,
			"V5" :	850 ,
			"V6" :	925 ,
			"V7" :	1000 ,
			"V8" :	1075 ,
			"V9" :	1150 ,
			"V10"	: 1225 ,
			"V11"	: 1300 ,
			"V12"	: 1325 ,
			"V13"	: 1350 ,
			"V14"	: 1375 ,
			"V15"	: 1400 ,
			"V16"	: 1450
		}
	}
	,"Saxon" : {
		defaultGrade: "VIIc",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"I" :	10 ,
			"II" :	25 ,
			"III" :	40 ,
			"IV" :	70 ,
			"V" :	150 ,
			"VI" :	250 ,
			"VIIa" :	300 ,
			"VIIb" :	350 ,
			"VIIc" :	400 ,
			"VIIIa" :	450 ,
			"VIIIb" :	500 ,
			"VIIIc" :	550 ,
			"IXa" :	625 ,
			"IXb" :	700 ,
			"IXc" :	775 ,
			"Xa" : 850 ,
			"Xb" : 900 ,
			"Xc" : 950 ,
			"XIa" :	1050 ,
			"XIb" :	1100 ,
			"XIc" :	1150 ,
			"XIIa" :	1225 ,
			"XIIb" :	1300 ,
			"XIIc" :	1350 ,
			"XIIIa" :	1400
		}
	}
	,"SouthAfrica" : {
		defaultGrade: "19",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"5" :	10 ,
			"6" :	15 ,
			"7" :	20 ,
			"8" :	25 ,
			"9" :	45 ,
			"10" :	90 ,
			"11" :	100 ,
			"12" :	125 ,
			"13" :	150 ,
			"14" :	200 ,
			"15" :	250 ,
			"16" :	300 ,
			"17" :	350 ,
			"18" :	375 ,
			"19" :	400 ,
			"20" :	450 ,
			"21" :	500 ,
			"22" :	550 ,
			"23" :	625 ,
			"24" :	650 ,
			"25" :	700 ,
			"26" :	775 ,
			"27" :	800 ,
			"28" :	850 ,
			"29" :	900 ,
			"30" :	950 ,
			"31" :	1000 ,
			"32" :	1050 ,
			"33" :	1100 ,
			"34" :	1150 ,
			"35" :	1225 ,
			"36" :	1300 ,
			"37" :	1325 ,
			"38" :	1350 ,
			"39" :	1400 ,
			"40" :	1450
		}
	}
	,"Australia" : {
		defaultGrade: "18",
		tickTypeFactors : clLib.defaultTickTypeFactors,
		grades : {
			"5" :	10 ,
			"6" :	35 ,
			"7" :	45 ,
			"8" :	60 ,
			"9" :	90 ,
			"10" :	100 ,
			"11" :	125 ,
			"12" :	150 ,
			"13" :	175 ,
			"14" :	200 ,
			"15" :	250 ,
			"16" :	300 ,
			"17" :	350 ,
			"18" :	400 ,
			"19" :	450 ,
			"20" :	500 ,
			"21" :	525 ,
			"22" :	550 ,
			"23" :	625 ,
			"24" :	700 ,
			"25" :	750 ,
			"26" :	800 ,
			"27" :	875 ,
			"28" :	925 ,
			"29" :	1000 ,
			"30" :	1050 ,
			"31" :	1100 ,
			"32" :	1150 ,
			"33" :	1200 ,
			"34" :	1225 ,
			"35" :	1250 ,
			"36" :	1300 ,
			"37" :	1350 ,
			"38" :	1400
		}	
	}
};

