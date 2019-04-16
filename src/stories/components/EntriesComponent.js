import * as React from "react";
import { FlatList } from "react-native";

import EntryComponent from "./EntryComponent";

export default class EntriesComponent extends React.PureComponent {

  _renderItem = ({ item, index }) => {
    return (
      <EntryComponent
        currency={this.props.currency}
        index={index}
        value={item}
        onPress={this.props.onPressItem}
        onLongPress={this.props.onLongPressItem}
      />
    );
  };

  render() {
    return (
      <FlatList
        numColumns={2}
        data={this.props.data}
        keyExtractor={(item, index) => index}
        renderItem={this._renderItem}
        onEndReachedThreshold={1}
        onEndReached={() => this.props.onEndReached()}
      />
    );
  }
}
