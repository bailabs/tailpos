import * as React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, CardItem, Text, Input, CheckBox } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class QueueComponent extends React.PureComponent {
  renderHelpText() {
    const { hasTailOrder } = this.props;

    const text = hasTailOrder
      ? "Don't forget to save!"
      : "Enable the TailOrder in order to input.";

    return <Text style={styles.helpText}>{text}</Text>;
  }

  render() {
    const {
      queueHost,
      hasTailOrder,
      setQueueHost,
      toggleTailOrder,
    } = this.props;

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col style={styles.col}>
                <Text style={styles.titleText}>Queueing Settings</Text>
              </Col>
              <Col style={styles.colRight}>
                <TouchableOpacity>
                  <Icon size={30} name="content-save" style={styles.icon} />
                </TouchableOpacity>
              </Col>
            </Grid>
          </CardItem>
          <CardItem style={styles.cardItemForm}>
            <View style={styles.checkBoxView}>
              <CheckBox
                color="#cfcfcf"
                style={styles.checkBox}
                checked={hasTailOrder}
                onPress={toggleTailOrder}
              />
              <Text>TailOrder</Text>
            </View>
          </CardItem>
          {this.renderHelpText()}
          <CardItem style={styles.cardItemForm}>
            <View style={styles.view}>
              <Text style={styles.text}>Host Address</Text>
              <Input
                disabled={!hasTailOrder}
                style={styles.input}
                value={queueHost}
                onChangeText={setQueueHost}
              />
            </View>
          </CardItem>
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
  view: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.7,
  },
  cardItem: {
    backgroundColor: "#4b4c9d",
    width: Dimensions.get("window").width * 0.7,
    marginBottom: 15,
  },
  col: {
    alignSelf: "center",
  },
  colRight: {
    alignContent: "flex-end",
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
    alignSelf: "flex-end",
  },
  helpText: {
    color: "#a7a7a7",
    left: 17,
  },
});

export default QueueComponent;
