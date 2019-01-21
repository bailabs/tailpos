import { types } from "mobx-state-tree";

import { openAndSyncDB, saveSnapshotToDB, editFields } from "./DbFunctions";

import { assignUUID } from "./Utils";

let db = openAndSyncDB("sessions", false);

export const Token = types
  .model("Token", {
    _id: types.identifier(),
    token: types.string,
    db_name: types.string,
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Token"))
  .actions(self => ({
    postProcessSnapshot(snapshot) {
      saveSnapshotToDB(db, snapshot);
    },
    delete() {
      db.get(self._id).then(doc => db.remove(doc));
    },
    edit(data) {
      editFields(self, data);
    },
  }));

const Store = types
  .model("TokenStore", {
    currentToken: types.maybe(types.reference(Token)),
  })
  .actions(self => ({
    setCurrentToken(token) {
      self.currentToken = token;
    },
    getCurrentToken() {
      return new Promise((resolve, reject) => {
        if (self.currentToken) {
          return resolve(self.currentToken);
        } else {
          db.allDocs({ include_docs: true }).then(results => {
            if (results.total_rows > 0) {
              const { doc } = results.rows[0];
              const token = Token.create({
                _id: doc._id,
                token: doc.token,
                db_name: doc.db_name,
              });
              self.setCurrentToken(token);
              return resolve(self.currentToken);
            } else {
              return resolve(null);
            }
          });
        }
      });
    },
    createAndSetToken(data) {
      const token = Token.create({
        token: data.token,
        db_name: data.db_name,
      });
      self.currentToken = token;
      return self.currentToken;
    },
  }));

const TokenStore = Store.create({});

export default TokenStore;
