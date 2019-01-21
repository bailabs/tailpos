import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Input, Item, Header } from "native-base";
// import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class BarcodeInputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeState: false,
    };
  }
  searchSales() {
    return (
      <Item>
        <Icon name="magnify" size={20} />
        <Input
          placeholder="Search Items"
          onChangeText={text => this.props.onChangeText(text)}
        />
        <TouchableOpacity onPress={() => this.props.onSearchClick(false)}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      </Item>
    );
  }

  searchItem() {
    return (
      <Item>
        <Icon name="magnify" size={20} />
        <Input
          placeholder="Search Items"
          onChangeText={text => this.props.onChangeText(text)}
        />
        <TouchableOpacity
          onPress={() => this.props.itemMaintenanceStatusChange(false)}
        >
          <Icon name="close" size={20} />
        </TouchableOpacity>
      </Item>
    );
  }

  render() {
    if (this.props.status === "Item") {
      return (
        <Header searchBar rounded style={{ backgroundColor: "#294398" }}>
          {this.searchItem()}
        </Header>
      );
    } else if (this.props.status === "Sales") {
      return (
        <Header searchBar rounded style={{ backgroundColor: "#294398" }}>
          {this.searchSales()}
        </Header>
      );
    }
  }
}
