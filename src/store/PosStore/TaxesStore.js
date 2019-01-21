import { assignUUID } from "./Utils";
import { types } from "mobx-state-tree";
import { openAndSyncDB, syncDB } from "./DbFunctions";

let db = openAndSyncDB("taxes", true);
let rowsOptions = {};

export const Taxes = types
  .model("Taxes", {
    _id: types.identifier(),
    name: types.string,
    rate: types.string,
    type: types.enumeration("Type", [
      "Included in the price",
      "Added to the price",
    ]),
    option: types.enumeration("Option", [
      "Apply the tax to the new items",
      "Apply the tax to existing items",
      "Apply the tax to all new items",
    ]),
    activate: types.boolean,
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Taxes"))
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
      Object.keys(data).forEach(key => {
        if (key !== "_id") {
          self[key] = data[key];
        }
      });
    },
  }));

const TaxesStore = types
  .model("TaxesStore", {
    rows: types.optional(types.array(Taxes), []),
  })
  .actions(self => ({
    initSync(session) {
      syncDB(db, "taxes", session, () => {});
    },
    add(data) {
      self.rows.push(data);
    },
    destroyDb() {
      db.destroy().then(function() {
        db = openAndSyncDB("taxes", true);
        rowsOptions = {};
      });
    },
    edit(index, object) {
      return new Promise((resolve, reject) => {
        const initialArray = object;
        const activateValue = initialArray[index].activate;
        initialArray[index].activate = !activateValue;
        return resolve(initialArray);
      });
    },
    find(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        db.get(id).then(doc => {
          return Taxes.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    getFromDb(numberRows) {
      rowsOptions.limit = numberRows;
      rowsOptions.include_docs = true;
      db.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          rowsOptions.startKey = entries.rows[entries.rows.length - 1].id;
          rowsOptions.skip = 1;
          for (let i = 0; i < entries.rows.length; i++) {
            if (entries.rows[i].doc._id) {
              entries.rows[i].doc.dateUpdated = Date.now();
              entries.rows[i].doc.syncStatus = false;
              self.add(JSON.parse(JSON.stringify(entries.rows[i].doc)));
            }
          }
        }
      });
    },
  }));

const taxesStore = TaxesStore.create({});

export default taxesStore;
