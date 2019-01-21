import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { CardItem, Text } from "native-base";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ShiftReportCardComponent = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <CardItem bordered style={{ justifyContent: "space-between" }}>
        <View>
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              textAlignVertical: "center",
              color: "#294398",
            }}
          >
            Shift #{props.shiftNumber}: {props.attendant}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 21,
            color: "#294398",
          }}
        >
          {props.date.toLocaleDateString()}
        </Text>
      </CardItem>
    </TouchableOpacity>
  );
};

export default ShiftReportCardComponent;
