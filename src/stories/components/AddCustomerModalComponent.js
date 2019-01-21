import * as React from "react";
import { View, Dimensions, Modal, Alert } from "react-native";
import {
  Text,
  Container,
  Content,
  Form,
  Label,
  Item,
  Input,
  Button,
} from "native-base";

export default class AddCustomerModalComponent extends React.Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
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
              width: Dimensions.get("window").width * 0.6,
              height: Dimensions.get("window").height,
            }}
          >
            <Container>
              <Content padder>
                <Form style={{ margin: 10 }}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 15,
                    }}
                  >
                    <Text>Add Customer</Text>
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Label>Name</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerName}
                        onChangeText={value =>
                          this.props.onChangeCustomerName(value)
                        }
                      />
                    </Item>
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Label>Email</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerEmail}
                        onChangeText={value =>
                          this.props.onChangeCustomerEmail(value)
                        }
                      />
                    </Item>
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Label>Phone Number</Label>
                    <Item regular>
                      <Input
                        keyboardType="numeric"
                        value={this.props.values.customerPhoneNumber}
                        onChangeText={value =>
                          this.props.onChangeCustomerPhoneNumber(value)
                        }
                      />
                    </Item>
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Label>Note</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerNotes}
                        onChangeText={value =>
                          this.props.onChangeCustomerNotes(value)
                        }
                      />
                    </Item>
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Button
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => this.props.onSaveCustomer()}
                    >
                      <Text>Save</Text>
                    </Button>
                    <Button
                      style={{
                        marginTop: 10,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => this.props.onCancelAddCustomer()}
                    >
                      <Text>Cancel</Text>
                    </Button>
                  </View>
                </Form>
              </Content>
            </Container>
          </View>
        </View>
      </Modal>
    );
  }
}
