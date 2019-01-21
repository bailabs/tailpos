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
import { View, Alert } from "react-native";
import { formatNumber } from "accounting-js";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";

import NumberKeys from "@components/NumberKeysComponent";
import Printer from "@components/PrinterComponent";
import SearchableDropdown from "../../../stories/components/SearchableDropdownComponent";
import AddCustomer from "../../../stories/components/AddCustomerModalComponent";
let MoneyCurrency = require("money-currencies");

export default class Payment extends React.Component {
  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );
    const amountValue = parseFloat(this.props.values.value);
    const amountDue = parseFloat(this.props.values.amountDue);

    let change = 0;

    if (amountValue - amountDue > 0) {
      change = amountValue - amountDue;
    }
    return (
      <Container>
        <Header style={{ backgroundColor: "#4B4C9D" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation()}>
              <Icon
                name="arrow-left"
                style={{
                  fontSize: 24,
                  color: "white",
                }}
              />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                marginLeft: "-35%",
                fontWeight: "bold",
              }}
            >
              Payment
            </Title>
          </Body>
        </Header>
        <Grid>
          <Col
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "35%",
            }}
          >
            <View style={{ paddingTop: 15 }}>
              <NumberKeys
                currency={this.props.currency}
                onPay={() => {
                  Alert.alert(
                    "Confirm Payment",
                    "Are you sure?",
                    [
                      { text: "Cancel" },
                      { text: "Proceed", onPress: () => this.props.onPay() },
                    ],
                    { cancelable: false },
                  );
                }}
                value={this.props.values.value}
                onChangeNumberKeyClick={text => this.props.onValueChange(text)}
              />
            </View>
          </Col>
          <Col
            style={{
              backgroundColor: "white",
              width: "65%",
            }}
          >
            <Content padder>
              <Form style={{ margin: 10 }}>
                <View style={{ marginBottom: 15 }}>
                  <Label style={{ marginBottom: 5 }}>Amount Due</Label>
                  <Item regular>
                    <Input
                      editable={false}
                      keyboardType="numeric"
                      value={mc.moneyFormat(
                        formatNumber(this.props.values.amountDue),
                      )}
                      onChange={value => this.props.onChange(value)}
                    />
                  </Item>
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Label style={{ marginBottom: 5 }}>Amount Change</Label>
                  <Item regular>
                    <Input
                      editable={false}
                      keyboardType="numeric"
                      value={mc.moneyFormat(formatNumber(change))}
                      onChangeAmountChange={value =>
                        this.props.onChangeAmountChange(value)
                      }
                    />
                  </Item>
                </View>
                <Label style={{ marginBottom: 5 }}>Customer</Label>
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
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <View style={{ flex: 1 }}>
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
                    style={{ flex: 1, marginBottom: 15 }}
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
