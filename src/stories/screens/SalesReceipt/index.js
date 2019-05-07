import * as React from "react";
import { StyleSheet } from "react-native";

import { Content, Container } from "native-base";

import { observer } from "mobx-react/native";

import TotalLineComponent from "@components/TotalLineComponent";
import GrandTotalComponent from "@components/GrandTotalComponent";
import ReceiptLinesComponent from "@components/ReceiptLinesComponent";
import FooterTicketComponent from "@components/FooterTicketComponent";

@observer
class SalesReceipt extends React.Component {
  onReceiptLineDelete = index => this.props.onReceiptLineDelete(index);
  onReceiptLineEdit = index => this.props.onReceiptLineEdit(index);
  onPaymentClick = text => this.props.onPaymentClick(text);

  render() {
    const {
      receipt,
      onViewOrders,
      currency,
      isDiscountsEmpty,
      onDeleteClick,
      onBarcodeClick,
      onDiscountClick,
      onTakeAwayClick,
      hasTailOrder,
      currentTable,
      onCancelOrder,
      isViewingOrder,
    } = this.props;

    return (
      <Container>
        <GrandTotalComponent
          currency={currency}
          hasTailOrder={hasTailOrder}
          onViewOrders={onViewOrders}
          grandTotal={receipt ? receipt.netTotal.toFixed(2) : "0.00"}
        />
        <Content style={styles.content}>
          <ReceiptLinesComponent
            currency={currency}
            lines={receipt ? receipt.lines.slice() : []}
            onReceiptLineEdit={this.onReceiptLineEdit}
            onReceiptLineDelete={this.onReceiptLineDelete}
          />

          <TotalLineComponent
            currency={currency}
            receipt={receipt ? receipt : ""}
            subtotal={receipt ? receipt.subtotal.toFixed(2) : "0.00"}
            discount={receipt ? receipt.discounts.toFixed(2) : "0.00"}
            taxesValue={receipt ? receipt.taxesValue.toFixed(2) : "0.00"}
            totalPayment={receipt ? receipt.netTotal.toFixed(2) : "0.00"}
          />
        </Content>
        <FooterTicketComponent
          hasTailOrder={hasTailOrder}
          onDeleteClick={onDeleteClick}
          onBarcodeClick={onBarcodeClick}
          onDiscountClick={onDiscountClick}
          onTakeAwayClick={onTakeAwayClick}
          onPaymentClick={this.onPaymentClick}
          receipt={receipt ? receipt : ""}
          isDiscountsEmpty={isDiscountsEmpty}
          totalQty={receipt ? receipt.grandQuantity : 0}
          totalSubTotal={receipt ? receipt.subtotal.toFixed(2) : "0.00"}
          currentTable={currentTable}
          onCancelOrder={onCancelOrder}
          isViewingOrder={isViewingOrder}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
  },
});

export default SalesReceipt;
