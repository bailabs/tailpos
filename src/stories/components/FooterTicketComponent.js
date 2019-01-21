import * as React from "react";
import { Button, Text, Footer } from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

const FooterTicketComponent = props => (
  <Footer
    style={{
      backgroundColor: "white",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 30, // space
      paddingRight: 30, // space
      height: 60,
    }}
  >
    <Button
      bordered
      onPress={() => props.onDeleteClick()}
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "center",
        borderColor: "#ee3c4f",
      }}
    >
      <Icon name="trash" size={26} color="#ee3c4f" />
    </Button>
    <Button
      bordered
      onPress={() => props.onBarcodeClick()}
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "center",
      }}
    >
      <Icon name="barcode" size={24} color="#4B4C9D" />
    </Button>
    <Button
      bordered
      onPress={() => props.onDiscountClick()}
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "center",
      }}
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

export default FooterTicketComponent;
