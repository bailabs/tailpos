import { types, destroy } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import {
  deleteObject,
  editFields,
  getRows,
  openAndSyncDB,
  saveSnapshotToDB,
  syncDB,
} from "./DbFunctions";

let db = openAndSyncDB("discounts", true);
let rowsOptions = {};

let replicationHandler = null;

export const Discount = types
  .model("Discount", {
    _id: types.identifier(),
    name: types.string,
    value: types.number,
    percentageType: types.string,
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Discount"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
    edit(data) {
      editFields(self, data);
    },
    delete() {
      deleteObject(self, db);
    },
    changeStatus() {
      // self.dateUpdated = Date.now;
      self.syncStatus = true;
    },
  }));

const Store = types
  .model("DiscountStore", {
    rows: types.optional(types.array(Discount), []),
    selectedDiscount: types.maybe(types.reference(Discount)),
  })
  .views(self => ({
    get isEmptyRows() {
      return self.rows.length === 0 ? true : false;
    },
  }))
  .actions(self => ({
    initSync(session) {
      replicationHandler = syncDB(db, "discounts", session);
      replicationHandler.on("complete", function() {
        if (self.rows.length === 0) {
          self.getFromDb(20);
        }
      });
    },
    destroyDb() {
      db.destroy().then(function() {
        self.clear();
        self.unsetDiscount();
        rowsOptions = {};
        db = openAndSyncDB("discounts", true);
      });
    },
    add(data) {
      if (data._id === undefined) {
        self.rows.push(data);
      } else {
        let obj = self.rows.find(rowData => rowData._id === data._id);
        if (!obj) {
          self.rows.push(data);
        }
      }
    },
    setDiscount(discount) {
      self.selectedDiscount = discount;
    },
    unsetDiscount() {
      self.selectedDiscount = null;
    },
    find(id) {
      const obj = self.rows.find(discount => {
        return discount._id === id;
      });

      if (obj) {
        return obj;
      } else {
        db
          .find({
            selector: {
              _id: { $regex: `.*${id}.*` },
            },
          })
          .then(result => {
            const { docs } = result;
            if (docs.length > 0) {
              return Discount.create(
                JSON.parse(JSON.stringify(result.docs[0])),
              );
            } else {
              return null;
            }
          });
      }
    },
    findFromRows(id) {
      for (var i = 0; i < self.rows.length; i++) {
        if (self.rows[i]._id) {
          return self.rows[i];
        }
      }
      return null;
    },
    delete(row) {
      destroy(row);
    },
    clear() {
      self.rows.clear();
    },
    getFromDb(numberRows) {
      return getRows(self, db, numberRows, rowsOptions);
      // db.allDocs().then(function (result){
      //     return Promise.all(result.rows.map(function (row){
      //         return db.remove(row.id,row.value.rev)
      //     }))
      // })
    },
    replaceRows(rows) {
      self.rows.replace(rows);
    },
    search(name) {
      db
        .find({
          selector: {
            name: { $regex: `.*${name}.*` },
          },
        })
        .then(result => {
          const { docs } = result;
          const replacement = docs.map(item =>
            JSON.parse(JSON.stringify(item)),
          );
          if (replacement) {
            self.replaceRows(replacement);
          } else {
            self.replaceRows([]);
          }
        });
    },
  }));

const Discounts = Store.create({});

export default Discounts;
