import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBox } from "native-base";

const EditCheckBoxComponent = props => (
  <View style={styles.view}>
    <CheckBox
      style={styles.checkbox}
      checked={props.checked}
      onPress={props.onPress}
    />
    <Text style={styles.text}>{props.label}</Text>
  </View>
);

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    paddingLeft: 17,
    paddingRight: 17,
  },
  checkbox: {
    left: 0,
  },
  text: {
    marginLeft: 10,
  },
});

export default EditCheckBoxComponent;
