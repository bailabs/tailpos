import * as React from "react";
import { StyleSheet } from "react-native";
import { Item } from "native-base";

const ListingItemComponent = props => {
  const { item, half } = styles;
  const itemStyle = props.half ? StyleSheet.flatten([item, half]) : item;

  return (
    <Item regular style={itemStyle}>
      {props.children}
    </Item>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
  },
  half: {
    width: "50%",
  },
});

export default ListingItemComponent;
