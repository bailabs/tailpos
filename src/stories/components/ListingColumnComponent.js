import * as React from "react";
import { View, StyleSheet } from "react-native";

const ListingColumnComponent = props => {
  const { view, last } = styles;
  const viewStyle = props.last ? StyleSheet.flatten([view, last]) : view;

  return <View style={viewStyle}>{props.children}</View>;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginRight: 30,
  },
  last: {
    marginRight: 0,
  },
});

export default ListingColumnComponent;
