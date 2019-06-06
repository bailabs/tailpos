import { types, destroy, getRoot } from "mobx-state-tree";
import DeviceInfo from "react-native-device-info";
import { Customer } from "./CustomerStore";
import { assignUUID } from "./Utils";
import {
  editFields,
  openAndSyncDB,
  saveSnapshotToDB,
  syncDB,
} from "./DbFunctions";

let db = openAndSyncDB("receipts", true);
let customerDB = openAndSyncDB("customers");
// let rowsOptions = {};

let replicationHandler = null;

export const ReceiptLine = types
  .model("ReceiptLine", {
    _id: types.identifier(),
    item: types.string, // identifier item
    item_name: types.maybe(types.string), // history purposes
    sold_by: types.optional(types.string, ""),
    price: types.number,
    qty: types.number,
    commission_details: types.optional(types.string, "[]"),
    discount_rate: types.optional(types.number, 0),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "ReceiptLine"))
  .views(self => ({
    get total() {
      if (self.discount_rate > 0) {
        return (
          self.price * self.qty -
          self.price * self.qty * (self.discount_rate / 100)
        );
      }
      return self.price * self.qty;
    },
  }))
  .actions(self => ({
    setQuantity(qty) {
      self.qty = qty;
    },
    setPrice(price) {
      self.price = price;
    },
    setCommissionDetails(values) {
      self.commission_details = values;
    },
    changeCommissionStatus(name) {
      let commission_details = JSON.parse(self.commission_details);
      for (let i = 0; i < commission_details.length; i++) {
        if (commission_details[i].commission_attendant_name === name) {
          commission_details[i].status = true;
        }
      }
      self.setCommissionDetails(JSON.stringify(commission_details));
    },
    setDiscountRate(amount) {
      self.discount_rate = amount;
    },

    edit(data) {
      editFields(self, data);
    },
    delete() {
      getRoot(self).deleteLine(self);
    },
  }));

