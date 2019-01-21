import * as React from "react";
import { View, Text, Button } from "native-base";

const IdleComponent = props => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000025",
    }}
  >
    <View style={{ alignSelf: "center" }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#043c6c",
          marginBottom: 10,
        }}
      >
        Would you like to create new {props.type}?
      </Text>
      <Button
        style={{ alignSelf: "center", backgroundColor: "#4B4C9D" }}
        onPress={props.onPress}
      >
        <Text>Create new {props.type}</Text>
      </Button>
    </View>
  </View>
);

export default IdleComponent;
