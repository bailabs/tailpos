import * as React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Form, Item, Input, Button, Toast } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../translations/CurrentLanguage";

import ModalKeypadComponent from "./ModalKeypadComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
// TODO: refactor to match with the quantity modal, price modal
class PriceModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "0.00",
    };
  }

  onRequestClose = () => null;

  onNumberPress = text => {
    let price = text;

    if (this.state.price !== "0.00") {
      price = this.state.price.concat(text);
    }

    this.setState({ price });
  };

  onDeletePress = () => {
    this.setState({ price: this.state.price.slice(0, -1) });
  };

  onSubmit = () => {
    const price = parseFloat(this.state.price);
    if (price > 0) {
      this.setState({ price: "0.00" });
      this.props.onSubmit(price);
    } else {
      Toast.show({
        text: strings.ZeroPriceIsNotAvailable,
        buttonText: "Okay",
        type: "warning",
      });
    }
  };

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.onRequestClose}
      >
        <View style={styles.view}>
          <View style={styles.innerView}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>{strings.EditPrice}</Text>
              <TouchableOpacity
                style={styles.close}
                onPress={this.props.onClose}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>

            <Form>
              <Item regular style={styles.item}>
                <Input
                  keyboardType="numeric"
                  style={styles.input}
                  value={this.state.price}
                />
              </Item>
            </Form>
            <ModalKeypadComponent
              onNumberPress={this.onNumberPress}
              onDeletePress={this.onDeletePress}
            />
            <Button
              block
              success
              onPress={this.onSubmit}
              style={styles.setButton}
            >
              <Text>{strings.SetPrice}</Text>
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
    width: 240,
    backgroundColor: "white",
  },
  headerView: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    color: "gray",
    fontWeight: "bold",
  },
  close: {
    alignSelf: "flex-end",
  },
  item: {
    backgroundColor: "#eee",
  },
  input: {
    paddingRight: 15,
    fontWeight: "bold",
    textAlign: "right",
  },
  setButton: {
    borderRadius: 0,
  },
});

export default PriceModalComponent;
