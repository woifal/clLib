"use strict";


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
clLib.localStorage ={};

//
// Cached versions of parsed JSON strings from localStorage as objects
//
var storageCache = {};



clLib.localStorage.indexExists = function(storageName, indexName) {
	var indexedStorages = clLib.localStorage.indexes;
	if(
		storageName in indexedStorages &&
		indexName in indexedStorages.storageName
	) {
		return true;
	}
	return false;
};


clLib.localStorage.initStorage = function(storageName, storageObj) {
//	localStorage.clear();
	
	console.log("adding elements " + Object.keys(storageObj).length);
	var allItems = {};
	for(var entityName in storageObj) {
		console.log("entity: " + entityName);
		var entityItems = {};
		for(var i = 0; i < storageObj[entityName].length; i++) {
			entityItems[storageObj[entityName][i]["_id"]] = storageObj[entityName][i];
		}
		allItems[entityName] = entityItems;
	}
	console.log("storing items");
	clLib.localStorage.setStorageItems(storageName, allItems);
	console.log("items stored");
	
	var indexedEntities = clLib.localStorage.indexes;
	var storageItems = clLib.localStorage.getStorageItems(storageName);
	
	var indexedItems = {};
	
	console.log("indexItems: " + tojson(indexedEntities));
	//console.log("allitems " + tojson(storageItems));
	// check all entities in storageObj for configured indexs..
	for(var entityName in indexedEntities) {
	//$.each(indexedEntities, function(entityName) {
		//console.log("working on indexedentity " + entityName);
		
		// iterate indexed entities from storageObj
		var currentEntityIndexes = indexedEntities[entityName];
		var currentEntityItems = storageItems[entityName];
		var currentEntityIdxItems = {};
		//console.log("working on currententityitems " + tojson(currentEntityItems));
		if(!currentEntityItems) {
			//console.log("no items for " + entityName + " in current collection..");
			return;
		}
		// Iterate all items of current entity(routes, areas, etc..)
		$.each(currentEntityItems, function(currentId, currentItem) {
		//for(var currentId in currentEntityItems) {
			var currentItem = currentEntityItems[currentId];
			// Resolve every index for current item
			for(var indexedCol in currentEntityIndexes) {
			//$.each(currentEntityIndexes, function(idx, indexedCol) {
				//console.log("!!Checking indexed column " + indexedCol);
				var currentIdxKey = currentItem[indexedCol];
				clLib.addObjArr(
					currentEntityIdxItems, 
					[indexedCol, currentIdxKey,	"items"], // French => 8a+ => "items"
					currentId);  // _123123123
				// Need to take care of distinct values per indexed column value?
				$.each(currentEntityIndexes[indexedCol].distinct, function(i, distinctColValue) {
					clLib.addObjKey(
							currentEntityIdxItems, 
							[
								indexedCol, currentIdxKey, "distinct", distinctColValue,  // French => 8a+ => "distinct" => Colour
								currentItem[distinctColValue]
							]); // Blue
				});
				
			}
			//);
			//console.log("3after adding row it is" + tojson(currentEntityIdxItems));
		//}
		});
		//console.log("setting index to " + tojson(currentEntityIdxItems));
		/*
		* Store indexed for current entity
		*/
		clLib.localStorage.setStorageIndexes(storageName, entityName, currentEntityIdxItems);
		
	}
	//);
	
	//console.log("initialized storage " + storageName);
	//console.log("storage now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_items")));
	//console.log("index now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_index_" + "routes")));
	
};



window.tojson  = function(x) {
	return JSON.stringify(x);
}

clLib.localStorage.getItem = function(key) {
	return localStorage.getItem(key);
}
clLib.localStorage.setItem = function(key, value){
	localStorage.setItem(key, value);
}

clLib.localStorage.getStorageItems = function(storageName) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	if(!storageCache[storageItemsKey]) {
		var jsonItems = clLib.localStorage.getItem(storageItemsKey);
		var storage	= JSON.parse(jsonItems);
		storageCache[storageItemsKey] = storage;
	}
	
	return storageCache[storageItemsKey];
};

clLib.localStorage.getStorageIndexes = function(storageName, entityName) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	if(!storageCache[indexItemsKey]) {
		var jsonIndexes = clLib.localStorage.getItem(indexItemsKey); 
		var storage = JSON.parse(jsonIndexes)
		storageCache[indexItemsKey] = storage;
	}
	
	return storageCache[indexItemsKey];
};

clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
	clLib.localStorage.setItem(storageName + "_createdAt", tojson(new Date()));
};

clLib.localStorage.getLastRefreshDate = function(storageName) {
	return clLib.localStorage.getItem(storageName + "_createdAt");
};

clLib.localStorage.setStorageIndexes = function(storageName, entityName, indexItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	clLib.localStorage.setItem(indexItemsKey, tojson(indexItems)); 
};



Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

Array.prototype.getIntersect = function(anotherArray) {
	var i = 0;
	var resultArray = [];
	for(i = 0; i < anotherArray.length; i++) {
		if(this.indexOf(anotherArray[i]) > -1) {
			resultArray.push(anotherArray[i]);
		}
	}
	return resultArray;
}
	
Array.prototype.sortBy = function(sortKey, descSortFlag) {
    this.sort(function(a, b) {
		//alert("comparing " + a[sortKey] + " - " +  b[sortKey]);
		var sortResult = 
			a[sortKey] < b[sortKey] ? -1 : 1;
		//alert("sortresult is " + sortResult);

        if(descSortFlag) {
			sortResult *= -1;
		}
		//alert("returning " + sortResult);
		return sortResult;
    });
};

/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName, sortKey, descSortFlag, limit) {
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		alert("no local store available => you need to refresh first.");
		return;
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		alert("no local data available => you need to refresh first.");
		return;
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}
	//console.log("storage keys: "+ Object.keys(storage));
	
	// Indexes?
/*
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//console.log("Indexes for queried entity: " + JSON.stringify(indexes));
	var remainingWhereObj = {};
	var foundIds = [];
	var indexFound = false;
	if(Object.keys(clLib.localStorage.indexes[entity]) > 0) {
		$.each(whereObj, function(keyName, condition) {
			console.log("check for index entries with key " + keyName + " in (" + typeof(clLib.localStorage.indexes[entity]) + ") " + JSON.stringify(clLib.localStorage.indexes[entity]));
			if(Object.keys(clLib.localStorage.indexes[entity]).indexOf(keyName) > -1) {
				//console.log("   found!");
				//foundIds.push.apply(foundIds, indexes[keyName][condition]);
				if(indexFound) {
					//foundIds = indexes[keyName][condition].items;
					foundIds = foundIds.getIntersect(indexes[keyName][condition].items);
				} else{
					foundIds = indexes[keyName][condition].items;
				}
				indexFound = true;
			} else {
				remainingWhereObj[keyName] = condition;
				//console.log("   not found!");
			}
		});
	}
	//foundIds = foundIds.getUnique();
	//console.log("got unique ids " + JSON.stringify(foundIds));
	//console.log("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	var remainingIdsToQuery = Object.keys(storage[entity]);
	if(indexFound) {
		remainingIdsToQuery = foundIds;
	} else {
		remainingWhereObj = whereObj;
	}
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundIds;
	}
*/
	var remainingIdsToQuery = Object.keys(storage[entity]);
	
	$.each(remainingIdsToQuery, function(index, id) {
		//console.log("remainigni items!!");
		var currentItem = storage[entity][id];
		//console.log("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
		var eligible = true;
		if(	
			typeof(whereObj) !== "undefined" &&
			Object.keys(whereObj).length > 0
		) {
			// item is the current row to iterate
			$.each(whereObj, function(keyName, condition) {
				// still eligible? check remaining conditions..
				if(eligible) {
					eligible = clLib.localStorage.evalCondition(currentItem[keyName], condition);
				}
			});
		}
		if(eligible) {
			//alert("eligible!");
/*			if(!(indexFound) || (
				indexFound && foundIds.indexOf(id) > -1
			)) {
				resultsObj.push(currentItem);
			}
*/
			resultsObj.push(currentItem);
			
		}
	});
	
	if(sortKey) {
		//alert("sorting by "  + sortKey);
		resultsObj.sortBy(sortKey, descSortFlag);
		//alert("sorted result " + JSON.stringify(resultsObj));
	}

	if(limit) {
		resultsObj = resultsObj.slice(0, limit);
	}
	return resultsObj;
	
	
}

