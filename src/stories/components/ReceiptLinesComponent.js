import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { formatNumber } from "accounting-js";
let MoneyCurrency = require("money-currencies");

export default class ReceiptLinesComponent extends React.PureComponent {
  closeRow(rowMap, id) {
    rowMap[id].closeRow();
  }

  _renderItem = (data, rowMap) => {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const { item } = data;
    return (
      <View style={styles.rowFront}>
        <Text style={styles.rowFrontName}>{item.item_name}</Text>
        <Text style={styles.rowFrontQuantity}>{formatNumber(item.qty)}</Text>
        <Text style={styles.rowFrontTotal}>
          {mc.moneyFormat(formatNumber(item.total.toFixed(2)))}{" "}
          {item.discount_rate ? "(" + item.discount_rate + ")" : null}
        </Text>
      </View>
    );
  };

  _renderHiddenItem = (data, rowMap) => {
    const { item, index } = data;
    return (
      <View style={styles.rowBack}>
        <Button
          full
          style={styles.rowBackEdit}
          onPress={() => {
            this.closeRow(rowMap, item._id);
            this.props.onReceiptLineEdit(index);
          }}
        >
          <Icon active name="pencil" size={21} color="white" />
        </Button>
        <Button
          full
          danger
          style={styles.rowBackDelete}
          onPress={() => {
            this.closeRow(rowMap, item._id);
            this.props.onReceiptLineDelete(index);
          }}
        >
          <Icon active name="delete" size={21} color="white" />
        </Button>
      </View>
    );
  };

  render() {
    return (
      <SwipeListView
        useFlatList
        data={this.props.lines}
        keyExtractor={(item, index) => item._id}
        renderItem={this._renderItem}
        renderHiddenItem={this._renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
        style={{ marginBottom: 10 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: "white",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  rowNoFront: {
    backgroundColor: "white",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    height: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  rowFrontName: {
    flex: 3,
    fontWeight: "bold",
  },

  rowFrontQuantity: {
    flex: 1,
    textAlign: "right",
  },

  rowFrontTotal: {
    flex: 2,
    textAlign: "right",
  },

  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowBackEdit: {
    width: 75,
    height: 50,
  },

  rowBackDelete: {
    width: 75,
    height: 50,
  },
});
