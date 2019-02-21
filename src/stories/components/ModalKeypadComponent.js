import * as React from "react";
import { View } from "react-native";
import { Button, Text } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const NumberButton = props => (
  <Button
    bordered
    style={{
      width: 80,
      borderRadius: 0,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#eee",
    }}
    onPress={() => props.onNumberPress(props.text)}
  >
    <Text
      style={{
        alignSelf: "center",
        fontWeight: "bold",
      }}
    >
      {props.text}
    </Text>
  </Button>
);

const DeleteButton = props => (
  <Button
    bordered
    style={{
      width: 80,
      borderRadius: 0,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#eee",
    }}
    onPress={() => props.onDeletePress()}
  >
    <Icon name="backspace" size={24} color="#ee3c4f" />
  </Button>
);

export default class ModalKeypadComponent extends React.PureComponent {
  render() {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <NumberButton text="1" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="2" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="3" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <NumberButton text="4" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="5" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="6" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <NumberButton text="7" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="8" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="9" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <NumberButton text="." onNumberPress={this.props.onNumberPress} />
          <NumberButton text="0" onNumberPress={this.props.onNumberPress} />
          <DeleteButton onDeletePress={this.props.onDeletePress} />
        </View>
      </View>
    );
  }
}
