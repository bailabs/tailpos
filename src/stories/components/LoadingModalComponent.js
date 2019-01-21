import * as React from "react";
import { Modal, View, Text } from "react-native";

export default class LoadingModalComponent extends React.Component {
  render() {
    return (
      <Modal>
        <View>
          <Text>Text</Text>
        </View>
      </Modal>
    );
  }
}
