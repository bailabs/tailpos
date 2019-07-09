import * as React from "react";
import { View } from "react-native";
import {
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Radio,
} from "native-base";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class EntryInputComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Content padder>
        <Form>
          <Item stackedLabel>
            <Label>{strings.ItemName}</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>{strings.Category}</Label>
            <Input />
          </Item>
          <Item
            stackedLabel
            style={{
              alignSelf: "flex-start",
              borderBottomWidth: 0,
            }}
          >
            <Label style={{ marginBottom: 15 }}>{strings.SoldBy}</Label>
            <View style={{ flexDirection: "row" }}>
              <Radio />
              <Text>{strings.Each}</Text>
              <Radio />
              <Text>{strings.Weight}</Text>
            </View>
          </Item>
          <Item stackedLabel>
            <Label>{strings.Price}</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>{strings.SKU}</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>{strings.Barcode}</Label>
            <Input />
          </Item>
          <Item style={{ alignSelf: "flex-end", marginBottom: 30 }}>
            <Button style={{ marginTop: 30 }}>
              <Text>{strings.AddNewItem}</Text>
            </Button>
          </Item>
        </Form>
      </Content>
    );
  }
}
