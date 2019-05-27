import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";

import { formatNumber } from "accounting-js";
let MoneyCurrency = require("money-currencies");

import ReceiptBackLineComponent from "./ReceiptBackLineComponent";

export default class ReceiptLinesComponent extends React.PureComponent {
  onReceiptLineEdit = (id, index, rowMap) => {
    rowMap[id].closeRow();
    this.props.onReceiptLineEdit(index);
  };

  onReceiptLineDelete = (id, index, rowMap) => {
    rowMap[id].closeRow();
    this.props.onReceiptLineDelete(index);
  };

  _renderColumn = (lastChar, column) => {
    return lastChar !== "*" ? column : null;
  };

  _renderItem = (data, rowMap) => {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const { item } = data;
    const lastChar = item.item_name[item.item_name.length - 1];

    return (
      <View style={styles.rowFront}>
        <Text style={styles.rowFrontName}>{item.item_name}</Text>
        {this._renderColumn(
          lastChar,
          <Text style={styles.rowFrontQuantity}>{formatNumber(item.qty)}</Text>,
        )}
        {this._renderColumn(
          lastChar,
          <Text style={styles.rowFrontTotal}>
            {mc.moneyFormat(formatNumber(item.total.toFixed(2)))}{" "}
            {item.discount_rate ? "(" + item.discount_rate + ")" : null}
          </Text>,
        )}
      </View>
    );
  };

  _renderHiddenItem = (data, rowMap) => {
    const { item, index } = data;
    return (
      <ReceiptBackLineComponent
        id={item._id}
        index={index}
        rowMap={rowMap}
        onReceiptLineEdit={this.onReceiptLineEdit}
        onReceiptLineDelete={this.onReceiptLineDelete}
      />
    );
  };

  _extractKey = (item, index) => item._id;

  render() {
    return (
      <SwipeListView
        useFlatList
        leftOpenValue={75}
        rightOpenValue={-75}
        data={this.props.lines}
        style={styles.swipeListView}
        renderItem={this._renderItem}
        keyExtractor={this._extractKey}
        renderHiddenItem={this._renderHiddenItem}
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
  swipeListView: {
    marginBottom: 10,
  },
});
