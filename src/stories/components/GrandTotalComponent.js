import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Header, Left, Body, Text, Button } from "native-base";
import { formatNumber } from "accounting-js";

let MoneyCurrency = require("money-currencies");

const GrandTotalComponent = props => {
  const { hasTailOrder, onViewOrders, currency, grandTotal } = props;

  const ViewOrderButton = hasTailOrder ? (
    <Button onPress={onViewOrders}>
      <Text>View Orders</Text>
    </Button>
  ) : null;

  const currencySymbol = currency ? currency : "PHP";
  const GrandTotalText = new MoneyCurrency(currencySymbol).moneyFormat(
    formatNumber(grandTotal),
  );

  return (
    <Header noShadow style={styles.header}>
      <Left>{ViewOrderButton}</Left>
      <Body />
      <Text style={styles.text}>{GrandTotalText}</Text>
    </Header>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    backgroundColor: "#efefef",
  },
  text: {
    paddingTop: 5,
    paddingRight: 5,
    color: "#4b4c9d",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width * 0.03,
  },
});

export default GrandTotalComponent;
