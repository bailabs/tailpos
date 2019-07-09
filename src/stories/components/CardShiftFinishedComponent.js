import * as React from "react";
import { View } from "react-native";
import { Card, Text, Button } from "native-base";
import { formatNumber } from "accounting-js";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../translations/CurrentLanguage";

var moment = require("moment");
let MoneyCurrency = require("money-currencies");
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class CardShiftFinishedComponent extends React.Component {
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const now = this.props.shiftEnd.toLocaleTimeString();
    const then = this.props.shiftBeginning.toLocaleTimeString();

    const timeDiff = moment.utc(
      moment(now, "HH:mm:ss").diff(moment(then, "HH:mm:ss")),
    );

    return (
      <Card style={{ padding: 15, paddingTop: 25 }}>
        <View>
          <Icon
            name="timetable"
            size={64}
            color="green"
            style={{ alignSelf: "center" }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "green",
              fontWeight: "bold",
            }}
          >
            {strings.EndedShift}
          </Text>
        </View>

        <View
          style={{
            marginTop: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {/*{this.props.shiftAttendant.user_name !== null? this.props.shiftAttendant.user_name: ""}*/}
            {""}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "gray",
            }}
          >
            {/*{this.props.shiftAttendant.role}*/}
            {""}
          </Text>
        </View>

        <View
          style={{
            marginTop: 15,
            borderTopWidth: 0.5,
            borderTopColor: "gray",
            borderBottomWidth: 0.5,
            borderBottomColor: "gray",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <View>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              {strings.WorkedFor} {timeDiff.format("HH:mm:ss")}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {strings.ShiftStartedOn} {then} {strings.AndEndedOn} {now}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 15, marginBottom: 15 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 36,
              }}
            >
              {mc.moneyFormat(formatNumber(this.props.cashBeginning))}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {strings.CashBeginning}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 36,
              }}
            >
              {mc.moneyFormat(formatNumber(this.props.cashEnd))}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {strings.CashEnd}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: "gray",
            paddingTop: 15,
          }}
        >
          <Button
            style={{ alignSelf: "flex-end" }}
            onPress={() => this.props.shiftClick()}
          >
            <Text>{strings.StartAnotherShift}</Text>
          </Button>
        </View>
      </Card>
    );
  }
}
