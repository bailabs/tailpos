// @flow
import * as React from "react";
import { View, Text } from "react-native";
import { Button, Label } from "native-base";
import Modal from "react-native-modal";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class RegistrationCompleteModal extends React.Component {
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    return (
      <Modal isVisible={this.props.isVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Icon
            name="check-circle-outline"
            size={72}
            style={{ textAlign: "center" }}
            color="#32cd32"
          >
            <Label style={{ fontSize: 28 }}>
              {"\n\n"} {strings.YouHaveSuccessfullyRegistered}
            </Label>
          </Icon>
          <Button
            primary
            full
            style={{ marginTop: 32 }}
            onPress={() => this.props.onClose()}
          >
            <Text style={{ color: "white" }}>{strings.Close}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}
