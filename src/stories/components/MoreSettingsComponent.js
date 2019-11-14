import * as React from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Text, Card, CardItem } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import { currentLanguage } from "../../translations/CurrentLanguage";

import EditInput from "./EditInputComponent";
import EditCheckBox from "./EditCheckBoxComponent";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class MoreSettingsComponent extends React.PureComponent {
  render() {
    const { toggleItemSize, toggleMultipleMop } = this.props;
    const {
      smallSizeIcon,
      mediumSizeIcon,
      largeSizeIcon,
      multipleMop,
    } = this.props.values;
    strings.setLanguage(currentLanguage().companyLanguage);

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col style={styles.col}>
                <Text style={styles.titleText}>More Settings</Text>
              </Col>
              <Col />
            </Grid>
          </CardItem>

          <EditInput
            onChange={this.props.changeNoReceipts}
            value={this.props.values.changeNoReceipts}
            label="Printed Receipts per Transaction"
          />
          <EditInput label="SMS Unifonic ID" />
          <CardItem>
            <EditCheckBox
              label="Multiple Mode of Payment"
              checked={multipleMop}
              onPress={() => toggleMultipleMop("Medium")}
            />
          </CardItem>
          <CardItem>
            <Text style={styles.text}>Item Icon Size</Text>
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Small"
              checked={smallSizeIcon}
              onPress={() => toggleItemSize("Small")}
            />
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Medium"
              checked={mediumSizeIcon}
              onPress={() => toggleItemSize("Medium")}
            />
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Large"
              checked={largeSizeIcon}
              onPress={() => toggleItemSize("Large")}
            />
          </CardItem>
        </Card>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
  },
  cardItem: {
    marginBottom: 15,
    backgroundColor: "#4b4c9d",
  },
  col: {
    alignSelf: "center",
  },
  titleText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.02,
  },
  icon: {
    color: "white",
    marginLeft: 10,
  },
  viewRight: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  cardItemHelp: {
    borderColor: "gray",
    borderBottomWidth: 0.5,
  },
  cardItemText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "gray",
  },
  cardItemView: {
    width: "50%",
    marginLeft: 3,
  },
  cardItemViewTextAreaTax: {
    width: "50%",
    marginLeft: 3,
  },
  cardItemViewTextArea: {
    width: "60%",
  },
  pickerView: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
  },
  picker: {
    width: "100%",
  },
  text: {
    fontWeight: "bold",
  },
});

export default MoreSettingsComponent;
