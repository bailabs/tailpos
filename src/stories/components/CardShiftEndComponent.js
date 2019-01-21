import * as React from "react";
import { View } from "react-native";
import { Card, Text, Button, Form, Item, Input } from "native-base";
import BreakdownModal from "./BreakdownModalComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");

export default class CardShiftEndComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: "",
      visibility: false,
      actualMoney: "",
    };
  }

  render() {
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
          <Text style={{ fontWeight: "bold" }}>Shift details</Text>
          <Form style={{ marginTop: 25, marginBottom: 25 }}>
            <View>
              <Text
                style={{
                  fontStyle: "italic",
                  marginBottom: 5,
                  color: "gray",
                }}
              >
                The cash you wanted to put into the register or get out from the
                register.
              </Text>
              <Item regular>
                <Input
                  value={
                    this.props.pay
                      ? mc.moneyFormat(this.props.pay)
                      : this.props.pay
                  }
                  keyboardType="numeric"
                  style={{ fontSize: 28, textAlign: "left" }}
                  editable={false}
                  // onChangeText={text => this.setState({ pay: text })}
                />
              </Item>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
              <Button
                full
                disabled={disabled}
                onPress={() => {
                  this.setState({ pay: "" });
                  this.props.payInClick(this.props.pay);
                }}
                style={payInStyle}
              >
                <Text>Pay-in</Text>
              </Button>
              <Button
                full
                disabled={disabled}
                onPress={() => {
                  this.setState({ pay: "" });
                  this.props.payOutClick(this.props.pay);
                }}
                style={payOutStyle}
              >
                <Text>Pay-out</Text>
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
              <Text style={{ fontWeight: "bold" }}>Shift started</Text>
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
              <Text style={{ fontWeight: "bold" }}>Beginning Cash</Text>
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
              <Text style={{ fontWeight: "bold" }}>Ending Cash</Text>
              <Text>{mc.moneyFormat(this.props.cashEnd)}</Text>
            </View>
          </View>
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
            <Text>Close Shift</Text>
          </Button>
        </Card>
      </View>
    );
  }
}
