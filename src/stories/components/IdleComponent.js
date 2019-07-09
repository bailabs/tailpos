import * as React from "react";
import { View, Text, Button } from "native-base";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
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
        {strings.WouldYouLikeToCreateNew} {props.type}?
      </Text>
      <Button
        style={{ alignSelf: "center", backgroundColor: "#4B4C9D" }}
        onPress={props.onPress}
      >
        <Text>
          {strings.CreateNew} {props.type}
        </Text>
      </Button>
    </View>
  </View>
);

export default IdleComponent;
