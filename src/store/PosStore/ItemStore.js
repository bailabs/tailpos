import { types, destroy, detach } from "mobx-state-tree";
import { assignUUID } from "./Utils";
import {
  deleteObject,
  editFields,
  getRows,
  openAndSyncDB,
  saveSnapshotToDB,
  syncDB,
  sync,
} from "./DbFunctions";

let db = openAndSyncDB("items", true);
// let favoriteDb = openAndSyncDB("favorites", true);
let catDb = openAndSyncDB("categories");
let rowsOptions = {};

let replicationHandler = null;

export const Item = types
  .model("Item", {
    _id: types.identifier(),
    name: types.union(types.string, types.number),
    soldBy: types.string,
    price: types.optional(types.number, 0),
    sku: types.optional(types.string, ""),
    barcode: types.union(types.string, types.number),
    colorAndShape: types.optional(types.string, ""),
    colorOrImage: types.optional(types.string, ""),
    imagePath: types.optional(types.string, ""),
    favorite: types.optional(types.string, ""),
    category: types.optional(types.string, ""),
    taxes: types.optional(types.string, ""),
    dateUpdated: types.optional(types.Date, Date.now),
    syncStatus: types.optional(types.boolean, false),
  })
  .preProcessSnapshot(snapshot => assignUUID(snapshot, "Item"))
  .views(self => ({
    get color() {
      let itemColor = "";
      if (this.colorAndShape) {
        itemColor = JSON.parse(this.colorAndShape)[0].color;
      }
      if (itemColor === "gray" && self.category !== "No Category") {
        catDb
          .get(self.category)
          .then(function(obj) {
            return JSON.parse(obj.colorAndShape)[0].color;
          })
          .catch(() => {
            return itemColor;
          });
      } else {
        return itemColor;
      }
    },
    get taxesValue() {
      let itemTaxes = [];
      if (self.taxes) {
        itemTaxes = JSON.parse(this.taxes);
        return itemTaxes;
      } else {
        return itemTaxes;
      }
    },
    get shape() {
      if (this.colorAndShape) {
        return JSON.parse(this.colorAndShape)[0].shape;
      } else {
        return "";
      }
    },
  }))
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
    setFavorite() {
      self.favorite = "true";
    },
    setUnfavorite() {
      self.favorite = "false";
    },
  }));
