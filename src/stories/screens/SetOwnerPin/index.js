import * as React from "react";
import { View, Image } from "react-native";
import { Container, Content, Text, Input, Form, Item } from "native-base";
import { currentLanguage } from "../../../translations/CurrentLanguage";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class Pin extends React.Component {
  render() {

      strings.setLanguage(currentLanguage().companyLanguage);
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
