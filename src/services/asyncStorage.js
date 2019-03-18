import { AsyncStorage } from "react-native";

export const asyncStorageKeys = {
  SHIFTS: "SHIFTS",
};

export const getObjectFromAsync = (name) => {
  return AsyncStorage.getItem(name)
    .then(item => {
      if (item) {
        return JSON.parse(item);
      }
    })
    .catch(error => console.log(error));
};

export const setObjectInAsync = (key, value) => {
  const valueString = JSON.stringify(value);
  AsyncStorage.setItem(key, valueString);
};
