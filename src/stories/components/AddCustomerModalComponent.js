import * as React from "react";
import { View, Dimensions, Modal, Alert, StyleSheet } from "react-native";
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

export default class AddCustomerModalComponent extends React.PureComponent {
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
        <View style={styles.outerView}>
          <View style={styles.innerView}>
            <Container>
              <Content padder>
                <Form style={styles.form}>
                  <View style={styles.formView}>
                    <Text>Add Customer</Text>
                  </View>
                  <View style={styles.view}>
                    <Label>Name</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerName}
                        onChangeText={this.props.onChangeCustomerName}
                      />
                    </Item>
                  </View>
                  <View style={styles.view}>
                    <Label>Email</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerEmail}
                        onChangeText={this.props.onChangeCustomerEmail}
                      />
                    </Item>
                  </View>
                  <View style={styles.view}>
                    <Label>Phone Number</Label>
                    <Item regular>
                      <Input
                        keyboardType="numeric"
                        value={this.props.values.customerPhoneNumber}
                        onChangeText={this.props.onChangeCustomerPhoneNumber}
                      />
                    </Item>
                  </View>
                  <View style={styles.view}>
                    <Label>Note</Label>
                    <Item regular>
                      <Input
                        value={this.props.values.customerNotes}
                        onChangeText={this.props.onChangeCustomerNotes}
                      />
                    </Item>
                  </View>
                  <View style={styles.view}>
                    <Button
                      full
                      style={styles.button}
                      onPress={this.props.onSaveCustomer}
                    >
                      <Text>Save</Text>
                    </Button>
                    <Button
                      full
                      style={styles.button}
                      onPress={this.props.onCancelAddCustomer}
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

const styles = StyleSheet.create({
  outerView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000090",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  innerView: {
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height,
  },
  form: {
    margin: 10,
  },
  formView: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
});
