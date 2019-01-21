import * as React from "react";
import { View } from "react-native";
import { ListItem, Body, Text, Right, Icon } from "native-base";

const ReceiptListItemComponent = props => (
  <ListItem>
    <Body>
      <Text>{props.name}</Text>
      <Text note>{props.date}</Text>
    </Body>
    <Right>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Text>{props.amount}</Text>
          <Text note style={{ textAlign: "right" }}>
            {props.type}
          </Text>
        </View>
        <Icon active name="arrow-forward" style={{ marginLeft: 10 }} />
      </View>
    </Right>
  </ListItem>
);

export default ReceiptListItemComponent;
