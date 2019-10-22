import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Content, Form, Input, Text, Picker, Radio, Button } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import { formatNumber, unformat } from "accounting-js";

import ColorShapeInput from "@components/ColorShapeInputComponent";
import BarcodeInput from "@components/BarcodeInputComponent";
import ButtonComponent from "@components/ButtonComponent";
import IdleComponent from "@components/IdleComponent";
import ListingLabel from "@components/ListingLabelComponent";
import ListingRow from "@components/ListingRowComponent";
import ListingItem from "@components/ListingItemComponent";
import ListingColumn from "@components/ListingColumnComponent";
import SectionBreak from "@components/SectionBreakComponent";

import Frm from "./frm";

let MoneyCurrency = require("money-currencies");
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

export default class InputItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState();
    this.frm = new Frm(this);
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
      tax: "0",
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

  _onButtonAdd = () => {
    this.props.onAdd(this.state);
    this.clear();
  };

  _onButtonEdit = () => {
    this.props.onEdit(this.state);
    this.clear();
  };

  _onButtonCancel = () => {
    this.props.onCancel();
    this.clear();
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
          <ListingLabel text={strings.Item} />
          <ListingRow>
            <ListingItem half>
              <Input
                value={this.state.name}
                placeholder={strings.ItemName}
                onChangeText={this.frm.onChangeName}
              />
            </ListingItem>
          </ListingRow>
          <ListingLabel text={strings.Category} />
          <ListingRow>
            <View
              style={{
                borderWidth: 2,
                borderColor: "#D9D5DC",
                width: "50%",
                paddingRight: 5,
                marginBottom: 10,
              }}
            >
              <Picker
                mode="dropdown"
                selectedValue={this.state.category}
                onValueChange={this.frm.onChangeCategory}
              >
                <Picker.Item label={strings.NoCategory} value="No Category">
                  <Icon name="square" />
                </Picker.Item>
                {CategoryItems}
              </Picker>
            </View>
          </ListingRow>
          <ListingRow>
            <ListingColumn>
              <ListingLabel text={strings.Price} />
              <ListingItem>
                <Input
                  value={
                    this.props.isCurrencyDisabled
                      ? this.state.price
                      : mc.moneyFormat(this.state.price)
                  }
                  keyboardType="numeric"
                  placeholder={strings.Price}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  onChangeText={value =>
                    this.frm.onChangePrice(value, this.props.isCurrencyDisabled)
                  }
                />
              </ListingItem>
            </ListingColumn>
            <ListingColumn>
              <ListingLabel text={strings.SoldBy} />
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Radio
                  onPress={this.frm.setSoldByEach}
                  selected={this.state.soldBy === "Each"}
                />
                <Text> {strings.Each}</Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Radio
                  onPress={this.frm.setSoldByWeight}
                  selected={this.state.soldBy === "Weight"}
                />
                <Text> {strings.Weight}</Text>
              </View>
            </ListingColumn>
          </ListingRow>
          <ListingRow>
            <ListingColumn>
              <ListingLabel text={"Tax(%)"} />
              <ListingItem>
                <Input
                  value={this.state.tax}
                  keyboardType="numeric"
                  placeholder={"Tax(%)"}
                  // onBlur={this.onBlur}
                  // onFocus={this.onFocus}
                  onChangeText={value => this.frm.onChangeTax(value)}
                />
              </ListingItem>
            </ListingColumn>
          </ListingRow>
          <ListingRow>
            <ListingColumn>
              <ListingLabel text={strings.Barcode} />
              <BarcodeInput
                status={this.state.barcodeState}
                value={this.state.barcode}
                placeholder={strings.Barcode}
                onChangeText={this.frm.onChangeBarcode}
                onChangeState={this.frm.onChangeBarcodeState}
              />
            </ListingColumn>
          </ListingRow>
          <SectionBreak />
          <ListingRow>
            <ListingColumn>
              <ListingLabel text={strings.StockKeepingUnit} />
              <ListingItem half>
                <Input
                  value={this.state.sku}
                  placeholder={strings.SKU}
                  onChangeText={this.frm.onChangeSku}
                />
              </ListingItem>
            </ListingColumn>
          </ListingRow>
          <ColorShapeInput
            status={this.state.status}
            value={this.state.colorAndShape}
            onChangeColor={this.frm.onChangeColor}
            onChangeShape={this.frm.onChangeShape}
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
          onAdd={this._onButtonAdd}
          onEdit={this._onButtonEdit}
          onCancel={this._onButtonCancel}
          text="Item"
        />
      </Content>
    );
  }
}
