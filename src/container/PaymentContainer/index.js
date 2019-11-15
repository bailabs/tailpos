import * as React from "react";
import { Alert } from "react-native";
import { Toast } from "native-base";
import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import * as EmailValidator from "email-validator";
import { inject, observer } from "mobx-react/native";
import { unregister_tag_event } from "./nfc_manager_initialization";
import { currentLanguage } from "../../translations/CurrentLanguage";

import PaymentController from "./controller";
import PaymentScreen from "@screens/Payment";
import { on_pay } from "./on_pay";
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

@inject(
  "itemStore",
  "customerStore",
  "receiptStore",
  "discountStore",
  "categoryStore",
  "paymentStore",
  "printerStore",
  "shiftStore",
  "attendantStore",
  "stateStore",
)
@observer
export default class PaymentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.controller = new PaymentController(props.stateStore);
    this.state = { arrayObjects: [] };
  }

  componentWillMount() {
    const { stateStore } = this.props;
    this.props.stateStore.setBalance(
      (
        parseFloat(stateStore.amount_due, 10) -
        parseFloat(this.get_payment_total(), 10)
      ).toString(),
    );
    this.props.stateStore.changeValue("selected", "Cash", "Payment");

    this.props.stateStore.setPaymentValue("0");

    if (this.props.customerStore.rows.length > 0) {
      this.setState({ arrayObjects: this.props.customerStore.rows.slice() });
    }

    const { params } = this.props.navigation.state;

    this.getBluetoothState(params.receipt);
    if (!this.props.printerStore.defaultPrinter) {
      // this.setState({ connectionStatus: "No Default Printer" });
      this.props.stateStore.changeValue(
        "connectionStatus",
        "No Default Printer",
        "Payment",
      );
    }
    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        // this.setState({ connectionStatus: "Connecting..." });
        this.props.stateStore.changeValue(
          "connectionStatus",
          "Connecting...",
          "Payment",
        );

        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            // this.setState({ connection: true });
            this.props.stateStore.changeValue("connection", true, "Payment");

            this.props.printerStore.setDefaultPrinter({
              _id: this.props.printerStore.rows[i]._id,
              name: this.props.printerStore.rows[i].name,
              macAddress: this.props.printerStore.rows[i].macAddress,
              defaultPrinter: this.props.printerStore.rows[i].defaultPrinter,
            });
          })
          .catch(() => {
            // this.setState({ connectionStatus: "Connecting..." });
            this.props.stateStore.changeValue(
              "connectionStatus",
              "Connecting...",
              "Payment",
            );

            BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
              .then(() => {
                // this.setState({ connection: true });
                this.props.stateStore.changeValue(
                  "connection",
                  true,
                  "Payment",
                );

                this.props.printerStore.setDefaultPrinter({
                  _id: this.props.printerStore.rows[i]._id,
                  name: this.props.printerStore.rows[i].name,
                  macAddress: this.props.printerStore.rows[i].macAddress,
                  defaultPrinter: this.props.printerStore.rows[i]
                    .defaultPrinter,
                });
              })
              .catch(() => {
                // this.setState({ connectionStatus: "Offline" });
                this.props.stateStore.changeValue(
                  "connectionStatus",
                  "Offline",
                  "Payment",
                );
              });
          });
      }
    }
  }

  async getBluetoothState(value) {
    if (value) {
      BluetoothStatus.enable(true);
    } else {
      BluetoothStatus.disable(true);
    }
  }

  onValueChange = text => {
    if (text === "Del") {
      const finalValue = this.props.stateStore.payment_value.slice(0, -1);
      this.props.stateStore.setPaymentValue(finalValue);
    } else {
      if (text.length > 1) {
        this.props.stateStore.setPaymentValue(text);
      } else {
        if (this.props.stateStore.payment_value === "0") {
          this.props.stateStore.setPaymentValue(text);
        } else {
          this.props.stateStore.setPaymentValue(
            this.props.stateStore.payment_value + text,
          );
        }
      }
    }
  };

  onPay = async () => {
    const { defaultReceipt } = this.props.receiptStore;
    const { defaultAttendant } = this.props.attendantStore;
    defaultReceipt.setAttendant(defaultAttendant.user_name);
    on_pay(this.props);
  };

  onBack() {
    this.props.navigation.goBack();
  }

  navigation = () => {
    this.props.stateStore.setPaymentValue("0");
    this.props.stateStore.setMopAmount("0");
    const { stateStore } = this.props;
    stateStore.resetPaymentTypes();
    unregister_tag_event();
    this.getBluetoothState(true);
    this.onBack();
  };
  onPrinterPress = () => {
    this.props.navigation.navigate("Settings");
  };

  onConnectDevice() {
    if (this.props.printerStore.rows.length > 0) {
      for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
        if (this.props.printerStore.rows[i].defaultPrinter) {
          // this.setState({ connectionStatus: "Connecting..." });
          this.props.stateStore.changeValue(
            "connectionStatus",
            "Connecting...",
            "Payment",
          );

          BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
            .then(() => {
              // this.setState({ connection: true });
              this.props.stateStore.changeValue("connection", true, "Payment");

              this.props.printerStore.setDefaultPrinter({
                _id: this.props.printerStore.rows[i]._id,
                name: this.props.printerStore.rows[i].name,
                macAddress: this.props.printerStore.rows[i].macAddress,
                defaultPrinter: this.props.printerStore.rows[i].defaultPrinter,
              });
              // this.setState({ connectionStatus: "Connected" });
              this.props.stateStore.changeValue(
                "connectionStatus",
                "Connected",
                "Payment",
              );
            })
            .catch(() => {
              BluetoothSerial.connect(
                this.props.printerStore.rows[i].macAddress,
              )
                .then(() => {
                  // this.setState({ connection: true });
                  this.props.stateStore.changeValue(
                    "connection",
                    true,
                    "Payment",
                  );

                  this.props.printerStore.setDefaultPrinter({
                    _id: this.props.printerStore.rows[i]._id,
                    name: this.props.printerStore.rows[i].name,
                    macAddress: this.props.printerStore.rows[i].macAddress,
                    defaultPrinter: this.props.printerStore.rows[i]
                      .defaultPrinter,
                  });
                  // this.setState({ connectionStatus: "Connected" });
                  this.props.stateStore.changeValue(
                    "connectionStatus",
                    "Connected",
                    "Payment",
                  );
                })
                .catch(() => {
                  // this.setState({ connectionStatus: "Not Connected" });
                  this.props.stateStore.changeValue(
                    "connectionStatus",
                    "Not Connected",
                    "Payment",
                  );
                });
            });
        }
      }
    } else {
      Toast.show({
        text: strings.NoAddedPrinterDevice,
        buttonText: strings.Okay,
        position: "bottom",
        duration: 6000,
      });
    }
  }

  searchCustomer = text => {
    this.props.customerStore.search(text).then(result => {
      for (let i = 0; i < result.length; i += 1) {
        let existing = false;
        for (let v = 0; v < this.state.arrayObjects.length; v += 1) {
          if (result[i]._id === this.state.arrayObjects[v]._id) {
            existing = true;
          }
        }
        if (!existing) {
          this.state.arrayObjects.push(result[i]);
        }
      }
    });
  };

  onSaveCustomer = () => {
    if (this.props.stateStore.payment_state[0].customerName) {
      if (
        EmailValidator.validate(
          this.props.stateStore.payment_state[0].customerEmail,
        )
      ) {
        this.props.customerStore.add({
          name: this.props.stateStore.payment_state[0].customerName,
          email: this.props.stateStore.payment_state[0].customerEmail,
          phoneNumber: this.props.stateStore.payment_state[0]
            .customerPhoneNumber,
          note: this.props.stateStore.payment_state[0].customerNotes,
        });
        this.props.stateStore.changeValue("modalVisible", false, "Payment");
        this.props.stateStore.changeValue("customerName", "", "Payment");
        this.props.stateStore.changeValue("customerEmail", "", "Payment");
        this.props.stateStore.changeValue("customerPhoneNumber", "", "Payment");
        this.props.stateStore.changeValue("customerNotes", "", "Payment");
      } else {
        Alert.alert(strings.InvalidEmail, strings.PleaseEnterValidEmail);
      }
    } else {
      Alert.alert(strings.InvalidEmail, strings.PleaseEnterValidEmail);
    }
  };

  onCancelAddCustomer = () => {
    this.props.stateStore.changeValue("modalVisible", false, "Payment");
    this.props.stateStore.changeValue("customerName", "", "Payment");
    this.props.stateStore.changeValue("customerEmail", "", "Payment");
    this.props.stateStore.changeValue("customerPhoneNumber", "", "Payment");
    this.props.stateStore.changeValue("customerNotes", "", "Payment");
  };
  get_payment_total = () => {
    let payment_data = JSON.parse(this.props.stateStore.payment_types);
    let total = 0;
    for (let i = 0; i < payment_data.length; i += 1) {
      total += payment_data[i].amount;
    }
    return total;
  };
  addMultipleMop = () => {
    const { stateStore } = this.props;
    if (parseFloat(this.props.stateStore.payment_value, 10) > 0) {
      stateStore.updatePaymentType({
        type: this.props.stateStore.payment_state[0].selected,
        amount: parseFloat(this.props.stateStore.payment_value, 10),
      });
      stateStore.setMopAmount(this.get_payment_total().toString());
      stateStore.setBalance(
        (
          parseFloat(stateStore.amount_due, 10) -
          parseFloat(this.get_payment_total(), 10)
        ).toString(),
      );
      stateStore.setPaymentValue("0");
    } else {
      Toast.show({
        text: "Please input amount greater than 0",
        buttonText: strings.Okay,
        position: "bottom",
        duration: 6000,
      });
    }
  };
  removeMop = () => {
    const { stateStore } = this.props;
    stateStore.removePaymentType();
    stateStore.setMopAmount(this.get_payment_total().toString());
    stateStore.setBalance(
      (
        parseFloat(stateStore.amount_due, 10) -
        parseFloat(this.get_payment_total(), 10)
      ).toString(),
    );
  };
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    return (
      <PaymentScreen
        values={this.props.stateStore.payment_state[0].toJSON()}
        paymentTypes={JSON.parse(this.props.stateStore.payment_types)}
        paymentValue={this.props.stateStore.payment_value}
        balance={this.props.stateStore.balance}
        payment_amount_multiple={this.props.stateStore.payment_amount}
        amountDue={this.props.stateStore.amount_due}
        name={this.props.stateStore.payment_state[0].customerName}
        connectDevice={this.onConnectDevice}
        onValueChange={this.onValueChange}
        defaultCustomer={
          this.props.receiptStore.defaultCustomer.name.toString()
            ? this.props.receiptStore.defaultCustomer.name.toString()
            : "Default customer"
        }
        onPay={this.onPay}
        searchCustomer={this.searchCustomer}
        searchedCustomers={this.state.arrayObjects}
        modalVisibleChange={this.controller.modalVisibleChange}
        navigation={this.navigation}
        onPrinterPress={this.onPrinterPress}
        onChangePayment={payment =>
          this.controller.onChangePayment(payment, this.props)
        }
        onChangeCustomerName={this.controller.onChangeCustomerName}
        onChangeCustomerEmail={this.controller.onChangeCustomerEmail}
        onChangeCustomerPhoneNumber={this.onChangeCustomerPhoneNumber}
        onChangeCustomerNotes={this.controller.onChangeCustomerNotes}
        onSaveCustomer={this.onSaveCustomer}
        onCancelAddCustomer={this.onCancelAddCustomer}
        currency={
          this.props.printerStore.companySettings[0].countryCode
            ? this.props.printerStore.companySettings[0].countryCode
            : ""
        }
        useDefaultCustomer={this.props.stateStore.useDefaultCustomer}
        isCurrencyDisabled={this.props.stateStore.isCurrencyDisabled}
        settings_state={this.props.stateStore.settings_state[0]}
        addMultipleMop={this.addMultipleMop}
        removeMop={this.removeMop}
      />
    );
  }
}