export const Receipt = types
  .model("Receipt", {
    _id: types.identifier(),
    date: types.Date,
    status: types.optional(
      types.enumeration("Status", [
        "current",
        "completed",
        "draft",
        "cancelled",
      ]),
      "draft",
    ),
    reason: types.optional(types.string, ""),
    customer: types.string,
    lines: types.optional(types.array(ReceiptLine), []),
    discountName: types.optional(types.string, ""),
    discount: types.optional(types.string, ""),
    discountValue: types.optional(types.number, 0),
    receiptNumber: types.optional(types.number, 0),
    discountType: types.optional(types.string, "percentage"),
    taxesValue: types.optional(types.string, ""),
    taxesAmount: types.optional(types.number, 0),
    shift: types.optional(types.string, ""),
    deviceId: types.optional(types.string, DeviceInfo.getDeviceId()),
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
    attendant: types.optional(types.string, ""),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Receipt"))
  .views(self => ({
    get grandTotal() {
      if (self.lines.length !== 0) {
        let total = 0;
        for (let i = 0; i < self.lines.length; i++) {
          total = total + self.lines[i].total;
        }
        if (self.taxesValue > 0) {
          total = total + self.get_tax_total;
        }
        return total;
      }
      return 0;
    },
    get discounts() {
      let total = 0;
      if (self.lines.length !== 0) {
        for (let i = 0; i < self.lines.length; i++) {
          if (self.lines[i].discount_rate > 0) {
            total +=
              self.lines[i].price *
              self.lines[i].qty *
              (self.lines[i].discount_rate / 100);
          }
        }
      }
      if (self.discountType === "percentage") {
        return self.discountValue * self.grandTotal + total;
      } else if (self.discountType === "fixDiscount") {
        return self.discountValue + total;
      }
    },
    get netTotal() {
      let discountValue = self.discountValue;
      if (self.discountType === "percentage") {
        discountValue = discountValue * self.grandTotal;
      }

      let netTotal = self.grandTotal - discountValue;

      if (netTotal <= 0) {
        netTotal = 0;
      }

      return netTotal;
    },
    get grandQuantity() {
      if (self.lines.length !== 0) {
        let total = 0;
        for (let i = 0; i < self.lines.length; i++) {
          const { qty } = self.lines[i];
          total = total + qty;
        }
        return total;
      }
      return 0;
    },
    get subtotal() {
      if (self.lines.length !== 0) {
        let total = 0;
        for (let i = 0; i < self.lines.length; i++) {
          total = total + self.lines[i].total;
        }
        return total;
      }
      return 0;
    },
    get get_tax_total() {
      if (self.lines.length !== 0) {
        let total = 0;
        for (let i = 0; i < self.lines.length; i++) {
          total = total + self.lines[i].total;
        }

        return parseFloat(total, 10) * (parseFloat(self.taxesValue, 10) / 100);
      }
      return 0;
    },
    get linesLength() {
      return self.lines.length;
    },
  }))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
    edit(data) {
      editFields(self, data);
    },
    changeTaxesAmount(taxAmount) {
      self.taxesAmount = taxAmount;
    },
    changeTaxes(taxAmount) {
      self.taxesValue = taxAmount ? taxAmount : "0";
    },
    changeStatusCommission(name) {
      for (let i = 0; i < self.lines.length; i += 1) {
        let objectReceipt = JSON.parse(self.lines[i].commission_details);
        for (let x = 0; x < objectReceipt.length; x += 1) {
          if (objectReceipt[x].commission_attendant_name === name) {
            self.lines[i].changeCommissionStatus(name);
          }
        }
      }
    },
    add(line, isStackItem) {
      let resLine = null;

      if (isStackItem) {
        const lastItemId = self.lines.length - 1;
        if (lastItemId >= 0) {
          if (self.lines[lastItemId].item === line.item) {
            resLine = self.lines[lastItemId];
          }
        }
      } else {
        resLine = self.lines.find(
          findLine =>
            findLine.item === line.item && findLine.price === line.price,
        );
      }

      if (resLine) {
        resLine.qty = resLine.qty + line.qty;
      } else {
        self.lines.push(line);
      }

      return self.lines.length - 1;
    },
    cancelDiscount() {
      self.discount = "";
      self.discountName = "";
      self.discountValue = 0;
      self.discountType = "percentage";
    },
    addReceiptDiscount(discount) {
      if (discount.percentageType === "percentage") {
        self.discountName = discount.name;
        self.discount = discount._id;
        self.discountValue = discount.value / 100;
        self.discountType = discount.percentageType;
      } else if (discount.percentageType === "fixDiscount") {
        self.discountName = discount.name;
        self.discount = discount._id;
        self.discountValue = discount.value;
        self.discountType = discount.percentageType;
      }
    },
    addOnTheFlyReceiptDiscount(discount) {
      if (discount.percentageType === "percentage") {
        self.discount = "";
        self.discountName = "On The Fly Discount";
        self.discountValue = discount.value / 100;
        self.discountType = discount.percentageType;
      } else if (discount.percentageType === "fixDiscount") {
        self.discount = "";
        self.discountName = "On The Fly Discount";
        self.discountValue = discount.value;
        self.discountType = discount.percentageType;
      }
    },
    find(id) {
      return self.lines.filter(line => line._id === id)[0];
    },
    setShift(shift) {
      self.shift = shift;
    },
    setDeviceId(id) {
      self.deviceId = id;
    },
    // edit(data) {
    //   Object.keys(data).forEach(key => {
    //     if (key !== "_id") {
    //       self[key] = data[key];
    //     }
    //   });
    // },
    deleteLine(line) {
      // I don't understand how MobX works here.
      const index = self.lines.indexOf(line);

      self.lines.splice(index, 1);
    },
    delete() {
      ReceiptStore.delete(self); // Reference
    },
    clear() {
      self.discount = "";
      self.discountValue = 0;
      self.taxesValue = "0";

      // Yay!
      self.lines.splice(0, self.lines.length);
    },
    completed(attendant) {
      self.attendant = attendant;

      self.status = "completed";
    },
    cancelled(obj) {
      self.status = "cancelled";
      self.dateUpdated = Date.now();
      self.syncStatus = false;
    },
    changeReason(reasonVal) {
      self.reason = reasonVal;
    },
    changeStatus() {
      // self.dateUpdate = Date.now;
      self.syncStatus = true;
    },
  }));

