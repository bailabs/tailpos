/**
 * Created by jan on 4/20/18.
 * Last modified by Ivan on 4/25/18.
 */
import * as React from "react";
import { Dimensions, View } from "react-native";
import { Text, Button, Card, CardItem, Input } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class CompanyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Card
          style={{
            height: Dimensions.get("window").height * 0.8,
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem
            style={{
              backgroundColor: "#4B4C9D",
              width: Dimensions.get("window").width * 0.7,
              height: Dimensions.get("window").height * 0.8 * 0.1,
            }}
          >
            <Grid style={{}}>
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
                  Sync Settings
                </Text>
              </Col>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.05,
                }}
              >
                <Icon
                  name="pencil"
                  size={30}
                  style={{ color: "white" }}
                  onPress={() => this.props.onSyncEdit(true)}
                />
              </Col>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.05,
                }}
              >
                <Icon
                  name="content-save"
                  size={30}
                  style={{ color: "white" }}
                  onPress={() => this.props.onSyncSave()}
                />
              </Col>
            </Grid>
          </CardItem>
          <CardItem style={{ width: Dimensions.get("window").width * 0.7 }}>
            <Input
              disabled={!this.props.syncEditStatus}
              style={{
                borderColor: this.props.syncEditStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
              }}
              rowSpan={5}
              value={this.props.url}
              onChangeText={text => this.props.changeUrl(text)}
              placeholder="ERPNext URL"
            />
          </CardItem>
          <CardItem style={{ width: Dimensions.get("window").width * 0.7 }}>
            <Input
              disabled={!this.props.syncEditStatus}
              style={{
                borderColor: this.props.syncEditStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
              }}
              rowSpan={5}
              value={this.props.user_name}
              onChangeText={text => this.props.changeUserName(text)}
              placeholder="User Name"
            />
          </CardItem>
          <CardItem style={{ width: Dimensions.get("window").width * 0.7 }}>
            <Input
              disabled={!this.props.syncEditStatus}
              style={{
                borderColor: this.props.syncEditStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
              }}
              rowSpan={5}
              value={this.props.password}
              onChangeText={text => this.props.changePassword(text)}
              placeholder="Password"
            />
          </CardItem>
          <CardItem>
            {this.props.url && this.props.user_name && this.props.password ? (
              <View>
                <Button onPress={() => this.props.sync("sync")}>
                  <Text>Sync</Text>
                </Button>
                <Button
                  style={{ marginLeft: 30 }}
                  onPress={() => this.props.sync("forceSync")}
                >
                  <Text>Force Sync</Text>
                </Button>
              </View>
            ) : null}
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default CompanyComponent;
