import * as React from "react";

import { Content, Container } from "native-base";

import { observer } from "mobx-react/native";

import FooterTicketComponent from "@components/FooterTicketComponent";
import TotalLineComponent from "@components/TotalLineComponent";
import ReceiptLinesComponent from "@components/ReceiptLinesComponent";
import GrandTotalComponent from "@components/GrandTotalComponent";

@observer
export default class SalesReceipt extends React.Component {

  onReceiptLineDelete = (index) => this.props.onReceiptLineDelete(index)

  render() {
    return (
      <Container>
        <GrandTotalComponent // header
          grandTotal={
            this.props.receipt ? this.props.receipt.netTotal.toFixed(2) : "0.00"
          }
        />
        <Content style={{ backgroundColor: "white" }}>
          <ReceiptLinesComponent
            currency={this.props.currency}
            lines={this.props.receipt ? this.props.receipt.lines.slice() : []}
            onReceiptLineDelete={this.onReceiptLineDelete}
            onReceiptLineEdit={index => this.props.onReceiptLineEdit(index)}
          />

          <TotalLineComponent
            currency={this.props.currency}
            receipt={this.props.receipt ? this.props.receipt : ""}
            subtotal={
              this.props.receipt
                ? this.props.receipt.subtotal.toFixed(2)
                : "0.00"
            }
            discount={
              this.props.receipt
                ? this.props.receipt.discounts.toFixed(2)
                : "0.00"
            }
            totalPayment={
              this.props.receipt
                ? this.props.receipt.netTotal.toFixed(2)
                : "0.00"
            }
            taxesValue={
              this.props.receipt
                ? this.props.receipt.taxesValue.toFixed(2)
                : "0.00"
            }
          />
        </Content>
        <FooterTicketComponent
          totalSubTotal={
            this.props.receipt ? this.props.receipt.subtotal.toFixed(2) : "0.00"
          }
          receipt={this.props.receipt ? this.props.receipt : ""}
          totalQty={this.props.receipt ? this.props.receipt.grandQuantity : 0}
          isDiscountsEmpty={this.props.isDiscountsEmpty}
          onDeleteClick={() => this.props.onDeleteClick()}
          onBarcodeClick={() => this.props.onBarcodeClick()}
          onDiscountClick={() => this.props.onDiscountClick()}
          onPaymentClick={text => this.props.onPaymentClick(text)}
        />
      </Container>
    );
  }
}
