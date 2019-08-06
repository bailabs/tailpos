import * as React from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Label, Text } from "native-base";
import { currentLanguage } from "../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

const BLUETOOTH_ICON_SIZE = Dimensions.get("window").width * 0.04;

const StatusComponent = props => (
  <View style={styles.rowCenter}>
    <Icon name="circle" style={props.online ? styles.green : styles.gray} />
    <Text
      style={
        props.online
          ? [styles.green, styles.statusText]
          : [styles.gray, styles.statusText]
      }
    >
      {props.children}
    </Text>
  </View>
);

const PrinterComponent = props => {
  strings.setLanguage(currentLanguage().companyLanguage);

  const connectionStatus = (
    <StatusComponent online={props.connection}>
      {props.connection ? strings.Online : props.connectionStatus}
    </StatusComponent>
  );

  return (
    <View style={props.style}>
      <Label>{strings.PrinterStatus}</Label>
      <View style={styles.innerView}>
        <TouchableOpacity
          onPress={props.onPrinterPress}
          style={styles.rowCenter}
        >
          <Icon name="printer" size={36} style={styles.icon} />
          {connectionStatus}
        </TouchableOpacity>
        <Icon
          name="bluetooth-connect"
          style={styles.blue}
          size={BLUETOOTH_ICON_SIZE}
          onPress={props.connectDevice}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  green: {
    color: "green",
  },
  blue: {
    color: "blue",
  },
  gray: {
    color: "gray",
  },
  statusText: {
    marginLeft: 2,
  },
  innerView: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
});

export default PrinterComponent;
