import * as React from "react";
import { View, Dimensions, Text, FlatList } from "react-native";
import { Form, Item, Button, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
var MoneyCurrency = require("money-currencies");

export default class NumberKeysComponent extends React.Component {
  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginRight: 3,
          marginBottom: 10,
          width: Dimensions.get("window").width * 0.073,
          height: Dimensions.get("window").height * 0.1,
        }}
      >
        <Button
          full
          onPress={() => this.props.onChangeNumberKeyClick(item.text)}
        >
          <Text style={{ color: "white" }}>{item.text}</Text>
        </Button>
      </View>
    );
  };
  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    return (
      <Form style={{ height: Dimensions.get("window").height * 0.7 }}>
        <Item regular>
          <Input
            editable={false}
            placeholder="Amount Paid"
            value={mc.moneyFormat(this.props.value)}
            style={{ color: "black", textAlign: "right" }}
            underlineColorAndroid="transparent"
          />
        </Item>
        <FlatList
          numColumns={4}
          style={{ marginTop: 15 }}
          data={[
            { text: "1000" },
            { text: "7" },
            { text: "8" },
            { text: "9" },
            { text: "500" },
            { text: "4" },
            { text: "5" },
            { text: "6" },
            { text: "200" },
            { text: "1" },
            { text: "2" },
            { text: "3" },
            { text: "100" },
            { text: "." },
            { text: "0" },
            { text: "Del" },
          ]}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
        />
        <Button
          disabled={!this.props.value}
          block
          onPress={() => this.props.onPay()}
        >
          <Icon
            name="shopping-cart"
            color="white"
            size={Dimensions.get("window").width * 0.03}
          />
          <Text
            style={{
              color: "white",
              fontSize: Dimensions.get("window").width * 0.02,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            Pay
          </Text>
        </Button>
      </Form>
    );
  }
}