const Store = types
  .model("ReceiptStore", {
    rows: types.optional(types.array(types.reference(Receipt)), []),
    defaultCustomer: types.optional(types.reference(Customer), ""),
    defaultReceipt: types.maybe(types.reference(Receipt)),
    previousReceipt: types.maybe(types.reference(Receipt)),
    selectedLine: types.maybe(types.reference(ReceiptLine)),
    lastScannedBarcode: types.optional(types.string, ""),
    commissions: types.optional(types.string, "[]"),
  })
  .actions(self => ({
    initSync(session) {
      replicationHandler = syncDB(db, "receipts", session);
      replicationHandler.on("complete", function() {
        if (self.rows.length === 0) {
          // self.getFromDb(20);
        }
      });
    },
    destroyDb() {
      self.defaultCustomer = "";
      self.defaultReceipt = null;
      self.selectedLine = null;
      self.lastScannedBarcode = "";

      db.destroy().then(function() {
        self.clearRows();
        db = openAndSyncDB("receipts", true);
        // rowsOptions = {};
      });
    },
    clearRows() {
      self.rows.clear();
    },
    emptyCommissions() {
      self.commissions = "[]";
    },
    addCommissions(objectCommission) {
      const cat = JSON.parse(self.commissions);
      cat.push(objectCommission);
      self.commissions = JSON.stringify(cat);
    },
    updateCommissions(obj) {
      if (obj) {
        let existing = false;
        let objectLength = JSON.parse(self.commissions);

        for (let i = 0; i < objectLength.length; i += 1) {
          if (obj.commission_attendant_name === objectLength[i].name) {
            objectLength[i].amount =
              parseFloat(objectLength[i].amount, 10) +
              parseFloat(obj.commission_amount, 10);
            objectLength[i].status = obj.status;
            existing = true;
            self.commissions = JSON.stringify(objectLength);
          }
        }
        if (!existing) {
          self.addCommissions({
            name: obj.commission_attendant_name,
            amount: parseFloat(obj.commission_amount, 10),
            status: obj.status,
          });
        }
      }
    },
    updateCommissionsStatus(obj) {
      if (obj) {
        let objectLength = JSON.parse(self.commissions);
        for (let i = 0; i < objectLength.length; i += 1) {
          if (obj.name === objectLength[i].name) {
            objectLength[i].status = true;
            self.commissions = JSON.stringify(objectLength);
          }
        }
      }
    },
    setPreviuosReceiptToNull() {
      self.previousReceipt = null;
    },
    setPreviousReceipt(obj) {
      self.previousReceipt = obj;
    },
    setCustomer(customer) {
      self.defaultCustomer = customer;
    },
    setReceipt(receipt) {
      self.defaultReceipt = receipt;
    },
    async setDefaultCustomer() {
      return await customerDB
        .find({
          selector: {
            name: { $eq: "Default customer" },
          },
        })
        .then(result => {
          const { docs } = result;
          if (docs.length === 0) {
            const newCustomer = Customer.create({
              name: "Default customer",
              email: "default@bai.ph",
              phoneNumber: "09213887721",
              note: "Default note",
            });
            self.setCustomer(newCustomer);
          } else {
            const customer = Customer.create({
              _id: docs[0]._id,
              name: docs[0].name,
              email: docs[0].email,
              phoneNumber: docs[0].phoneNumber,
              note: docs[0].note,
            });
            self.setCustomer(customer);
          }
          return Promise.resolve("Success");
        });
    },
    setReceiptLine(line) {
      self.selectedLine = line;
    },
    add(data) {
      self.rows.push(data);
    },
    findReceipt(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        db.get(id).then(doc => {
          return Receipt.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    delete(row) {
      const index = self.rows.indexOf(row);
      self.rows.splice(index, 1);
      destroy(row);
    },
    newReceipt(tax) {
      self.numberOfReceipts().then(response => {
        const newReceipt = Receipt.create({
          date: Date.parse(new Date().toDateString()),
          status: "current",
          taxesValue: tax ? tax : "0",
          customer: self.defaultCustomer._id,
          receiptNumber: parseInt(response, 10) + 1,
          dateUpdated: Date.now(),
          syncStatus: false,
        });
        self.setReceipt(newReceipt);
      });
    },
    getReceiptsForItemSalesReport(date) {
      return new Promise((resolve, reject) => {
        db
          .find({
            selector: {
              date: {
                $regex: `.*${Date.parse(new Date(date).toDateString())}.*`,
              },
              status: { $eq: "completed" },
            },
          })

          .then(result => {
            const { docs } = result;
            return resolve(docs);
          });
      });
    },

    currentReceipt(tax) {
      if (!self.defaultReceipt || self.defaultReceipt.status === "completed") {
        db
          .find({
            selector: {
              status: { $eq: "current" },
            },
          })
          .then(async result => {
            const { docs } = result;
            let receiptNumber = await self.numberOfReceipts();
            // if no docs
            if (docs.length === 0) {
              const newReceipt = Receipt.create({
                date: Date.parse(new Date().toDateString()),
                status: "current",
                taxesValue: tax ? tax : "0",
                customer: self.defaultCustomer._id,
                receiptNumber: parseInt(receiptNumber, 10) + 1,
                dateUpdated: Date.now(),
                syncStatus: false,
              });

              self.setReceipt(newReceipt);
            } else {
              const receipt = Receipt.create({
                _id: docs[0]._id,
                date: Date.parse(new Date(docs[0].date).toDateString()),
                status: docs[0].status,
                reason: docs[0].reason,
                customer: docs[0].customer,
                taxesValue:
                  parseFloat(docs[0].taxesValue) > 0 ? docs[0].taxesValue : tax,
                taxesAmount: docs[0].taxesAmount > 0 ? docs[0].taxesAmount : 0,
                discount: docs[0].discount,
                discountName: docs[0].discountName,
                discountValue: docs[0].discountValue,
                discountType: docs[0].discountType,
                receiptNumber: docs[0].receiptNumber,
                dateUpdated: docs[0].dateUpdated,
                syncStatus: docs[0].syncStatus,
                attendant: docs[0].attendant,
              });
              const { lines } = docs[0];
              Object.keys(lines).map(key => {
                receipt.add(lines[key]);
              });
              self.setReceipt(receipt);
            }
            return self.defaultReceipt;
          });
      }
      if (self.rows.length === 0) {
        self.getFromDb(20);
      }
    },
    unselectReceiptLine() {
      self.selectedLine = null;
    },
    setLastScannedBarcode(barcodeValue) {
      self.lastScannedBarcode = barcodeValue;
    },
    getShiftReceipts(shift) {
      return new Promise((resolve, reject) => {
        db
          .find({
            selector: {
              shift: { $regex: `.*${shift}.*` },
            },
          })
          .then(result => {
            const { docs } = result;
            return resolve(docs);
          });
      });
    },
    async getFromDb(numberRows) {
      let maximumReceiptNumber = (await self.numberOfReceipts()) - 1;
      let minimumReceiptNumber = maximumReceiptNumber - 20;

      await db
        .find({
          selector: {
            receiptNumber: {
              $gt: minimumReceiptNumber,
              $lte: maximumReceiptNumber,
            },
          },
        })
        .then(async result => {
          if (result && result.docs.length > 0) {
            for (let x = 0; x < result.docs.length; x++) {
              const doc = result.docs[x];

              const receiptObj = Receipt.create({
                _id: doc._id,
                date: Date.parse(new Date(doc.date).toDateString()),
                status: doc.status,
                reason: doc.reason,
                customer: doc.customer,
                taxesValue: doc.taxesValue.toString(),
                taxesAmount: doc.taxesAmount > 0 ? doc.taxesAmount : 0,
                receiptNumber: doc.receiptNumber,
                discountName: doc.discountName,
                discount: doc.discount,
                discountValue: doc.discountValue,
                discountType: doc.discountType,
                dateUpdated: doc.dateUpdated,
                syncStatus: doc.syncStatus,
                attendant: doc.attendant,
              });
              Object.keys(doc.lines).map(key => {
                receiptObj.add(doc.lines[key]);
              });
              self.add(receiptObj);
            }
          }
        });
    },
    async find(key) {
      return await db.get(key).then(receipt => {
        const receiptObject = Receipt.create({
          _id: receipt._id,
          date: receipt.date,
          status: receipt.status,
          customer: receipt.customer,
          taxesValue:
            receipt.taxesValue !== undefined || receipt.taxesValue !== null
              ? receipt.taxesValue
              : "0",
          taxesAmount: receipt.taxesAmount > 0 ? receipt.taxesAmount : 0,
          discountName: receipt.discountName,
          discount: receipt.discount,
          discountType: receipt.discountType,
          discountValue: receipt.discountValue,
          receiptNumber: receipt.receiptNumber,
          dateUpdated: receipt.dateUpdated,
          syncStatus: receipt.syncStatus,
          attendant: receipt.attendant,
        });
        Object.keys(receipt.lines).map(index => {
          receiptObject.add(receipt.lines[index]);
        });
        return Promise.resolve(receiptObject);
      });
    },
    numberOfReceipts() {
      return new Promise((resolve, reject) => {
        db.allDocs().then(entries => {
          return resolve(entries.total_rows);
        });
      });
    },
  }));

const ReceiptStore = Store.create({});

export default ReceiptStore;
