import * as React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Text, Form, Item, Button, Input, Picker } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import ModalKeypadComponent from "./ModalKeypadComponent";

export default class QuantityModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: "",
      status: "Qty",
      price: "",
      discount: "",
      commission: "",
      commission_amount: "",
      defaultQty: "",
      defaultPrice: "",
      attendantName: "No Attendant",
    };
  }

  componentWillReceiveProps(nextProps) {
    const { quantity } = nextProps;
    const { price } = nextProps;
    const { commission_rate } = nextProps;
    const { commission_name } = nextProps;
    const { commission_amount } = nextProps;
    const { discount_rate } = nextProps;
    this.setState({
      quantity: quantity.toString(),
      price: price.toString(),
      defaultQty: quantity.toString(),
      defaultPrice: price.toString(),
      attendantName: commission_name.toString(),
      commission: commission_rate.toString(),
      commission_amount: commission_amount.toString(),
      discount: discount_rate.toString(),
    });
  }

  onChangeEditStatus(val) {
    this.setState({ status: val });
  }

  onChangeText(text) {
    this.setState({ quantity: text });
  }

  onNumberPress(text) {
    if (this.state.quantity === "0") {
      this.setState({ quantity: text });
    } else {
      this.setState({ quantity: this.state.quantity.concat(text) });
    }
  }
  onNumberDiscountPress(text) {
    if (this.state.price === "0") {
      this.setState({ discount: text });
    } else {
      this.setState({ discount: this.state.discount.concat(text) });
    }
  }
  onNumberPricePress(text) {
    if (this.state.price === "0") {
      this.setState({ price: text });
    } else {
      this.setState({ price: this.state.price.concat(text) });
    }
  }
  onNumberCommissionPress(text) {
    if (this.state.quantity === "0") {
      this.setState({ commission: text });
    } else {
      this.setState({
        commission: this.state.commission.concat(text),
        commission_amount: (
          parseInt(this.state.commission.concat(text), 10) /
          100 *
          (this.state.discount
            ? parseInt(this.state.discount, 10) *
              (parseInt(this.state.price, 10) *
                parseInt(this.state.quantity, 10))
            : parseInt(this.state.price, 10) *
              parseInt(this.state.quantity, 10))
        ).toString(),
      });
    }
  }
  onDeletePress() {
    this.setState({ quantity: this.state.quantity.slice(0, -1) });
  }
  onDeletePricePress() {
    this.setState({ price: this.state.price.slice(0, -1) });
  }
  onDeleteCommissionPress() {
    this.setState({
      commission: this.state.commission.slice(0, -1),
      commission_amount:
        this.state.commission.slice(0, -1) !== ""
          ? (
              parseInt(this.state.commission.slice(0, -1), 10) /
              100 *
              parseInt(this.state.price, 10)
            ).toString()
          : "",
    });
  }
  onDeleteDiscountPress() {
    this.setState({
      discount: this.state.discount.slice(0, -1),
    });
  }
  computeCommission(value) {
    let commissionValue = this.props.attendants.filter(
      attendant => attendant._id === value,
    );

    let priceQty =
      parseFloat(this.state.price, 10) * parseFloat(this.state.quantity, 10);
    let discountValue =
      parseFloat(this.state.discount) > 0
        ? priceQty - parseFloat(this.state.discount) / 100 * priceQty
        : priceQty;

    this.setState({
      attendantName: value,
      commission_amount: (
        parseFloat(commissionValue[0].commission, 10) /
        100 *
        discountValue
      ).toString(),
    });
  }
  render() {
    const attendants = this.props.attendants.map(attendant => (
      <Picker.Item
        label={attendant.user_name}
        value={attendant._id}
        key={attendant._id}
      />
    ));

    return (
      <Modal
        onRequestClose={() => null}
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000090",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ backgroundColor: "white", width: 480 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                Edit Transaction Line
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.onClick()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", width: 360 }}>
              <Button
                onPress={() => this.onChangeEditStatus("Qty")}
                style={{
                  width: 120,
                  borderRadius: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    this.state.status === "Qty" ? "#4B4C9D" : "#D3D3D3",
                }}
              >
                <Text
                  style={{
                    color: this.state.status === "Qty" ? "white" : "gray",
                  }}
                >
                  Quantity
                </Text>
              </Button>
              <Button
                onPress={() => this.onChangeEditStatus("Price")}
                style={{
                  width: 120,
                  borderRadius: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    this.state.status === "Price" ? "#4B4C9D" : "#D3D3D3",
                }}
              >
                <Text
                  style={{
                    color: this.state.status === "Price" ? "white" : "gray",
                  }}
                >
                  Price
                </Text>
              </Button>
              <Button
                onPress={() => this.onChangeEditStatus("Discount")}
                style={{
                  width: 120,
                  borderRadius: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    this.state.status === "Discount" ? "#4B4C9D" : "#D3D3D3",
                }}
              >
                <Text
                  style={{
                    color: this.state.status === "Discount" ? "white" : "gray",
                  }}
                >
                  Discount
                </Text>
              </Button>
              <Button
                onPress={() => this.onChangeEditStatus("Commission")}
                style={{
                  width: 120,
                  borderRadius: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    this.state.status === "Commission" ? "#4B4C9D" : "#D3D3D3",
                }}
              >
                <Text
                  style={{
                    color:
                      this.state.status === "Commission" ? "white" : "gray",
                  }}
                >
                  Commission
                </Text>
              </Button>
            </View>

            {this.state.status === "Qty" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    value={this.state.quantity}
                    keyboardType="numeric"
                    onChangeText={text => this.onChangeText(text)}
                  />
                </Item>
              </Form>
            ) : this.state.status === "Price" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    value={this.state.price}
                    keyboardType="numeric"
                    onChangeText={text => this.onNumberCommissionPress(text)}
                  />
                </Item>
              </Form>
            ) : this.state.status === "Discount" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    value={this.state.discount}
                    keyboardType="numeric"
                    onChangeText={text => this.onNumberCommissionPress(text)}
                  />

                  <Icon name="percent" size={21} />
                </Item>
              </Form>
            ) : this.state.status === "Commission" ? (
              <Form>
                <Picker
                  mode="dropdown"
                  textStyle={{ borderWidth: 1 }}
                  selectedValue={this.state.attendantName}
                  onValueChange={value => {
                    this.computeCommission(value);
                  }}
                >
                  <Picker.Item label="None" value="" />
                  {attendants}
                </Picker>
                <Item regular style={{ marginTop: 10, marginBottom: 5 }}>
                  <Input
                    editable={false}
                    value={this.state.commission_amount}
                    placeholder="Commission Amount"
                    keyboardType="numeric"
                    // onChangeText={text => this.onChangePrice(text)}
                  />
                </Item>
              </Form>
            ) : null}
            {this.state.status !== "Commission" ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ModalKeypadComponent
                  onNumberPress={text =>
                    this.state.status === "Qty"
                      ? this.onNumberPress(text)
                      : this.state.status === "Price"
                        ? this.onNumberPricePress(text)
                        : this.state.status === "Commission"
                          ? this.onNumberCommissionPress(text)
                          : this.state.status === "Discount"
                            ? this.onNumberDiscountPress(text)
                            : ""
                  }
                  onDeletePress={() =>
                    this.state.status === "Qty"
                      ? this.onDeletePress()
                      : this.state.status === "Price"
                        ? this.onDeletePricePress()
                        : this.state.status === "Commission"
                          ? this.onDeleteCommissionPress()
                          : this.state.status === "Discount"
                            ? this.onDeleteDiscountPress()
                            : ""
                  }
                />
              </View>
            ) : null}

            <Button
              block
              success
              onPress={() => {
                this.props.onSubmit(this.state);
              }}
              style={{ borderRadius: 0 }}
            >
              <Text>
                Set{" "}
                {this.state.status === "Qty"
                  ? "quantity"
                  : this.state.status === "Price"
                    ? "price"
                    : this.state.status === "Commission"
                      ? "commission"
                      : ""}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
