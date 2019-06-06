import { AsyncStorage } from "react-native";

export const retrieveSettings = () => {
  return AsyncStorage.getItem("@Settings:Queue").then(
    item => (item ? JSON.parse(item) : null),
  );
};

export const saveToSettings = value => {
  const valueString = JSON.stringify(value);
  return AsyncStorage.setItem("@Settings:Queue", valueString);
};

export const saveConfig = settings => {
  return saveToSettings({
    deviceId: settings.deviceId,
    queueHost: settings.queueHost,
    hasTailOrder: settings.hasTailOrder,
    useDescription: settings.useDescription,
    useDefaultCustomer: settings.useDefaultCustomer,
    isStackItem: settings.isStackItem,
  });
};
