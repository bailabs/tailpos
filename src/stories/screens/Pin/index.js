import * as React from "react";
import { View, Image } from "react-native";
import { Container, Content, Text, Picker, Button } from "native-base";

import CodeInput from "react-native-confirmation-code-input";
import { currentLanguage } from "../../../translations/CurrentLanguage";


import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class Pin extends React.Component {
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
    const Attendants = this.props.attendants.map((value, index) => (
      <Picker.Item
        key={index}
        value={value._id}
        label={`${value.user_name} [${value.role}]`}
      />
    ));
    const AttendantPicker = (
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 64, opacity: 0.9, marginBottom: 25 }}
          source={{ uri: "whole_text_logo" }}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
            color: "#427ec6",
            textAlign: "center",
          }}
        >
          {strings.SelectAttendant}
        </Text>
        <Picker
          note
          mode="dropdown"
          style={{ width: 200 }}
          selectedValue={this.props.currentAttendant}
          onValueChange={(attendant, index) =>
            this.props.onAttendantChange(attendant, index)
          }
        >
          <Picker.Item label={strings.None} value="" />
          {Attendants}
        </Picker>
        <Button
          block
          onPress={() => this.props.onNext()}
          style={{
            backgroundColor: "#427EC6",
            width: 200,
            alignSelf: "center",
          }}
        >
          <Text>{strings.Next}</Text>
          <Icon name="chevron-right" color="white" size={24} />
        </Button>
      </View>
    );

    const PinCode = (
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 64, opacity: 0.9, marginBottom: 25 }}
          source={{ uri: "whole_text_logo" }}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
            color: "#427ec6",
            textAlign: "center",
          }}
        >
          {strings.EnterPin}
        </Text>
        <CodeInput
          size={50}
          codeLength={4}
          secureTextEntry
          autoFocus={false}
          ignoreCase={true}
          compareWithCode={this.props.code}
          codeInputStyle={{ borderWidth: 2 }}
          activeColor="rgba(66, 126, 198, 1)"
          inactiveColor="rgba(66, 126, 198, 0.3)"
          onFulfill={isValid => this.props.onFulfill(isValid)}
        />
      </View>
    );

    const PinComponent = this.props.selected ? PinCode : AttendantPicker;

    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
          {PinComponent}
        </Content>
      </Container>
    );
  }
}

export default Pin;
