import * as React from "react";
import { StyleSheet } from "react-native";
import { Item } from "native-base";

const ListingItemComponent = props => (
  <Item regular style={styles.item}>
    {props.children}
  </Item>
);

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
  },
});

export default ListingItemComponent;
