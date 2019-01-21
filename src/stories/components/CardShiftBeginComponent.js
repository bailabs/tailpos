import * as React from "react";
import { View } from "react-native";
import { Card, Text, Form, Item, Input, Button } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");

export default class CardShiftBeginComponent extends React.Component {
  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const disabled = !this.props.shiftAttendant ? true : false;

    return (
      <Card style={{ padding: 15, paddingTop: 25 }}>
        <Text style={{ fontWeight: "bold" }}>Shift details</Text>
        <Form style={{ marginTop: 25 }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Beginning Cash</Text>
            <Text
              style={{
                fontStyle: "italic",
                marginBottom: 5,
                color: "gray",
              }}
            >
              The cash by the start of the shift
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
          <Text>Open Shift</Text>
        </Button>
      </Card>
    );
  }
}
