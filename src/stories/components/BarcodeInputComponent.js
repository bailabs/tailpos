import * as React from "react";
import { View, Dimensions } from "react-native";
import { Button, Input, Item } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Camera from "react-native-camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Sound = require("react-native-sound");
Sound.setCategory("Playback");
const beep = new Sound("beep.mp3", Sound.MAIN_BUNDLE);

export default class BarcodeInputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeState: false,
    };
  }
  closeCamera() {
    this.props.onChangeState("Form");
  }
  closeSalesCamera() {
    this.props.onChangeSalesStatus(false);
  }
  onBarCodeRead(data) {
    beep.play();
    this.props.onChangeState("Form");
    this.props.onChangeText(data.data); // call
  }
  onSalesBarcodeRead(data) {
    this.props.onBarcodeRead(data.data);
  }
  showSalesCamera() {
    return (
      <View>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.disk}
          type="back"
          onBarCodeRead={this.onSalesBarcodeRead.bind(this)}
          mirrorImage={false}
        >
          <Icon
            name="close-outline"
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              color: "#000",
              padding: 5,
              margin: 5,
              fontSize: Dimensions.get("window").width / 50,
              marginBottom: Dimensions.get("window").width / 1.9,
              marginLeft: Dimensions.get("window").width / 2.15,
            }}
            onPress={this.closeSalesCamera.bind(this)}
          />
        </Camera>
      </View>
    );
  }
  showCamera() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5FCFF",
        }}
      >
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.disk}
          type="back"
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          mirrorImage={false}
        >
          <Icon
            name="close-outline"
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              color: "#000",
              padding: 5,
              fontSize: Dimensions.get("window").width / 50,
              marginBottom: Dimensions.get("window").width / 1.9,
              marginLeft: Dimensions.get("window").width / 1.85,
            }}
            onPress={this.closeCamera.bind(this)}
          />
        </Camera>
      </View>
    );
  }

  showForm() {
    return (
      <Grid>
        <Col style={{ width: "80%", justifyContent: "center" }}>
          <Item regular style={{ marginBottom: 10 }}>
            <Input
              value={this.props.value}
              placeholder={this.props.placeholder}
              onChangeText={text => this.props.onChangeText(text)}
            />
          </Item>
        </Col>
        <Col
          style={{
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ backgroundColor: "white", marginLeft: 5 }}
            onPress={() => this.props.onChangeState("Item")}
          >
            <Icon name="barcode-scan" size={45} />
          </Button>
        </Col>
      </Grid>
    );
  }

  render() {
    if (this.props.status === "Item") {
      return <View>{this.showCamera()}</View>;
    } else if (this.props.status === "Sales") {
      return <View>{this.showSalesCamera()}</View>;
    } else if (this.props.status === "Form") {
      return <View>{this.showForm()}</View>;
    }
  }
}
