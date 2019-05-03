import * as React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, CardItem, Text, Input, CheckBox, Toast } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class QueueComponent extends React.PureComponent {
  toggle = () => {
    const { isEditingQueue, toggleTailOrder } = this.props;

    if (isEditingQueue) {
      toggleTailOrder();
    } else {
      Toast.show({
        text: "Please click the edit (pencil icon) button",
        buttonText: "Okay",
      });
    }
  };

  toggleDescription = () => {
    const { isEditingQueue, toggleUseDescription } = this.props;

    if (isEditingQueue) {
      toggleUseDescription();
    } else {
      Toast.show({
        text: "Please click the edit (pencil icon) button",
        buttonText: "Okay",
      });
    }
  };

  toggleCustomer = () => {
    const { isEditingQueue, toggleUseDefaultCustomer } = this.props;

    if (isEditingQueue) {
      toggleUseDefaultCustomer();
    } else {
      Toast.show({
        text: "Please click the edit (pencil icon) button",
        buttonText: "Okay",
      });
    }
  };

  renderHelpText() {
    const { hasTailOrder } = this.props;

    const text = hasTailOrder
      ? "Don't forget to save!"
      : "Enable the TailOrder in order to input.";

    return <Text style={styles.helpText}>{text}</Text>;
  }

  renderCheckbox() {
    const { hasTailOrder, isEditingQueue } = this.props;
    return (
      <CardItem style={[styles.cardItemForm, styles.followingCheck]}>
        <View style={styles.checkBoxView}>
          <CheckBox
            style={styles.checkBox}
            checked={hasTailOrder}
            onPress={this.toggle}
            color={isEditingQueue ? "#ca94ff" : "#cfcfcf"}
          />
          <Text>TailOrder</Text>
        </View>
      </CardItem>
    );
  }

  renderCustomerCheck() {
    const { isEditingQueue, useDefaultCustomer } = this.props;
    return (
      <CardItem style={[styles.cardItemForm, styles.followingCheck]}>
        <View style={styles.checkBoxView}>
          <CheckBox
            style={styles.checkBox}
            checked={useDefaultCustomer}
            onPress={this.toggleCustomer}
            color={isEditingQueue ? "#ca94ff" : "#cfcfcf"}
          />
          <Text>Use Default Customer</Text>
        </View>
      </CardItem>
    );
  }

  renderDescriptionCheck() {
    const { isEditingQueue, useDescription } = this.props;
    return (
      <CardItem style={styles.cardItemForm}>
        <View style={styles.checkBoxView}>
          <CheckBox
            style={styles.checkBox}
            checked={useDescription}
            onPress={this.toggleDescription}
            color={isEditingQueue ? "#ca94ff" : "#cfcfcf"}
          />
          <Text>Use Description</Text>
        </View>
      </CardItem>
    );
  }

  renderDescriptionText() {
    return (
      <Text style={styles.helpText}>
        Descriptive Item names in the listing.
      </Text>
    );
  }

  renderInput() {
    const {
      hasTailOrder,
      queueHost,
      setQueueHost,
      isEditingQueue,
    } = this.props;

    return (
      <CardItem style={styles.cardItemForm}>
        <View style={styles.view}>
          <Text style={styles.text}>Host Address</Text>
          <Input
            disabled={!hasTailOrder || !isEditingQueue}
            style={isEditingQueue ? styles.inputEnabled : styles.input}
            value={queueHost}
            onChangeText={setQueueHost}
          />
        </View>
      </CardItem>
    );
  }

  render() {
    const { onQueueSave, setQueueEditing } = this.props;

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col style={styles.col}>
                <Text style={styles.titleText}>Other Settings</Text>
              </Col>
              <Col>
                <View style={styles.colView}>
                  <TouchableOpacity onPress={setQueueEditing}>
                    <Icon size={30} name="pencil" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onQueueSave}>
                    <Icon size={30} name="content-save" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </Col>
            </Grid>
          </CardItem>
          {this.renderDescriptionCheck()}
          {this.renderDescriptionText()}
          {this.renderCustomerCheck()}
          {this.renderCheckbox()}
          {this.renderHelpText()}
          {this.renderInput()}
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
  },
  inputEnabled: {
    borderWidth: 1,
    borderColor: "#ca94ff",
  },
  view: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
  },
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
  colView: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  titleText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.02,
  },
  checkBox: {
    left: 0,
    marginRight: 10,
  },
  checkBoxView: {
    flexDirection: "row",
  },
  cardItemForm: {
    paddingVertical: 5,
  },
  icon: {
    color: "white",
    marginLeft: 10,
  },
  helpText: {
    color: "#a7a7a7",
    left: 17,
  },
  followingCheck: {
    marginTop: 10,
  },
});

export default QueueComponent;
