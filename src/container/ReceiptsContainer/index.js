// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import Receipts from "@screens/Receipts";
import { BluetoothStatus } from "react-native-bluetooth-status";

@inject(
  "paymentStore",
  "receiptStore",
  "customerStore",
  "attendantStore",
  "printerStore",
)
@observer
export default class ReceiptsContainer extends React.Component {
  componentWillMount() {
    this.getBluetoothState();
  }
  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if (!isEnabled) {
      BluetoothStatus.enable(true);
    }
  }

  onPaymentClick = index => {
    // payment object
    const payment = this.props.paymentStore.rows[index];

    // set the payment to be displayed
    this.props.paymentStore.setPayment(payment);

    // get the receipt
    this.props.receiptStore
      .find(payment.receipt)
      .then(result => {
        this.props.paymentStore.setReceipt(result);
        return this.props.customerStore.find(result.customer);
      })
      .then(result => {
        this.props.paymentStore.setCustomer(result);
        this.props.navigation.navigate("ReceiptInfo");
      });
  };

  onReceiptClick = obj => {
    // Receipt
    // const receipt = this.props.receiptStore.rows[index];
    this.props.paymentStore.setReceipt(obj);

    this.props.paymentStore
      .find(obj._id)
      .then(result => {
        this.props.paymentStore.setPayment(result);
        return this.props.customerStore.find(obj.customer);
      })
      .then(result => {
        this.props.paymentStore.setCustomer(result);
        this.props.navigation.navigate("ReceiptInfo");
      });
  };

  sortByDate = (a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  };

  sortByReceiptNumber = (a, b) => {
    return a.receiptNumber - b.receiptNumber;
  };

  onFindStatus(text) {
    return new Promise((resolve, reject) => {
      this.props.receiptStore.find(text).then(result => {
        resolve(result.status);
      });
    });
  }

  render() {
    return (
      <Receipts
        currency={
          this.props.printerStore.companySettings[0].countryCode
            ? this.props.printerStore.companySettings[0].countryCode
            : ""
        }
        navigation={this.props.navigation}
        payments={this.props.paymentStore.rows.slice()}
        status={this.props.receiptStore.rows
          .slice()
          .sort(this.sortByDate)
          .sort(this.sortByReceiptNumber)}
        receipts={this.props.receiptStore.rows
          .slice()
          .sort(this.sortByDate)
          .sort(this.sortByReceiptNumber)}
        onPaymentClick={this.onPaymentClick}
        onReceiptClick={this.onReceiptClick}
        currentAttendant={this.props.attendantStore.defaultAttendant}
      />
    );
  }
}
