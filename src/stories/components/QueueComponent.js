import * as React from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Card, CardItem, Text, Input } from "native-base";

import { Col, Grid } from "react-native-easy-grid";

class QueueComponent extends React.PureComponent {
  render() {
    const { queueHost, setQueueHost } = this.props;
    return (
      <View>
        <Card
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem
            style={{
              backgroundColor: "#4B4C9D",
              width: Dimensions.get("window").width * 0.7,
            }}
          >
            <Grid>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.7 * 0.83,
                }}
              >
                <Text
                  style={{
                    fontSize: Dimensions.get("window").width * 0.02,
                    color: "white",
                  }}
                >
                  Queueing Settings
                </Text>
              </Col>
            </Grid>
          </CardItem>
          <CardItem>
            <View style={styles.view}>
              <Text style={styles.text}>Host Address</Text>
              <Input
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
  },
  view: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default QueueComponent;
