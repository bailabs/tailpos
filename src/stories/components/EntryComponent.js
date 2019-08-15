import * as React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatNumber } from "accounting-js";

let MoneyCurrency = require("money-currencies");

export default class EntryComponent extends React.PureComponent {
  withPrice() {
    if (this.props.value.price) {
      let mc = new MoneyCurrency(
        this.props.currency ? this.props.currency : "PHP",
      );

      return (
        <View style={{ marginTop: -15 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: Dimensions.get("window").height * 0.035,
              color: "lightslategray",
              textAlign: "center",
            }}
          >
            {this.props.isCurrencyDisabled
              ? formatNumber(this.props.value.price)
              : mc.moneyFormat(formatNumber(this.props.value.price))}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
  onPress = () => {
    this.props.onPress(this.props.value);
  };

  onLongPress = () => {
    this.props.onLongPress(this.props.value);
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
          <View
            style={{
              margin: 2,
              alignItems: "center",
              justifyContent: "center",
              width: Dimensions.get("window").width * 0.15,
              height: Dimensions.get("window").height * 0.28,
            }}
          >
            {this.props.value.colorAndShape ? (
              <Icon
                style={{
                  position: "absolute",
                  fontSize: Dimensions.get("window").width * 0.15,
                  color: this.props.value.color,
                }}
                name={this.props.value.shape}
                size={100}
              />
            ) : (
              <Icon
                style={{
                  position: "absolute",
                  fontSize: Dimensions.get("window").width * 0.15,
                  color: "gray",
                }}
                name="square"
                size={100}
              />
            )}

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width * 0.12,
                height: Dimensions.get("window").height * 0.08,
              }}
            >
              <Text
                numberOfLines={5}
                style={{
                  fontSize: Dimensions.get("window").height * 0.02,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {this.props.useDescription
                  ? this.props.value.description
                  : this.props.value.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {this.withPrice()}
      </View>
    );
  }
}
