import * as React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Button } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

const IdleComponent = props => (
  <View style={styles.view}>
    {strings.setLanguage(currentLanguage().companyLanguage)}

    <View style={styles.innerView}>
      <Text style={styles.text}>
        {strings.WouldYouLikeToCreateNew} {props.type}?
      </Text>
      <Button style={styles.button} onPress={props.onPress}>
        <Text>
          {strings.CreateNew} {props.type}
        </Text>
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000025",
  },
  innerView: {
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#043c6c",
    marginBottom: 10,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#4b4c9d",
  },
});

export default IdleComponent;
