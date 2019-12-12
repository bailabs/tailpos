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
      const { smallSizeIcon, mediumSizeIcon } = this.props.company;
      const { listStatus } = this.props;

      const height = Dimensions.get("window").height;
      return (
        <View
          style={{
            marginTop:
              listStatus === "Sales"
                ? smallSizeIcon
                  ? height * -0.06
                  : mediumSizeIcon
                    ? height * -0.04
                    : height * -0.035
                : height * -0.035,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize:
                listStatus === "Sales"
                  ? smallSizeIcon
                    ? height * 0.025
                    : mediumSizeIcon
                      ? height * 0.03
                      : height * 0.035
                  : height * 0.035,
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
    let width = Dimensions.get("window").width;
    let height = Dimensions.get("window").height;
    const { smallSizeIcon, mediumSizeIcon } = this.props.company;
    const { listStatus } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
          <View
            style={{
              marginTop:
                listStatus === "Sales"
                  ? smallSizeIcon
                    ? height * -0.035
                    : mediumSizeIcon
                      ? -4
                      : 2
                  : 2,
              alignItems: "center",
              justifyContent: "center",
              width:
                listStatus === "Sales"
                  ? smallSizeIcon
                    ? width * 0.11
                    : mediumSizeIcon
                      ? width * 0.13
                      : width * 0.15
                  : width * 0.15,
              height: height * 0.28,
            }}
          >
            {this.props.value.colorAndShape ? (
              <Icon
                style={{
                  position: "absolute",
                  fontSize:
                    listStatus === "Sales"
                      ? smallSizeIcon
                        ? width * 0.1
                        : mediumSizeIcon
                          ? width * 0.13
                          : width * 0.15
                      : width * 0.15,
                  color: this.props.value.color,
                }}
                name={this.props.value.shape}
              />
            ) : (
              <Icon
                style={{
                  position: "absolute",
                  fontSize:
                    listStatus === "Sales"
                      ? smallSizeIcon
                        ? width * 0.1
                        : mediumSizeIcon
                          ? width * 0.13
                          : width * 0.15
                      : width * 0.15,
                  color: "gray",
                }}
                name="square"
              />
            )}

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width:
                  listStatus === "Sales"
                    ? smallSizeIcon
                      ? width * 0.06
                      : mediumSizeIcon
                        ? width * 0.09
                        : width * 0.12
                    : width * 0.12,
                height: height * 0.08,
              }}
            >
              <Text
                numberOfLines={5}
                style={{
                  fontSize:
                    listStatus === "Sales"
                      ? smallSizeIcon
                        ? height * 0.015
                        : mediumSizeIcon
                          ? height * 0.018
                          : height * 0.022
                      : height * 0.022,
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
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
