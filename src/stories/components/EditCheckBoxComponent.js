import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBox, Toast } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class EditCheckBoxComponent extends React.PureComponent {
  onPress = () => {
    const { disabled, onPress } = this.props;
    if (disabled) {
      Toast.show({
        text: strings.PleaseClickTheEditButton,
        buttonText: "Okay",
      });
    } else {
      onPress();
    }
  };

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      const { checked, label, disabled } = this.props;
    return (
      <View style={styles.view}>
        <CheckBox
          checked={checked}
          color={disabled ? "#cfcfcf" : "#ca94ff"}
          style={styles.checkbox}
          onPress={this.onPress}
        />
        <Text style={styles.text}>{label}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    paddingLeft: 17,
    paddingRight: 17,
  },
  checkbox: {
    left: 0,
  },
  text: {
    marginLeft: 10,
  },
});

export default EditCheckBoxComponent;
