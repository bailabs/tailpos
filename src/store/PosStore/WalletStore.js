import { assignUUID } from "./Utils";
import { types } from "mobx-state-tree";
import { openAndSyncDB, syncDB } from "./DbFunctions";

let db = openAndSyncDB("wallet", true);
let rowsOptions = {};

export const Wallet = types
  .model("Wallet", {
    _id: types.identifier(),
    wallet_card_number: types.string,
    prepaid_balance: types.optional(types.number, 0),
    credit_limit: types.optional(types.number, 0),
    expiry_date: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Wallet"))
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

const WalletStore = types
  .model("WalletStore", {
    rows: types.optional(types.array(Wallet), []),
  })
  .actions(self => ({
    initSync(session) {
      syncDB(db, "wallet", session, () => {});
    },
    add(data) {
      self.rows.push(data);
    },
    destroyDb() {
      db.destroy().then(function() {
        db = openAndSyncDB("wallet", true);
        rowsOptions = {};
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
          return Wallet.create(JSON.parse(JSON.stringify(doc)));
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

const walletStore = WalletStore.create({});

export default walletStore;
