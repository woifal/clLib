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


clLib.localStorage.addStorageItems = function(entityName, entityItemsArr, storageName) {
	clLib.loggi("adding elements " + entityItemsArr.length + "->" + JSON.stringify(entityItemsArr));
	for(var i = 0; i < entityItemsArr.length; i++) {
		// store new items
		clLib.localStorage.addStorageItem(storageName, entityName, entityItemsArr[i]);
	}
};

clLib.localStorage.initStorageItems = function(entityName, entityItemsArr, storageName) {
	clLib.loggi("initStorageItems for : " + JSON.stringify(entityItemsArr));
	var entityItems = {};
	for(var i = 0; i < entityItemsArr.length; i++) {
		entityItems[entityItemsArr[i]["_id"]] = entityItemsArr[i];
	}
	clLib.loggi("entityItems after ID-remapping >" + JSON.stringify(entityItems) + "<");
	// add UNSYNCED entries to cache	
	var unsyncedStorage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	clLib.loggi("currently unsynced items for entity >" + entityName + "< =>" + JSON.stringify(unsyncedStorage) + "<");
	if(unsyncedStorage && unsyncedStorage[entityName]) {
		$.each(unsyncedStorage[entityName], function(dummyId) {
			var entityInstance = unsyncedStorage[entityName][dummyId];
			//alert("add to storage items (" + entityName + ") for >" + dummyId + "< bzw. >" + JSON.stringify(entityInstance) + "<");
			entityItems[entityInstance["_id"]] = entityInstance;
		});
	}
	
	clLib.loggi("returning entityitems " + JSON.stringify(entityItems));
	return entityItems;
};

clLib.localStorage.initStorage = function(storageObj, storageName) {
	clLib.loggi("init storage with " + JSON.stringify(storageObj));
	// Use default storageName if none supplied..
	storageName = storageName || "defaultStorage";
	
	// Delete cache
	var storageItemsKey = storageName + "_items";
	
	delete(storageCache[storageItemsKey]);

	clLib.loggi("adding elements " + Object.keys(storageObj).length + "->" + JSON.stringify(Object.keys(storageObj)));
	var allItems = {};
	for(var entityName in storageObj) {
		var entityItems = clLib.localStorage.initStorageItems(entityName, storageObj[entityName], storageName);
		// store retrieved AND unsynced items
		allItems[entityName] = entityItems;
	}

	clLib.loggi("storing items");
	clLib.localStorage.setStorageItems(storageName, allItems);
	clLib.loggi("items stored");
	
	clLib.localStorage.initStorageIndexes(storageObj, storageName);
	
	//clLib.loggi("initialized storage " + storageName);
	//clLib.loggi("storage now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_items")));
	//alert("local storage after init " + JSON.stringify(localStorage));
};

clLib.localStorage.initStorageIndexes = function(storageObj, storageName) {
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
	//clLib.loggi("index now is " + JSON.stringify(clLib.localStorage.getItem(storageName + "_index_" + "routes")));
	
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
	var storageName = storageName || "defaultStorage";
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
	var storage	= JSON.parse(jsonItems || "{}");
	storageCache[storageItemsKey] = storage;
};


clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || "defaultStorage";
	var storageItemsKey = storageName + "_items";
	clLib.loggi("setting " + storageItemsKey + " to " + tojson(storageItems));
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
	clLib.localStorage.setLastRefreshDate(storageName);
};

