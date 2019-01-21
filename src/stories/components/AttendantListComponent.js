/**
 * Created by jan on 4/20/18.
 * Last modified by Iva
 */
import * as React from "react";
import { Dimensions, FlatList, View } from "react-native";
import { Text, Item } from "native-base";
class AddAttendantComponent extends React.Component {
  _renderItem = ({ item, index }) => {
    return (
      <Item
        regular
        style={{
          marginTop: 10,
          height: Dimensions.get("window").height * 0.8 * 0.09,
          width: Dimensions.get("window").width * 0.7 * 0.42,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => this.props.onClickAttendant(item)}
        onLongPress={() => this.props.onDeleteAttendant(item)}
      >
        <Text
          style={{ fontSize: Dimensions.get("window").height * 0.8 * 0.03 }}
        >
          {item.user_name}
        </Text>
      </Item>
    );
  };
  render() {
    return (
      <View
        style={{
          height: Dimensions.get("window").height * 0.8 * 0.8,
          width: Dimensions.get("window").width * 0.7 * 0.45,
        }}
      >
        <FlatList
          numColumns={1}
          data={this.props.attendantsData}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default AddAttendantComponent;
