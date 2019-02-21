import * as React from "react";
import {
  View,
  Dimensions,
  Modal,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Container,
  Content,
  Form,
  Item,
  Input,
  Button,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import ModalKeypadComponent from "./ModalKeypadComponent";
let MoneyCurrency = require("money-currencies");

export default class BreakdownModalComponent extends React.PureComponent {
  onDeletePress = () => this.props.onDeletePress();
  onChangeActualMoney = text => this.props.onChangeActualMoney(text);

  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    return (
      <KeyboardAvoidingView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.modalBreakDownVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed");
          }}
        >
          <View
            style={{
              backgroundColor: "#00000090",
              alignItems: "center",
              justifyContent: "center",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: Dimensions.get("window").width * 0.3,
                height: Dimensions.get("window").height * 0.65,
              }}
            >
              <Container>
                <Content padder>
                  <Form style={{}}>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => this.props.onChangeVisibility()}
                      >
                        <Icon name="close" size={21} />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginBottom: 15,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Item regular>
                        <Input
                          keyboardType="numeric"
                          onFocus={() => this.props.onFocusValue()}
                          placeholder="Actual Money"
                          editable={false}
                          value={
                            this.props.actualMoney
                              ? mc.moneyFormat(this.props.actualMoney)
                              : this.props.actualMoney
                          }
                        />
                      </Item>
                    </View>
                    <View>
                      <ModalKeypadComponent
                        onDeletePress={this.onDeletePress}
                        onNumberPress={this.onChangeActualMoney}
                      />
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                        // flexDirection: "row",
                      }}
                    >
                      <Button
                        block
                        success
                        onPress={() => this.props.onPressClose()}
                      >
                        <Text>Set Actual Money</Text>
                      </Button>
                    </View>
                  </Form>
                </Content>
              </Container>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}
