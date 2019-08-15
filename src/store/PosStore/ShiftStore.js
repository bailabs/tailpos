import { types } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import {
  saveSnapshotToDB,
  openAndSyncDB,
  syncDB,
  editFields,
} from "./DbFunctions";

let db = openAndSyncDB("shifts", true);
let rowsOptions = {};

export const Pay = types.model("Pay", {
  date: types.Date,
  amount: types.number,
  reason: types.string,
  flow: types.enumeration("Flow", ["In", "Out", "Drops"]),
});
export const OrderType = types.model("Pay", {
  amount: types.number,
  type: types.enumeration("Type", [
    "Dine-in",
    "Takeaway",
    "Delivery",
    "Online",
    "Family",
  ]),
});
export const Shift = types
  .model("Shift", {
    _id: types.identifier(),
    beginning_cash: types.maybe(types.number),
    ending_cash: types.maybe(types.number),
    short: types.maybe(types.number),
    actual_money: types.optional(types.number, 0),
    total_sales: types.optional(types.number, 0),
    total_discounts: types.optional(types.number, 0),
    total_taxes: types.optional(types.number, 0),
    shift_beginning: types.maybe(types.Date),
    shift_end: types.maybe(types.Date),
    attendant: types.optional(types.string, ""),
    status: types.optional(types.string, "Opened"),
    numberOfTransaction: types.optional(types.number, 0),
    commissions: types.optional(types.number, 0),
    pays: types.optional(types.array(Pay), []),
    orderType: types.optional(types.array(OrderType), []),
    reportType: types.optional(types.string, "XReading"),
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Shift"))
  .views(self => ({
    get shiftEnded() {
      return self.shift_end ? true : false;
    },
    get shiftStarted() {
      return self.shift_beginning ? true : false;
    },
    get totalPayOut() {
      let totalPayOut = 0;
      for (let i = 0; i < self.pays.length; i += 1) {
        if (self.pays[i].flow === "Out") {
          totalPayOut = totalPayOut + self.pays[i].amount;
        }
      }
      return totalPayOut;
    },
    get getOrderTypesTotal() {
      let totals = {
        dineInTotal: 0,
        takeawayTotal: 0,
        deliveryTotal: 0,
        onlineTotal: 0,
        familyTotal: 0,
      };
      if (self.orderType.length !== 0) {
        for (let i = 0; i < self.orderType.length; i++) {
          const { amount, type } = self.orderType[i];
          if (type === "Dine-in") {
            totals.dineInTotal = totals.dineInTotal + amount;
          } else if (type === "Takeaway") {
            totals.takeawayTotal = totals.takeawayTotal + amount;
          } else if (type === "Delivery") {
            totals.deliveryTotal = totals.deliveryTotal + amount;
          } else if (type === "Online") {
            totals.onlineTotal = totals.onlineTotal + amount;
          } else if (type === "Family") {
            totals.familyTotal = totals.familyTotal + amount;
          }
        }
        return totals;
      }
      return totals;
    },
    get totalPayIn() {
      let totalPayIn = 0;
      for (let i = 0; i < self.pays.length; i += 1) {
        if (self.pays[i].flow === "In") {
          totalPayIn = totalPayIn + self.pays[i].amount;
        }
      }
      return totalPayIn;
    },
    get totalCashSales() {
      // let totalCashSales =
      //   self.total_sales + self.total_discounts - self.total_taxes;
      return self.total_sales;
    },
    get totalNetSales() {
      let totalNetSales =
        self.total_sales - self.total_discounts - self.commissions;
      return totalNetSales;
    },
    get computeShort() {
      let shortValue = self.actual_money - self.ending_cash;
      return shortValue;
    },
    get expectedDrawer() {
      return parseInt(self.ending_cash, 10) - parseInt(self.commissions, 10);
    },
  }))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
    edit(data) {
      editFields(self, data);
    },
    addPay(pay) {
      self.pays.push(pay);
    },
    addOrderType(orderType) {
      self.orderType.push(orderType);
    },

    addNumberOfTransaction() {
      self.numberOfTransaction += 1;
    },
    addTotalSales(amount) {
      self.total_sales = self.total_sales + amount;
    },
    addTotalDiscount(amount) {
      self.total_discounts = self.total_discounts + amount;
    },
    addTotalTaxes(amount) {
      self.total_taxes = self.total_taxes + amount;
    },
    beginShift(attendant) {
      // One transaction for DB
      self.shift_beginning = Date.now();
      self.attendant = attendant;
    },
    startShift() {
      self.shift_beginning = Date.now();
    },
    endShift() {
      self.shift_end = Date.now();
    },
    closeShift(money) {
      // One transaction for DB
      self.status = "Closed";
      self.shift_end = Date.now();
      self.actual_money = parseInt(money, 10);
    },
    setBeginCash(cash) {
      self.beginning_cash = cash;
      self.ending_cash = cash;
    },
    setEndCash(cash) {
      self.ending_cash = cash;
    },
    setAttendant(attendant) {
      self.attendant = attendant;
    },
    changeStatus() {
      // self.dateUpdated = Date.now;
      //   if(self.status === "Closed"){
      //       self.syncStatus = true;
      //   }
      self.status = "Closed";
    },
    changeSyncStatus() {
      self.syncStatus = true;
    },
    changeActualMoney(money) {
      self.actual_money = parseInt(money, 10);
    },
    setType() {
      self.reportType = "ZReading";
    },
    changeShort() {
      self.short = 0;
    },
    changeValues(obj) {
      self.beginning_cash += obj.beginning_cash;
      self.ending_cash += obj.ending_cash;
      self.short += obj.short;
      self.actual_money += obj.actual_money;
      self.total_sales += obj.total_sales;
      self.total_discounts += obj.total_discounts;
      self.total_taxes += obj.total_taxes;
      self.numberOfTransaction += obj.numberOfTransaction;
    },
    minusValues(obj) {
      self.numberOfTransaction -= 1;
      self.ending_cash -= obj.total;
      self.total_sales -= obj.total;
      self.total_discounts -= obj.receipt.discountValue;
      self.total_taxes -= obj.receipt.taxesValue;
    },
    addCommission(commission) {
      self.commissions = self.commissions + commission;
      self.ending_cash = self.ending_cash - commission;
    },
  }));

