import * as React from "react";
import { View } from "react-native";
import { Card, Text, Form, Item, Input, Button } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class CardShiftBeginComponent extends React.Component {
  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const disabled = !this.props.shiftAttendant ? true : false;
      strings.setLanguage(currentLanguage().companyLanguage);

    return (
      <Card style={{ padding: 15, paddingTop: 25 }}>
        <Text style={{ fontWeight: "bold" }}>{strings.ShiftDetails}</Text>
        <Form style={{ marginTop: 25 }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>{strings.BeginningCash}</Text>
            <Text
              style={{
                fontStyle: "italic",
                marginBottom: 5,
                color: "gray",
              }}
            >
              {strings.TheCashByTheStartOfTheShift}
            </Text>
            <Item regular style={{ marginBottom: 10 }}>
              <Input
                value={
                  this.props.pay
                    ? mc.moneyFormat(this.props.pay)
                    : this.props.pay
                }
                keyboardType="numeric"
                editable={false}
                // onChangeText={text => this.props.amountOnChange(text)}
              />
            </Item>
          </View>
        </Form>
        <Button
          disabled={disabled}
          style={{ marginTop: 15, paddingLeft: 10, alignSelf: "flex-end" }}
          onPress={() => this.props.shiftClick()}
        >
          <Icon name="timer" color="white" size={24} />
          <Text>{strings.OpenShift}</Text>
        </Button>
      </Card>
    );
  }
}
