import * as React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, CardItem, Text, Input, CheckBox, Toast } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const editingOnlyOnPress = function() {
  const { isEditing, onPress } = this;
  if (isEditing) {
    onPress();
  } else {
    Toast.show({
      text: "Please click the edit (pencil icon) button",
      buttonText: "Okay",
    });
  }
};

const SettingsCheckBox = (props) => {
  const { text, checked, isEditing, first = false } = props;
  const cardItemStyle = first ? styles.cardItemForm : [styles.cardItemForm, styles.followingCheck];
  return (
    <CardItem style={cardItemStyle}>
      <View style={styles.checkBoxView}>
        <CheckBox
          style={styles.checkBox}
          checked={checked}
          color={isEditing ? "#ca94ff" : "#cfcfcf"}
          onPress={editingOnlyOnPress.bind(props)}
        />
        <Text>{text}</Text>
      </View>
    </CardItem>
  );
};

const HelpText = (props) => (
  <Text style={styles.helpText}>
    {props.text}
  </Text>
);

class QueueComponent extends React.PureComponent {

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
    const {
      isEditingQueue,
      onQueueSave,
      setQueueEditing,
      useDescription,
      toggleUseDescription,
      useDefaultCustomer,
      toggleUseDefaultCustomer,
      hasTailOrder,
      toggleTailOrder,
    } = this.props;

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
          <SettingsCheckBox
            text="Use Description"
            checked={useDescription}
            onPress={toggleUseDescription}
            isEditing={isEditingQueue}
          />
          <HelpText text="Descriptive Item names in the listing." />
          <SettingsCheckBox
            text="Use Default Customer"
            checked={useDefaultCustomer}
            onPress={toggleUseDefaultCustomer}
            isEditing={isEditingQueue}
          />
          <SettingsCheckBox
            text="Use TailOrder"
            checked={hasTailOrder}
            onPress={toggleTailOrder}
            isEditing={isEditingQueue}
          />
          <HelpText text="Enable the TailOrder feature" />
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
