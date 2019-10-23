import * as React from "react";
import { FlatList } from "react-native";

import EntryComponent from "./EntryComponent";

export default class EntriesComponent extends React.PureComponent {
  _renderItem = ({ item, index }) => {
    return (
      <EntryComponent
        listStatus={this.props.listStatus}
        company={this.props.company}
        isCurrencyDisabled={this.props.isCurrencyDisabled}
        index={index}
        value={item}
        currency={this.props.currency}
        onPress={this.props.onPressItem}
        onLongPress={this.props.onLongPressItem}
        useDescription={this.props.useDescription}
      />
    );
  };

  render() {
    let numCol =
      this.props.listStatus === "Sales"
        ? this.props.company.smallSizeIcon
          ? 4
          : 3
        : 2;
    return (
      <FlatList
        numColumns={numCol}
        data={this.props.data}
        keyExtractor={(item, index) => index}
        renderItem={this._renderItem}
        onEndReachedThreshold={1}
        onEndReached={() => this.props.onEndReached()}
      />
    );
  }
}
