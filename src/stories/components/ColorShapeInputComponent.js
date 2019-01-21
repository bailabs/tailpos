import * as React from "react";
import { View, Dimensions, Text } from "react-native";
import { Picker } from "native-base";
import { Row, Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";

export default class BarcodeInputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeState: false,
    };
  }

  colorPicker() {
    return (
      <Picker
        mode="dropdown"
        selectedValue={this.props.value[0].color}
        onValueChange={text => this.props.onChangeColor(text)}
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
              <Text style={{ color: "black" }}>Color:</Text>
            </Col>
            <Col style={{ justifyContent: "center" }}>{this.colorPicker()}</Col>
          </Row>
        </Col>
        <Col style={{ justifyContent: "center" }}>
          <Icon
            name="square"
            size={80}
            style={{ color: this.props.value[0].color }}
          />
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
              <Text style={{ color: "black" }}>Color:</Text>
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
              <Text style={{ color: "black" }}>Shape:</Text>
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
    if (this.props.status === "item") {
      return <View>{this.showColorAndShape()}</View>;
    } else if (this.props.status === "category") {
      return <View>{this.showOnlyColor()}</View>;
    }
  }
}
