import * as React from "react";
import { Toast } from "native-base";
import { observer, inject } from "mobx-react/native";

import Signup from "@screens/Signup";

@inject("signupForm")
@observer
class SignupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledRegisterButton: false,
    };
  }
  onBack() {
    this.props.navigation.goBack();
  }

  onRegister() {
    this.setState({ disabledRegisterButton: true });
    this.props.signupForm.validateForm();

    if (this.props.signupForm.isValid) {
      this.props.signupForm
        .register()
        .then(result => {
          const { created } = result;
          if (created) {
            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onSuccess();
          } else {
            Toast.show({
              text: "Unable to register. E-mail address is already taken.",
              buttonText: "Okay",
              type: "warning",
              duration: 5000,
            });
          }
          this.setState({ disabledRegisterButton: false });
        })
        .catch(error => {
          Toast.show({
            text: "Unable to register. Connection failed.",
            buttonText: "Okay",
            type: "warning",
            duration: 5000,
          });
          this.setState({ disabledRegisterButton: false });
        });
    } else {
      this.setState({ disabledRegisterButton: false });
      const {
        emailError,
        passwordError,
        confirmPasswordError,
        firstNameError,
        lastNameError,
      } = this.props.signupForm;

      if (firstNameError) {
        Toast.show({
          text: "First name: " + firstNameError,
          buttonText: "Okay",
          type: "warning",
          duration: 5000,
        });
      } else if (lastNameError) {
        Toast.show({
          text: "Last name: " + lastNameError,
          buttonText: "Okay",
          type: "warning",
          duration: 5000,
        });
      } else if (emailError) {
        Toast.show({
          text: "Email: " + emailError,
          buttonText: "Okay",
          type: "warning",
          duration: 5000,
        });
      } else if (passwordError) {
        Toast.show({
          text: "Password: " + passwordError,
          buttonText: "Okay",
          type: "warning",
          duration: 5000,
        });
      } else if (confirmPasswordError) {
        Toast.show({
          text: "Confirm password: " + confirmPasswordError,
          buttonText: "Okay",
          type: "warning",
          duration: 5000,
        });
      }
    }
  }

  onEmailChange(text) {
    this.props.signupForm.emailOnChange(text);
  }

  onPasswordChange(text) {
    this.props.signupForm.passwordOnChange(text);
  }

  onConfirmPasswordChange(text) {
    this.props.signupForm.confirmPasswordOnChange(text);
  }

  onFirstNameChange(text) {
    this.props.signupForm.firstNameOnChange(text);
  }

  onLastNameChange(text) {
    this.props.signupForm.lastNameOnChange(text);
  }

  onEmailCheck() {
    this.props.signupForm.validateEmail();
    if (!this.props.signupForm.emailError) {
      this.props.signupForm.emailCheck().then(result => {
        if (result.not_available) {
          this.props.signupForm.emailNotAvailable();
          Toast.show({
            text: "Email already exists.",
            buttonText: "Okay",
            type: "danger",
          });
        } else {
          Toast.show({
            text: "Email is available.",
            buttonText: "Okay",
          });
        }
      });
    } else {
      Toast.show({
        text: "Input a valid email.",
        buttonText: "Okay",
        type: "danger",
      });
    }
  }

  render() {
    return (
      <Signup
        onBack={() => this.onBack()}
        onRegister={() => this.onRegister()}
        onEmailCheck={() => this.onEmailCheck()}
        onEmailChange={text => this.onEmailChange(text)}
        onPasswordChange={text => this.onPasswordChange(text)}
        onConfirmPasswordChange={text => this.onConfirmPasswordChange(text)}
        onFirstNameChange={text => this.onFirstNameChange(text)}
        onLastNameChange={text => this.onLastNameChange(text)}
        disabledRegisterButton={this.state.disabledRegisterButton}
        emailError={this.props.signupForm.emailError}
        passwordError={this.props.signupForm.passwordError}
        lastNameError={this.props.signupForm.lastNameError}
        firstNameError={this.props.signupForm.firstNameError}
        confirmPasswordError={this.props.signupForm.confirmPasswordError}
      />
    );
  }
}

export default SignupContainer;
