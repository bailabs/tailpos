import {
  nfc_initialization,
  // validate_tag_event,
  unregister_tag_event,
} from "./nfc_manager_initialization";
export default class PaymentController {
  constructor(stateStore) {
    this.stateStore = stateStore;
  }
  modalVisibleChange = modalVisible => {
    this.stateStore.changeValue("modalVisible", modalVisible, "Payment");
  };
  onChangePayment = (payment, props) => {
    this.stateStore.changeValue("selected", payment, "Payment");
    if (payment === "Wallet" && !props.stateStore.settings_state[0].multipleMop) {
      this.stateStore.setPaymentValue(this.stateStore.amount_due);
      nfc_initialization(props, this.stateStore.deviceId);
      // validate_tag_event(
      //   {
      //     techTypes: [
      //       "android.nfc.tech.NfcA",
      //       "android.nfc.tech.MifareClassic",
      //       "android.nfc.tech.NdefFormatable",
      //     ],
      //     id: "9AF076DF",
      //   },
      //   props,
      //   this.stateStore.deviceId,
      // );

    } else {
      this.stateStore.setPaymentValue("0");
      unregister_tag_event();
    }
  };

  onChangeCustomerName = customerName => {
    this.stateStore.changeValue("customerName", customerName, "Payment");
  };
  onChangeCustomerEmail = customerEmail => {
    this.stateStore.changeValue("customerEmail", customerEmail, "Payment");
  };
  onChangeCustomerPhoneNumber = customerPhoneNumber => {
    this.stateStore.changeValue(
      "customerPhoneNumber",
      customerPhoneNumber,
      "Payment",
    );
  };
  onChangeCustomerNotes = customerNotes => {
    this.stateStore.changeValue("customerNotes", customerNotes, "Payment");
  };
}
