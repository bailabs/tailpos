import * as React from "react";
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Title,
  Right,
  Content,
} from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import SingleReceiptComponent from "@components/SingleReceiptComponent";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class ReceiptInfo extends React.Component {
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    const {
      defaultPayment,
      paymentReceipt,
      paymentCustomer,
    } = this.props.paymentStore;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
                size={24}
                color="white"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>{strings.Receipt}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <SingleReceiptComponent
            currency={this.props.currency}
            connectDevice={() => this.props.connectDevice()}
            reprintStatus={this.props.reprintStatus}
            onEditReason={text => this.props.onEditReason(text)}
            editStatus={this.props.editStatus}
            cancelStatus={this.props.cancelStatus}
            onChangeCancelStatus={text => this.props.onChangeCancelStatus(text)}
            onChangeReason={text => this.props.onChangeReason(text)}
            reasonValue={this.props.reasonValue}
            printer={false}
            customer={paymentCustomer.name}
            discountName={paymentReceipt.discountName}
            discountType={paymentReceipt.discountType}
            total={paymentReceipt.netTotal.toFixed(2)}
            date={defaultPayment.date.toLocaleString()}
            status={paymentReceipt.status}
            reason={paymentReceipt.reason}
            receiptLines={paymentReceipt.lines.slice()}
            amountPaid={defaultPayment.paid.toFixed(2)}
            onCancel={obj => this.props.onReceiptCancel(obj)}
            discount={paymentReceipt.discounts.toFixed(2)}
            receipt={this.props.receipt}
            onReprint={values => this.props.onReprint(values)}
            change={this.props.paymentStore.amountChange.toFixed(2)}
          />
        </Content>
      </Container>
    );
  }
}

export default ReceiptInfo;
