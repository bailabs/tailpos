import PouchDB from "pouchdb-react-native";
import SQLite from "react-native-sqlite-2";
import SQLiteAdapterFactory from "pouchdb-adapter-react-native-sqlite";
import { getRoot } from "mobx-state-tree";
import { unformat } from "accounting-js";
import FrappeFetch from "react-native-frappe-fetch";
import { Toast } from "native-base";
var validUrl = require("valid-url");

export function openAndSyncDB(dbName, withSync = false) {
  const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
  PouchDB.plugin(SQLiteAdapter);
  const db = new PouchDB(dbName + ".db", { adapter: "react-native-sqlite" });
  PouchDB.plugin(require("pouchdb-find"));
  PouchDB.plugin(require("pouchdb-upsert"));
  return db;
}

export function syncDB(db, dbName, session) {
  // Server URL
  const url = `https://${session.db_name}:${session.token}@db.tailpos.com/${
    session.db_name
  }-${dbName}`;
  const opts = { live: true, retry: true };

  // Sync from
  return db.replicate.from(url).on("complete", function(info) {
    db.sync(url, opts);
  });
}
export function sync(
  jsonObject,
  type,
  trashObj,
  credentials,
  jobStatus,
  store,
) {
  // if (credentials.url !== undefined && credentials.user_name !== undefined && credentials.password !== undefined) {
  if (validUrl.isWebUri(credentials.url.toLowerCase())) {
    return FrappeFetch.createClient({
      url: credentials.url.toLowerCase(),
      username: credentials.user_name,
      password: credentials.password,
    })

      .then(responseLog => {
        const { Client } = FrappeFetch;
        return Client.postApi(
          "tailpos_sync.sync_pos.sync_data",
          // "frappe.handler.ping",
          {
            tailposData: JSON.parse(jsonObject),
            trashObject: JSON.parse(trashObj),
            deviceId: credentials.deviceId,
            typeOfSync: type,
          },
        );
      })
      .catch(error => {
        store.stateStore.setIsNotSyncing();

        if (!jobStatus) {
          Toast.show({
            text: "Unable to sync",
            type: "danger",
            duration: 5000,
          });
        }
      })

      .then(response => response.json())
      .then(responseJson => {
        return responseJson.message.data;
      });
  } else {
    store.stateStore.setIsNotSyncing();
    Toast.show({
      text: "Invalid URL",
      type: "danger",
      duration: 5000,
    });
  }
}

export function changeItemsStatusValue(table) {
  table.allDocs({ include_docs: true }).then(entries => {
    if (entries && entries.rows.length > 0) {
      for (var i = 0; i < entries.rows.length; i++) {
        if (entries.rows[i].doc.name) {
          const entry = entries.rows[i].doc;
          const objectValue = {
            name: entry.name,
            soldBy: entry.soldBy,
            price: unformat(entry.price),
            sku: entry.sku,
            barcode: entry.barcode,
            category: entry.category,
            colorAndShape: JSON.stringify(entry.colorAndShape),
            taxes: JSON.stringify(entry.taxes),
            dateUpdated: entry.dateUpdated,
            syncStatus: true,
          };
          editFields(entry, objectValue);
        }
      }
    }
  });
}
export function saveSnapshotToDB(db, snapshot) {
  let updateObj = false;
  db.upsert(snapshot._id, function(doc) {
    if (!doc._id) {
      doc = snapshot;
      updateObj = true;
    } else {
      Object.keys(snapshot).forEach(function(key) {
        if (!(key === "_rev")) {
          if (doc[key] !== snapshot[key]) {
            doc[key] = snapshot[key];
            updateObj = true;
          }
        }
      });
    }
    if (updateObj) {
      return doc;
    } else {
      return updateObj;
    }
  });
}

export function editFields(obj, data) {
  Object.keys(data).forEach(function(key) {
    if (!(key === "_id")) {
      obj[key] = data[key];
    }
  });
}

export function deleteObject(obj, db) {
  db.get(obj._id).then(doc => {
    db.remove(doc);
  });
  getRoot(obj).delete(obj);
}

export function getRows(obj, db, numberRows, rowsOptions) {
  return new Promise((resolve, reject) => {
    rowsOptions.limit = numberRows;
    rowsOptions.include_docs = true;
    db.allDocs(rowsOptions).then(entries => {
      if (entries && entries.rows.length > 0) {
        rowsOptions.startkey = entries.rows[entries.rows.length - 1].id;
        rowsOptions.skip = 1;
        for (var i = 0; i < entries.rows.length; i++) {
          if (entries.rows[i].doc.name || entries.rows[i].doc.role) {
            // entries.rows[i].doc.dateUpdated = Date.now();
            // entries.rows[i].doc.syncStatus = false;
            obj.add(JSON.parse(JSON.stringify(entries.rows[i].doc)));
          }
        }
      }
    });
    resolve(obj.rows);
  });
}
