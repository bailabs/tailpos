import * as React from "react";
import { StyleSheet } from "react-native";

import { Button, Text, Footer } from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

const FooterTicketComponent = props => (
  <Footer style={styles.footer}>
    <Button
      bordered
      onPress={props.onDeleteClick}
      style={[styles.button, styles.danger]}
    >
      <Icon name="trash" size={26} color="#ee3c4f" />
    </Button>
    <Button
      bordered
      onPress={props.onBarcodeClick}
      style={styles.button}
    >
      <Icon name="barcode" size={24} color="#4B4C9D" />
    </Button>
    <Button
      bordered
      onPress={props.onDiscountClick}
      style={styles.button}
    >
      <Icon
        name="percent"
        size={24}
        color={props.totalQty === 0 ? "gray" : "#4B4C9D"}
      />
    </Button>
    <Button
      onPress={() => props.onPaymentClick(props.receipt)}
      style={{
        backgroundColor: props.totalQty === 0 ? "gray" : "#4B4C9D",
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "center",
      }}
      disabled={props.totalSubTotal === "0.00"}
    >
      <Icon name="credit-card" size={24} color="white" />
      <Text>Payment ({props.totalQty})</Text>
    </Button>
  </Footer>
);

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    height: 60,
    paddingLeft: 30,
    paddingRight: 30,
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: "center",
  },
  danger: {
    borderColor: "#ee3c4f",
  },
});

export default FooterTicketComponent;
