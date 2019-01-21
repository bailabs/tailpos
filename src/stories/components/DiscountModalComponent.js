import * as React from "react";
import { View } from "react-native";

import DiscountPickerComponent from "./DiscountPickerComponent";
import DiscountCurrentSelected from "./DiscountCurrentSelectedComponent";

export default class DiscountModalComponent extends React.Component {
  render() {
    return (
      <View style={{ backgroundColor: "white", width: 350 }}>
        <DiscountCurrentSelected
          currentDiscount={this.props.currentDiscount}
          onCancelDiscount={value => this.props.onCancelDiscount(value)}
        />
        <DiscountPickerComponent
          data={this.props.discountData}
          selectedValue={this.props.selectedDiscount}
          onValueChange={(value, index) =>
            this.props.onDiscountChange(value, index)
          }
        />
      </View>
    );
  }
}
