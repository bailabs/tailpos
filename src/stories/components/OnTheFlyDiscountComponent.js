import * as React from "react";
import { View } from "react-native";
import { Form, Item, Input, Text, Picker } from "native-base";
import { observer } from "mobx-react/native";

import ModalKeypadComponent from "@components/ModalKeypadComponent";
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
@observer
export default class OnTheFlyDiscountComponent extends React.Component {
  render() {
    return (
      <View style={{ width: 500, margin: 5, alignSelf: "center" }}>
        <View>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {strings.DiscountType}
          </Text>
          <Picker
            iosHeader="Select one"
            mode="dropdown"
            selectedValue={this.props.percentageType}
            onValueChange={value => this.props.onValueChange(value)}
          >
            <Picker.Item label={strings.Percentage} value="percentage" />
            <Picker.Item label={strings.FixDiscount} value="fixDiscount" />
          </Picker>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Form style={{ width: 240 }}>
            <Item regular>
              <Input
                editable={false}
                value={this.props.onTheFlyDiscountValue}
                keyboardType="numeric"
              />
            </Item>
          </Form>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ModalKeypadComponent
            onNumberPress={text => this.props.onNumberPress(text)}
            onDeletePress={() => this.props.onDeletePress()}
          />
        </View>
      </View>
    );
  }
}
