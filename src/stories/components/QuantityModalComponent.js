import * as React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  Text,
  Form,
  Item,
  Button,
  Input,
  Picker,
  Grid,
  Row,
  Col,
} from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../translations/CurrentLanguage";

import ModalKeypadComponent from "./ModalKeypadComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
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
    const { price, quantity, discount_rate } = nextProps;

    this.setState({
      price: price.toString(),
      quantity: quantity.toString(),
      defaultPrice: price.toString(),
      defaultQty: quantity.toString(),
      discount: discount_rate.toString(),
    });
  }
  onAddCommissionAttendant() {
    if (this.state.attendantName !== "No Attendant") {
      let commissionValue = this.props.attendants.filter(
        attendant => attendant._id === this.state.attendantName,
      );
      if (commissionValue.length > 0) {
        this.props.addCommissionArray({
          commission_attendant_name: commissionValue[0].user_name,
          commission_attendant_id: this.state.attendantName,
          commission_rate: commissionValue[0].commission,
          commission_amount: this.state.commission_amount,
          status: false,
        });
      }

      this.setState({ attendantName: "No Attendant" });
    }
  }
  onChangeEditStatus(val) {
    this.setState({ status: val });
  }

  onNumberPress(text) {
    let quantity = text;

    if (this.state.quantity !== "0") {
      quantity = this.state.quantity.concat(text);
    }

    this.setState({ quantity });
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
    if (value !== "No Attendant") {
      this.setState({
        attendantName: value,
        commission_amount: (
          parseFloat(commissionValue[0].commission, 10) /
          100 *
          discountValue
        ).toString(),
      });
    } else {
      this.setState({
        attendantName: value,
        commission_amount: "0",
      });
    }
  }

  _renderItem = ({ item, index }) => {
      strings.setLanguage(currentLanguage().companyLanguage);

      if (item) {
      return (
        <Row style={{ marginBottom: 10, marginTop: index === 0 ? 10 : 0 }}>
          <Col
            style={{
              marginLeft: 10,
              alignItems: "flex-start",
              justifyContent: "center",
              height: 50,
              fontSize: 16,
            }}
          >
            <Text>{item.commission_attendant_name}</Text>
          </Col>
          <Col
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              fontSize: 16,
            }}
          >
            <Text>{item.commission_amount}</Text>
          </Col>
        </Row>
      );
    }
  };

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
        <View style={styles.view}>
          <View style={styles.innerView}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>
                {strings.EditTransactionLine}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.props.onClick}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <View style={styles.options}>
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
                  {strings.Quantity}
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
                  {strings.Price}
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
                  {strings.Discount}
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
                  {strings.Commission}
                </Text>
              </Button>
            </View>

            {this.state.status === "Qty" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    keyboardType="numeric"
                    value={this.state.quantity}
                  />
                </Item>
              </Form>
            ) : this.state.status === "Price" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    keyboardType="numeric"
                    value={this.state.price}
                  />
                </Item>
              </Form>
            ) : this.state.status === "Discount" ? (
              <Form>
                <Item regular>
                  <Input
                    editable={false}
                    keyboardType="numeric"
                    value={this.state.discount}
                  />
                  <Icon name="percent" size={21} />
                </Item>
              </Form>
            ) : this.state.status === "Commission" ? (
              <Form>
                <Form style={{ marginTop: 10, flexDirection: "row" }}>
                  <Picker
                    mode="dropdown"
                    style={{ width: 480 * 0.87 }}
                    textStyle={{ borderWidth: 1 }}
                    selectedValue={this.state.attendantName}
                    onValueChange={value => {
                      this.computeCommission(value);
                    }}
                  >
                    <Picker.Item label="None" value="No Attendant" />
                    {attendants}
                  </Picker>
                  <Button
                    block
                    success
                    onPress={() => this.onAddCommissionAttendant()}
                  >
                    <Text>{strings.Add}</Text>
                  </Button>
                </Form>
                {this.props.commissionArray.length > 0 ? (
                  <View style={{ marginBottom: 30 }}>
                    <Grid>
                      <Col
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          height: 50,
                          fontSize: 16,
                        }}
                      >
                        <Text>{strings.Name}</Text>
                      </Col>
                      <Col
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          height: 50,
                          fontSize: 16,
                        }}
                      >
                        <Text>{strings.Amount}</Text>
                      </Col>
                    </Grid>
                  </View>
                ) : null}

                <View>
                  <FlatList
                    numColumns={1}
                    data={this.props.commissionArray}
                    keyExtractor={(item, index) => index}
                    renderItem={this._renderItem}
                  />
                </View>
              </Form>
            ) : null}
            {this.state.status !== "Commission" ? (
              <View style={styles.keypad}>
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
              style={styles.setButton}
              onPress={() => {
                this.props.onSubmit(this.state);
              }}
            >
              <Text>
                {strings.Set}{" "}
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#00000090",
  },
  innerView: {
    width: 480,
    backgroundColor: "white",
  },
  headerView: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    borderBottomColor: "#bbb",
    justifyContent: "space-between",
  },
  headerText: {
    color: "gray",
    fontWeight: "bold",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  options: {
    width: 360,
    flexDirection: "row",
  },
  setButton: {
    borderRadius: 0,
  },
  keypad: {
    alignItems: "center",
    justifyContent: "center",
  },
});
