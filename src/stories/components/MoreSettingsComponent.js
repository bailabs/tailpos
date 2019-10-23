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
    const { toggleItemSize } = this.props;
    const { smallSizeIcon, mediumSizeIcon, largeSizeIcon } = this.props.values;
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
            secure={false}
            disabled={!this.props.editStatus}
            onChange={this.props.changeNoReceipts}
            value={this.props.values.changeNoReceipts}
            label="Printed Receipts per Transaction"
          />

          <CardItem>
            <Text style={styles.text}>Item Icon Size</Text>
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Small"
              checked={smallSizeIcon}
              onPress={() => toggleItemSize("Small")}
              // disabled={!this.props.editStatus}
            />
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Medium"
              checked={mediumSizeIcon}
              onPress={() => toggleItemSize("Medium")}

              // disabled={!this.props.editStatus}
            />
          </CardItem>
          <CardItem>
            <EditCheckBox
              label="Large"
              checked={largeSizeIcon}
              onPress={() => toggleItemSize("Large")}

              // disabled={!this.props.editStatus}
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
