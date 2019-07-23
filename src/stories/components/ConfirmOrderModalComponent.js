import * as React from "react";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Form, Button, Picker } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class ConfirmOrderModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: "Takeaway",
    };
  }
  changeOrderType(val) {
    this.setState({ orderType: val });
  }
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

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
            <Form
              style={{
                marginBottom: 10,
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
                {strings.SelectOrderType}:{" "}
              </Text>
              <Picker
                mode="dropdown"
                style={{ marginLeft: 5, width: 275 * 0.87 }}
                selectedValue={this.state.orderType}
                onValueChange={value => {
                  this.changeOrderType(value);
                }}
              >
                <Picker.Item label="Take Away" value="Takeaway" />
                <Picker.Item label="Dine In" value="Dine-in" />
                <Picker.Item label="Delivery" value="Delivery" />
                <Picker.Item label="Online" value="Online" />
                <Picker.Item label="Family" value="Family" />
              </Picker>
            </Form>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Button
                style={{ marginRight: 5 }}
                block
                success
                onPress={this.props.onClick}
              >
                <Text>{strings.Cancel}</Text>
              </Button>
              <Button
                block
                success
                onPress={() => this.props.onConfirmOrder(this.state)}
              >
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
