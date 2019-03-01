import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "native-base";

import { formatNumber } from "accounting-js";

import { SwipeRow } from "react-native-swipe-list-view";

const ReceiptLineComponent = props => (
  <SwipeRow>
    <View style={styles.swipeRowView}>
      <Text style={styles.nameText}>{props.name}</Text>
      <Text style={styles.qtyText}>{props.quantity}</Text>
      <Text style={styles.totalText}>
        {formatNumber(props.total)}
      </Text>
    </View>
  </SwipeRow>
);

const styles = StyleSheet.create({
  swipeRowView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
  },
  nameText: {
    flex: 3,
    fontWeight: "bold"
  },
  qtyText: {
    flex: 1,
    textAlign: "right"
  },
  totalText: {
    flex: 2,
    textAlign: "right"
  },
});

export default ReceiptLineComponent;
