import * as React from "react";
import { StyleSheet } from "react-native";
import { Item, Picker } from "native-base";

const PickerComponent = props => (
  <Item regular style={styles.item}>
    <Picker
      note
      mode="dropdown"
      style={styles.picker}
      selectedValue={props.value}
      onValueChange={props.onChangeValue}
    >
      {props.children}
    </Picker>
  </Item>
);

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
    flexDirection: "row",
  },
  picker: {
    flex: 1,
  },
});

export default PickerComponent;
