import * as React from "react";
import { Content, Form, Input, Picker } from "native-base";

import { unformat, formatNumber } from "accounting-js";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import ButtonComponent from "@components/ButtonComponent";
import IdleComponent from "@components/IdleComponent";
import ListingLabel from "@components/ListingLabelComponent";
import ListingItem from "@components/ListingItemComponent";
import ListingRow from "@components/ListingRowComponent";
import ListingColumn from "@components/ListingColumnComponent";

let MoneyCurrency = require("money-currencies");
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

export default class InputDiscount extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState();
  }

  _getInitialState = () => {
    return {
      name: "",
      value: "",
      percentageType: "percentage",
    };
  };

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    if (data) {
      const value = formatNumber(data.value);

      this.setState({
        name: data.name,
        value: value,
        percentageType: data.percentageType.toString(),
      });
    }
  }

  clear = () => {
    this.setState(this._getInitialState());
  };

  onValueChange = percentageType => {
    this.setState({ percentageType });
  };

  onBlur = () => {
    const value = formatNumber(this.state.value);
    this.setState({ value });
  };

  onFocus = () => {
    if (this.state.value === "") {
      this.setState({ value: "" });
    } else {
      const value = unformat(this.state.value);
      this.setState({ value: value.toFixed(2) });
    }
  };

  onButtonAdd = () => {
    const hasError = this.props.onAdd(this.state);
    if (hasError === false) {
      this.clear();
    }
  };

  onButtonEdit = () => {
    const hasError = this.props.onEdit(this.state);
    if (hasError === false) {
      this.clear();
    }
  };

  onButtonCancel = () => {
    this.props.onCancel();
    this.clear();
  };

  _onChangeName = name => {
    this.setState({ name });
  };

  _onChangeValue = value => {
    let newPrice = value;
    if (this.state.percentageType === "fixDiscount") {
      newPrice = value.slice(1);
    }
    this.setState({ value: newPrice });
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    if (this.props.status === "idle") {
      return <IdleComponent type="Discount" onPress={this.props.onIdleClick} />;
    } else {
      return (
        <Content padder>
          <Form>
            <ListingRow>
              <ListingColumn last>
                <ListingLabel text={strings.DiscountName} />
                <ListingItem>
                  <Input
                    value={this.state.name}
                    placeholder={strings.DiscountName}
                    onChangeText={this._onChangeName}
                  />
                </ListingItem>
              </ListingColumn>
            </ListingRow>
            <ListingRow>
              <ListingColumn>
                <ListingLabel text={strings.DiscountValue} />
                <ListingItem>
                  <Input
                    keyboardType="numeric"
                    value={
                      this.state.value
                        ? this.state.percentageType === "fixDiscount"
                          ? mc.moneyFormat(this.state.value)
                          : this.state.value
                        : this.state.value
                    }
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    placeholder={strings.DiscountValue}
                    onChangeText={this._onChangeValue}
                  />
                </ListingItem>
              </ListingColumn>
              <ListingColumn last>
                <ListingLabel text={strings.DiscountType} />
                <Picker
                  iosHeader="Select one"
                  mode="dropdown"
                  selectedValue={this.state.percentageType}
                  onValueChange={this.onValueChange}
                >
                  <Picker.Item label={strings.Percentage} value="percentage" />
                  <Picker.Item
                    label={strings.FixDiscount}
                    value="fixDiscount"
                  />
                </Picker>
              </ListingColumn>
            </ListingRow>
          </Form>
          <ButtonComponent
            status={this.props.status}
            onAdd={this.onButtonAdd}
            onEdit={this.onButtonEdit}
            onCancel={this.onButtonCancel}
            text={strings.Discount}
          />
        </Content>
      );
    }
  }
}
