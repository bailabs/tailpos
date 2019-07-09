import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Form, Input, Item } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import ModalKeypadComponent from "./ModalKeypadComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class CardShiftAttendantComponent extends React.PureComponent {
  onNumberPress = props => this.props.onNumberPress(props);
  onDeletePress = props => this.props.onDeletePress();

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    const { shiftAttendant } = this.props;
    const attendantRole = shiftAttendant
      ? shiftAttendant.role
      : "Set your attendant";

    const attendantName = shiftAttendant ? shiftAttendant.user_name : "";

    return (
      <Card style={styles.card}>
        <Form>
          <View>
            <Text style={styles.text}>{strings.Attendant}</Text>
            <Item disabled regular style={styles.item}>
              <Input disabled value={attendantName} style={styles.input} />
            </Item>
          </View>
          <View style={styles.view}>
            <Text style={styles.text}>{strings.Role}</Text>
            <Item disabled regular style={styles.item}>
              <Input disabled value={attendantRole} style={styles.input} />
            </Item>
          </View>
        </Form>
        <Form style={styles.form}>
          <ModalKeypadComponent
            onDeletePress={this.onDeletePress}
            onNumberPress={this.onNumberPress}
          />
        </Form>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    paddingTop: 25,
  },
  text: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "#cfcfcf",
    borderColor: "#afafaf",
  },
  view: {
    marginTop: 15,
  },
});

export default CardShiftAttendantComponent;
