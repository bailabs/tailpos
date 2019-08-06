import * as React from "react";
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Title,
  Content,
  Form,
  Label,
  Item,
  Input,
  Picker,
} from "native-base";
import { View, Alert, StyleSheet } from "react-native";
import { formatNumber } from "accounting-js";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import NumberKeys from "@components/NumberKeysComponent";
import Printer from "@components/PrinterComponent";
import SearchableDropdown from "../../../stories/components/SearchableDropdownComponent";
import AddCustomer from "../../../stories/components/AddCustomerModalComponent";
let MoneyCurrency = require("money-currencies");
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

const PAYMENT_ITEMS = [
  <Picker.Item label={strings.Cash} value="Cash" />,
  <Picker.Item label={strings.Card} value="Card" />,
  <Picker.Item label="Visa" value="Visa" />,
  <Picker.Item label="Amex" value="Amex" />,
  <Picker.Item label="Sapn" value="Sapn" />,
];

export default class Payment extends React.PureComponent {
  onValueChange = text => {
    this.props.onValueChange(text);
  };

  onPay = () => {
    Alert.alert(
      strings.ConfirmPayment,
      strings.AreYouSure,
      [
        { text: strings.Cancel },
        { text: strings.Proceed, onPress: this.props.onPay },
      ],
      { cancelable: false },
    );
  };

  renderCustomer = () => {
    const { useDefaultCustomer } = this.props;

    if (useDefaultCustomer) {
      return null;
    }
    strings.setLanguage(currentLanguage().companyLanguage);
    return (
      <View>
        <Label style={styles.viewLabel}>{strings.Customer}</Label>
        <SearchableDropdown
          searchedCustomers={this.props.searchedCustomers}
          searchCustomer={this.props.searchCustomer}
          modalVisibleChange={this.props.modalVisibleChange}
        />
        <AddCustomer
          values={this.props.values}
          modalVisible={this.props.values.modalVisible}
          onChangeCustomerName={this.props.onChangeCustomerName}
          onChangeCustomerEmail={this.props.onChangeCustomerEmail}
          onChangeCustomerPhoneNumber={this.props.onChangeCustomerPhoneNumber}
          onChangeCustomerNotes={this.props.onChangeCustomerNotes}
          onSaveCustomer={this.props.onSaveCustomer}
          onCancelAddCustomer={this.props.onCancelAddCustomer}
        />
      </View>
    );
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );
    const amountValue = parseFloat(this.props.paymentValue);
    const amountDue = parseFloat(this.props.amountDue);

    let change = 0;

    if (amountValue - amountDue > 0) {
      change = amountValue - amountDue;
    }

    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={this.props.navigation}>
              <Icon name="arrow-left" style={styles.headerArrow} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTitle}>{strings.Payment}</Title>
          </Body>
        </Header>
        <Grid>
          <Col size={35} style={styles.contentLeft}>
            <View style={styles.leftView}>
              <NumberKeys
                currency={this.props.currency}
                onPay={this.onPay}
                value={this.props.paymentValue}
                onChangeNumberKeyClick={this.onValueChange}
              />
            </View>
          </Col>
          <Col size={65} style={styles.contentRight}>
            <Content padder>
              <Form style={styles.contentForm}>
                <View style={styles.formView}>
                  <Label style={styles.viewLabel}>{strings.AmountDue}</Label>
                  <Item regular>
                    <Input
                      editable={false}
                      keyboardType="numeric"
                      value={mc.moneyFormat(formatNumber(this.props.amountDue))}
                    />
                  </Item>
                </View>
                <View style={styles.formView}>
                  <Label style={styles.viewLabel}>{strings.AmountChange}</Label>
                  <Item regular>
                    <Input
                      editable={false}
                      keyboardType="numeric"
                      value={mc.moneyFormat(formatNumber(change))}
                    />
                  </Item>
                </View>
                {this.renderCustomer()}
                <View style={styles.optionView}>
                  <View style={styles.paymentView}>
                    <Label>{strings.PaymentType}</Label>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.props.values.selected}
                      onValueChange={this.props.onChangePayment}
                    >
                      {PAYMENT_ITEMS}
                    </Picker>
                  </View>
                  <Printer
                    connectionStatus={this.props.values.connectionStatus}
                    connectDevice={this.props.connectDevice}
                    connection={this.props.values.connection}
                    onPrinterPress={this.props.onPrinterPress}
                    style={styles.printerStyle}
                  />
                </View>
              </Form>
            </Content>
          </Col>
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4b4c9d",
  },
  headerArrow: {
    fontSize: 24,
    color: "white",
  },
  headerTitle: {
    marginLeft: "-35%",
    fontWeight: "bold",
  },
  contentLeft: {
    alignItems: "center",
    justifyContent: "center",
  },
  leftView: {
    paddingTop: 15,
  },
  contentRight: {
    backgroundColor: "white",
  },
  contentForm: {
    margin: 10,
  },
  formView: {
    marginBottom: 15,
  },
  viewLabel: {
    marginBottom: 5,
  },
  optionView: {
    flexDirection: "row",
    marginTop: 15,
  },
  paymentView: {
    flex: 1,
  },
  printerStyle: {
    flex: 1,
    marginBottom: 15,
  },
});
