import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const NumberButton = props => (
  <Button
    bordered
    style={styles.keyButton}
    onPress={() => props.onNumberPress(props.text)}
  >
    <Text style={styles.keyText}>
      {props.text}
    </Text>
  </Button>
);

const DeleteButton = props => (
  <Button
    bordered
    style={styles.keyButton}
    onPress={() => props.onDeletePress()}
  >
    <Icon name="backspace" size={24} color="#ee3c4f" />
  </Button>
);

export default class ModalKeypadComponent extends React.PureComponent {
  render() {
    return (
      <View>
        <View style={styles.modalView}>
          <NumberButton text="1" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="2" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="3" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={styles.modalView}>
          <NumberButton text="4" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="5" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="6" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={styles.modalView}>
          <NumberButton text="7" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="8" onNumberPress={this.props.onNumberPress} />
          <NumberButton text="9" onNumberPress={this.props.onNumberPress} />
        </View>
        <View style={styles.modalView}>
          <NumberButton text="." onNumberPress={this.props.onNumberPress} />
          <NumberButton text="0" onNumberPress={this.props.onNumberPress} />
          <DeleteButton onDeletePress={this.props.onDeletePress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyButton: {
    width: 80,
    borderRadius: 0,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontWeight: "bold",
    alignSelf: "center",
  },
  modalView: {
    flexDirection: "row",
  },
});
