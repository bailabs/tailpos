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
import { currentLanguage } from "../../../translations/CurrentLanguage";

import { formatNumber, unformat } from "accounting-js";

import ColorShapeInput from "@components/ColorShapeInputComponent";
import BarcodeInput from "@components/BarcodeInputComponent";
import ButtonComponent from "@components/ButtonComponent";
import IdleComponent from "@components/IdleComponent";

let MoneyCurrency = require("money-currencies");
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class InputItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState();
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

  _getInitialState = () => {
    return {
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
      barcodeState: "Form",
      showOptions: false,
      colorAndShape: [{ color: "gray", shape: "square" }],
    };
  };

  clear() {
    this.setState(this._getInitialState());
  }

  onFocus = () => {
    const { price } = this.state;
    const currency = unformat(price);

    let priceText = "";

    if (price !== "0.00") {
      priceText = currency.toFixed(2);
    }

    this.setState({ price: priceText });
  };

  onBlur = () => {
    this.setState({ price: formatNumber(this.state.price) });
  };

  _getCategoryItems = () => {
    return this.props.categories.map(category => (
      <Picker.Item
        label={category.name}
        value={category._id}
        key={category._id}
      />
    ));
  };

  _getPrinterColorStatus = () => {
    return this.props.printerStatus === "Online" ? "green" : "#aaa";
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    const PrinterColorStatus = this._getPrinterColorStatus();
    const CategoryItems = this._getCategoryItems();

    if (this.props.status === "idle") {
      return <IdleComponent type="Item" onPress={this.props.onIdleClick} />;
    }

    return (
      <Content padder>
        <Form>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {strings.Item}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Item regular style={{ marginBottom: 10, width: "50%" }}>
              <Input
                value={this.state.name}
                placeholder={strings.ItemName}
                onChangeText={text => this.setState({ name: text })}
              />
            </Item>
          </View>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {strings.Category}
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#D9D5DC",
              width: "50%",
              paddingRight: 5,
            }}
          >
            <Picker
              mode="dropdown"
              selectedValue={this.state.category}
              onValueChange={value => this.setState({ category: value })}
            >
              <Picker.Item label={strings.NoCategory} value="No Category">
                <Icon name="square" />
              </Picker.Item>
              {CategoryItems}
            </Picker>
          </View>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <View style={{ width: "50%", marginRight: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                {strings.Price}
              </Text>
              <Item regular style={{ marginBottom: 10 }}>
                <Input
                  value={mc.moneyFormat(this.state.price)}
                  keyboardType="numeric"
                  placeholder={strings.Price}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  onChangeText={text => {
                    let newPrice = text.slice(1);
                    this.setState({ price: newPrice });
                  }}
                />
              </Item>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                {strings.SoldBy}
              </Text>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Radio
                  onPress={() => this.setState({ soldBy: "Each" })}
                  selected={this.state.soldBy === "Each"}
                />
                <Text> {strings.Each}</Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Radio
                  onPress={() => this.setState({ soldBy: "Weight" })}
                  selected={this.state.soldBy === "Weight"}
                />
                <Text> {strings.Weight}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              {strings.Barcode}
            </Text>
            <BarcodeInput
              status={this.state.barcodeState}
              value={this.state.barcode}
              placeholder={strings.Barcode}
              onChangeText={text =>
                this.setState({ barcode: text, barcodeState: "Form" })
              }
              onChangeState={text => this.setState({ barcodeState: text })}
            />
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#D9D5DC",
              marginTop: 15,
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                color: "#afafaf",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {strings.OtherInformation}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                {strings.StockKeepingUnit}
              </Text>
              <Item regular style={{ marginBottom: 10 }}>
                <Input
                  value={this.state.sku}
                  placeholder={strings.SKU}
                  onChangeText={text => this.setState({ sku: text })}
                />
              </Item>
            </View>
          </View>
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
                name={this.state.showOptions ? "chevron-down" : "chevron-right"}
                size={21}
              />
              {this.state.showOptions
                ? strings.HideOptions
                : strings.ShowOptions}
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
                  <Icon name="barcode" color="white" size={21} />{" "}
                  {strings.PrintBarcode}
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
