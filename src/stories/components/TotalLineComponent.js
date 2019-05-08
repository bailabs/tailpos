import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { formatNumber } from "accounting-js";

let MoneyCurrency = require("money-currencies");

const TotalLineComponent = props => (
  <View style={styles.viewOuter}>
    <View style={styles.viewInner}>
      <Text style={styles.text}>Subtotal</Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.subtotal),
        )}
      </Text>
    </View>
    <View style={styles.viewInner}>
      <Text style={styles.text}>Tax {parseFloat(props.receipt.taxesValue) > 0 ? "(" + props.receipt.taxesValue.toString() + "%)" : ""}</Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.taxesValue),
        )}
      </Text>
    </View>
    <View style={styles.viewInner}>
      <Text style={styles.text}>
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
    <View style={styles.viewInner}>
      <Text style={[styles.text, styles.totalText]}>Total Payment</Text>
      <Text>
        {new MoneyCurrency(props.currency ? props.currency : "PHP").moneyFormat(
          formatNumber(props.totalPayment),
        )}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  viewOuter: {
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 30,
  },
  viewInner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "bold",
  },
  totalText: {
    color: "#4b4c9d",
  },
});

export default TotalLineComponent;
