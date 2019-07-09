import * as React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text, Button } from "native-base";

import OnTheFlyDiscountComponent from "@components/OnTheFlyDiscountComponent";
import DiscountModalComponent from "@components/DiscountModalComponent";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class DiscountSelectionModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percentageType: "percentage",
      onTheFlyDiscountValue: "0",
    };
  }

  onValueChange(value) {
    this.setState({
      percentageType: value,
    });
  }
  onNumberPress(text) {
    let onTheFlyDiscountValue = text;

    if (this.state.onTheFlyDiscountValue !== "0") {
      onTheFlyDiscountValue = this.state.onTheFlyDiscountValue.concat(text);
    }

    this.setState({ onTheFlyDiscountValue });
  }

  onDeletePress() {
    this.setState({
      onTheFlyDiscountValue: this.state.onTheFlyDiscountValue.slice(0, -1),
    });
  }
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.discountSelection}
        onRequestClose={() => {}}
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
          <View style={{ backgroundColor: "white", width: 500 }}>
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
                {strings.Discount}
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.onClick()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Button
                block
                success
                onPress={() => this.props.changeSelectionStatus(true)}
              >
                <Text>{strings.OnTheFlyDiscount}</Text>
              </Button>
              <Button
                block
                success
                onPress={() => this.props.changeSelectionStatus(false)}
              >
                <Text>{strings.ExistingDiscount}</Text>
              </Button>
            </View>
            {this.props.discountSelectionStatus ? (
              <OnTheFlyDiscountComponent
                onTheFlyDiscountValue={this.state.onTheFlyDiscountValue}
                percentageType={this.state.percentageType}
                onValueChange={value => this.onValueChange(value)}
                onNumberPress={text => this.onNumberPress(text)}
                onDeletePress={() => this.onDeletePress()}
              />
            ) : (
              <DiscountModalComponent
                discountData={this.props.discountData}
                currentDiscount={this.props.currentDiscount}
                onCancelDiscount={value => this.props.onCancelDiscount(value)}
                onDiscountChange={(discount, index) =>
                  this.props.onDiscountChange(discount, index)
                }
                selectedDiscount={this.props.selectedDiscount}
              />
            )}
            <Button
              block
              success
              onPress={() => {
                const stateValue = this.state;
                this.setState({
                  percentageType: "percentage",
                  onTheFlyDiscountValue: "0",
                });
                this.props.onDiscountEdit(stateValue);
              }}
            >
              <Text>{strings.SetDiscount}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
