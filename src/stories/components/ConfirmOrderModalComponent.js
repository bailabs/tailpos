import * as React from "react";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Form, Button, Picker, Item, Input } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LocalizedStrings from "react-native-localization";

import PickerComponent from "./PickerComponent";
import Label from "./ListingLabelComponent";

import { currentLanguage } from "../../translations/CurrentLanguage";
import translation from "../.././translations/translation";
let strings = new LocalizedStrings(translation);

const ORDER_TYPES = ["Dine-in", "Takeaway", "Delivery", "Online", "Family"];

// TODO: translation table selection
export default class ConfirmOrderModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: "Dine-in",
      tableNo: "",
    };
  }

  onChangeOrderType = orderType => {
    this.setState({ orderType });
  };

  onChangeTableNo = tableNo => {
    this.setState({ tableNo });
  };

  onConfirmOrder = () => {
    this.props.onConfirmOrder(this.state);
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    const OrderTypes = ORDER_TYPES.map((orderType, id) => (
      <Picker.Item
        key={`order-type-${id}`}
        label={orderType}
        value={orderType}
      />
    ));

    return (
      <Modal
        onRequestClose={() => null}
        animationType="slide"
        transparent={true}
        visible={this.props.visibility}
      >
        <View style={styles.view}>
          <View style={styles.innerView}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>{strings.ConfirmOrder}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.props.onClick}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <Form style={styles.form}>
              <Label text={strings.SelectOrderType} />
              <PickerComponent
                value={this.state.orderType}
                onChangeValue={this.onChangeOrderType}
              >
                {OrderTypes}
              </PickerComponent>
              {this.state.orderType === "Dine-in" ||
              this.state.orderType === "Family"
                ? [
                    <Label text="Select Table" />,
                    <Item regular>
                      <Input
                        placeholder="Table No"
                        value={this.state.tableNo}
                        onChangeText={this.onChangeTableNo}
                      />
                    </Item>,
                  ]
                : null}
            </Form>
            <View style={styles.footerView}>
              <Button
                block
                success
                style={styles.firstButton}
                onPress={this.props.onClick}
              >
                <Text>{strings.Cancel}</Text>
              </Button>
              <Button block success onPress={this.onConfirmOrder}>
                <Text>{strings.Confirm}</Text>
              </Button>
            </View>
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
    width: 370,
    borderRadius: 5,
    backgroundColor: "white",
  },
  headerView: {
    padding: 15,
    borderBottomWidth: 1,
    flexDirection: "row",
    borderBottomColor: "#bbb",
    justifyContent: "space-between",
  },
  headerText: {
    color: "gray",
    fontWeight: "bold",
  },
  form: {
    padding: 15,
    flexDirection: "column",
  },
  footerView: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  firstButton: {
    marginRight: 10,
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
