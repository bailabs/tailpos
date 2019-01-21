import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import {
  Container,
  Content,
  Text,
  Form,
  Item,
  Icon,
  Input,
  Button,
  Spinner,
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

class Signup extends React.Component {
  render() {
    const SpinnerComponent = this.props.disabledRegisterButton ? (
      <Spinner color="#427ec6" />
    ) : (
      <Button
        block
        onPress={this.props.onRegister}
        disabled={this.props.disabledRegisterButton}
        style={{ backgroundColor: "#427ec6" }}
      >
        <MaterialIcon name="account-plus" size={21} color="white" />
        <Text>Register</Text>
      </Button>
    );

    return (
      <Container>
        <Grid>
          <Col style={{ width: "35%", backgroundColor: "#dedede" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Image
                style={{
                  width: 128,
                  height: 160,
                  marginBottom: 30,
                  alignSelf: "center",
                }}
                source={{ uri: "foot_long_logo" }}
              />
            </View>
            <TouchableOpacity onPress={this.props.onBack}>
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Icon
                  name="arrow-back"
                  style={{ color: "#427ec6", marginRight: 10 }}
                />
                <Text style={{ color: "#427ec6", fontWeight: "bold" }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col style={{ width: "65%" }}>
            <Content padder>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <MaterialIcon
                  name="account-plus"
                  size={72}
                  color="#aaa"
                  style={{ marginRight: 15 }}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 36,
                    color: "#aaa",
                  }}
                >
                  Create Account
                </Text>
              </View>
              <Form>
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <Item
                    regular
                    error={this.props.firstNameError ? true : false}
                    style={{ flex: 1, marginRight: 15 }}
                  >
                    <Icon active name="person" />
                    <Input
                      placeholder="First name"
                      onChangeText={this.props.onFirstNameChange}
                    />
                  </Item>
                  <Item
                    regular
                    error={this.props.lastNameError ? true : false}
                    style={{ flex: 1 }}
                  >
                    <Icon active name="person" />
                    <Input
                      placeholder="Last name"
                      onChangeText={this.props.onLastNameChange}
                    />
                  </Item>
                </View>
                <Item
                  regular
                  error={this.props.emailError ? true : false}
                  style={{ marginBottom: 15 }}
                >
                  <Icon active name="mail" />
                  <Input
                    keyboardType="email-address"
                    placeholder="Email address"
                    onChangeText={this.props.onEmailChange}
                  />
                  <Button
                    style={{
                      height: "100%",
                      backgroundColor: "#427ec6",
                      paddingLeft: 15,
                      paddingRight: 15,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onPress={() => this.props.onEmailCheck()}
                  >
                    <MaterialIcon size={18} color="white" name="check-all" />
                  </Button>
                </Item>
                <Item
                  regular
                  error={this.props.passwordError ? true : false}
                  style={{ marginBottom: 15 }}
                >
                  <Icon active name="unlock" />
                  <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={this.props.onPasswordChange}
                  />
                </Item>
                <Item
                  regular
                  error={this.props.confirmPasswordError ? true : false}
                  style={{ marginBottom: 15 }}
                >
                  <Icon activate name="unlock" />
                  <Input
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    onChangeText={this.props.onConfirmPasswordChange}
                  />
                </Item>
              </Form>
              {SpinnerComponent}
            </Content>
          </Col>
        </Grid>
      </Container>
    );
  }
}

export default Signup;
