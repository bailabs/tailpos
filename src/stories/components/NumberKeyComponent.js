import * as React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Button } from "native-base";

export default class NumberKeyComponent extends React.PureComponent {
  onChangeNumberKeyClick = () =>
    this.props.onChangeNumberKeyClick(this.props.text);
  render() {
    return (
      <View style={styles.outsideButton}>
        <Button full onPress={this.onChangeNumberKeyClick}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outsideButton: {
    marginRight: 3,
    marginBottom: 10,
    width: Dimensions.get("window").width * 0.073,
    height: Dimensions.get("window").height * 0.1,
  },
  buttonText: {
    color: "white",
  },
});
