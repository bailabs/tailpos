import * as React from "react";
import { View, StyleSheet } from "react-native";

const ListingRowComponent = props => (
  <View style={styles.view}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  view: { flexDirection: "row" },
});

export default ListingRowComponent;