clLib.localStorage.addStorageItem = function(storageName, entity, newItem) {
	//alert("!!!adding storage for storageName >" + storageName + "< and entity >" + entity + "<");
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

clLib.localStorage.updateStorageItem = function(storageName, entity, entityId, entityInstance) {
	//alert("updating storage for storageName >" + storageName + "< and entity >" + entity + "<");
	// storageItems => [entity][_id]
	
	// fetch storage items - NOT using the session cache
	var storageItemsKey = storageName + "_items";
	var jsonItems = clLib.localStorage.getItem(storageItemsKey);
	var storageItems = JSON.parse(jsonItems);
	// add new item to localstorage 
	//alert("old storageitems: " + JSON.stringify(storageItems));

	var currentItem = storageItems[entity][entityId];
	if(currentItem) {
		$.each(entityInstance, function(field, value) {
			currentItem[field] = value;
		}); //asdf
	}

	//alert("new storageItems >" + JSON.stringify(storageItems));
	clLib.localStorage.setStorageItems(storageName, storageItems);
	clLib.localStorage.initCache(storageName, storageItems);
};


clLib.localStorage.removeStorageItem = function(storageName, entity, id2delete) {
	//alert("removing storage for storageName >" + storageName + "< and entity >" + entity + "< >" + id2delete + "<");
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
	var storageName = storageName || "defaultStorage";
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
	var storageName = storageName || "defaultStorage";
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
	console.log("syncing up all entities for >" + entity + "< in >" + storageName + "<");
	var storage = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	console.log("currently unsynced items >" + JSON.stringify(storage) + "<");
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
	
	
	console.log("syncing entity (" + entityInstance["deleted"] + ")" + JSON.stringify(entityInstance));
	if(entityInstance["deleted"] == 1) {
//		alert("unsynced items:  >" + JSON.stringify(unsyncedStorage) + "<");
//		alert(">" + dummyId + "< in storagecache? >" + JSON.stringify(entityStorage[dummyId]) + "<");

		var dummyId = entityInstance["_id"];
		if(entityInstance["localOnly"]) {

			// delete from unsynced entries..
			clLib.localStorage.removeStorageItem("UNSYNCED_" + storageName, entity, dummyId);

			alert("route was local only, so just delete from UNSYNCED_ storage..");
            //
            // ???????????????????????????
            //
            "x";
		}
		// need to mark "as-deleted" on server as well..
		else {
			var updatedInstance;

			clLib.REST.updateEntity(entity, entityInstance
			,function(realInstance) {
				clLib.loggi("synced realInstance >" + JSON.stringify(realInstance) + "<");
				entityInstance["_id"] = realInstance["_id"];	

				clLib.loggi("synced UP >" + dummyId + "<, new id is (" + typeof(realInstance) + ")>" + realInstance["_id"] + "<, dummyId was >" + dummyId + "<");
				// delete from unsynced entries..
				clLib.localStorage.removeStorageItem("UNSYNCED_" + storageName, entity, dummyId);
				// delete from available routes..
				clLib.localStorage.removeStorageItem(storageName, entity, dummyId);
			}
			,function(e) {
				var errorMsg = e.message;
				var errorCode = "N/A";
				if(e.message && JSON.parse(e.message)["responseText"]) {
					errorCode = JSON.parse(JSON.parse(e.message)["responseText"])["code"];
					errorMsg = JSON.parse(JSON.parse(e.message)["responseText"])["description"];
				}
				if(errorCode == "DBSC002") {
					clLib.sessionToken = null;
				}
				
				clLib.loggi("could not sync item due to:" + e.name + " + (" + e.message + ")");
			}
			);
		}
	}
	else {
		var dummyId = entityInstance["_id"];

		//alert("2unsynced items:  >" + JSON.stringify(unsyncedStorage) + "<");
		//alert("2>" + dummyId + "< in storagecache? >" + JSON.stringify(entityStorage[dummyId]) + "<");

		delete(entityInstance["_id"]);
		entityInstance["localOnly"] = 0;
		var realInstance;


		console.log("storing entity " + JSON.stringify(entityInstance));
        clLib.REST.storeEntity(entity, entityInstance
		,function(realInstance) {
			clLib.loggi("synced realInstance >" + JSON.stringify(realInstance) + "<");
			entityInstance["_id"] = realInstance["_id"];	

			clLib.loggi("synced UP >" + dummyId + "<, new id is (" + typeof(realInstance) + ")>" + realInstance["_id"] + "<, dummyId was >" + dummyId + "<");
			// delete dummy id
			clLib.localStorage.removeStorageItem(storageName, entity, dummyId);
			// delete from unsynced entries..
			clLib.localStorage.removeStorageItem("UNSYNCED_" + storageName, entity, dummyId);

			// store real id
			clLib.localStorage.addStorageItem(storageName, entity, entityInstance);
		}
		,function(e) {
			var errorMsg = e.message;
			var errorCode = "N/A";
			if(e.message && JSON.parse(e.message)["responseText"]) {
				errorCode = JSON.parse(JSON.parse(e.message)["responseText"])["code"];
				errorMsg = JSON.parse(JSON.parse(e.message)["responseText"])["description"];
			}
			if(errorCode == "DBSC002") {
				clLib.sessionToken = null;
			}
			
			clLib.loggi("could not sync item due to:" + e.name + " + (" + e.message + ")");
		}
		);
	}
}



clLib.localStorage.addInstance = function(entity, entityInstance, storageName) {
    console.log("addinstance >" + entity + "< >" + JSON.stringify(entityInstance) + "<");
    var storage = clLib.localStorage.getStorageItems(storageName);
	
	var dummyId = "DUMMY" + new Date().getTime();
	entityInstance["_id"] = dummyId;
	entityInstance["localOnly"] = 1;

	clLib.localStorage.addStorageItem(storageName, entity, entityInstance);
	// mark as local-only

	clLib.localStorage.addStorageItem("UNSYNCED_" + storageName, entity, entityInstance);
	
	clLib.loggedInCheck(
	function() {
		clLib.loggi("online, syncing UP!!!");
		clLib.localStorage.syncAllUp(entity, storageName);
	}
	, function(e) {
		clLib.loggi("offline, saving for later sync UP..");
	}
	);
}

clLib.localStorage.removeInstance = function(entity, entityId, storageName) {
    //alert("removeinstance called!" + entity + "," + entityId + "," + storageName);
    

	var entityInstance = {};
	entityInstance = clLib.localStorage.getStorageItems(storageName)[entity][entityId];
	if(!entityInstance) {
		alert("Could not delete route log. contact woifal.");
		return;
	}
	
	entityInstance["deleted"]  = 1;

	var unsyncedInst = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName);
	if(unsyncedInst) {
		unsyncedInst = unsyncedInst[entity];
		if(unsyncedInst) {
			unsyncedInst = unsyncedInst[entityId];
		}
	}
	//var unsyncedInst = clLib.localStorage.getStorageItems("UNSYNCED_" + storageName)[entity][entityId];
	if(unsyncedInst) {
		clLib.localStorage.updateStorageItem("UNSYNCED_" + storageName, entity, entityId, entityInstance);
	} else {
		clLib.localStorage.addStorageItem("UNSYNCED_" + storageName, entity, entityInstance);
	}
	clLib.localStorage.updateStorageItem(storageName, entity, entityId, entityInstance);
	
	// update remote db (if necessary)
	clLib.loggedInCheck(
	function() {
		clLib.loggi("online, syncing UP!!!");
		clLib.localStorage.syncAllUp(entity, storageName);
	}
	, function(e) {
		clLib.loggi("offline, saving for later sync UP..");
	}
	);
}

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
	//clLib.loggi("storage Keys:" + JSON.stringify(remainingIdsToQuery));
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
	
	//alert("unsorted " + resultsObj.length);
	if(sortKey) {
		//alert("sorting by "  + sortKey);
		resultsObj.sortBy(sortKey, descSortFlag);
		//alert("sorted result " + JSON.stringify(resultsObj));
	}
	//alert("sorted " + resultsObj.length);

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
	//alert("storage keys: "+ Object.keys(storage));
	
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
		clLib.loggi("storage: " + JSON.stringify(storage));
	}
