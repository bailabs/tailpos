import * as React from "react";
import { View } from "react-native";
import { Card, Text, Button, Form, Item, Input } from "native-base";
import BreakdownModal from "./BreakdownModalComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class CardShiftEndComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: "",
      reason: "",
      visibility: false,
      actualMoney: "",
    };
  }

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const disabled = this.props.pay === "" ? true : false;

    const disabledStyle = {
      flex: 1,
      borderRadius: 0,
      backgroundColor: "lightgray",
    };

    // Pay-In
    const payInStyle = disabled
      ? disabledStyle
      : {
          flex: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: "green",
        };

    // Pay-Out
    const payOutStyle = disabled
      ? disabledStyle
      : {
          flex: 1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          backgroundColor: "firebrick",
        };

    return (
      <View>
        <BreakdownModal
          currency={this.props.currency}
          onDeletePress={() =>
            this.setState({ actualMoney: this.state.actualMoney.slice(0, -1) })
          }
          onPressClose={() => this.props.shiftClick(this.state.actualMoney)}
          onFocusValue={() => this.setState({ actualMoney: "" })}
          actualMoney={this.state.actualMoney}
          modalBreakDownVisible={this.state.visibility}
          onChangeActualMoney={money =>
            this.setState({ actualMoney: this.state.actualMoney + money })
          }
          onChangeVisibility={() => this.setState({ visibility: false })}
        />
        <Card style={{ padding: 15, paddingTop: 25 }}>
          <Text style={{ fontWeight: "bold" }}>
            {strings.ShiftDetails}{" "}
            <Text
              style={{
                fontStyle: "italic",
                marginBottom: 5,
                color: "gray",
                fontSize: 14,
              }}
            >
              ({
                strings.TheCashYouWantedToPutIntoTheRegisterOrGetOutFromTheRegister
              })
            </Text>
          </Text>
          <Form style={{ marginTop: 15, marginBottom: 25 }}>
            <View>
              <Item regular>
                <Input
                  placeholder={strings.Amount}
                  value={
                    this.props.pay
                      ? mc.moneyFormat(this.props.pay)
                      : this.props.pay
                  }
                  keyboardType="numeric"
                  style={{ fontSize: 20, textAlign: "left" }}
                  editable={false}
                  // onChangeText={text => this.setState({ pay: text })}
                />
              </Item>
              <Item regular style={{ marginTop: 3 }}>
                <Input
                  placeholder={strings.Reason}
                  value={this.state.reason}
                  // keyboardType="numeric"
                  style={{ fontSize: 18, textAlign: "left" }}
                  // editable={false}
                  onChangeText={text => this.setState({ reason: text })}
                />
              </Item>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
              <Button
                full
                disabled={disabled}
                onPress={() => {
                  this.setState({ pay: "", reason: "" });
                  this.props.payInClick({
                    pay: this.props.pay,
                    reason: this.state.reason,
                    type: "Pay In",
                  });
                }}
                style={payInStyle}
              >
                <Text>{strings.Payin}</Text>
              </Button>
              <Button
                full
                disabled={disabled}
                onPress={() => {
                  this.setState({ pay: "", reason: "" });
                  this.props.payOutClick({
                    pay: this.props.pay,
                    reason: this.state.reason,
                    type: "Pay Out",
                  });
                }}
                style={payOutStyle}
              >
                <Text>{strings.Payout}</Text>
              </Button>
            </View>
          </Form>
          <View
            style={{
              borderTopWidth: 0.25,
              borderBottomWidth: 0.25,
              borderColor: "gray",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{strings.ShiftStarted}</Text>
              <Text>
                {this.props.shiftBeginning.toLocaleTimeString("en-US")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {strings.BeginningCash}
              </Text>
              <Text>{mc.moneyFormat(this.props.cashBeginning)}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{strings.EndingCash}</Text>
              <Text>{mc.moneyFormat(this.props.cashEnd)}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              {strings.ShiftOpenedBy}: {this.props.attendant}
            </Text>
            <Button
              onPress={() => this.setState({ visibility: true })}
              style={{ marginTop: 15, paddingLeft: 10, alignSelf: "flex-end" }}
              disabled={
                this.props.shiftAttendant.role === "Owner"
                  ? false
                  : this.props.shiftAttendant.user_name !== this.props.attendant
                    ? true
                    : false
              }
            >
              <Icon name="timer-off" color="white" size={24} />
              <Text>{strings.CloseShift}</Text>
            </Button>
          </View>
        </Card>
      </View>
    );
  }
}
