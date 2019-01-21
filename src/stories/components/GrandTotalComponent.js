import * as React from "react";
import { Header, Left, Body, Text } from "native-base";
import { formatMoney } from "accounting-js";
import { Dimensions } from "react-native";

const GrandTotalComponent = props => (
  <Header
    noShadow
    style={{ backgroundColor: "#00000010", justifyContent: "center" }}
  >
    <Left />
    <Body />
    <Text
      style={{
        color: "#4B4C9D",
        textAlign: "right",
        fontWeight: "bold",
        paddingTop: 5,
        paddingRight: 5,
        fontSize: Dimensions.get("window").width * 0.03,
      }}
    >
      {formatMoney(props.grandTotal, { symbol: "PHP" })}
    </Text>
  </Header>
);

export default GrandTotalComponent;
