import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { CardItem, Text } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class ShiftReportCardComponent extends React.PureComponent {
  onPress = () => this.props.onPress(this.props.shift);

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <TouchableOpacity onPress={this.onPress}>
        <CardItem bordered style={styles.cardItem}>
          <View>
            <Text style={styles.text}>
              {strings.Shift} #{this.props.shiftNumber}: {this.props.attendant}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {this.props.date.toLocaleDateString()}
          </Text>
        </CardItem>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    justifyContent: "space-between",
  },
  text: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#294398",
    textAlignVertical: "center",
  },
  dateText: {
    fontSize: 21,
    color: "#294398",
  },
});

export default ShiftReportCardComponent;
