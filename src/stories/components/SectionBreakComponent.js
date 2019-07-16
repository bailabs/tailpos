import * as React from "react";
import { View, StyleSheet } from "react-native";

const SectionBreakComponent = props => <View style={styles.view} />;

const styles = StyleSheet.create({
  view: {
    borderTopWidth: 1,
    borderTopColor: "#D9D5DC",
    paddingTop: 10,
    marginTop: 15,
  },
});

export default SectionBreakComponent;
