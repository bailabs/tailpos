import * as React from "react";
import { View } from "react-native";
import { Text, CheckBox, Card, CardItem } from "native-base";
import { Dimensions } from "react-native";
import { currentLanguage } from "../../translations/CurrentLanguage";

import { Col, Grid } from "react-native-easy-grid";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class BluetoothScannerComponent extends React.Component {
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <View>
        <Card
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem>
            <Grid>
              <Col
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: Dimensions.get("window").width * 0.02 }}
                >
                  {strings.BluetoothScanner}
                </Text>
              </Col>
              <Col
                style={{
                  width: Dimensions.get("window").width * 0.03,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <CheckBox
                  checked={this.props.value.checkBoxBluetoothValue}
                  onPress={() =>
                    this.props.onCheckBoxValueChange(
                      !this.props.value.checkBoxBluetoothValue,
                    )
                  }
                  color="gray"
                />
              </Col>
              <Col
                style={{
                  width: Dimensions.get("window").width * 0.1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Text>{strings.Enable}</Text>
              </Col>
            </Grid>
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default BluetoothScannerComponent;
