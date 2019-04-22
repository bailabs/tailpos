import { Toast } from "native-base";

export function syncObjectValues(status, store, jobStatus) {
  let syncStoreMethod = "";
  if (status === "forceSync") {
    syncStoreMethod = store.syncStore.forceSync();
  }
  if (status === "sync") {
    syncStoreMethod = store.syncStore.selectedSync();
  }
  syncStoreMethod.then(async result => {
    if (
      JSON.parse(result).length > 0 ||
      JSON.parse(store.syncStore.trashRows).length > 0
    ) {
      store.syncStore
        .syncNow(result, status, store.printerStore.sync[0], jobStatus)

        .then(async resultFromErpnext => {
          if (resultFromErpnext) {
            for (let x = 0; x < resultFromErpnext.data.length; x += 1) {
              if (resultFromErpnext.data[x].tableNames === "Categories") {
                await categorySync(resultFromErpnext.data[x], store);
              } else if (resultFromErpnext.data[x].tableNames === "Customer") {
                await customerSync(resultFromErpnext.data[x], store);
              } else if (resultFromErpnext.data[x].tableNames === "Discounts") {
                await discountSync(resultFromErpnext.data[x], store);
              } else if (
                resultFromErpnext.data[x].tableNames === "Attendants"
              ) {
                await attendantSync(resultFromErpnext.data[x], store);
              }
              // else if (resultFromErpnext.data[x].tableNames === "Item") {
              //   await itemSync(resultFromErpnext.data[x], store);
              // }
            }

            if (resultFromErpnext.deleted_documents.length > 0) {
              for (
                let x = 0;
                x < resultFromErpnext.deleted_documents.length;
                x += 1
              ) {
                await deleteRecords(
                  resultFromErpnext.deleted_documents[x],
                  store,
                );
              }
            }
          }

          for (let xx = 0; xx < resultFromErpnext.data.length; xx += 1) {
            if (resultFromErpnext.data[xx].tableNames === "Item") {
              await itemSync(resultFromErpnext.data[xx], store);
            }
          }
          await changeSyncStatusValue(result, store);
          if (!jobStatus) {
            Toast.show({
              text: "Sync successful",
              duration: 3000,
            });
          }
        });
    } else {
      if (!jobStatus) {
        Toast.show({
          text: "Already up to date",
          type: "danger",
          duration: 3000,
        });
      }
    }
  });
}

