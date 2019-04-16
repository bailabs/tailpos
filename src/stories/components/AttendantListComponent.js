import * as React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text, Item } from "native-base";

class AddAttendantComponent extends React.PureComponent {
  _renderItem = ({ item, index }) => {
    return (
      <Item
        regular
        style={styles.item}
        onPress={() => this.props.onClickAttendant(item)}
        onLongPress={() => this.props.onDeleteAttendant(item)}
      >
        <Text>{item.user_name}</Text>
      </Item>
    );
  };

  _extractKey = (item, index) => index;

  render() {
    const { attendantsData } = this.props;
    return (
      <View style={styles.view}>
        <FlatList
          numColumns={1}
          data={attendantsData}
          renderItem={this._renderItem}
          keyExtractor={this._extractKey}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: "50%",
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default AddAttendantComponent;
