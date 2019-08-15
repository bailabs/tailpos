import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { CardItem, Text } from "native-base";
import { formatNumber } from "accounting-js";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
const ReceiptCardComponent = props => {
  const receiptStatus = (
    <Icon name="circle" size={14} color="green">
      <Text
        style={{
          color:
            props.status.status === strings.Completed
              ? "green"
              : props.status.status === strings.Cancelled
                ? "gray"
                : "#294398",
        }}
      >
        {" "}
        {props.status.status}
      </Text>
    </Icon>
  );
  strings.setLanguage(currentLanguage().companyLanguage);

  return (
    <TouchableOpacity onPress={() => props.onPress(props.obj)}>
      <CardItem bordered style={{ justifyContent: "space-between" }}>
        <View>
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              textAlignVertical: "center",
              color: "#294398",
            }}
          >
            {`${strings.Receipt} #${props.number}: `}{" "}
            {props.isCurrencyDisabled ? formatNumber(props.amount) : new MoneyCurrency(
              props.currency ? props.currency : "PHP",
            ).moneyFormat(formatNumber(props.amount))}{" "}
            {receiptStatus}
          </Text>
          <Text style={{ color: "#aaa" }}>
            {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
          </Text>
          {props.role === "Owner" ? (
            <Text style={{ color: "#aaa" }}>
              {strings.Attendant}: {props.obj.attendant}
            </Text>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 21,
            color: "#294398",
          }}
        >
          {props.date.toLocaleDateString()}
        </Text>
      </CardItem>
    </TouchableOpacity>
  );
};

export default ReceiptCardComponent;
