import * as React from "react";
import { View, Text, Dimensions } from "react-native";
import { Button } from "native-base";

export default class NumberKeyComponent extends React.PureComponent {
  onChangeNumberKeyClick = () => this.props.onChangeNumberKeyClick(this.props.text)
  render() {
    return (
      <View
        style={{
          marginRight: 3,
          marginBottom: 10,
          width: Dimensions.get("window").width * 0.073,
          height: Dimensions.get("window").height * 0.1,
        }}
      >
        <Button
          full
          onPress={this.onChangeNumberKeyClick}
        >
          <Text style={{ color: "white" }}>{this.props.text}</Text>
        </Button>
      </View>
    );
  }
}
