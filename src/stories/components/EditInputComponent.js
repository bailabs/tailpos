import * as React from "react";
import { View, StyleSheet } from "react-native";
import { CardItem, Input, Text } from "native-base";

const Label = props => <Text style={styles.text}>{props.text}</Text>;

const EditInputComponent = props => (
  <CardItem>
    <View style={styles.view}>
      {props.label ? <Label text={props.label} /> : null}
      <Input
        style={{
          borderWidth: 1,
          borderColor: props.disabled ? "#cfcfcf" : "#ca94ff",
        }}
        value={props.value}
        disabled={props.disabled}
        onChangeText={props.onChange}
        secureTextEntry={props.secure}
        placeholder={props.placeholder}
      />
    </View>
  </CardItem>
);

const styles = StyleSheet.create({
  view: {
    width: "50%",
  },
  text: {
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default EditInputComponent;
