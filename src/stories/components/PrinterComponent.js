import * as React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { Label, Text } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class PrinterComponent extends React.Component {
  render() {
    const connectionStatus = this.props.connection ? (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="circle" style={{ color: "green" }} />
        <Text style={{ color: "green", marginLeft: 2 }}>{strings.Online}</Text>
      </View>
    ) : (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="circle" style={{ color: "gray" }} />
        <Text style={{ color: "gray", marginLeft: 2 }}>
          {this.props.connectionStatus}
        </Text>
      </View>
    );

    return (
      <View style={this.props.style}>
        <Label>{strings.PrinterStatus}</Label>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={this.props.onPrinterPress}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="printer" size={36} style={{ marginRight: 10 }} />
            {connectionStatus}
          </TouchableOpacity>
          <Icon
            name="bluetooth-connect"
            style={{ color: "blue" }}
            size={Dimensions.get("window").width * 0.04}
            onPress={() => this.props.connectDevice()}
          />
        </View>
      </View>
    );
  }
}
