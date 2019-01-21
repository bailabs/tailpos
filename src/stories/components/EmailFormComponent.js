import * as React from "react";
import { Form, Item, Input, Button, Text } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// TODO: styles based from props
const EmailFormComponent = props => {
  return (
    <Form style={{ width: 350 }}>
      <Item
        regular
        error={props.emailError}
        style={{ backgroundColor: "white" }}
      >
        <Icon active name="account" size={30} />
        <Input
          placeholder="Name"
          value={props.userName}
          onChangeText={text => props.onNameChange(text)}
        />
      </Item>
      <Item
        regular
        error={props.emailError}
        style={{ backgroundColor: "white" }}
      >
        <Icon active name="lock-open" size={30} />
        <Input
          keyboardType="numeric"
          placeholder="Pin"
          value={props.pin}
          onChangeText={text => props.onPinChange(text)}
          secureTextEntry={props.securityPinStatus}
        />
        <Icon
          active
          name={props.securityPinStatus ? "eye-off" : "eye"}
          size={30}
          onPress={props.onPinSecurityStatus}
        />
      </Item>
      <Item
        regular
        error={props.passwordError}
        style={{ backgroundColor: "white" }}
      >
        <Icon active name="lock-open" size={30} />
        <Input
          placeholder="Confirm Pin"
          value={props.confirmPin}
          onChangeText={text => props.onConfirmPinChange(text)}
          keyboardType="numeric"
          secureTextEntry={props.securityConfirmPinStatus}
        />
        <Icon
          active
          name={props.securityConfirmPinStatus ? "eye-off" : "eye"}
          size={30}
          onPress={props.onConfirmPinSecurityStatus}
        />
      </Item>
      <Button
        block
        onPress={() => props.onSubmit()}
        style={{ backgroundColor: "#427ec6" }}
      >
        <Text>{props.submitText}</Text>
      </Button>
    </Form>
  );
};

export default EmailFormComponent;