/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getDistinct = function(entity, whereObj, colName, storageName) {
	var resultsObj = {};
	var storage = clLib.localStorage.getStorageItems(storageName);
	//console.log("storage keys: "+ Object.keys(storage));
	
/*
	// indexes?
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//console.log("Indexes for queried entity: " + JSON.stringify(indexes));

	var remainingWhereObj = {};
	var foundValues = [];
	var indexFound = false;
	
	//console.log("Iterating where " + JSON.stringify(whereObj));
	$.each(whereObj, function(keyName, condition) {
		// Is there an index for the current where-column?
		//console.log("Checking for " + keyName + " in " + JSON.stringify(clLib.localStorage.indexes[entity]));
		if(
			clLib.localStorage.indexes[entity][keyName] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"].indexOf(colName) > -1
		) {
			//console.log("   found!");
			if(indexFound) {
				foundValues = foundValues.getIntersect(
					Object.keys(indexes[keyName][condition]["distinct"][colName])
				);
			} else{
				//console.log("indexsxxx" + JSON.stringify(indexes));
				//console.log("indeasfdas" + JSON.stringify(indexes[keyName][condition]["distinct"][colName]));
				foundValues = Object.keys(indexes[keyName][condition]["distinct"][colName]);
			}
			indexFound = true;
	
		} else {
			remainingWhereObj[keyName] = condition;
			console.log("   not found!");
		}
	});
	//foundValues = foundValues.getUnique();
	//console.log("got unique ids " + JSON.stringify(foundValues));
	//console.log("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundValues;
	}
*/	
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		alert("no local store available => you need to refresh first.");
		return {};
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		alert("no local data available => you need to refresh first.");
		return {};
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}

	var remainingIdsToQuery = Object.keys(storage[entity]);
	var foundCounter = 0;
	var limit = 30;
	$.each(remainingIdsToQuery, function(index, id) {
/*
		if(foundCounter > limit) {
			return;
		}
*/		
		var currentItem = storage[entity][id];
		//console.log("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
		var eligible = true;
		
		// item is the current row to iterate
		$.each(whereObj, function(keyName, condition) {
			// still eligible? check remaining conditions..
			if(eligible) {
				eligible = clLib.localStorage.evalCondition(currentItem[keyName], condition);
		 	}
		});
		if(eligible) {
			if(typeof(currentItem[colName]) !== 'undefined') {
				//alert("aaaa" + colName);
				resultsObj[currentItem[colName]] += 1;
				foundCounter++;
			}
		}
	});
	console.log("Got resultsobj" + JSON.stringify(resultsObj));
/*	if(Object.keys(foundValues).length > 0) {
		return foundValues.getIntersect(
			Object.keys(resultsObj));
	}
*/
	return resultsObj ? Object.keys(resultsObj) : null;
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
	//console.log("checking " + valueToTest + " against " + JSON.stringify(condition));
	if(!valueToTest) {
		return false;
	}
	
	var eligible = true;
	if(!(condition instanceof Object)) {
		//console.log("no object, comparing string values >" + valueToTest + "< against >" + condition + "<");
		if(valueToTest != condition) {
			eligible = false;
		}
	}
	else {
		//console.log("object condition, comparing advanced values");
		//alert("evaling conditions " + JSON.stringify(condition));
		$.each(condition, function(operator, compValue) {
			//alert("evaling condition " + JSON.stringify(operator));
			if(operator == "$gte"){
				//alert("$gt " + valueToTest + " < " + compValue);
				//alert("$gte2 " + valueToTest + " < " + compValue);
				if(!(valueToTest >= compValue)) {
					eligible = false;
				} else {
					//alert("yes, gte!");
				}
			} else 
			if(operator == "$gt"){
				//alert("$gt " + valueToTest + " < " + compValue);
				//alert("$gt2 " + valueToTest + " < " + compValue);
				if(!(valueToTest > compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$lt") {
				//alert("$lt " + valueToTest + " < " + compValue);
				//alert("$lt2 " + valueToTest + " < " + compValue);
				if(!(valueToTest < compValue)) {
					eligible = false;
				} else {
					//alert("yes, st!!!");
				}
			} else 
			if(operator == "$like"){
				if(!(valueToTest.indexOf(compValue) > -1)) {
					eligible = false;
				} else {
					//console.log("found match!!" + valueToTest);
				}
			} 
			if(operator == "$starts-with"){
				if(!(valueToTest.indexOf(compValue) == 0)) {
					eligible = false;
				} else {
					console.log("found starting match!!" + valueToTest);
				}
			} 
		});
	};
	if(eligible) {
		//alert("Eligibility is " + eligible);
	}
	return eligible;
	
};