//alert(12);
	if(!storage[entity]){
		//alert("no local data available for " + storageName + "[" + entity + "]=> you need to refresh first.");
		return {};
	} else {
		//alert("entity (" + entity + "," + colName + ") storage: " + JSON.stringify(storage[entity]));
		
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
		clLib.loggi("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
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

	clLib.loggi("checking " + valueToTest + " against " + JSON.stringify(condition));
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

//
// Refresh remote data modifed after last refresh date..
//
clLib.localStorage.refreshNewData = function () {
	console.log("refreshing entities changed after " + clLib.localStorage.getLastRefreshDate() + "..");
	var entities;
	clLib.REST.getEntities("Routes"
		, {
			"_updatedAt": { 
				"$gt": {
					"$date": clLib.localStorage.getLastRefreshDate("defaultStorage")
				},
			}
			,"deleted" : {
				"$ne": 1
			}
		}
		, function(resultObj) {
			entities = resultObj;
		}
		,function(e) {
			alert("error while retrieving Routes.." + e);
		}
	);
	console.log("Entities to add to local storage: " + JSON.stringify(entities));
	clLib.localStorage.addStorageItems("Routes", entities);
	
	clLib.REST.getEntities("RouteLog"
		, {
			"_updatedAt": { 
				"$gt": {
					"$date": clLib.localStorage.getLastRefreshDate("defaultStorage")
				}
			}
			,"deleted" : {
				"$ne": 1
			}
		}
		, function(resultObj) {
			entities = resultObj;
		}
		,function(e) {
			alert("error while retrieving Routes.." + e);
		}
	);
	console.log("Entities to add to local storage: " + JSON.stringify(entities));
	clLib.localStorage.addStorageItems("RouteLog", entities);
};

clLib.localStorage.refreshAllData = function (callbackFunc, errorFunc) {
    //alert("need to refresh?");
	clLib.loggedInCheck(
	function() {
		clLib.UI.execWithMsg(function() {
			var warnings = "";
			//alert("previous refresh:" +clLib.localStorage.getLastRefreshDate("defaultStorage"));

			var storageObjects = {};

			var userRoutes;
			clLib.REST.getEntities("Routes", {
				"deleted" : {
					"$ne": 1
				}
			}
			,function(resultObj) {
				userRoutes = resultObj;
			}
			,function(e) {
				warnings += "error while retrieving Routes.." + e;
			}
			);
			
			console.log("GOT: " + JSON.stringify(userRoutes));
			$.extend(storageObjects, userRoutes);

			var userRouteLogs;
			// TESTING: return ALL routelogs..
			clLib.REST.getEntities("RouteLog", $.extend({}, //clLib.getRouteLogWhereToday(), 
				{
					"deleted" : {
						"$ne": 1
					}
				}
			)	
			, function(resultObj) {
				userRouteLogs = resultObj;
			}
			,function(e) {
				warnings += "error while retrieving RouteLog.." + JSON.stringify(e);
			}
			);
			
			console.log("GOT: " + JSON.stringify(userRouteLogs));
			$.extend(storageObjects, userRouteLogs);

			var areas;
			clLib.REST.getEntities("Area", {}
			, function(resultObj) {
				areas = resultObj;
			}
			,function(e) {
				warnings += "error while retrieving Area.." + e;
			}
			);
			clLib.loggi("GOT: " + JSON.stringify(areas));
			$.extend(storageObjects, areas);

			//
			// compile grade config for DB-like use in clLib.localStorage...
			//
			var compiledGradeConfig = clLib.compileGradeConfig();
			console.log("compiledGradeConfig: " + JSON.stringify(compiledGradeConfig));
			$.extend(storageObjects, compiledGradeConfig);
			console.log("initializing storage with >" + JSON.stringify(storageObjects)+ "<");
			
			// Initialize local storage..
			clLib.localStorage.initStorage(storageObjects);

//			clLib.UI.fillUIelements("startScreen", "startScreen");

			//alert("new refresh:" + clLib.localStorage.getLastRefreshDate("defaultStorage"));
//			clLib.UI.hideLoading();
			
			clLib.loggi("calling refreshAllData callback with " + warnings);
			return callbackFunc({"warnings" : warnings});
		}, {text: "Refreshing from server.."}
		);
	} 
	, function(e) {
	    clLib.alert("Not online!");
        return errorFunc(e);
    }
	);
};