const ShiftStore = types
  .model("ShiftStore", {
    defaultShift: types.maybe(types.reference(Shift)),
    zReading: types.maybe(types.reference(Shift)),
  })
  .actions(self => ({
    initSync(session) {
      syncDB(db, "shifts", session, () => {});
    },
    setShift(shift) {
      self.defaultShift = shift;
    },
    destroyDb() {
      db.destroy().then(function() {
        db = openAndSyncDB("shifts", true);
        rowsOptions = {};
        self.newShift();
      });
    },
    addPay(obj) {
      Object.keys(obj).map(key => {
        self.defaultShift.addPay(obj[key]);
      });
    },
    newShift() {
      self.defaultShift = Shift.create({});
    },
    setZReading(obj) {
      self.zReading = Shift.create({});
    },
    setZReadingFromDb(obj) {
      self.zReading = obj;
    },
    setNewValues(obj) {
      self.defaultShift.minusValues(obj);
    },
    findShift(id) {
      return new Promise(function(resolve, reject) {
        db.get(id).then(doc => {
          if (doc) {
            resolve(Shift.create(JSON.parse(JSON.stringify(doc))));
          } else {
            resolve(null);
          }
        });
      });
    },
    findCurrentShift(name) {
      db
        .createIndex({
          index: { fields: ["attendant"] },
        })
        .then(function() {
          db
            .find({
              selector: {
                attendant: { $regex: name },
                shift_end: { $regex: null },
              },
            })
            .then(result => {
              // const shiftObj = Shift.create({
              //     _id: result._id,
              //     beginning_cash: result.beginning_cash,
              //     ending_cash: result.ending_cash,
              //     shift_beginning: result.shift_beginning,
              //     shift_end: result.shift_end,
              //     attendant: result.attendant,
              //     short: result.short,
              //     actual_money: result.actual_money,
              //     numberOfTransaction: result.numberOfTransaction,
              //     total_sales: result.total_sales,
              //     total_discounts: result.total_discounts,
              //     total_taxes: result.total_taxes,
              //     status: result.status,
              //     reportType: result.reportType,
              //     dateUpdated: Date.now(),
              //     syncStatus: false,
              // });
              // self.setShift(shiftObj);
            });
        });
    },
    getFromDb(numberRows, attendantName) {
      rowsOptions.limit = numberRows;
      rowsOptions.include_docs = true;
      db.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          let check = false;
          for (let i = 0; i < entries.rows.length; i++) {
            const { doc } = entries.rows[i];
            if (entries.rows[i].doc.shift_end === null) {
              check = true;

              const shiftObj = Shift.create({
                _id: doc._id,
                beginning_cash: doc.beginning_cash,
                ending_cash: doc.ending_cash,
                shift_beginning: doc.shift_beginning,
                shift_end: doc.shift_end,
                attendant: doc.attendant,
                short: doc.short,
                commissions: doc.commissions ? doc.commissions : 0,
                actual_money: doc.actual_money,
                numberOfTransaction: doc.numberOfTransaction,
                total_sales: doc.total_sales,
                total_discounts: doc.total_discounts,
                total_taxes: doc.total_taxes,
                status: doc.status,
                reportType: doc.reportType,
                dateUpdated: Date.now(),
                syncStatus: false,
              });

              Object.keys(doc.pays).map(key => {
                shiftObj.addPay(doc.pays[key]);
              });
              Object.keys(doc.orderType).map(key => {
                shiftObj.addOrderType(doc.orderType[key]);
              });
              self.setShift(shiftObj);
            }
            if (entries.rows[i].doc.reportType === "ZReading") {
              const zReadingObj = Shift.create({
                _id: entries.rows[i].doc._id,
                beginning_cash: entries.rows[i].doc.beginning_cash,
                ending_cash: entries.rows[i].doc.ending_cash,
                shift_beginning: entries.rows[i].doc.shift_beginning,
                shift_end: entries.rows[i].doc.shift_end,
                attendant: entries.rows[i].doc.attendant,
                short: entries.rows[i].doc.short,
                actual_money: entries.rows[i].doc.actual_money,
                commissions: entries.rows[i].doc.commissions
                  ? entries.rows[i].doc.commissions
                  : 0,
                numberOfTransaction: entries.rows[i].doc.numberOfTransaction,
                total_sales: entries.rows[i].doc.total_sales,
                total_discounts: entries.rows[i].doc.total_discounts,
                total_taxes: entries.rows[i].doc.total_taxes,
                status: entries.rows[i].doc.status,
                reportType: entries.rows[i].doc.reportType,
                dateUpdated: Date.now(),
                syncStatus: false,
              });
              Object.keys(entries.rows[i].doc.pays).map(key => {
                zReadingObj.addPay(entries.rows[i].doc.pays[key]);
              });
              Object.keys(entries.rows[i].doc.orderType).map(key => {
                zReadingObj.addOrderType(entries.rows[i].doc.orderType[key]);
              });
              self.setZReadingFromDb(zReadingObj);
            }
          }
          if (!check) {
            self.newShift();
            // self.zReading = self.defaultShift
          }
        } else {
          self.newShift();

          // self.zReading = self.defaultShift
        }
      });

      // db.allDocs().then(function (result){
      //   return Promise.all(result.rows.map(function (row){
      //     return db.remove(row.id,row.value.rev)
      //   }))
      // })
    },
    async find(key) {
      return await db.get(key).then(report => {
        const reportObject = Shift.create({
          _id: report._id,
          beginning_cash: report.beginning_cash,
          ending_cash: report.ending_cash,
          shift_beginning: report.shift_beginning,
          shift_end: report.shift_end,
          total_sales: report.total_sales,
          actual_money: report.actual_money,
          numberOfTransaction: report.numberOfTransaction,
          total_discounts: report.total_discounts,
          total_taxes: report.total_taxes,
          attendant: report.attendant,
          status: report.status,

          commissions: report.commissions,
          reportType: report.reportType,
          dateUpdated: report.dateUpdated,
          syncStatus: report.syncStatus,
        });
        Object.keys(report.pays).map(index => {
          reportObject.addPay(report.pays[index]);
        });
        Object.keys(report.orderType).map(index => {
          reportObject.addOrderType(report.orderType[index]);
        });

        return Promise.resolve(reportObject);
      });
    },
  }));

const shiftStore = ShiftStore.create({});

export default shiftStore;
