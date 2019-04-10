import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";

import { Header, Left, Body, Text, Button } from "native-base";
import { formatMoney } from "accounting-js";

const GrandTotalComponent = props => {
  const ViewOrderButton = props.hasTailOrder ? (
    <Button onPress={props.onViewOrders}>
      <Text>View Orders</Text>
    </Button>
  ) : null;

  return (
    <Header noShadow style={styles.header}>
      <Left>{ViewOrderButton}</Left>
      <Body />
      <Text style={styles.text}>
        {formatMoney(props.grandTotal, { symbol: "PHP" })}
      </Text>
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
