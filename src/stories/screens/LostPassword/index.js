import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  Container,
  Content,
  Text,
  Form,
  Item,
  Input,
  Button,
  Icon,
  Spinner,
} from "native-base";

import styles from "./styles";

class LostPassword extends React.Component {
  render() {
    const FormComponent = this.props.isRequesting ? (
      <Spinner color="#427ec6" />
    ) : (
      <Form style={{ width: 350 }}>
        <Item
          regular
          style={{ backgroundColor: "white" }}
          error={this.props.emailError ? true : false}
        >
          <Input
            placeholder="Email"
            onChangeText={text => this.props.onEmailChange(text)}
          />
        </Item>
        <Button
          block
          onPress={() => this.props.onSendPassword()}
          style={{ backgroundColor: "#427ec6" }}
        >
          <Text>Send password</Text>
        </Button>
        <TouchableOpacity
          onPress={this.props.onBack}
          style={{ marginTop: 10, opacity: 0.5 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="arrow-back"
              style={{ color: "#427ec6", marginRight: 10 }}
            />
            <Text style={{ color: "#427ec6", fontWeight: "bold" }}>Back</Text>
          </View>
        </TouchableOpacity>
      </Form>
    );

    return (
      <Container style={styles.container}>
        <Content
          padder
          contentContainerStyle={{ flex: 1, justifyContent: "center" }}
        >
          <View style={{ alignSelf: "center", alignItems: "center" }}>
            <Image
              style={{
                width: 200,
                height: 64,
                opacity: 0.75,
                marginBottom: 30,
              }}
              source={{ uri: "whole_text_logo" }}
            />
            {FormComponent}
          </View>
        </Content>
      </Container>
    );
  }
}

export default LostPassword;
