import * as React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Form, Item, Input, Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentLanguage } from "../../translations/CurrentLanguage";

import ModalKeypadComponent from "./ModalKeypadComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class ConfirmationModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
    };
  }

  onRequestClose = () => null;

  onNumberPress = text => {
    this.setState({ pin: this.state.pin.concat(text) });
  };

  onDeletePress = () => {
    this.setState({ pin: this.state.pin.slice(0, -1) });
  };

  onSubmit = () => {
    const pin = parseFloat(this.state.pin);

    this.setState({ pin: "" });
    this.props.onSubmit(pin);
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
              <Text style={styles.headerText}>Approvers Pin</Text>
              <TouchableOpacity
                style={styles.close}
                onPress={() => this.props.onClose()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>

            <Form>
              <Item regular style={styles.item}>
                <Input
                  secureTextEntry={this.props.secure}
                  keyboardType="numeric"
                  style={styles.input}
                  value={this.state.pin}
                />
              </Item>
            </Form>
            <ModalKeypadComponent
              noPeriod={true}
              onNumberPress={this.onNumberPress}
              onDeletePress={this.onDeletePress}
            />
            <Button
              block
              success
              onPress={this.onSubmit}
              style={styles.setButton}
            >
              <Text>Confirm</Text>
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
  },
  setButton: {
    borderRadius: 0,
  },
});
