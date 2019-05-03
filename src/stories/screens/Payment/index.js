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

import NumberKeys from "@components/NumberKeysComponent";
import Printer from "@components/PrinterComponent";
import SearchableDropdown from "../../../stories/components/SearchableDropdownComponent";
import AddCustomer from "../../../stories/components/AddCustomerModalComponent";
let MoneyCurrency = require("money-currencies");

export default class Payment extends React.PureComponent {
  onValueChange = text => {
    this.props.onValueChange(text);
  };

  onPay = () => {
    Alert.alert(
      "Confirm Payment",
      "Are you sure?",
      [{ text: "Cancel" }, { text: "Proceed", onPress: this.props.onPay }],
      { cancelable: false },
    );
  };

  renderCustomer = () => {
    const { useDefaultCustomer } = this.props;

    if (useDefaultCustomer) {
      return null;
    }

    return (
      <View>
        <Label style={styles.viewLabel}>Customer</Label>
        <SearchableDropdown
          searchedCustomers={this.props.searchedCustomers}
          searchCustomer={text => this.props.searchCustomer(text)}
          modalVisibleChange={text =>
            this.props.modalVisibleChange(text)
          }
        />
        <AddCustomer
          values={this.props.values}
          modalVisible={this.props.values.modalVisible}
          modalVisibleChange={text =>
            this.props.modalVisibleChange(text)
          }
          onChangeCustomerName={
            text => this.props.onChangeCustomerName(text)
            //   this.setState({name: text})
          }
          onChangeCustomerEmail={text =>
            this.props.onChangeCustomerEmail(text)
          }
          onChangeCustomerPhoneNumber={text =>
            this.props.onChangeCustomerPhoneNumber(text)
          }
          onChangeCustomerNotes={text =>
            this.props.onChangeCustomerNotes(text)
          }
          onSaveCustomer={() => this.props.onSaveCustomer()}
          onCancelAddCustomer={() => this.props.onCancelAddCustomer()}
        />
      </View>
    );
  }

  render() {
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
            <Button transparent onPress={() => this.props.navigation()}>
              <Icon name="arrow-left" style={styles.headerArrow} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTitle}>Payment</Title>
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
                  <Label style={styles.viewLabel}>Amount Due</Label>
                  <Item regular>
                    <Input
                      editable={false}
                      keyboardType="numeric"
                      value={mc.moneyFormat(formatNumber(this.props.amountDue))}
                    />
                  </Item>
                </View>
                <View style={styles.formView}>
                  <Label style={styles.viewLabel}>Amount Change</Label>
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
                    <Label>Payment Type</Label>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.props.values.selected}
                      onValueChange={this.props.onPickerChange}
                    >
                      <Picker.Item label="Cash" value="Cash" />
                      <Picker.Item label="Card" value="Card" />
                    </Picker>
                  </View>
                  <Printer
                    connectionStatus={this.props.values.connectionStatus}
                    connectDevice={() => this.props.connectDevice()}
                    connection={this.props.values.connection}
                    itemSelected={this.props.values.itemSelected}
                    onPrinterChange={value => this.props.onPrinterChange(value)}
                    onPrinterPress={() => this.props.onPrinterPress()}
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
