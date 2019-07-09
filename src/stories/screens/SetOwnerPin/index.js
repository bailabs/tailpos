import * as React from "react";
import { View, Image } from "react-native";
import { Container, Content, Text, Input, Form, Item } from "native-base";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class Pin extends React.Component {
  render() {
    // const AttendantPicker = (
    //   <View style={{ alignItems: "center" }}>
    //     <Image
    //       style={{ width: 200, height: 64, opacity: 0.9, marginBottom: 25 }}
    //       source={{ uri: "whole_text_logo" }}
    //     />
    //     <Text
    //       style={{
    //         fontWeight: "bold",
    //         fontSize: 24,
    //         color: "#427ec6",
    //         textAlign: "center",
    //       }}
    //     >
    //       Select Attendant
    //     </Text>
    //     <Picker
    //       note
    //       mode="dropdown"
    //       style={{ width: 200 }}
    //       selectedValue={this.props.currentAttendant}
    //       onValueChange={(attendant, index) =>
    //         this.props.onAttendantChange(attendant, index)
    //       }
    //     >
    //       <Picker.Item label="None" value="" />
    //       {Attendants}
    //     </Picker>
    //     <Button
    //       block
    //       onPress={() => this.props.onNext()}
    //       style={{
    //         backgroundColor: "#427EC6",
    //         width: 200,
    //         alignSelf: "center",
    //       }}
    //     >
    //       <Text>Next</Text>
    //       <Icon name="chevron-right" color="white" size={24} />
    //     </Button>
    //   </View>
    // );
    //
    // const PinCode = (
    //   <View style={{ alignItems: "center" }}>
    //     <Image
    //       style={{ width: 200, height: 64, opacity: 0.9, marginBottom: 25 }}
    //       source={{ uri: "whole_text_logo" }}
    //     />
    //     <Text
    //       style={{
    //         fontWeight: "bold",
    //         fontSize: 24,
    //         color: "#427ec6",
    //         textAlign: "center",
    //       }}
    //     >
    //       Enter PIN
    //     </Text>
    //     <CodeInput
    //       size={50}
    //       codeLength={4}
    //       secureTextEntry
    //       autoFocus={false}
    //       ignoreCase={true}
    //       compareWithCode={this.props.code}
    //       codeInputStyle={{ borderWidth: 2 }}
    //       activeColor="rgba(66, 126, 198, 1)"
    //       inactiveColor="rgba(66, 126, 198, 0.3)"
    //       onFulfill={isValid => this.props.onFulfill(isValid)}
    //     />
    //   </View>
    // );

    // const PinComponent = this.props.selected ? PinCode : AttendantPicker;

    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              {strings.SetOwnerPin}
            </Text>
            <Form>
              <Item regular style={{ marginBottom: 10, width: 300 }}>
                <Input
                  value={this.props.values.pin}
                  placeholder="Pin"
                  onChangeText={text => this.props.onChangePin(text)}
                />
              </Item>
              <Item regular style={{ marginBottom: 10, width: 300 }}>
                <Input
                  value={this.props.values.confirmPin}
                  placeholder="Confirm Pin"
                  onChangeText={text => this.props.onChangeConfirmPin(text)}
                />
              </Item>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Pin;
