import * as React from "react";
import { Dimensions, Text, FlatList } from "react-native";
import { Form, Item, Button, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
var MoneyCurrency = require("money-currencies");
import { currentLanguage } from "../../translations/CurrentLanguage";

import NumberKeyComponent from "./NumberKeyComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class NumberKeysComponent extends React.PureComponent {
  onPay = () => this.props.onPay();

  _extractKey = (item, index) => index;
  _renderItem = ({ item, index }) => {
    return (
      <NumberKeyComponent
        text={item.text}
        onChangeNumberKeyClick={this.props.onChangeNumberKeyClick}
      />
    );
  };
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );
    return (
      <Form style={{ height: Dimensions.get("window").height * 0.7 }}>
        <Item regular>
          <Input
            editable={false}
            placeholder={strings.AmountPaid}
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
          keyExtractor={this._extractKey}
          renderItem={this._renderItem}
        />
        <Button block disabled={!this.props.value} onPress={this.onPay}>
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
            {strings.Pay}
          </Text>
        </Button>
      </Form>
    );
  }
}
