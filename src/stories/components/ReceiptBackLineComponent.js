import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ReceiptBackLineComponent extends React.PureComponent {
  onReceiptLineEdit = () =>
    this.props.onReceiptLineEdit(
      this.props.id,
      this.props.index,
      this.props.rowMap,
    );
  onReceiptLineDelete = () =>
    this.props.onReceiptLineDelete(
      this.props.id,
      this.props.index,
      this.props.rowMap,
    );
  render() {
    return (
      <View style={styles.rowBack}>
        <Button
          full
          style={styles.rowBackButton}
          onPress={this.onReceiptLineEdit}
        >
          <Icon active name="pencil" size={21} color="white" />
        </Button>
        <Button
          full
          danger
          style={styles.rowBackButton}
          onPress={this.onReceiptLineDelete}
        >
          <Icon active name="delete" size={21} color="white" />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowBackButton: {
    width: 75,
    height: 50,
  },
});
