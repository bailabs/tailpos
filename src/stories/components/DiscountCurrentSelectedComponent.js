import * as React from "react";
import { View } from "react-native";
import { Input, Text, Button } from "native-base";

export default class DiscountCurrentSelectedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "sample",
    };
  }
  render() {
    return (
      <View style={{ borderBottomWidth: 1 }}>
        <Text style={{ padding: 10, fontSize: 14, fontWeight: "bold" }}>
          Current Discount Selected
        </Text>
        {this.props.currentDiscount ? (
          <View
            style={{
              padding: 10,
              flexDirection: "row",
            }}
          >
            <Input
              placeholder="Current Selected"
              value={this.props.currentDiscount.name}
              style={{ fontSize: 14 }}
            />
            <Button
              onPress={() =>
                this.props.onCancelDiscount(this.props.currentDiscount)
              }
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>No Selected Discount</Text>
          </View>
        )}
      </View>
    );
  }
}
