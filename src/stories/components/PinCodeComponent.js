import * as React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import CodeInput from "react-native-confirmation-code-input";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class PinCodeComponent extends React.Component {
  render() {
    return (
      <View style={{ alignItems: "center", alignSelf: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 24, color: "#427ec6" }}>
          {strings.EnterPINCode}
        </Text>
        <CodeInput
          keyboardType="numeric"
          activeColor="rgba(66, 126, 198, 1)"
          inactiveColor="rgba(66, 126, 198, 0.3)"
          size={50}
          codeLength={4}
          autoFocus={false}
          ignoreCase={true}
          compareWithCode={this.props.code}
          codeInputStyle={{ borderWidth: 2 }}
          onFulfill={isValid => this.props.onFulfill(isValid)}
          secureTextEntry
        />
      </View>
    );
  }
}
