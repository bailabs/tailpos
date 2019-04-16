import * as React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text, Item } from "native-base";

class RoleListComponent extends React.PureComponent {
  _renderItem = ({ item, index }) => {
    return (
      <Item
        regular
        style={styles.item}
        onPress={() => this.props.onClickRole(item)}
        onLongPress={() => this.props.onDeleteRoles(item)}
      >
        <Text>{item.role}</Text>
      </Item>
    );
  };

  _extractKey = (item, index) => index

  render() {
    const { rolesData } = this.props;
    return (
      <View style={styles.view}>
        <FlatList
          numColumns={1}
          data={rolesData}
          keyExtractor={this._extractKey}
          renderItem={this._renderItem}
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

export default RoleListComponent;
