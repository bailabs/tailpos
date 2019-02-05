import { types, destroy, detach } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import {
  deleteObject,
  editFields,
  getRows,
  openAndSyncDB,
  saveSnapshotToDB,
  syncDB,
} from "./DbFunctions";

let db = openAndSyncDB("customers", true);
let rowsOptions = {};

let replicationHandler = {};

export const Customer = types
  .model("Customer", {
    _id: types.identifier(),
    name: types.string,
    email: types.string,
    phoneNumber: types.string,
    note: types.string,
    dateUpdated: Date.now(),
    syncStatus: false,
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Customer"))
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
  }));

const Store = types
  .model("CustomerStore", {
    rows: types.optional(types.array(Customer), []),
    searchedCustomers: types.optional(types.array(Customer), []),
    searchStatus: types.optional(types.string, "false"),
  })
  .actions(self => ({
    initSync(session) {
      replicationHandler = syncDB(db, "customers", session);
      replicationHandler.on("complete", function() {
        if (self.rows.length === 0) {
          self.getFromDb(20);
        }
      });
    },
    add(data) {
      self.rows.push(data);
    },
    replaceSearchedCustomers(replacement) {
      self.searchedCustomers.replace(replacement);
    },
    searchStatusMethod(booleanValue) {
      self.searchStatus = booleanValue;
    },
    async find(id) {
      let obj = await self.rows.find(data => {
        return data._id === id;
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
              return Customer.create(
                JSON.parse(JSON.stringify(result.docs[0])),
              );
            } else {
              return null;
            }
          });
        // await db.get(id).then(doc => {
        //   if(doc){
        //       return Customer.create(JSON.parse(JSON.stringify(doc)));
        //   } else {
        //       return null;
        //   }
        // });
      }
    },
    delete(data) {
      destroy(data);
    },
    removeCustomer(customer) {
      detach(customer);
    },
    removeCustomerTemporary() {
      self.rows.clear();
    },
    getFromDb(numberRows) {
      return getRows(self, db, numberRows, rowsOptions);
    },
    checkDuplication(customer) {
      db
        .find({
          selector: {
            name: { $eq: customer },
          },
        })
        .then(result => {
          const { docs } = result;
          return docs.length;
        });
    },
    search(name) {
      if (name) {
        return new Promise((resolve, reject) => {
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
                return resolve(replacement);
              }
            });
        });
      }
    },
  }));

const Customers = Store.create({});

export default Customers;