//Favorites
const Store = types
  .model("ItemStore", {
    filtered: types.optional(types.boolean, false),
    rows: types.optional(types.array(Item), []),
    favoriteRows: types.optional(types.array(Item), []),
    queriedRows: types.optional(types.array(Item), []),
    categoryLengths: types.optional(types.string, "[]"),
    selectedItem: types.maybe(types.reference(Item)),
    duplicateBarcodeObject: types.optional(types.string, ""),
    barcodeValue: types.optional(types.string, ""),
    itemsLength: types.optional(types.number, 0),
    favoritesLength: types.optional(types.number, 0),
    itemsToBeSynced: types.optional(types.array(Item), []),
  })
  .actions(self => ({
    initSync(session) {
      replicationHandler = syncDB(db, "items", session);
      replicationHandler.on("complete", function() {
        if (self.rows.length === 0) {
          self.getFromDb(20);
        }
      });
    },
    destroyDb() {
      db.destroy().then(function() {
        self.clearRows();
        db = openAndSyncDB("items", true);
        rowsOptions = {};
      });
    },
    addCategoryLength(len) {
      const cat = JSON.parse(self.categoryLengths);
      cat.push(len);
      self.categoryLengths = JSON.stringify(cat);
    },
    addBulk(data) {
      db.bulkDocs(data);
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
    addFavorite(data) {
      self.favoriteRows.push(data);
    },
    addToQueriedRows(data) {
      self.queriedRows.push(data);
    },
    detachItemFromFavorites(item) {
      for (let i = 0; i < self.queriedRows.length; i += 1) {
        if (item._id === self.queriedRows[i]._id) {
          detach(self.queriedRows[i]);
        }
      }
    },
    updateLengthObjects(obj) {
      if (obj) {
        let objectLength = JSON.parse(self.categoryLengths);
        var length = false;
        for (let i = 0; i < objectLength.length; i += 1) {
          if (obj === objectLength[i].categoryId) {
            objectLength[i].categoryId = obj;
            objectLength[i].categoryLength += 1;
            length = true;
          }
        }
        if (!length) {
          self.addCategoryLength({
            categoryId: obj,
            categoryLength: 1,
          });
        } else {
          self.categoryLengths = JSON.stringify(objectLength);
        }
      }
    },
    updateLengthObjectsDelete(obj) {
      if (obj) {
        let objectLength = JSON.parse(self.categoryLengths);

        for (let i = 0; i < objectLength.length; i += 1) {
          if (obj === objectLength[i].categoryId) {
            objectLength[i].categoryId = obj;
            objectLength[i].categoryLength -= 1;
          }
        }

        self.categoryLengths = JSON.stringify(objectLength);
      }
    },
    setDuplicateBarcodeObject(values) {
      self.duplicateBarcodeObject = values;
    },
    find(id) {
      let obj = self.rows.find(data => {
        return data._id === id;
      });
      if (obj) {
        return obj;
      } else {
        // db.get(id).then(doc => {
        //   if(doc){
        //       return Item.create(JSON.parse(JSON.stringify(doc)));
        //   } else {
        //       return null;
        //   }
        // });
        db
          .find({
            selector: {
              _id: { $regex: `.*${id}.*` },
            },
          })
          .then(result => {
            const { docs } = result;
            if (docs.length > 0) {
              return Item.create(JSON.parse(JSON.stringify(result.docs[0])));
            } else {
              return null;
            }
          });
      }
    },
    findName(name, price) {
      return new Promise(function(resolve, reject) {
        self.filtered = true;
        db
          .createIndex({
            index: { fields: ["name"] },
          })
          .then(function() {
            db
              .find({
                selector: {
                  name: { $regex: name },
                  price: { $regex: price },
                },
              })
              .then(result => {
                const categoryItemsReplacement = result.docs.map(item =>
                  JSON.parse(JSON.stringify(item)),
                );
                if (categoryItemsReplacement) {
                  resolve(categoryItemsReplacement);
                }
              });
          });
      });
    },
    setBarcodeValue(data) {
      self.barcodeValue = data;
    },
    clearBarcode() {
      self.barcodeValue = "";
    },
    setItem(item) {
      self.selectedItem = item;
    },
    unselectItem() {
      self.selectedItem = null;
    },
    findFromRows(id) {
      for (var i = 0; i < self.rows.length; i++) {
        if (self.rows[i]._id) {
          return self.rows[i];
        }
      }
      return null;
    },
    get() {
      return self.rows;
    },
    delete(row) {
      destroy(row);
    },
    clearLine(index) {
      detach(self.rows[index]);
    },
    clear() {
      for (var i = 0; i < self.rows.length; i++) {
        detach(self.rows[i]);
      }
    },
    clearRows() {
      self.rows.clear();
    },
    clearQueriedRows() {
      self.queriedRows.clear();
    },
    getCategoryLengths() {
      return JSON.parse(self.categoryLengths);
    },
    getFromDb(numberRows) {
      return getRows(self, db, numberRows, rowsOptions);
    },
    getFromFavoriteDb() {
      return new Promise(function(resolve, reject) {
        self.filtered = true;
        db
          .createIndex({
            index: { fields: ["favorite"] },
          })
          .then(function() {
            db
              .find({
                selector: {
                  favorite: { $regex: "true" },
                },
              })
              .then(result => {
                const categoryItemsReplacement = result.docs.map(item =>
                  JSON.parse(JSON.stringify(item)),
                );
                if (categoryItemsReplacement) {
                  self.replaceRows(categoryItemsReplacement);
                  resolve(categoryItemsReplacement);
                } else {
                  self.replaceRows([]);
                  resolve([]);
                }
              });
          });
      });
    },
    favorites() {
      self.filtered = true;
      db
        .createIndex({
          index: { fields: ["favorite"] },
        })
        .then(function() {
          db
            .find({
              selector: {
                favorite: { $regex: "true" },
              },
            })
            .then(result => {
              const categoryItemsReplacement = result.docs.map(item =>
                JSON.parse(JSON.stringify(item)),
              );
              if (categoryItemsReplacement) {
                self.replaceRows(categoryItemsReplacement);
              } else {
                self.replaceRows([]);
              }
            });
        });
    },
    setLength(data) {
      self.itemsLength = data;
    },
    updateLength() {
      self.itemsLength = self.itemsLength + 1;
    },
    updateLengthDelete() {
      self.itemsLength = self.itemsLength - 1;
    },
    getLengthItemsFromDb() {
      catDb.allDocs({ include_docs: true, attachments: true }).then(entries => {
        if (entries && entries.rows.length > 0) {
          for (let i = 0; i < entries.rows.length; i += 1) {
            if (entries.rows[i].doc.name) {
              self
                .itemsExistsBasedOnCategory(entries.rows[i].doc._id)
                .then(result => {
                  self.addCategoryLength({
                    categoryId: entries.rows[i].doc._id,
                    categoryLength: result,
                  });
                });
            }
          }
        }
      });
      db.allDocs({ include_docs: true }).then(entries => {
        let count = 0;
        if (entries && entries.rows.length > 0) {
          for (let i = 0; i < entries.rows.length; i += 1) {
            if (entries.rows[i].doc.name) {
              count += 1;
            }
          }
          self.setLength(count);
        }
      });
    },
    itemsExistsBasedOnCategory(categoryId) {
      return new Promise((resolve, reject) =>
        db
          .find({
            selector: {
              category: { $regex: `.*${categoryId}.*` },
            },
          })
          .then(result => {
            resolve(result.docs.length);
          }),
      );
    },
    itemsBasedOnCategorySelected(categoryId) {
      if (categoryId === "All") {
        self.filtered = false;
        self.queriedRows.clear();
      } else {
        self.filtered = true;

        db
          .createIndex({
            index: { fields: ["category"] },
          })
          .then(function() {
            db
              .find({
                selector: {
                  category: { $regex: `.*${categoryId}.*` },
                },
              })
              .then(result => {
                const categoryItemsReplacement = result.docs.map(item =>
                  JSON.parse(JSON.stringify(item)),
                );
                if (categoryItemsReplacement) {
                  self.replaceRows(categoryItemsReplacement);
                } else {
                  self.replaceRows([]);
                }
              });
          });
      }
    },
    replaceRows(rows) {
      self.queriedRows.replace(rows);
    },
    replaceFavoriteRows(rows) {
      self.favoriteRows.replace(rows);
    },
    syncItems(rows) {
      self.itemsToBeSynced.replace(rows);
    },
    search(name, categoryValue) {
      db
        .createIndex({
          index: { fields: ["name"] },
        })
        .then(function() {
          db
            .find({
              selector: {
                name: { $regex: `.*${name}.*` },
              },
            })
            .then(result => {
              const { docs } = result;
              const itemsReplacement = docs.map(item =>
                JSON.parse(JSON.stringify(item)),
              );
              if (itemsReplacement) {
                self.replaceRows(itemsReplacement);
              } else {
                self.replaceRows([]);
              }
            });
        });
    },
    searchByBarcode(barcode) {
      return new Promise(function(resolve, reject) {
        db
          .find({
            selector: {
              barcode: { $regex: `.*${barcode}.*` },
            },
          })
          .then(result => {
            resolve(result.docs[0]);
          });
      });
    },
    syncNowItems(objects) {
      sync(db, "Items", objects);
    },

    notSyncedItems() {
      return new Promise(function(resolve, reject) {
        db
          .find({
            selector: {
              syncStatus: { $regex: false },
            },
          })
          .then(result => {
            const itemsReplacement = result.docs.map(item =>
              JSON.parse(JSON.stringify(item)),
            );
            resolve(itemsReplacement);
          });
      });
    },
  }));

const Items = Store.create({});

export default Items;
