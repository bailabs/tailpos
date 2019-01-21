import * as React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import { formatNumber } from "accounting-js";
let MoneyCurrency = require("money-currencies");
const TotalLineComponent = props => (
  <View style={{ paddingLeft: 30, paddingRight: 30, marginBottom: 30 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontWeight: "bold" }}>Subtotal</Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.subtotal),
        )}
      </Text>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontWeight: "bold" }}>Tax</Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.taxesValue),
        )}
      </Text>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontWeight: "bold" }}>
        Discounts{" "}
        {props.receipt
          ? props.receipt.discountType === "percentage"
            ? props.receipt.discountValue > 0
              ? "(" + (props.receipt.discountValue * 100).toString()
              : ""
            : props.receipt.discountType === "fixDiscount"
              ? props.receipt.discountValue > 0
                ? "(" + props.receipt.discountValue
                : ""
              : ""
          : ""}
        {props.receipt
          ? props.receipt.discountType === "percentage"
            ? props.receipt.discountValue > 0
              ? "%)"
              : ""
            : props.receipt.discountValue > 0
              ? ")"
              : ""
          : ""}
      </Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.discount),
        )}
      </Text>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontWeight: "bold", color: "#043c6c" }}>
        Total Payment
      </Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.totalPayment),
        )}
      </Text>
    </View>
  </View>
);

export default TotalLineComponent;
