import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Header, Left, Body, Text, Button, View } from "native-base";
import { formatNumber } from "accounting-js";
import { currentLanguage } from "../../translations/CurrentLanguage";

let MoneyCurrency = require("money-currencies");
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
const get_tailorder_button = (props, currentTable) => {
  strings.setLanguage(currentLanguage().companyLanguage);
  if (props.isViewingOrder) {
    return (
      <Button
        style={styles.button}
        disabled={currentTable === -1}
        onPress={props.onCancelOrder}
      >
        <Text>{strings.CancelOrder}</Text>
      </Button>
    );
  }

  return (
    <Button
      style={styles.button}
      disabled={props.receipt.linesLength === 0}
      onPress={props.onTakeAwayClick}
    >
      <Text>{strings.ConfirmOrder}</Text>
    </Button>
  );
};
const GrandTotalComponent = props => {
  const {
    hasTailOrder,
    onViewOrders,
    currency,
    grandTotal,
    isCurrencyDisabled,
  } = props;

  const TailOrder = hasTailOrder
    ? get_tailorder_button(props, props.currentTable)
    : null;
  strings.setLanguage(currentLanguage().companyLanguage);

  const ViewOrderButton = hasTailOrder ? (
    <Button onPress={onViewOrders}>
      <Text>{strings.ViewOrders}</Text>
    </Button>
  ) : null;

  const currencySymbol = currency ? currency : "PHP";
  const GrandTotalText = isCurrencyDisabled
    ? formatNumber(grandTotal)
    : new MoneyCurrency(currencySymbol).moneyFormat(formatNumber(grandTotal));
  return (
    <Header noShadow style={styles.header}>
      <Left style={{ flexDirection: "row" }}>
        <View>{ViewOrderButton}</View>
        <View>{TailOrder}</View>
      </Left>
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

  button: {
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: "center",
  },
});

export default GrandTotalComponent;
