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


clLib.localStorage.indexExists = function(storageName, indexName) {
	var indexedStorages = clLib.localStorage.indexes;
	if(
		storageName in indexedStorages &&
		$.inArray(indexName, indexedStorages.storageName)
	) {
		return true;
	}
	return false;
};

clLib.localStorage.initStorage = function(storageName, storageObj) {
	localStorage.clear();
	
	var allItems = {};
	for(var entityName in storageObj) {
		var entityItems = {};
		for(var i = 0; i < storageObj[entityName].length; i++) {
			entityItems[storageObj[entityName][i]["_id"]] = storageObj[entityName][i];
		}
		allItems[entityName] = entityItems;
	}
	
	clLib.localStorage.setStorageItems(storageName, allItems);
	
	var indexedEntities = clLib.localStorage.indexes;
	var storageItems = clLib.localStorage.getStorageItems(storageName);
	
	var indexedItems = {};
	
	console.log("indexItems: " + tojson(indexedEntities));
	//console.log("allitems " + tojson(storageItems));
	// check all entities in storageObj for configured indexs..
	for(var entityName in indexedEntities) {
	//$.each(indexedEntities, function(entityName) {
		console.log("working on indexedentity " + entityName);
		
		// iterate indexed entities from storageObj
		var currentEntityIndexes = indexedEntities[entityName];
		var currentEntityItems = storageItems[entityName];
		var currentEntityIdxItems = {};
		//console.log("working on currententityitems " + tojson(currentEntityItems));
		if(!currentEntityItems) {
			console.log("no items for " + entityName + " in current collection..");
			return;
		}
		// Iterate all items of current entity(routes, areas, etc..)
		$.each(currentEntityItems, function(currentId, currentItem) {
		//for(var currentId in currentEntityItems) {
			var currentItem = currentEntityItems[currentId];
			// Resolve every index for current item
			$.each(currentEntityIndexes, function(idx, indexedCol) {
				//console.log("!!Checking indexed column " + indexedCol);
				var currentIdxKey = currentItem[indexedCol];
				clLib.addObjArr(currentEntityIdxItems, indexedCol, currentIdxKey, currentId);
			});
			//console.log("3after adding row 	it is" + tojson(currentEntityIdxItems));
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
	var storageItems = clLib.localStorage.getItem(storageItemsKey);
	//console.log("getting storage " + storageName);
	//console.log("storage is " + storageItems);
	//console.log("JSON storage is " + JSON.parse(storageItems));
	//console.log("stringed JSON storage is " + tojson(JSON.parse(storageItems)));
	var storage = JSON.parse(storageItems);
	return storage;
};


clLib.localStorage.setStorageItems = function(storageName, storageItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var storageItemsKey = storageName + "_items";
	clLib.localStorage.setItem(storageItemsKey, tojson(storageItems));
};

clLib.localStorage.setStorageIndexes = function(storageName, entityName, indexItems) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	clLib.localStorage.setItem(indexItemsKey, tojson(indexItems)); 
};

clLib.localStorage.getStorageIndexes = function(storageName, entityName) {
	var storageName = storageName || clLib.localStorage.getItem("defaultStorage");
	var indexItemsKey = storageName + "_index_" + entityName;
	
	var storageStr = clLib.localStorage.getItem(indexItemsKey); 
	var storageObj = JSON.parse(storageStr);
	return storageObj;
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
	
/*
*	Returns all objects from localStorage storage "storageName" where ALL conditions in whereObj are met.
*/
clLib.localStorage.getEntities = function(entity, whereObj, storageName) {
	var resultsObj = [];
	var storage = clLib.localStorage.getStorageItems(storageName);
	//console.log("storage keys: "+ Object.keys(storage));
	
	/* 
		check for parts of where clause already indexed..
	*/
	var allEntityIndexes = clLib.localStorage.getStorageIndexes(storageName, entity);
	//console.log("Indexes for queried entity: " + JSON.stringify(allEntityIndexes));
	var origWhereObj = whereObj;
	var foundIds = [];
	var indexFound = false;
	$.each(origWhereObj, function(keyName, condition) {
		//console.log("check for index entries with key " + keyName + " in (" + typeof(clLib.localStorage.indexes[entity]) + ") " + JSON.stringify(clLib.localStorage.indexes[entity]));
		if(clLib.localStorage.indexes[entity].indexOf(keyName) > -1) {
			//console.log("   found!");
			//foundIds.push.apply(foundIds, allEntityIndexes[keyName][condition]);
			if(indexFound) {
				foundIds = foundIds.getIntersect(allEntityIndexes[keyName][condition]);
			} else{
				foundIds = allEntityIndexes[keyName][condition];
			}
			indexFound = true;
			delete whereObj[keyName];
		} else {
			//console.log("   not found!");
		}
	});
	//foundIds = foundIds.getUnique();
	//console.log("got unique ids " + JSON.stringify(foundIds));
	//console.log("remaining where clause " + JSON.stringify(whereObj));
	
	var remainingIdsToQuery = Object.keys(storage[entity]);
	if(indexFound) {
		remainingIdsToQuery = foundIds;
	}
	$.each(remainingIdsToQuery, function(index, id) {
		var currentItem = storage[entity][id];
		//console.log("iterating id(" + index + ") " + id + " item " + JSON.stringify(currentItem));
		
		var eligible = true;
		//console.log("whereObj " + Object.keys(whereObj).length);
		//console.log("typeof(whereObj)" + typeof(whereObj));
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
			if(!(indexFound) || (
				indexFound && foundIds.indexOf(id) > -1
			)) {
				resultsObj.push(currentItem);
			}
		}
	});
	return resultsObj;
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
	//console.log("checking " + valueToTest + " against " + condition);
	var eligible = true;
	if(!(condition instanceof Object)) {
		//console.log("no object, comparing string values >" + valueToTest + "< against >" + condition + "<");
		if(valueToTest != condition) {
			eligible = false;
		}
	}
	else {
		//console.log("object condition, comparing advanced values");
		$.each(condition, function(operator, compValue) {
			if(operator == "$gte"){
				if(!(valueToTest >= compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$gt"){
				if(!(valueToTest > compValue)) {
					eligible = false;
				}
			} else 
			if(operator == "$lt") {
				if(!(valueToTest < compValue)) {
					eligible = false;
				};
			} else 
			if(operator == "$lt"){
				if(!(valueToTest < compValue)) {
					eligible = false;
				}
			} 
		});
	};
	//console.log("Eligibility is " + eligible);
	return eligible;
	
};
