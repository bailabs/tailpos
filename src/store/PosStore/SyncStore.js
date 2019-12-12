import { types } from "mobx-state-tree";
import { openAndSyncDB, sync, saveSnapshotToDB } from "./DbFunctions";
import { assignUUID } from "./Utils";

let trash = openAndSyncDB("trash", true);
export const Trash = types
  .model("Trash", {
    _id: types.identifier(),
    trashId: types.optional(types.string, ""),
    table_name: types.optional(types.string, ""),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Item"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(trash, snapshot);
    },
  }));
const SyncStore = types
  .model("SyncStore", {
    rows: types.optional(types.string, "[]"),
    trashRows: types.optional(types.string, "[]"),
  })
  .actions(self => ({
    add(data) {
      let rowsData = JSON.parse(self.rows);
      rowsData.push(data);
      self.rows = JSON.stringify(rowsData);
    },
    addToTrash(data) {
      let dataObject = JSON.parse(self.trashRows);
      dataObject.push(data);
      self.trashRows = JSON.stringify(dataObject);
    },
    async forceSync() {
      self.rows = "[]";
      let databaseNames = [
        "categories",
        "items",
        "discounts",
        "attendants",
        "receipts",
        "payments",
        "shifts",
        "customers",
        "company",
      ];
      let databaseNamesUpperCase = [
        "Categories",
        "Item",
        "Discounts",
        "Attendants",
        "Receipts",
        "Payments",
        "Shifts",
        "Customer",
        "Company",
      ];
      await trash.allDocs({ include_docs: true }).then(entries => {
        if (entries && entries.rows.length > 0) {
          for (let i = 0; i < entries.rows.length; i += 1) {
            if (entries.rows[i].doc.trashId) {
              JSON.parse(self.trashRows).push(
                JSON.parse(JSON.stringify(entries.rows[i].doc)),
              );
            }
          }
        }
      });
      return new Promise(function(resolve, reject) {
        for (let x = 0; x < databaseNames.length; x += 1) {
          openAndSyncDB(databaseNames[x])
            .allDocs({ include_docs: true })
            .then(entries => {
              if (entries && entries.rows.length > 0) {
                for (let i = 0; i < entries.rows.length; i += 1) {
                  if (
                    entries.rows[i].doc.name ||
                    entries.rows[i].doc.user_name ||
                    entries.rows[i].doc.status === "completed" ||
                    entries.rows[i].doc.status === "cancelled" ||
                    entries.rows[i].doc.receipt ||
                    entries.rows[i].doc.status === "Closed"
                  ) {
                    self.add({
                      dbName: databaseNamesUpperCase[x],
                      syncObject: entries.rows[i].doc,
                    });
                  }
                }
              }
            })
            .then(result => {
              if (databaseNames.length - 1 === x) {
                resolve(self.rows);
              }
            });
        }
      });
    },
    async selectedSync() {
      self.rows = "[]";
      let databaseNames = [
        "categories",
        "items",
        "discounts",
        "attendants",
        "receipts",
        "payments",
        "shifts",
        "customers",
      ];
      let databaseNamesUpperCase = [
        "Categories",
        "Item",
        "Discounts",
        "Attendants",
        "Receipts",
        "Payments",
        "Shifts",
        "Customer",
      ];

      await trash.allDocs({ include_docs: true }).then(entries => {
        if (entries && entries.rows.length > 0) {
          for (let i = 0; i < entries.rows.length; i += 1) {
            if (entries.rows[i].doc.trashId) {
              JSON.parse(self.trashRows).push(
                JSON.parse(JSON.stringify(entries.rows[i].doc)),
              );
            }
          }
        }
      });
      return new Promise(function(resolve, reject) {
        for (let x = 0; x < databaseNames.length; x += 1) {
          openAndSyncDB(databaseNames[x])
            .allDocs({ include_docs: true })
            .then(entries => {
              if (entries && entries.rows.length > 0) {
                for (let i = 0; i < entries.rows.length; i += 1) {
                  if (
                    (entries.rows[i].doc.name ||
                      entries.rows[i].doc.user_name ||
                      entries.rows[i].doc.status === "completed" ||
                      entries.rows[i].doc.status === "cancelled" ||
                      entries.rows[i].doc.receipt ||
                      entries.rows[i].doc.status === "Closed") &&
                    entries.rows[i].doc.syncStatus === false
                  ) {
                    self.add({
                      dbName: databaseNamesUpperCase[x],
                      syncObject: entries.rows[i].doc,
                    });
                  }
                }
              }
            })
            .then(result => {
              if (databaseNames.length - 1 === x) {
                resolve(self.rows);
              }
            });
        }
      });
    },
    async syncNow(objects, type, credentials, jobStatus, store) {
      let returnResult = [];

      let trashRowsValues = self.trashRows;
      self.trashRows = "[]";
      await sync(
        objects,
        type,
        trashRowsValues,
        credentials,
        jobStatus,
        store,
      ).then(result => {
        if (result) {
          returnResult = result;
        }
      });
      return returnResult;
    },
  }));

const Sync = SyncStore.create({});

export default Sync;
