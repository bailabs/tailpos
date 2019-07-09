import * as React from "react";
import { View, Image } from "react-native";
import { Container, Content, Text, Spinner } from "native-base";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./styles";

import EmailFormComponent from "@components/EmailFormComponent";
import CodeInputComponent from "@components/CodeInputComponent";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class Login extends React.Component {
  render() {
    const LoginComponent =
      this.props.status === "idle" ? (
        <EmailFormComponent
          submitText="Set Pin"
          onSubmit={() => this.props.onSetPin()}
          onPinSecurityStatus={() => this.props.onPinSecurityStatus()}
          onConfirmPinSecurityStatus={() =>
            this.props.onConfirmPinSecurityStatus()
          }
          onNameChange={text => this.props.onNameChange(text)}
          onPinChange={text => this.props.onPinChange(text)}
          onConfirmPinChange={text => this.props.onConfirmPinChange(text)}
          userName={this.props.userName}
          pin={this.props.pin}
          confirmPin={this.props.confirmPin}
          securityPinStatus={this.props.securityPinStatus}
          securityConfirmPinStatus={this.props.securityConfirmPinStatus}
        />
      ) : (
        <Spinner color="white" />
      );

    return (
      <Container style={styles.container}>
        <CodeInputComponent
          visible={this.props.verificationVisible}
          onVerify={code => this.props.onVerify(code)}
          onResend={() => this.props.onResend()}
          onClose={() => this.props.onCodeInputClose()}
        />
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
            {LoginComponent}
          </View>
        </Content>
      </Container>
    );
  }
}

export default Login;
