'use strict';

// Management of all push messages received/sent

var PushDBManager = {
  db: null,
  dbReady: false,
  dbName: 'Push_DB',
  dbVersion: 1,
  dbError: function pm_dbError(errorMsg) {
    console.log('Pending Message Database Error : ' + errorMsg);
  },

  init: function pm_init(callback) {
    try {
      var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                      window.mozIndexedDB || window.msIndexedDB;
    } catch (e) {
      this.dbError(e);
      return;
    }

    if (!indexedDB) {
      this.dbError('Indexed DB is not available!!!');
      return;
    }

    try {
      var msgCallback = callback;
      var msgManager = this;
      var request = indexedDB.open(this.dbName, this.dbVersion);
      request.onsuccess = function(event) {
        msgManager.db = event.target.result;
        msgManager.dbReady = true;
        if (msgCallback != undefined) {
          msgCallback();
        }
      };

      request.onerror = function(event) {
        msgManager.dbError('Database error: ' + event.target.errorCode);
      };

      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objStore = db.createObjectStore('push_messages', { keyPath: 'timestamp' });
        objStore.createIndex('from', 'from');
      };
    } catch (ex) {
      msgManager.dbError(ex.message);
    }
  },

  getPushMessages: function pm_getMsgDB(email, callback) {
    var store = this.db.transaction('push_messages').objectStore('push_messages');
    store = store.index('from'); // receiver number.
    var boundKeyRange = email ? IDBKeyRange.only(email) : null;
    var cursorRequest = store.openCursor(boundKeyRange, 'next');
    var msg = [];
    cursorRequest.onsuccess = function onsuccess() {
      var cursor = cursorRequest.result;
      if (!cursor) {
        callback(msg);
        return;
      }
      msg.push(cursor.value);
      cursor.continue();
    }
    cursorRequest.onerror = function onerror() {
      callback(null);
    }
  },

  storePushMessage: function pm_saveToMsgDB(msg, callback) {
    var transaction = this.db.transaction('push_messages', 'readwrite');
    var store = transaction.objectStore('push_messages');
    var addRequest = store.add(msg);
    var pendingMgr = this;
    addRequest.onsuccess = function onsuccess() {
      callback(addRequest.result);
    }
    addRequest.onerror = function onerror() {
      // Execute save operation again if failed.
      window.setTimeout(
        pendingMgr.saveToMsgDB(msg, callback).bind(pendingMgr), 500);
    }
  }

};