import { types, destroy } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import {
  openAndSyncDB,
  saveSnapshotToDB,
  editFields,
  deleteObject,
  getRows,
  syncDB,
} from "./DbFunctions";

let db = openAndSyncDB("roles", true);
let rowsOptions = {};

let replicationHandler = null;

export const Role = types
  .model("Role", {
    _id: types.identifier(),
    role: types.string,
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Role"))
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
  .model("RoleStore", {
    rows: types.optional(types.array(Role), []),
    roleSelected: types.maybe(types.reference(Role)),
  })
  .actions(self => ({
    delete(row) {
      destroy(row);
    },
    initSync(session) {
      replicationHandler = syncDB(db, "roles", session);
      replicationHandler.on("complete", function() {
        if (self.rows.length === 0) {
          self.getFromDb(20);
        }
      });
    },
    destroyDb() {
      db.destroy().then(function() {
        self.clearRows();
        db = openAndSyncDB("roles", true);
        rowsOptions = {};
      });
    },

    add(data) {
      self.rows.push(data);
    },
    find(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });
      if (obj) {
        return obj;
      } else {
        db.get(id).then(doc => {
          return Role.create(JSON.parse(JSON.stringify(doc)));
        });
      }
      return null;
    },
    setRole(obj) {
      self.roleSelected = obj;
    },
    unselectRole() {
      self.roleSelected = null;
    },
    getFromDb(numberRows) {
      return getRows(self, db, numberRows, rowsOptions);
    },
  }));

const Roles = Store.create({});

export default Roles;
