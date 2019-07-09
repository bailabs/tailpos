import * as React from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { Picker } from "native-base";
import { Row, Col, Grid } from "react-native-easy-grid";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/FontAwesome";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class ColorShapeInputComponent extends React.PureComponent {
  colorPicker() {
    const { onChangeColor } = this.props;
    const { color } = this.props.value[0];

    return (
      <Picker
        mode="dropdown"
        selectedValue={color}
        onValueChange={onChangeColor}
      >
        <Picker.Item label="Tomato" value="tomato" />
        <Picker.Item label="Fire Brick" value="firebrick" />
        <Picker.Item label="Blue" value="blue" />
        <Picker.Item label="Gray" value="gray" />
        <Picker.Item label="Green" value="green" />
        <Picker.Item label="Dark Orange" value="darkorange" />
        <Picker.Item label="Dark Magenta" value="darkmagenta" />
      </Picker>
    );
  }

  showOnlyColor() {
    const { color } = this.props.value[0];

    return (
      <Grid>
        <Col>
          <Text style={styles.text}>{strings.Color}</Text>
          <View style={styles.colorPickerView}>{this.colorPicker()}</View>
        </Col>
        <Col style={styles.rightCol}>
          <Icon size={88} name="square" style={{ color }} />
        </Col>
      </Grid>
    );
  }

  showColorAndShape() {
    return (
      <Grid>
        <Col>
          <Row>
            <Col
              style={{
                justifyContent: "center",
                width: Dimensions.get("window").width / 15,
              }}
            >
              <Text style={{ color: "black" }}>{strings.Color}:</Text>
            </Col>
            <Col style={{ justifyContent: "center" }}>{this.colorPicker()}</Col>
          </Row>
          <Row>
            <Col
              style={{
                justifyContent: "center",
                width: Dimensions.get("window").width / 15,
              }}
            >
              <Text style={{ color: "black" }}>{strings.Shape}:</Text>
            </Col>
            <Col style={{ justifyContent: "center" }}>
              <Picker
                mode="dropdown"
                selectedValue={this.props.value[0].shape}
                onValueChange={text => this.props.onChangeShape(text)}
              >
                <Picker.Item label="Square" value="square" />
                <Picker.Item label="Circle" value="circle" />
                <Picker.Item label="Certificate" value="certificate" />
                <Picker.Item label="Bookmark" value="bookmark" />
              </Picker>
            </Col>
          </Row>
        </Col>
        {this.props.value[0].shape && this.props.value[0].color ? (
          <Col style={{ justifyContent: "center" }}>
            <Icon
              name={this.props.value[0].shape}
              size={120}
              style={{ color: this.props.value[0].color }}
            />
          </Col>
        ) : (
          <Col style={{ justifyContent: "center" }} />
        )}
      </Grid>
    );
  }

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);

    if (this.props.status === "item") {
      return <View>{this.showColorAndShape()}</View>;
    } else if (this.props.status === "category") {
      return <View>{this.showOnlyColor()}</View>;
    }
  }
}

const styles = StyleSheet.create({
  colorPickerView: {
    borderWidth: 1.5,
    borderColor: "#D9D5DC",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
  },
  rightCol: {
    paddingLeft: 10,
  },
});
