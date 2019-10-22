import { types, getRoot, destroy } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import { Alert } from "react-native";
import PouchDB from "pouchdb-react-native";

import SQLite from "react-native-sqlite-2";
import SQLiteAdapterFactory from "pouchdb-adapter-react-native-sqlite";
const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(SQLiteAdapter);
const db = new PouchDB("printers.db", { adapter: "react-native-sqlite" });
const dbc = new PouchDB("company.db", { adapter: "react-native-sqlite" });
const dbb = new PouchDB("bluetoothscanner.db", {
  adapter: "react-native-sqlite",
});
const dbd = new PouchDB("sync.db", {
  adapter: "react-native-sqlite",
});
PouchDB.plugin(require("pouchdb-find"));
PouchDB.plugin(require("pouchdb-upsert"));

let rowsOptions = {};

export const Printer = types
  .model("Printer", {
    _id: types.identifier(),
    name: types.string,
    macAddress: types.string,
    defaultPrinter: types.boolean,
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Printer"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
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
    },
    edit(data) {
      Object.keys(data).forEach(function(key) {
        if (!(key === "_id")) {
          self[key] = data[key];
        }
      });
    },
    delete() {
      db.get(self._id).then(doc => {
        db.remove(doc);
      });
      getRoot(self).delete(self);
    },
  }));
export const Company = types
  .model("Company", {
    _id: types.identifier(),
    name: types.string,
    header: types.string,
    footer: types.string,
      changeNoReceipts: types.string,
    companyLanguage: types.string,
    tax: types.optional(types.string, "0"),
    countryCode: types.optional(types.string, "PHP"),
    currencyDisable: types.optional(types.boolean, false),
    hideCategory: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Company"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      let updateObj = false;
      dbc.upsert(snapshot._id, function(doc) {
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
    },
    edit(data) {
      Object.keys(data).forEach(function(key) {
        if (!(key === "_id")) {
          self[key] = data[key];
        }
      });
    },
    delete() {
      dbc.get(self._id).then(doc => {
        dbc.remove(doc);
      });
      getRoot(self).delete(self);
    },
  }));

export const BluetoothScanner = types
  .model("BluetoothScanner", {
    _id: types.identifier(),
    status: types.boolean,
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "BluetoothScanner"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      let updateObj = false;
      dbb.upsert(snapshot._id, function(doc) {
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
    },
    edit(data) {
      Object.keys(data).forEach(function(key) {
        if (!(key === "_id")) {
          self[key] = data[key];
        }
      });
    },
    delete() {
      dbb.get(self._id).then(doc => {
        dbb.remove(doc);
      });
      getRoot(self).delete(self);
    },
  }));

export const SyncInfo = types
  .model("SyncInfo", {
    _id: types.identifier(),
    url: types.optional(types.string, ""),
    user_name: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "SyncInfo"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      let updateObj = false;
      dbd.upsert(snapshot._id, function(doc) {
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
    },
    edit(data) {
      Object.keys(data).forEach(function(key) {
        if (!(key === "_id")) {
          self[key] = data[key];
        }
      });
    },

    delete() {
      dbd.get(self._id).then(doc => {
        dbd.remove(doc);
      });
      getRoot(self).delete(self);
    },
  }));

const Store = types
  .model("PrinterStore", {
    rows: types.optional(types.array(Printer), []),
    companySettings: types.optional(types.array(Company), []),
    bluetooth: types.optional(types.array(BluetoothScanner), []),
    sync: types.optional(types.array(SyncInfo), []),
    foundDevices: types.optional(types.string, "[]"),
    defaultPrinter: types.optional(types.string, ""),
  })
  .actions(self => ({
    add(value) {
      self.rows.push(value);
    },
    addCompany(value) {
      self.companySettings.push(value);
    },
    addBluetoothScannerStatus(value) {
      self.bluetooth.push({
        _id: value._id,
        status: value.status,
      });
    },
    addSync(value) {
      self.sync.push(value);
    },
    addFoundDevices(value) {
      self.foundDevices = JSON.stringify(value);
    },
    remove(value) {
      Alert.alert("");
    },
    delete(row) {
      destroy(row);
    },
    resetFoundDevices() {
      self.foundDevices = "[]";
    },
    find(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        db.get(id).then(doc => {
          return Printer.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    findCompany(id) {
      let obj = self.companySettings.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        dbc.get(id).then(doc => {
          return Company.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    findSync(id) {
      let obj = self.sync.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        dbd.get(id).then(doc => {
          return SyncInfo.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    findBluetoothScanner(id) {
      let obj = self.bluetooth.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        dbb.get(id).then(doc => {
          return BluetoothScanner.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    setDefaultPrinter(value) {
      // Alert.alert("", JSON.stringify(value)
      self.defaultPrinter = JSON.stringify(value);
    },
    getFromDb(numberRows) {
      rowsOptions.limit = numberRows;
      rowsOptions.include_docs = true;
      db.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          rowsOptions.startKey = entries.rows[entries.rows.length - 1].id;
          rowsOptions.skip = 1;
          for (let i = 0; i < entries.rows.length; i++) {
            if (entries.rows[i].doc.name) {
              self.add(JSON.parse(JSON.stringify(entries.rows[i].doc)));
            }
          }
        }
      });
      dbc.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          rowsOptions.startKey = entries.rows[entries.rows.length - 1].id;
          rowsOptions.skip = 1;

          for (let i = 0; i < entries.rows.length; i++) {
            if (entries.rows[i].doc._id) {
              if (!entries.rows[i].doc.companyLanguage) {
                entries.rows[i].doc.companyLanguage = "en";
              }
              if (!entries.rows[i].doc.changeNoReceipts) {
                entries.rows[i].doc.changeNoReceipts = "1";
              }
              self.addCompany(JSON.parse(JSON.stringify(entries.rows[i].doc)));
            }
          }
          if (entries.rows.length <= 0) {
            self.addCompany({
              name: "",
                changeNoReceipts: "1",
              header: "",
              footer: "",
              companyLanguage: "en",
              tax: "0",
              countryCode: "PHP",
              currencyDisable: false,
            });
          }
        } else {
          self.addCompany({
            name: "",
              changeNoReceipts: "1",
              header: "",
            companyLanguage: "en",
            footer: "",
            tax: "0",
            countryCode: "PHP",
            currencyDisable: false,
          });
        }
      });
      dbb.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          rowsOptions.startKey = entries.rows[entries.rows.length - 1].id;
          rowsOptions.skip = 1;
          for (let i = 0; i < entries.rows.length; i++) {
            if (entries.rows[i].doc._id) {
              self.addBluetoothScannerStatus(
                JSON.parse(JSON.stringify(entries.rows[i].doc)),
              );
            }
          }
        }
      });
      dbd.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          rowsOptions.startKey = entries.rows[entries.rows.length - 1].id;
          rowsOptions.skip = 1;
          for (let i = 0; i < entries.rows.length; i++) {
            if (entries.rows[i].doc._id) {
              self.addSync(JSON.parse(JSON.stringify(entries.rows[i].doc)));
            }
          }
        }
      });
    },
  }));

const Printers = Store.create({});

export default Printers;
