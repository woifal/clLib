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
	// Delete cache
	var storageItemsKey = storageName + "_items";
	
//	localStorage.removeItem("cache_" + storageItemsKey);
	delete(storageCache[storageItemsKey]);


	//alert("adding elements " + Object.keys(storageObj).length + "->" + JSON.stringify(Object.keys(storageObj)));
	var allItems = {};
	for(var entityName in storageObj) {
		//alert("entity: " + entityName);
		var entityItems = {};
		for(var i = 0; i < storageObj[entityName].length; i++) {
			entityItems[storageObj[entityName][i]["_id"]] = storageObj[entityName][i];
		}

		// add UNSYNCED entries to cache	
		var unsyncedStorage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
		clLib.loggi("currently unsynced items for entity >" + entityName + "< =>" + JSON.stringify(unsyncedStorage) + "<");
		if(unsyncedStorage) {
			$.each(unsyncedStorage[entityName], function(dummyId) {
				var entityInstance = unsyncedStorage[entityName][dummyId];
				//alert("add to storage items for >" + dummyId + "< bzw. >" + JSON.stringify(entityInstance) + "<");
				entityItems[entityInstance["_id"]] = entityInstance;
			});
		}
		
		// store retrieved AND unsynced items
		allItems[entityName] = entityItems;

	}



	clLib.loggi("storing items");
	clLib.localStorage.setStorageItems(storageName, allItems);
	clLib.loggi("items stored");
	
/*
	var storageItems = clLib.localStorage.getStorageItems(storageName);
	var indexedEntities = clLib.localStorage.indexes;
	var indexedItems = {};
	
	clLib.loggi("indexItems: " + tojson(indexedEntities));
	//clLib.loggi("allitems " + tojson(storageItems));
	// check all entities in storageObj for configured indexs..
	for(var entityName in indexedEntities) {
	//$.each(indexedEntities, function(entityName) {
		//clLib.loggi("working on indexedentity " + entityName);
		
		// iterate indexed entities from storageObj
		var currentEntityIndexes = indexedEntities[entityName];
		var currentEntityItems = storageItems[entityName];
		var currentEntityIdxItems = {};
		//clLib.loggi("working on currententityitems " + tojson(currentEntityItems));
		if(!currentEntityItems) {
			//clLib.loggi("no items for " + entityName + " in current collection..");
			return;
		}
		// Iterate all items of current entity(routes, areas, etc..)
		$.each(currentEntityItems, function(currentId, currentItem) {
		//for(var currentId in currentEntityItems) {
			var currentItem = currentEntityItems[currentId];
			// Resolve every index for current item
			for(var indexedCol in currentEntityIndexes) {
			//$.each(currentEntityIndexes, function(idx, indexedCol) {
				//clLib.loggi("!!Checking indexed column " + indexedCol);
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
			//clLib.loggi("3after adding row it is" + tojson(currentEntityIdxItems));
		//}
		});
		//clLib.loggi("setting index to " + tojson(currentEntityIdxItems));
		//
		// Store indexed for current entity
		//
		clLib.localStorage.setStorageIndexes(storageName, entityName, currentEntityIdxItems);
		
	}
	//);
	*/
	
	//clLib.loggi("initialized storage " + storageName);
	//clLib.loggi("storage now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_items")));
	//clLib.loggi("index now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_index_" + "routes")));
	//alert("local storage after init " + JSON.stringify(localStorage));
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










clLib.localStorage.getStorageItems = function(storageName, reinitCache) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	// session cache is good enough?
	if(
		reinitCache ||
		!storageCache[storageItemsKey]
	) {
		clLib.localStorage.initCache(storageName);
	}
	return storageCache[storageItemsKey];
};

clLib.localStorage.initCache = function(storageName) {
	var storageItemsKey = storageName + "_items";
	//alert("init cache for " + storageName + " and key " + storageItemsKey);
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storage	= JSON.parse(jsonItems);
	storageCache[storageItemsKey] = storage;
};


clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
	clLib.localStorage.setLastRefreshDate(storageName);
};

clLib.localStorage.addStorageItem = function(storageName, entity, newItem) {
	//alert("adding storage for storageName >" + storageName + "< and entity >" + entity + "<");
	// storageItems => [entity][_id]
	
	// fetch storage items - NOT using the session cache
	var storageItemsKey = storageName + "_items";
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storageItems = JSON.parse(jsonItems);
	// add new item to localstorage 
	//alert("old storageitems: " + JSON.stringify(storageItems));
	storageItems = clLib.addObjValue(storageItems, [entity, newItem["_id"]], newItem);

	//alert("new storageItems >" + JSON.stringify(storageItems));
	clLib.localStorage.setStorageItems(storageName, storageItems);
	clLib.localStorage.initCache(storageName, storageItems);
};


clLib.localStorage.removeStorageItem = function(storageName, entity, id2delete) {
	// storageItems => [entity][_id]
	
	// fetch storage items - NOT using the session cache
	var storageItemsKey = storageName + "_items";
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storageItems = JSON.parse(jsonItems);
	// remove new item from localstorage 
	delete(storageItems[entity][id2delete]);
	clLib.localStorage.setStorageItems(storageName, storageItems);
	clLib.localStorage.initCache(storageName, storageItems);
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



clLib.localStorage.getLastRefreshDate = function (storageName) {
    return clLib.localStorage.getItem(storageName + "_createdAt");
};

clLib.localStorage.setLastRefreshDate = function (storageName) {
    //alert("seeting last refresh of " + storageName + " to " + tojson(new Date()));
    clLib.localStorage.setItem(storageName + "_createdAt", tojson(new Date()));
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
	
clLib.isFunction = function(functionToCheck) {
 var getType = {};
 //alert("am i a function? :" + getType.toString.call(functionToCheck));
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

Array.prototype.sortByKey = function(sortKey, descSortFlag) {
    this.sort(function(a, b) {
		var sortResult = 
			a[sortKey] < b[sortKey] ? -1 : 1;
		if(descSortFlag) {
			sortResult *= -1;
		}
		return sortResult;
	});
};

Array.prototype.sortByFunction = function(sortFunction, descSortFlag) {
//	alert("yes, sorting by function " + JSON.stringify(sortFunction));
    this.sort(function(a, b) {
		var sortResult = 
			sortFunction(a) < sortFunction(b) ? -1 : 1;
		if(descSortFlag) {
			sortResult *= -1;
		}
		return sortResult;
    });
};

Array.prototype.sortBy = function(sortBy, descSortFlag) {
	var sortFunc;
//	alert("sortBy " + JSON.stringify(sortBy));

	if(clLib.isFunction(sortBy)) {
//		alert("JSON.stringify " + JSON.stringify(sortBy));
		return this.sortByFunction(sortBy, descSortFlag);	
	} else {
		return this.sortByKey(sortBy, descSortFlag);
	}
};

clLib.localStorage.syncAllUp = function(entity, storageName) {
	clLib.loggi("syncing up all entities for >" + entity + "< in >" + storageName + "<");
	var storage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	clLib.loggi("currently unsynced items >" + JSON.stringify(storage) + "<");
	$.each(storage[entity], function(dummyId) {
		var entityInstance = storage[entity][dummyId];
		//alert("call syncup for >" + dummyId + "< bzw. >" + JSON.stringify(entityInstance) + "<");

		clLib.localStorage.syncUp(entity, entityInstance, storageName);
	});
}


clLib.localStorage.syncUp = function(entity, entityInstance, storageName) {
	var entityStorage = clLib.localStorage.getStorageItems(storageName);
	entityStorage = entityStorage[entity];
	
	var unsyncedStorage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	unsyncedStorage = unsyncedStorage[entity];
	
	var dummyId = entityInstance["_id"];

	//alert("unsynced items:  >" + JSON.stringify(unsyncedStorage) + "<");
	//alert(">" + dummyId + "< in storagecache? >" + JSON.stringify(entityStorage[dummyId]) + "<");

	delete(entityInstance["_id"]);
	try {
		var realInstance = clLib.REST.storeEntity(entity, entityInstance);
	
		entityInstance["_id"] = realInstance["_id"];	

		//alert("synced UP >" + dummyId + "<, new id is " + realInstance["_id"]);
		// delete dummy id
		clLib.localStorage.removeStorageItem(storageName, entity, dummyId);
		// delete from unsynced entries..
		clLib.localStorage.removeStorageItem("UNSYNCED_" + storageName, entity, dummyId);

		// store real id
		clLib.localStorage.addStorageItem(storageName, entity, entityInstance);

	} catch (e) {
	    alert("could not sync item due to:" + e.name + " + (" + e.message + ")");
    }
}



clLib.localStorage.addInstance = function(entity, entityInstance, storageName) {
    //clLib.UI.showLoading("addInstance called..");
    //alert("addinstance called!");
    var storage = clLib.localStorage.getStorageItems(storageName);
	
	var dummyId = "DUMMY" + new Date().getTime();
	entityInstance["_id"] = dummyId;

	clLib.localStorage.addStorageItem(storageName, entity, entityInstance);
	// mark as local-only

	clLib.localStorage.addStorageItem("UNSYNCED_" + storageName, entity, entityInstance);
	
	if(clLib.isOnline()) {
		clLib.loggi("online, syncing UP!!!");
		//clLib.localStorage.syncUp(entity, entityInstance, storageName);
		clLib.localStorage.syncAllUp(entity, storageName);
	} else {
		clLib.loggi("offline, saving for later sync UP..");
	}
	//clLib.UI.showLoading(entity + " saved!");
}

clLib.isOnline = function() {
	var onlineMode = localStorage.getItem("onlineMode");
	clLib.loggi("currentlyOnline? >" + onlineMode);
	if(!(onlineMode == 0)) {
	    return navigator.onLine && clLib.loggedInCheck()
	} else {
		return false;
	}
};

/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName, sortKey, descSortFlag, limit) {
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		//alert("no local store available => you need to refresh first.");
		return;
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		//alert("no local data available for >" + entity + "<. You need to refresh first.");
		return;
	} else {
		//alert("entity storage: " + JSON.stringify(storage));
		
	}
	//clLib.loggi("storage keys: "+ Object.keys(storage));
	
	// Indexes?
/*
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//clLib.loggi("Indexes for queried entity: " + JSON.stringify(indexes));
	var remainingWhereObj = {};
	var foundIds = [];
	var indexFound = false;
	if(Object.keys(clLib.localStorage.indexes[entity]) > 0) {
		$.each(whereObj, function(keyName, condition) {
			clLib.loggi("check for index entries with key " + keyName + " in (" + typeof(clLib.localStorage.indexes[entity]) + ") " + JSON.stringify(clLib.localStorage.indexes[entity]));
			if(Object.keys(clLib.localStorage.indexes[entity]).indexOf(keyName) > -1) {
				//clLib.loggi("   found!");
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
				//clLib.loggi("   not found!");
			}
		});
	}
	//foundIds = foundIds.getUnique();
	//clLib.loggi("got unique ids " + JSON.stringify(foundIds));
	//clLib.loggi("remaining where clause " + JSON.stringify(remainingWhereObj));
	
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
		//clLib.loggi("remainigni items!!");
		var currentItem = storage[entity][id];
		//clLib.loggi("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
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
	//clLib.loggi("storage keys: "+ Object.keys(storage));
	
/*
	// indexes?
	var indexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//clLib.loggi("Indexes for queried entity: " + JSON.stringify(indexes));

	var remainingWhereObj = {};
	var foundValues = [];
	var indexFound = false;
	
	//clLib.loggi("Iterating where " + JSON.stringify(whereObj));
	$.each(whereObj, function(keyName, condition) {
		// Is there an index for the current where-column?
		//clLib.loggi("Checking for " + keyName + " in " + JSON.stringify(clLib.localStorage.indexes[entity]));
		if(
			clLib.localStorage.indexes[entity][keyName] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"] &&
			clLib.localStorage.indexes[entity][keyName]["distinct"].indexOf(colName) > -1
		) {
			//clLib.loggi("   found!");
			if(indexFound) {
				foundValues = foundValues.getIntersect(
					Object.keys(indexes[keyName][condition]["distinct"][colName])
				);
			} else{
				//clLib.loggi("indexsxxx" + JSON.stringify(indexes));
				//clLib.loggi("indeasfdas" + JSON.stringify(indexes[keyName][condition]["distinct"][colName]));
				foundValues = Object.keys(indexes[keyName][condition]["distinct"][colName]);
			}
			indexFound = true;
	
		} else {
			remainingWhereObj[keyName] = condition;
			clLib.loggi("   not found!");
		}
	});
	//foundValues = foundValues.getUnique();
	//clLib.loggi("got unique ids " + JSON.stringify(foundValues));
	//clLib.loggi("remaining where clause " + JSON.stringify(remainingWhereObj));
	
	if(Object.keys(remainingWhereObj).length == 0) {
		return foundValues;
	}
*/	
//alert(1);
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	if(!storage){
		//alert("no local store available for storage " + storageName + " => you need to refresh first.");
		return {};
	} else {
		//alert("storage: " + JSON.stringify(storage));
		
	}
//alert(12);
	if(!storage[entity]){
		//alert("no local data available for " + storageName + "[" + entity + "]=> you need to refresh first.");
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
		//clLib.loggi("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
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
	clLib.loggi("Got resultsobj" + JSON.stringify(resultsObj));
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
	// remove leading/trailing whitespace..
	valueToTest = $.trim(valueToTest);

	//clLib.loggi("checking " + valueToTest + " against " + JSON.stringify(condition));
	if(!valueToTest) {
		return false;
	}

	
	var eligible = true;
	if(!(condition instanceof Object)) {
		//alert("no object, comparing string values >" + $.trim(valueToTest) + "< against >" + condition + "<");
		if($.trim(valueToTest) != condition) {
			eligible = false;
		}
	}
	else {
		//clLib.loggi("object condition, comparing advanced values");
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
					//clLib.loggi("found match!!" + valueToTest);
				}
			} 
			if(operator == "$starts-with"){
				if(!(valueToTest.indexOf(compValue) == 0)) {
					eligible = false;
				} else {
					//clLib.loggi("found starting match!!" + valueToTest);
				}
			} 
		});
	};
	if(eligible) {
		//alert("Eligibility is " + eligible);
	}
	return eligible;
	
};


clLib.localStorage.refreshAllData = function () {
    if (clLib.isOnline()) {
        clLib.UI.showLoading("refreshing from server..");

        //alert("previous refresh:" +clLib.localStorage.getLastRefreshDate("routeStorage"));

        var userRoutes = clLib.REST.getEntities("Routes");
        console.log("GOT: " + JSON.stringify(userRoutes));
        clLib.localStorage.initStorage("routeStorage", userRoutes);

        var userRouteLogs = clLib.REST.getEntities("RouteLog", clLib.getRouteLogWhereToday());
        console.log("GOT: " + JSON.stringify(userRouteLogs));
        clLib.localStorage.initStorage("routeLogStorage", userRouteLogs);

        clLib.UI.fillUIelements("startScreen", "startScreen");

        //alert("new refresh:" + clLib.localStorage.getLastRefreshDate("routeStorage"));
        clLib.UI.hideLoading();
        return true;
    } else {
        clLib.alert("Not online!");
        return false;
    }
};
