import * as React from "react";
import { View } from "react-native";
import { Input, Text, Button } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class DiscountCurrentSelectedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "sample",
    };
  }
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <View style={{ borderBottomWidth: 1 }}>
        <Text style={{ padding: 10, fontSize: 14, fontWeight: "bold" }}>
          {strings.CurrentDiscountSelected}
        </Text>
        {this.props.currentDiscount ? (
          <View
            style={{
              padding: 10,
              flexDirection: "row",
            }}
          >
            <Input
              placeholder="Current Selected"
              value={this.props.currentDiscount.name}
              style={{ fontSize: 14 }}
            />
            <Button
              onPress={() =>
                this.props.onCancelDiscount(this.props.currentDiscount)
              }
            >
              <Text>{strings.Cancel}</Text>
            </Button>
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>{strings.NoSelectedDiscount}</Text>
          </View>
        )}
      </View>
    );
  }
}
