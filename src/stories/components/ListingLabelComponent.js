import * as React from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";

const ListingLabelComponent = props => (
  <Text style={styles.text}>{props.text}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ListingLabelComponent;
