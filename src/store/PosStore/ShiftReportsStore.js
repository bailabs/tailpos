import { types } from "mobx-state-tree";
import { Shift } from "./ShiftStore";
import { assignUUID } from "./Utils";
import { openAndSyncDB, saveSnapshotToDB, syncDB } from "./DbFunctions";

let db = openAndSyncDB("shiftreports", true);
let rowsOptions = {};

export const ShiftReports = types
  .model("ShiftReports", {
    _id: types.identifier(),
    date: types.Date,
    shift: types.string,
    status: types.string,
    shiftNumber: types.optional(types.number, 0),
    attendant: types.optional(types.string, ""),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "ShiftReports"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
  }));

const ShiftReportsStore = types
  .model("ShiftReportsStore", {
    rows: types.optional(types.array(ShiftReports), []),
    defaultReport: types.maybe(types.reference(Shift)),
    zReadingReport: types.maybe(types.reference(Shift)),
  })
  .actions(self => ({
    initSync(session) {
      syncDB(db, "shiftreports", session);
    },
    add(data) {
      self.rows.push(data);
    },
    setReport(report) {
      self.defaultReport = report;
    },
    getFromDb(numberRows) {
      rowsOptions.limit = numberRows;
      rowsOptions.include_docs = true;
      db.allDocs(rowsOptions).then(entries => {
        if (entries && entries.rows.length > 0) {
          for (let i = 0; i < entries.rows.length; i++) {
            const { doc } = entries.rows[i];
            const shiftObj = ShiftReports.create({
              _id: doc._id,
              date: doc.date,
              shift: doc.shift,
              status: doc.status,
              shiftNumber: doc.shiftNumber,
              attendant: doc.attendant,
            });
            self.add(shiftObj);
          }
        }
      });

      // db.allDocs().then(function (result){
      //   return Promise.all(result.rows.map(function (row){
      //     return db.remove(row.id,row.value.rev)
      //   }))
      // })
    },
    find(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });

      if (obj) {
        return obj;
      } else {
        db.get(id).then(doc => {
          return ShiftReports.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
  }));

const shiftReports = ShiftReportsStore.create({});

export default shiftReports;
