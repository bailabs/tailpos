import { Toast } from "native-base";
import { ReceiptLine } from "./store/PosStore/ReceiptStore";

export const isItemRemarks = item => {
  const lastChar = item.description[item.description.length - 1];
  return lastChar === "*";
};

export const showToast = (message, type = null, duration = 5000) => {
  Toast.show({
    type,
    duration,
    text: message,
    buttonText: "Okay",
  });
};

export const showToastDanger = (message, duration = 5000) => {
  Toast.show({
    duration,
    text: message,
    type: "danger",
    buttonText: "Okay",
  });
};

export const createReceiptLine = item => {
  return ReceiptLine.create({
    date: Date.now(),
    item: item.name,
    sold_by: item.soldBy,
    item_name: item.description,
    price: parseFloat(item.price),
    qty: 1,
  });
};
