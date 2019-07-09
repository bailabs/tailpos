import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class OrderItemComponent extends React.PureComponent {
  onTableClick = () => this.props.onTableClick(this.props.index);
  onTableLongPress = () => this.props.onTableLongPress(this.props.index);

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      const { id, tableNo, isTakeAway } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onTableClick}
        onLongPress={this.onTableLongPress}
      >
        <View style={[styles.view, isTakeAway && styles.takeAwayView]}>
          <Text style={styles.orderText}>
            [{strings.ORDER}-{id}]
          </Text>
          <Text style={styles.text}>
            {strings.TableNo} {tableNo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    margin: 15,
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    justifyContent: "center",
    backgroundColor: "#afafaf",
  },
  takeAwayView: {
    backgroundColor: "#ffb020",
  },
  text: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default OrderItemComponent;
