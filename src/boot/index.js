import config from "./configureStore";
import app from "./setup";
import { retrieveSettings } from "../services/storage";

global.Buffer = require("buffer").Buffer;

export default function() {
  const stores = config();

  let catPromise = stores.categoryStore.getFromDb(20);
  let discountPromise = stores.discountStore.getFromDb(20);
  let paymentPromise = stores.paymentStore.getFromDb(20);
  let itemPromise = stores.itemStore.getFromDb(20);
  let favoriteItemPromise = stores.itemStore.getFromFavoriteDb();
  let printerPromise = stores.printerStore.getFromDb(20);
  let customerPromise = stores.customerStore.getFromDb(20);
  let taxesPromise = stores.taxesStore.getFromDb(20);
  let shiftReportPromise = stores.shiftReportsStore.getFromDb(20);
  let attendantPromise = stores.attendantStore.getFromDb();
  let itemsLength = stores.itemStore.getLengthItemsFromDb();
  let shiftPromise = stores.shiftStore.getFromDb(20);
  let rolePromise = stores.roleStore.getFromDb(20);

  retrieveSettings()
    .then(item => {
      if (item) {
        stores.stateStore.setQueueHost(item.queueHost);
        if (item.hasTailOrder) {
          stores.stateStore.toggleTailOrder();
        }
      }
    });

  Promise.all([
    favoriteItemPromise,
    itemsLength,
    shiftReportPromise,
    shiftPromise,
    catPromise,
    discountPromise,
    paymentPromise,
    itemPromise,
    printerPromise,
    customerPromise,
    taxesPromise,
    attendantPromise,
    rolePromise,
  ])
    .then(() => stores.receiptStore.setDefaultCustomer())
    .then(() => stores.receiptStore.currentReceipt());

  return app(stores);
}
