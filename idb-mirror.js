/**
 * Optionale IndexedDB-Spiegelung des zuletzt gespeicherten JSON-Zustands (Phase R).
 * Primär bleibt localStorage in state.js; IDB dient als Backup bei Quota oder Recovery.
 */
(function () {
  const DB_NAME = 'botc_storyteller_idb';
  const STORE = 'snap';
  const VERSION = 1;

  function openDb(callback) {
    if (typeof indexedDB === 'undefined') {
      callback(new Error('no idb'));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = function () {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = function () { callback(null, req.result); };
    req.onerror = function () { callback(req.error || new Error('idb open')); };
  }

  window.BOTC_IDB_mirror = {
    put: function (jsonString) {
      if (typeof jsonString !== 'string' || !jsonString.length) return;
      openDb(function (err, db) {
        if (err || !db) return;
        try {
          const tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).put(jsonString, 'state');
          tx.oncomplete = function () { try { db.close(); } catch (_) {} };
        } catch (_) {
          try { db.close(); } catch (_) {}
        }
      });
    }
  };
})();
