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

    const { id, tableNo, isTakeAway, company, type } = this.props;
    const size = company.smallSizeIcon ? styles.smallSizeIcon : company.mediumSizeIcon ? styles.mediumSizeIcon : styles.largeSizeIcon;
    const text = company.smallSizeIcon ? styles.smalltext : company.mediumSizeIcon ? styles.mediumtext : styles.largetext;
    const orderText = company.smallSizeIcon ? styles.smallOrderText : company.mediumSizeIcon ? styles.mediumOrderText : styles.largeOrderText;
    return (
      <TouchableOpacity
        onPress={this.onTableClick}
        onLongPress={this.onTableLongPress}
      >
        <View style={[styles.view, size, isTakeAway && styles.takeAwayView]}>
          <Text style={orderText}>
            [{strings.ORDER}-{id}]
          </Text>
          <Text style={text}>
              {type} {strings.TableNo} {tableNo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    margin: 15,
    borderRadius: 180 / 2,
    justifyContent: "center",
    backgroundColor: "#afafaf",
  },
  largeSizeIcon: {
    width: 160,
    height: 160,
  },
    mediumSizeIcon: {
    width: 110,
    height: 110,
  },
    smallSizeIcon: {
    width: 80,
    height: 80,
  },
  takeAwayView: {
    backgroundColor: "#ffb020",
  },
    //SMALL
  smalltext: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  smallOrderText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
    //MEDIUM
  mediumtext: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  mediumOrderText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
    //LARGE
  largetext: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
  },
  largeOrderText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

});

export default OrderItemComponent;
