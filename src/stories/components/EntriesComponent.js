import * as React from "react";
import { FlatList } from "react-native";

import EntryComponent from "./EntryComponent";

export default class EntriesComponent extends React.PureComponent {
  _renderItem = ({ item, index }) => {
    return (
      <EntryComponent
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
    return (
      <FlatList
        numColumns={3}
        data={this.props.data}
        keyExtractor={(item, index) => index}
        renderItem={this._renderItem}
        onEndReachedThreshold={1}
        onEndReached={() => this.props.onEndReached()}
      />
    );
  }
}