export async function itemSync(itemObject, store) {
  let itemObjectResult = await store.itemStore.find(itemObject.syncObject.id);
  let categoryId = "";

  if (itemObject.syncObject.category !== "") {
    let categoryIds = await store.categoryStore.searchLengthName(
      itemObject.syncObject.category,
    );
    if (categoryIds) {
      categoryId = categoryIds._id;
      store.itemStore.updateLengthObjects(categoryIds._id);
    }
  } else {
    categoryId = "No Category";
  }

  if (itemObjectResult) {
    itemObjectResult.edit({
      _id: itemObject.syncObject.id,
      name:
        itemObject.syncObject.description !== null
          ? itemObject.syncObject.description
          : "",
      soldBy:
        itemObject.syncObject.stock_uom !== null
          ? itemObject.syncObject.stock_uom
          : "",
      price:
        itemObject.syncObject.standard_rate !== null
          ? itemObject.syncObject.standard_rate
          : 0,
      sku: itemObject.syncObject.sku !== null ? itemObject.syncObject.sku : "",
      barcode:
        itemObject.syncObject.barcode === null ||
        itemObject.syncObject.barcode === undefined
          ? ""
          : itemObject.syncObject.barcode,
      colorAndShape: JSON.stringify([
        {
          color:
            itemObject.syncObject.color !== null
              ? itemObject.syncObject.color.toLowerCase().replace(" ", "")
              : "gray",
          shape:
            itemObject.syncObject.shape !== null
              ? itemObject.syncObject.shape.toLowerCase()
              : "square",
        },
      ]),
      colorOrImage:
        itemObject.syncObject.color_or_image !== null
          ? itemObject.syncObject.color_or_image
          : "",
      imagePath:
        itemObject.syncObject.image !== null ? itemObject.syncObject.image : "",
      favorite:
        itemObject.syncObject.favorite !== null
          ? itemObject.syncObject.favorite
          : "",
      category:
        categoryId === null || categoryId === undefined ? "" : categoryId,
      taxes: "[]",
      dateUpdated: Date.now(),
      syncStatus: true,
    });
  } else {

    var objecct_to_add = {
        name:
            itemObject.syncObject.description !== null
                ? itemObject.syncObject.description
                : "",
        soldBy:
            itemObject.syncObject.stock_uom !== null
                ? itemObject.syncObject.stock_uom === "Nos" ? "Each" : itemObject.syncObject.stock_uom
                : "",
        price:
            itemObject.syncObject.standard_rate !== null
                ? itemObject.syncObject.standard_rate
                : 0,
        sku: itemObject.syncObject.sku !== null ? itemObject.syncObject.sku : "",
        barcode:
            itemObject.syncObject.barcode !== null && itemObject.syncObject.barcode !== undefined
                ? itemObject.syncObject.barcode
                : "",
        colorAndShape: JSON.stringify([
            {
                color:
                    itemObject.syncObject.color !== null
                        ? itemObject.syncObject.color.toLowerCase().replace(" ", "")
                        : "gray",
                shape:
                    itemObject.syncObject.shape !== null
                        ? itemObject.syncObject.shape.toLowerCase()
                        : "square",
            },
        ]),
        colorOrImage:
            itemObject.syncObject.color_or_image !== null
                ? itemObject.syncObject.color_or_image
                : "",
        imagePath:
            itemObject.syncObject.image !== null ? itemObject.syncObject.image : "",
        favorite:
            itemObject.syncObject.favorite !== null
                ? itemObject.syncObject.favorite
                : "",
        category: categoryId,
        taxes: "[]",
        dateUpdated: Date.now(),
        syncStatus: itemObject.syncObject.id !== null ? true : false,
    }
    itemObject.syncObject.id !== null ? objecct_to_add._id = itemObject.syncObject.id : null

      store.itemStore.add(objecct_to_add);
    itemObject.syncObject.category !== null
      ? store.itemStore.updateLengthObjects(itemObject.syncObject.category)
      : null;
    itemObject.syncObject.category !== null ||
    itemObject.syncObject.category === null
      ? store.itemStore.updateLength()
      : null;
  }
}
export async function categorySync(categoryObject, store) {
  const { id, description, color, shape } = categoryObject.syncObject;

  await store.categoryStore.find(id).then(categoryObjectResult => {
    if (categoryObjectResult !== null) {
      categoryObjectResult.edit({
        _id: id,
        name: description !== null ? description : "",
        colorAndShape: JSON.stringify([
          {
            color: color !== null ? color.toLowerCase() : "gray",
            shape: shape !== null ? shape.toLowerCase() : "square",
          },
        ]),
        dateUpdated: Date.now(),
        syncStatus: true,
      });
    } else {
      store.categoryStore.add({
        _id: id !== null ? id : "",
        name: description !== null ? description : "",
        colorAndShape: JSON.stringify([
          {
            color: color !== null ? color.toLowerCase() : "gray",
            shape: shape !== null ? shape.toLowerCase() : "square",
          },
        ]),
        dateUpdated: Date.now(),
        syncStatus: true,
      });
    }
  });
}
export async function discountSync(discountObject, store) {
  let discountObjectResult = await store.discountStore.find(
    discountObject.syncObject.id,
  );
  if (discountObjectResult) {
    discountObjectResult.edit({
      _id:
        discountObject.syncObject.id !== null
          ? discountObject.syncObject.id
          : "",
      name:
        discountObject.syncObject.description !== null
          ? discountObject.syncObject.description
          : "",
      value:
        discountObject.syncObject.value !== null
          ? discountObject.syncObject.value
          : 0,
      percentageType:
        discountObject.syncObject.percentagetype !== null
          ? discountObject.syncObject.percentagetype
          : "percentage",
      dateUpdated: Date.now(),
      syncStatus: true,
    });
  } else {
    store.discountStore.add({
      _id:
        discountObject.syncObject.id !== null
          ? discountObject.syncObject.id
          : "",
      name:
        discountObject.syncObject.description !== null
          ? discountObject.syncObject.description
          : "",
      value:
        discountObject.syncObject.value !== null
          ? discountObject.syncObject.value
          : 0,
      percentageType:
        discountObject.syncObject.percentagetype !== null
          ? discountObject.syncObject.percentagetype
          : "percentage",
      dateUpdated: Date.now(),
      syncStatus: true,
    });
  }
}

export async function attendantSync(attendantObject, store) {
  let attendantObjectResult = await store.attendantStore.find(
    attendantObject.syncObject.id,
  );
  if (attendantObjectResult) {
    attendantObjectResult.edit({
      _id: attendantObject.syncObject.id,
      user_name:
        attendantObject.syncObject.user_name !== null
          ? attendantObject.syncObject.user_name
          : "",
      pin_code:
        attendantObject.syncObject.pin_code !== null
          ? attendantObject.syncObject.pin_code
          : "",
      role:
        attendantObject.syncObject.role !== null
          ? attendantObject.syncObject.role
          : "Cashier",
      dateUpdated: Date.now(),
      syncStatus: true,
    });
  } else {
    store.attendantStore.add({
      _id:
        attendantObject.syncObject.id !== null
          ? attendantObject.syncObject.id
          : "",
      user_name:
        attendantObject.syncObject.user_name !== null
          ? attendantObject.syncObject.user_name
          : "",
      pin_code:
        attendantObject.syncObject.pin_code !== null
          ? attendantObject.syncObject.pin_code
          : "",
      role:
        attendantObject.syncObject.role !== null
          ? attendantObject.syncObject.role
          : "Cashier",
      dateUpdated: Date.now(),
      syncStatus: true,
    });
  }
}

