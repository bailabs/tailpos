import * as React from "react";
import { Button, Text } from "native-base";

export default class CategoryComponent extends React.Component {
  render() {
    // If the category is selected
    const selected = this.props.selected ? (
      <Button
        block
        success
        style={{ marginBottom: 10 }}
        onPress={() => this.props.onPress(this.props.index)}
      >
        <Text>{this.props.name}</Text>
      </Button>
    ) : (
      <Button
        bordered
        block
        success
        style={{ marginBottom: 10 }}
        onPress={() => this.props.onPress(this.props.index)}
      >
        <Text>{this.props.name}</Text>
      </Button>
    );

    return selected;
  }
}
