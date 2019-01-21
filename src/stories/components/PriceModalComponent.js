import * as React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text, Form, Item, Input, Button, Toast } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import ModalKeypadComponent from "./ModalKeypadComponent";

// TODO: refactor to match with the quantity modal, price modal
export default class PriceModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "0.00",
    };
  }

  componentWillReceiveProps(nextProps) {
    // const { price } = nextProps;
    // this.setState({ price: price.toString() });
  }

  onChangeText(text) {
    this.setState({ price: text });
  }

  onNumberPress(text) {
    if (this.state.price === "0.00") {
      this.setState({ price: text });
    } else {
      this.setState({ price: this.state.price.concat(text) });
    }
  }

  onDeletePress() {
    this.setState({ price: this.state.price.slice(0, -1) });
  }

  onSubmit() {
    if (parseFloat(this.state.price) > 0) {
      const price = parseFloat(this.state.price);
      this.setState({ price: "0.00" });
      this.props.onSubmit(price);
    } else {
      Toast.show({
        text: "Zero Price is not available.",
        buttonText: "Okay",
        type: "warning",
      });
    }
  }

  render() {
    return (
      <Modal
        onRequestClose={() => null}
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
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
          <View style={{ backgroundColor: "white", width: 240 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                Edit Price
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.onClose()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>

            <Form>
              <Item regular style={{ backgroundColor: "#eee" }}>
                <Input
                  value={this.state.price}
                  keyboardType="numeric"
                  onChangeText={text => this.onChangeText(text)}
                  style={{
                    fontWeight: "bold",
                    textAlign: "right",
                    paddingRight: 15,
                  }}
                />
              </Item>
            </Form>
            <ModalKeypadComponent
              onNumberPress={text => this.onNumberPress(text)}
              onDeletePress={() => this.onDeletePress()}
            />
            <Button
              block
              success
              onPress={() => this.onSubmit()}
              style={{ borderRadius: 0 }}
            >
              <Text>Set price</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