export async function customerSync(customerObject, store) {
  if (customerObject.syncObject.id !== null) {
    const customerObjectResult = await store.customerStore.find(
      customerObject.syncObject.id,
    );

    if (customerObjectResult) {
      customerObjectResult.edit({
        _id: customerObject.syncObject.id,
        name:
          customerObject.syncObject.customer_name !== null
            ? customerObject.syncObject.customer_name
            : "",
        email:
          customerObject.syncObject.email !== null
            ? customerObject.syncObject.email
            : "",
        phoneNumber:
          customerObject.syncObject.phonenumber !== null
            ? customerObject.syncObject.phonenumber
            : "Cashier",
        note:
          customerObject.syncObject.note !== null
            ? customerObject.syncObject.note
            : "Cashier",
        dateUpdated: Date.now(),
        syncStatus: true,
      });
    } else {
      store.customerStore.add({
        _id: customerObject.syncObject.id,
        name:
          customerObject.syncObject.customer_name !== null
            ? customerObject.syncObject.customer_name
            : "",
        email:
          customerObject.syncObject.email !== null
            ? customerObject.syncObject.email
            : "",
        phoneNumber:
          customerObject.syncObject.phonenumber !== null
            ? customerObject.syncObject.phonenumber
            : "Cashier",
        note:
          customerObject.syncObject.note !== null
            ? customerObject.syncObject.note
            : "Cashier",
        dateUpdated: Date.now(),
        syncStatus: true,
      });
    }
  }
}

export async function changeSyncStatusValue(data, store) {
  let dataValue = JSON.parse(data);
  if (dataValue.length > 0) {
    for (let x = 0; x < dataValue.length; x += 1) {
      if (dataValue[x].dbName === "Item") {
        await changeValue(dataValue[x], store.itemStore, "Item");
      } else if (dataValue[x].dbName === "Categories") {
        await changeValue(dataValue[x], store.categoryStore, "Categories");
      } else if (dataValue[x].dbName === "Discounts") {
        await changeValue(dataValue[x], store.discountStore, "Discounts");
      } else if (dataValue[x].dbName === "Attendants") {
        await changeValue(dataValue[x], store.attendantStore, "Attendants");
      } else if (dataValue[x].dbName === "Receipts") {
        await changeValue(dataValue[x], store.receiptStore, "Receipts");
      } else if (dataValue[x].dbName === "Shifts") {
        await changeValue(dataValue[x], store.shiftStore, "Shifts");
      } else if (dataValue[x].dbName === "Payments") {
        await changeValue(dataValue[x], store.paymentStore, "Payments");
      } else if (dataValue[x].dbName === "Customer") {
        await changeValue(dataValue[x], store.customerStore, "Customer");
      }
    }
  }
}

export async function changeValue(changeObject, store, dbType) {
  if (changeObject) {
    let objectToBeEdit = "";

    if (dbType === "Receipts") {
      objectToBeEdit = await store.findReceipt(changeObject.syncObject._id);
    } else if (dbType === "Shifts") {
      objectToBeEdit = await store.findShift(changeObject.syncObject._id);
    } else if (dbType === "Payments") {
      objectToBeEdit = await store.findPayment(changeObject.syncObject._id);
    } else {
      objectToBeEdit = await store.find(changeObject.syncObject._id);
    }

    if (objectToBeEdit && dbType !== "Receipts") {
      objectToBeEdit.edit({
        syncStatus: true,
      });
    } else if (objectToBeEdit && dbType === "Receipts") {
      objectToBeEdit.changeStatus();
    }
  }
}

export async function deleteRecords(deletedObject, store) {
  if (deletedObject) {
    if (deletedObject._id !== null) {
      let objectToBeDeleted = "";
      if (deletedObject.tableNames === "Items") {
        objectToBeDeleted = await store.itemStore.find(deletedObject._id);
      } else if (deletedObject.tableNames === "Categories") {
        objectToBeDeleted = await store.categoryStore.find(deletedObject._id);
      } else if (deletedObject.tableNames === "Discounts") {
        objectToBeDeleted = await store.discountStore.find(deletedObject._id);
      } else if (deletedObject.tableNames === "Attendants") {
        objectToBeDeleted = await store.attendantStore.find(deletedObject._id);
      } else if (deletedObject.tableNames === "Customer") {
        objectToBeDeleted = await store.customerStore.find(deletedObject._id);
      }

      if (deletedObject.tableNames === "Items" && objectToBeDeleted) {
        store.itemStore.updateLengthDelete();
        store.itemStore.updateLengthObjectsDelete(objectToBeDeleted.category);
      }
      if (objectToBeDeleted) {
        objectToBeDeleted.delete();
      }
    }
  }
}
