import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { Toast } from "native-base";
import SplashScreen from "react-native-splash-screen";

import Login from "@screens/Login";

@inject(
  "loginForm",
  "tokenStore",
  "itemStore",
  "categoryStore",
  "discountStore",
  "shiftStore",
  "attendantStore",
  "receiptStore",
  "paymentStore",
  "roleStore",
)
@observer
export default class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: "idle",
      verificationVisible: false,
      pin: "",
      confirmPin: "",
      securityPinStatus: true,
      securityConfirmPinStatus: true,
      userName: "",
    };
  }

  componentWillMount() {
    // because log-out
    const isLogout = this.props.navigation.getParam("isLogout", false);

    // if logging out
    if (isLogout) {
      // token stores parin
      const { currentToken } = this.props.tokenStore;

      // remove current session
      currentToken.delete();

      // item, category, discounts
      this.props.itemStore.destroyDb();
      this.props.shiftStore.destroyDb();
      this.props.paymentStore.destroyDb();
      this.props.receiptStore.destroyDb();
      this.props.categoryStore.destroyDb();
      this.props.discountStore.destroyDb();
      this.props.attendantStore.destroyDb();
    } else {
      // getting the current token

      this.props.tokenStore.getCurrentToken().then(result => {
        // if naay session
        if (result !== null) {
          this.props.navigation.navigate("Loading", { isLogin: true });
        }
      });
    }
  }

  componentDidMount() {
    // hide the splash screen
    SplashScreen.hide();
  }

  onSetPin() {
    if (this.state.userName) {
      if (this.state.pin.length === 4) {
        if (this.state.pin === this.state.confirmPin) {
          this.props.attendantStore.add({
            user_name: this.state.userName,
            pin_code: this.state.pin,
            role: "Owner",
            canLogin: true,
            dateUpdated: Date.now(),
            syncStatus: false,
          });
          this.props.roleStore.add({
            role: "Owner",
          });
          this.props.navigation.navigate("Loading");
        } else {
          Toast.show({
            text: "Pin code does not match",
            buttonText: "Okay",
            type: "danger",
            duration: 5000,
          });
        }
      } else {
        Toast.show({
          text: "Pin must be exactly 4 characters",
          buttonText: "Okay",
          type: "danger",
          duration: 5000,
        });
      }
    } else {
      Toast.show({
        text: "Enter valid name",
        buttonText: "Okay",
        type: "danger",
        duration: 5000,
      });
    }
    // this.props.loginForm.validateForm();
    //
    // if (this.state.loginStatus === "idle" && this.props.loginForm.isValid) {
    //   this.props.loginForm
    //     .login()
    //     .then(result => {
    //       // if naay token and db name
    //
    //       if (result) {
    //         const { verified } = result;
    //         const { valid } = result;
    //
    //         if (!verified) {
    //           Toast.show({
    //             text: "Email is not verified. Check your email for the code.",
    //             buttonText: "Okay",
    //             duration: 5000,
    //           });
    //
    //           // verification
    //           this.setState({ verificationVisible: true });
    //         } else {
    //           if (valid) {
    //             this.props.loginForm.clearStore();
    //             this.props.tokenStore.createAndSetToken(result);
    //             this.props.navigation.navigate("Loading");
    //           }
    //         }
    //
    //         this.setState({ loginStatus: "idle" });
    //       }
    //     })
    //     .catch(error => {
    //       if (error === 500 || error === 401) {
    //         Toast.show({
    //           text: "Unable to login. Check your credentials.",
    //           buttonText: "Okay",
    //           type: "danger",
    //           duration: 5000,
    //         });
    //       } else {
    //         Toast.show({
    //           text: "Unable to login. Connection failed.",
    //           buttonText: "Okay",
    //           type: "danger",
    //           duration: 5000,
    //         });
    //       }
    //       this.setState({ loginStatus: "idle" });
    //     });
    //
    //   // pending status
    //   this.setState({ loginStatus: "pending" });
    // } else {
    //   let errorMessage = "";
    //   if (this.props.loginForm.emailError) {
    //     errorMessage = this.props.loginForm.emailError;
    //   } else {
    //     errorMessage = this.props.loginForm.passwordError;
    //   }
    //   Toast.show({
    //     text: errorMessage,
    //     buttonText: "Okay",
    //     type: "danger",
    //     duration: 5000,
    //   });
    // }
  }

  onCodeInputClose() {
    this.setState({ verificationVisible: false });
  }

  registered() {
    this.props.loginForm.registered();
  }

  render() {
    return (
      <Login
        onSetPin={() => this.onSetPin()}
        onVerify={code => this.onVerify(code)}
        onResend={() => this.onResend()}
        onNameChange={text => this.setState({ userName: text })}
        onPinSecurityStatus={() =>
          this.setState({ securityPinStatus: !this.state.securityPinStatus })
        }
        onConfirmPinSecurityStatus={() =>
          this.setState({
            securityConfirmPinStatus: !this.state.securityConfirmPinStatus,
          })
        }
        onPinChange={text => this.setState({ pin: text })}
        onConfirmPinChange={text => this.setState({ confirmPin: text })}
        status={this.state.loginStatus}
        onCodeInputClose={() => this.onCodeInputClose()}
        verificationVisible={this.state.verificationVisible}
        userName={this.state.userName}
        pin={this.state.pin}
        confirmPin={this.state.confirmPin}
        securityPinStatus={this.state.securityPinStatus}
        securityConfirmPinStatus={this.state.securityConfirmPinStatus}
      />
    );
  }
}
