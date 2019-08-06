export default class PaymentController {
  constructor(stateStore) {
    this.stateStore = stateStore;
  }
  modalVisibleChange = (modalVisible) => {
    this.stateStore.changeValue("modalVisible", modalVisible, "Payment");
  }
  onChangePayment = (payment) => {
    this.stateStore.changeValue("selected", payment, "Payment");
  }
  onChangeCustomerName = (customerName) => {
    this.stateStore.changeValue("customerName", customerName, "Payment");
  }
  onChangeCustomerEmail = (customerEmail) => {
    this.stateStore.changeValue("customerEmail", customerEmail, "Payment");
  }
  onChangeCustomerPhoneNumber = (customerPhoneNumber) => {
    this.stateStore.changeValue("customerPhoneNumber", customerPhoneNumber, "Payment");
  }
  onChangeCustomerNotes = (customerNotes) => {
    this.stateStore.changeValue("customerNotes", customerNotes, "Payment");
  }
}


