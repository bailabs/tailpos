import { Alert } from "react-native";
import { Toast } from "native-base";
import { ReceiptLine } from "./store/PosStore/ReceiptStore";
import translation from "./translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export const isItemRemarks = item => {
  const lastChar = item.description[item.description.length - 1];
  return lastChar === "*";
};

export const showToast = (message, type = null, duration = 5000) => {
  Toast.show({
    type,
    duration,
    text: message,
    buttonText: strings.Okay,
  });
};

export const showToastDanger = (message, duration = 5000) => {
  Toast.show({
    duration,
    text: message,
    type: "danger",
    buttonText: strings.Okay,
  });
};

export const createReceiptLine = (item, category) => {
  return ReceiptLine.create({
    date: Date.now(),
    item: item.name,
    sold_by: item.soldBy,
    category: category,
    item_name: item.description,
    price: parseFloat(item.price),
    qty: 1,
  });
};

export const showAlert = (title, text, onPress) => {
  Alert.alert(title, text, [
    { text: strings.No, style: "cancel" },
    { text: strings.Yes, onPress: onPress },
  ]);
};

export const sortByName = (a, b) => {
  return a.name < b.name ? -1 : 1;
};

export const getCountryCode = printerStore => {
  const { countryCode } = printerStore.companySettings[0];
  return countryCode ? countryCode : "";
};
