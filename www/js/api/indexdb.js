'use strict';

var Indexdb = (function() {
	var Indexdb = function(dbName, version, storeMap, callback) {
		this.db = undefined;
		this.init(dbName, version, storeMap, callback);
	}
	Indexdb.prototype = {
		init:function(dbName, version, storeMap, callback) {
			var request = indexedDB.open(dbName, version);
			request.onupgradeneeded = function(event) {
				for (var storeName in storeMap) {
					var store = event.target.result.createObjectStore(storeName, {keyPath:storeMap[storeName].key, autoIncrement:storeMap[storeName].increment});
					for (var i = 0; i < storeMap[storeName].store.length; i++) {
						store.createIndex(storeMap[storeName].store[i].name, storeMap[storeName].store[i].name, storeMap[storeName].store[i].option);
					}
					if (storeMap[storeName].data) {
						for (var i = 0; i < storeMap[storeName].data.length; i++) {
							store.put(storeMap[storeName].data[i]);
						}
					}
				}
			}.bind(this);
			request.onsuccess = function(event) {
				this.db = event.target.result;
				callback && callback();
			}.bind(this);
			request.onerror = function(event) {
				console.log('failure Indexdb.init');
			}.bind(this);
		}, 
		create:function(storeMap) {
			for (var storeName in storeMap) {
				var store = this.db.createObjectStore(storeName, {keyPath:storeMap[storeName].key, autoIncrement:storeMap[storeName].increment});
				for (var i = 0; i < storeMap[storeName].store.length; i++) {
					store.createIndex(storeMap[storeName].store[i].name, storeMap[storeName].store[i].name, storeMap[storeName].store[i].option);
				}
			}
		}, 
		delete:function(storeArray) {
			for (var i = 0; i < storeArray.length; i++) {
				this.db.objectStoreNames.contains(storeArray[i]) && this.db.deleteObjectStore(storeArray[i]);
			}
		}, 
		next:function(storeName, id, callback) {
			if (storeName && id) {
				var transaction = this.db.transaction(storeName, 'readonly');
				var store = transaction.objectStore(storeName);
				var request = store.index(id).openCursor(undefined, 'prev');
				request.onsuccess = function(event) {
					callback && callback(event.target.result ? event.target.result.value[id] + 1 : 1);
				}.bind(this);
				request.onerror = function(event) {
					console.log('failure Indexdb.sequence');
				}.bind(this);
			}
		}, 
		get:function(storeName, key, value, callback) {
			if (storeName && key && value) {
				var transaction = this.db.transaction(storeName, 'readonly');
				var store = transaction.objectStore(storeName);
				var request = store.index(key).get(value);
				request.onsuccess = function(event) {
					callback && callback(event.target.result);
				}.bind(this);
				request.onerror = function(event) {
					console.log('failure Indexdb.get');
				}.bind(this);
			} else {
				callback && callback();
			}
		}, 
		select:function(storeMap, callback) {
			var transaction = this.db.transaction(Object.keys(storeMap), 'readonly');
			for (var storeName in storeMap) {
				var store = transaction.objectStore(storeName);
				var request = !storeMap[storeName] ? store.openCursor() : 
					store.index(storeMap[storeName].index).openCursor(storeMap[storeName].range, storeMap[storeName].sort);
				request.onsuccess = function(event) {
					callback && callback(event.target.result);
					event.target.result && event.target.result.continue();
				}.bind(this);
				request.onerror = function(event) {
					console.log('failure Indexdb.select');
				}.bind(this);
			}
		}, 
		update:function(storeMap, callback) {
			var transaction = this.db.transaction(Object.keys(storeMap), 'readwrite');
			for (var storeName in storeMap) {
				var store = transaction.objectStore(storeName);
				if (storeMap[storeName]) {
					for (var i = 0; i < storeMap[storeName].length; i++) {
						if ($.type(storeMap[storeName][i]) === 'object') {
							store.put(storeMap[storeName][i]);
						} else {
							store.delete(storeMap[storeName][i]);
						}
					}
				} else {
					store.clear();
				}
			}
			transaction.oncomplete = function() {
				callback && callback();
			}.bind(this);
			transaction.onerror = function() {
				console.log('failure Indexdb.update');
			}.bind(this);
		}
	};
	return Indexdb;
})();
