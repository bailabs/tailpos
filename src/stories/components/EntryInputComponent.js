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

export default class EntryInputComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Content padder>
        <Form>
          <Item stackedLabel>
            <Label>Item Name</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>Category</Label>
            <Input />
          </Item>
          <Item
            stackedLabel
            style={{
              alignSelf: "flex-start",
              borderBottomWidth: 0,
            }}
          >
            <Label style={{ marginBottom: 15 }}>Sold by</Label>
            <View style={{ flexDirection: "row" }}>
              <Radio />
              <Text>Each</Text>
              <Radio />
              <Text>Weight</Text>
            </View>
          </Item>
          <Item stackedLabel>
            <Label>Price</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>SKU</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>Barcode</Label>
            <Input />
          </Item>
          <Item style={{ alignSelf: "flex-end", marginBottom: 30 }}>
            <Button style={{ marginTop: 30 }}>
              <Text>Add new item</Text>
            </Button>
          </Item>
        </Form>
      </Content>
    );
  }
}
