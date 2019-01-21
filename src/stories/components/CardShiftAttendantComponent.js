import * as React from "react";
import { View } from "react-native";
import { Card, Text, Form, Picker, Input, Item } from "native-base";
import ModalKeypadComponent from "./ModalKeypadComponent";
export default class CardShiftAttendantComponent extends React.Component {
  render() {
    const Attendants = this.props.attendants.map((attendant, index) => (
      <Picker.Item
        label={attendant.user_name}
        key={index}
        value={attendant._id}
      />
    ));

    const attendantRole = this.props.shiftAttendant
      ? this.props.shiftAttendant.role
      : "Set your attendant";
    const currentAttendant = this.props.shiftAttendant
      ? this.props.shiftAttendant._id
      : "";

    return (
      <Card style={{ padding: 15, paddingTop: 25 }}>
        <Text style={{ fontWeight: "bold" }}>Attendant</Text>
        <Form>
          <View style={{ flex: 1, marginRight: 15 }}>
            <Picker
              note
              mode="dropdown"
              enabled={false}
              style={{ marginBottom: 15 }}
              selectedValue={currentAttendant}
              onValueChange={(value, index) =>
                this.props.attendantOnChange(index)
              }
            >
              <Picker.Item label="None" value="" />
              {Attendants}
            </Picker>
          </View>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Role</Text>
          <Item disabled regular>
            <Input disabled value={attendantRole} style={{ color: "gray" }} />
          </Item>
        </Form>
        <Form
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ModalKeypadComponent
            onDeletePress={() => this.props.onDeletePress()}
            onNumberPress={text => this.props.onNumberPress(text)}
          />
        </Form>
      </Card>
    );
  }
}
