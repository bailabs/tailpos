import { AsyncStorage } from "react-native";

export const retrieveSettings = () => {
  return AsyncStorage.getItem("@Settings:Queue")
    .then(item => item ? JSON.parse(item) : null);
};

export const saveToSettings = (value) => {
  const valueString = JSON.stringify(value);
  return AsyncStorage.setItem("@Settings:Queue", valueString);
};
