import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Content,
  Form,
  Item,
  Input,
  Text,
  Picker,
  Radio,
  Button,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { formatNumber, unformat } from "accounting-js";
import BarcodeInput from "@components/BarcodeInputComponent";
import ColorShapeInput from "@components/ColorShapeInputComponent";
import ButtonComponent from "@components/ButtonComponent";
import IdleComponent from "@components/IdleComponent";
// import TaxesComponent from "@components/TaxesComponent";
let MoneyCurrency = require("money-currencies");
export default class InputItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      status: "item",
      name: "",
      price: "0.00",
      sku: "",
      barcode: "",
      category: "No Category",
      soldBy: "Each",
      color: "red",
      shape: "circle",
      colorAndShape: [{ color: "gray", shape: "square" }],
      barcodeState: "Form",
      showOptions: false,
    };
  }

  onFocus() {
    const currency = unformat(this.state.price);
    if (this.state.price === "0.00") {
      this.setState({ price: "" });
    } else {
      this.setState({ price: currency.toFixed(2) });
    }
  }

  onBlur() {
    this.setState({ price: formatNumber(this.state.price) });
  }

  clear() {
    this.setState({
      name: "",
      price: "0.00",
      sku: "",
      barcode: "",
      category: "No Category",
      soldBy: "Each",
      colorAndShape: [{ color: "gray", shape: "square" }],
      showOptions: false,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    const { dataDetails } = nextProps;

    if (data) {
      const priceCurrency = formatNumber(data.price);

      this.setState({
        name: data.name,
        price: priceCurrency,
        sku: data.sku,
        barcode: data.barcode,
        category: data.category,
        soldBy: data.soldBy,
        colorAndShape: JSON.parse(data.colorAndShape),
      });
    }

    if (dataDetails) {
      const dataDupBarcode = JSON.parse(dataDetails);
      this.setState({
        name: dataDupBarcode.name,
        price: dataDupBarcode.price.toString(),
        sku: dataDupBarcode.sku,
        barcode: dataDupBarcode.barcode,
        category: dataDupBarcode.category,
        soldBy: dataDupBarcode.soldBy,
        colorAndShape: dataDupBarcode.colorAndShape,
      });
    }
  }

  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const PrinterColorStatus =
      this.props.printerStatus === "Online" ? "green" : "#aaa";
    // Categories go here
    const categoryItems = this.props.categories.map(category => (
      <Picker.Item
        label={category.name}
        value={category._id}
        key={category._id}
      />
    ));
    if (this.props.status === "idle") {
      return (
        <IdleComponent type="Item" onPress={() => this.props.onIdleClick()} />
      );
    } else {
      return (
        <Content padder>
          <Form>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Item</Text>
            <View style={{ flexDirection: "row" }}>
              <Item regular style={{ marginBottom: 10, width: 300 }}>
                <Input
                  value={this.state.name}
                  placeholder="Item name"
                  onChangeText={text => this.setState({ name: text })}
                />
              </Item>
            </View>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Category
            </Text>
            <Picker
              mode="dropdown"
              textStyle={{ borderWidth: 1 }}
              selectedValue={this.state.category}
              onValueChange={value => this.setState({ category: value })}
            >
              <Picker.Item label="No Category" value="No Category">
                <Icon name="square" />
              </Picker.Item>
              {categoryItems}
            </Picker>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <View style={{ flex: 0.6, marginRight: 15 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Price
                </Text>

                <Item regular style={{ marginBottom: 10 }}>
                  <Input
                    value={mc.moneyFormat(this.state.price)}
                    keyboardType="numeric"
                    placeholder="Price"
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus()}
                    onChangeText={text => {
                      let newPrice = text.slice(1);
                      this.setState({ price: newPrice });
                    }}
                  />
                </Item>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Sold by
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Radio
                    onPress={() => this.setState({ soldBy: "Each" })}
                    selected={this.state.soldBy === "Each"}
                  />
                  <Text> Each</Text>
                </View>
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Radio
                    onPress={() => this.setState({ soldBy: "Weight" })}
                    selected={this.state.soldBy === "Weight"}
                  />
                  <Text> Weight</Text>
                </View>
              </View>
            </View>
            {/*<TaxesComponent*/}
            {/*onActivateTax={text => this.props.onActivateTax(text)}*/}
            {/*taxes={this.props.taxes}*/}
            {/*/>*/}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View style={{ flex: 0.85 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Stock Keeping Unit
                </Text>
                <Item regular style={{ marginBottom: 10, width: 250 }}>
                  <Input
                    value={this.state.sku}
                    placeholder="SKU"
                    onChangeText={text => this.setState({ sku: text })}
                  />
                </Item>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Barcode
                </Text>
                <BarcodeInput
                  status={this.state.barcodeState}
                  value={this.state.barcode}
                  placeholder="Barcode"
                  onChangeText={text =>
                    this.setState({ barcode: text, barcodeState: "Form" })
                  }
                  onChangeState={text => this.setState({ barcodeState: text })}
                />
              </View>
            </View>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Other Information
            </Text>
            <ColorShapeInput
              status={this.state.status}
              value={this.state.colorAndShape}
              onChangeColor={text => {
                this.setState({
                  colorAndShape: [
                    { color: text, shape: this.state.colorAndShape[0].shape },
                  ],
                });
              }}
              onChangeShape={text =>
                this.setState({
                  colorAndShape: [
                    { color: this.state.colorAndShape[0].color, shape: text },
                  ],
                })
              }
            />
          </Form>

          <View
            style={{
              marginTop: 15,
              paddingLeft: 10,
              paddingTop: 15,
              paddingBottom: 15,
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: "#ddd",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.changeBluetoothStatus(!this.state.showOptions);
                this.setState({ showOptions: !this.state.showOptions });
              }}
            >
              <Text style={{ color: "#4b4c9d", fontWeight: "bold" }}>
                <Icon
                  name={
                    this.state.showOptions ? "chevron-down" : "chevron-right"
                  }
                  size={21}
                />
                {this.state.showOptions ? "Hide options" : "Show options"}
              </Text>
            </TouchableOpacity>

            {this.state.showOptions ? (
              <View
                style={{
                  width: 250,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  onPress={() => this.props.onPrintBarcode(this.state.barcode)}
                  style={{ marginTop: 10 }}
                >
                  <Text>
                    <Icon name="barcode" color="white" size={21} /> Print
                    Barcode
                  </Text>
                </Button>
                <Icon name="printer" color={PrinterColorStatus} size={21} />
                <Text style={{ color: PrinterColorStatus }}>
                  {this.props.printerStatus}
                </Text>
              </View>
            ) : null}
          </View>

          <ButtonComponent
            status={this.props.status}
            onAdd={() => {
              this.props.onAdd(this.state);
              this.clear();
            }}
            onEdit={() => {
              this.props.onEdit(this.state);
              this.clear();
            }}
            onCancel={() => {
              this.props.onCancel();
              this.clear();
            }}
            text="Item"
          />
        </Content>
      );
    }
  }
}
