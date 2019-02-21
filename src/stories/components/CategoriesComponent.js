import * as React from "react";
import { FlatList, View, Dimensions } from "react-native";
import { Text, Button } from "native-base";

export default class CategoriesComponent extends React.PureComponent {
  _renderItem = ({ item, index }) => {
    let catL = 0;
    this.props.catLengths.map(result => {
      if (result.categoryId === item._id) {
        catL = result.categoryLength;
      }
    });
    return (
      <Button
        primary
        key={index}
        block
        bordered={this.props.selectedCategoryIndex === index ? undefined : true}
        onPress={() => this.props.onCategoryClick(item._id, index)}
        style={{
          marginTop: 10,
          marginRight: 10,
          marginLeft: 10,
          borderColor: "#4B4C9D",
          height: 60,
        }}
        disabled={this.props.disabled}
      >
        <Text style={{ flexWrap: "wrap", textAlign: "center" }}>
          {item.name} ({catL})
        </Text>
      </Button>
    );
  };
  render() {
    return (
      <View
        style={{
          height: this.props.bluetoothStatus
            ? Dimensions.get("window").height * 0.75
            : Dimensions.get("window").height * 0.85,
        }}
      >
        <Button
          primary
          block
          bordered={this.props.selectedCategoryIndex === -2 ? undefined : true}
          style={{
            marginTop: 10,
            marginRight: 10,
            marginLeft: 10,
            borderColor: "#4B4C9D",
            height: 60,
          }}
          onPress={() => this.props.onCategoryClick("", -2)}
        >
          <Text> Favorites </Text>
        </Button>
        <Button
          primary
          block
          bordered={this.props.selectedCategoryIndex === -1 ? undefined : true}
          style={{
            marginTop: 10,
            marginRight: 10,
            marginLeft: 10,
            borderColor: "#4B4C9D",
            height: 60,
          }}
          onPress={() => this.props.onCategoryClick("", -1)}
        >
          <Text> All ({this.props.itemsLength})</Text>
        </Button>
        <FlatList
          numColumns={1}
          data={this.props.data}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
          onEndReachedThreshold={1}
          onEndReached={() => this.props.onEndReached()}
        />
      </View>
    );
  }
}
