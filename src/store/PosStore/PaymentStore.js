import { types } from "mobx-state-tree";
import { Receipt } from "./ReceiptStore";
import { Customer } from "./CustomerStore";
import { assignUUID } from "./Utils";
import DeviceInfo from "react-native-device-info";

import {
  getRows,
  openAndSyncDB,
  saveSnapshotToDB,
  syncDB,
  editFields,
} from "./DbFunctions";

let db = openAndSyncDB("payments", true);
let rowsOptions = {};

export const Payment = types
  .model("Payment", {
    _id: types.identifier(),
    date: types.Date,
    receipt: types.string,
    paid: types.number,
    type: types.optional(types.string, ""),
    deviceId: types.optional(types.string, DeviceInfo.getDeviceId()),
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Payment"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
    setDeviceId(id) {
      self.deviceId = id;
    },
    edit(data) {
      editFields(self, data);
    },
  }));

const PaymentStore = types
  .model("PaymentStore", {
    rows: types.optional(types.array(Payment), []),
    defaultPayment: types.maybe(types.reference(Payment)),
    paymentReceipt: types.maybe(types.reference(Receipt)),
    paymentCustomer: types.maybe(types.reference(Customer)),
  })
  .views(self => ({
    get amountChange() {
      const netTotal = self.paymentReceipt.netTotal;
      const paid = self.defaultPayment.paid;
      return paid - netTotal;
    },
  }))
  .actions(self => ({
    initSync(session) {
      syncDB(db, "payments", session, () => {
        if (self.rows.length === 0) {
          self.getFromDb(20);
        }
      });
    },
    destroyDb() {
      self.defaultPayment = null;
      self.paymentReceipt = null;
      self.paymentCustomer = null;

      db.destroy().then(function() {
        self.clearRows();
        db = openAndSyncDB("payments", true);
        rowsOptions = {};
      });
    },
    clearRows() {
      self.rows.clear();
    },
    add(data) {
      self.rows.push(data);
    },
    setPayment(payment) {
      self.defaultPayment = payment;
    },
    setReceipt(receipt) {
      self.paymentReceipt = receipt;
    },
    setCustomer(customer) {
      self.paymentCustomer = customer;
    },
    getFromDb(numberRows) {
      return getRows(self, db, numberRows, rowsOptions);
    },
    find(key) {
      return new Promise((resolve, reject) => {
        db
          .find({
            selector: {
              receipt: { $regex: `.*${key}.*` },
            },
          })
          .then(result => {
            if (result) {
              const { docs } = result;
              const paymentDoc = docs[0];
              const payment = Payment.create({
                receipt: key,
                _id: paymentDoc._id,
                date: paymentDoc.date,
                paid: paymentDoc.paid,
                type: paymentDoc.type,
              });
              return resolve(payment);
            }
          });
      });
    },
    findPayment(id) {
      return new Promise(function(resolve, reject) {
        db.get(id).then(doc => {
          if (doc) {
            resolve(Payment.create(JSON.parse(JSON.stringify(doc))));
          } else {
            resolve(null);
          }
        });
      });
    },
  }));

const paymentStore = PaymentStore.create({});

export default paymentStore;
