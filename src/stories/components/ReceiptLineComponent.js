import * as React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import { formatNumber } from "accounting-js";

import { SwipeRow } from "react-native-swipe-list-view";

const ReceiptLineComponent = props => (
  <SwipeRow>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 30,
        paddingRight: 30,
      }}
    >
      <Text style={{ flex: 3, fontWeight: "bold" }}>{props.name}</Text>
      <Text style={{ flex: 1, textAlign: "right" }}>{props.quantity}</Text>
      <Text style={{ flex: 2, textAlign: "right" }}>
        {formatNumber(props.total)}
      </Text>
    </View>
  </SwipeRow>
);

export default ReceiptLineComponent;
