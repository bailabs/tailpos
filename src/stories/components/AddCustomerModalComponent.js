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
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);


const _onRequestClose = () => {
  Alert.alert("Modal has been closed");
};


const AddCustomerModalComponent = props => {
  strings.setLanguage(currentLanguage().companyLanguage);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={_onRequestClose}
    >
      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <Container>
            <Content padder>
              <Form style={styles.form}>
                <View style={styles.formView}>
                  <Text>{strings.AddCustomer}</Text>
                </View>
                <View style={styles.view}>
                  <Label>{strings.Name}</Label>
                  <Item regular>
                    <Input
                      value={props.values.customerName}
                      onChangeText={props.onChangeCustomerName}
                    />
                  </Item>
                </View>
                <View style={styles.view}>
                  <Label>{strings.Email}</Label>
                  <Item regular>
                    <Input
                      value={props.values.customerEmail}
                      onChangeText={props.onChangeCustomerEmail}
                    />
                  </Item>
                </View>
                <View style={styles.view}>
                  <Label>{strings.PhoneNumber}</Label>
                  <Item regular>
                    <Input
                      keyboardType="numeric"
                      value={props.values.customerPhoneNumber}
                      onChangeText={props.onChangeCustomerPhoneNumber}
                    />
                  </Item>
                </View>
                <View style={styles.view}>
                  <Label>{strings.Note}</Label>
                  <Item regular>
                    <Input
                      value={props.values.customerNotes}
                      onChangeText={props.onChangeCustomerNotes}
                    />
                  </Item>
                </View>
                <View style={styles.view}>
                  <Button
                    full
                    style={styles.button}
                    onPress={props.onSaveCustomer}
                  >
                    <Text>{strings.Save}</Text>
                  </Button>
                  <Button
                    full
                    style={styles.button}
                    onPress={props.onCancelAddCustomer}
                  >
                    <Text>{strings.Cancel}</Text>
                  </Button>
                </View>
              </Form>
            </Content>
          </Container>
        </View>
      </View>
    </Modal>
  );
};


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


export default AddCustomerModalComponent;
