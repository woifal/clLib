"use strict";

var mongo = require('mongoskin');
require('../js/clLib.js');
require('../js/clLib.gradeConfig.js');
var util = require("util");
var async = require("async");

var mongoURI ="";
mongoURI = "mongodb://clAdmin:blerl1la@ds053438.mongolab.com:53438/climbinglog";
var conn;
conn = mongo.db(mongoURI, {safe: true});

var args = process.argv.splice(2);
var tableName = args[0];
var whereObj = JSON.parse(args[1]);

util.log("new where: >" + JSON.stringify(whereObj) + "<");
           

var exitCallBack = function() {
	process.exit();
}

// bind method: db.user ===> db.collection('user')
//conn.bind('Users');


function getItems(nextFunc) {
	var coll = conn.collection(tableName);
	if(!coll) {
		util.log("NO coll " + tableName + "found..");
	}
	coll.find(whereObj).toArray(function(err, items) {
		if (err) {
			util.log("ERROR:" + JSON.stringify(err));
		}
		
		util.log("length" + JSON.stringify(items.length));
		//util.log("items" + JSON.stringify(items));
        var i,u;
        u = 0;
        for(i = 0; i < items.length; i++) {
            var curItem = items[i];
            
            util.log(
				"#################\n###########\n############\n >"
				+ JSON.stringify(curItem)
				+ "<"
			);
			if(!curItem["_updatedAt"]) {
               // util.log("(" + i + ") id >" + curItem["_id"] + "< >" + curItem["DateISO"] + "< score is >" + curItem["score"] + "<");
               // util.log("     new score >" + newScore + "<");
                util.log("!!!!!!!!!!!!!   >" + curItem["DateISO"] + "<   >" + curItem["_updatedAt"] + "<");

                coll.update(
                    {_id: curItem["_id"]}
                    ,{
                        $set: {
                            "_updatedAt": Date.now()
                        }
                    }, 
                    {
                        safe: true, multi: true
                    }
                    ,function(err, items) {
                        if (err) {
                            util.log("ERROR:" + err.message);
                        }
                        util.log("updated >" +(u++) + "<");
                    }
                );

            }
            else {
                util.log("##############  >" + curItem["DateISO"] + "<   >" + curItem["_updatedAt"] + "<");
            }
       }
	});

};


return getItems()
;

util.log("Done");
