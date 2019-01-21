/**
 * Created by jan on 4/20/18.
 * Last modified by Ivan on 4/25/18.
 */
import * as React from "react";
import { Text, List, ListItem, CheckBox, Card, CardItem } from "native-base";
import {
  NativeAppEventEmitter,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

let devices = [];
let dup = 0;
let dup1 = 0;
class PrinterSettingsComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
  }

  onCreate() {
    this.props.availableDevicesChangeValue(true);
    BleManager.start().then(() => {
      BleManager.scan([], 10, false).then(() => {
        NativeAppEventEmitter.addListener(
          "BleManagerDiscoverPeripheral",
          data => {
            if (data.name === null) {
              for (let i = 0; i < this.props.addedDevice.length; i += 1) {
                if (data.id === this.props.addedDevice[i].macAddress) {
                  dup += 1;
                }
              }
              for (let i = 0; i < devices.length; i += 1) {
                if (data.id === devices[i].macAddress) {
                  dup1 += 1;
                }
              }
              if (dup === 0) {
                if (dup1 === 0) {
                  devices.push({
                    name: "Blutooth Device",
                    macAddress: data.id.toString(),
                    defaultPrinter: false,
                  });
                }
              }
            } else {
              for (let i = 0; i < this.props.addedDevice.length; i += 1) {
                if (data.id === this.props.addedDevice[i].macAddress) {
                  dup += 1;
                }
              }
              for (let i = 0; i < devices.length; i += 1) {
                if (data.id === devices[i].macAddress) {
                  dup1 += 1;
                }
              }
              if (dup === 0) {
                if (dup1 === 0) {
                  devices.push({
                    name: data.name.toString(),
                    macAddress: data.id.toString(),
                    defaultPrinter: false,
                  });
                }
              }
            }
            dup = 0;
            dup1 = 0;
            this.props.printerStore(devices);
          },
        );
      });
    });
    devices = [];
  }
  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          // width: Dimensions.get("window").width * 0.70 * 0.93,
          height: Dimensions.get("window").height * 0.1,
          marginLeft: 20,
        }}
      >
        <Grid>
          <Col
            style={{
              justifyContent: "center",
              width: Dimensions.get("window").width * 0.05,
            }}
          >
            <CheckBox
              onPress={() => this.props.checkBoxValueOnChange(item)}
              checked={this.props.checkBoxValue === item._id}
              color="green"
            />
          </Col>
          <Col
            style={{
              justifyContent: "center",
              // width: Dimensions.get("window").width * 0.70 * 0.93,
            }}
          >
            <Text>{item.name}</Text>
            {this.props.connected === item.macAddress ? (
              <Text style={{ color: "green" }}>Connected</Text>
            ) : (
              <Text style={{ color: "gray" }}>
                {this.props.currentAddress === item.macAddress
                  ? this.props.connectionStatus
                  : "Not Connected"}
              </Text>
            )}
          </Col>
          <Col
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              width: Dimensions.get("window").width * 0.128,
            }}
          >
            <Grid>
              <Col
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="bluetooth-connect"
                  style={{ color: "blue" }}
                  size={Dimensions.get("window").width * 0.035}
                  onPress={() => this.props.connectDevice(item, item._id)}
                />
              </Col>
              <Col
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="delete"
                  style={{ color: "red" }}
                  size={Dimensions.get("window").width * 0.035}
                  onPress={() => this.props.removeDevice(index)}
                />
              </Col>
            </Grid>
          </Col>
        </Grid>
      </View>
    );
  };
  _renderPrintersItem = ({ item, index }) => {
    return (
      <View
        style={{
          // width: Dimensions.get("window").width,
          height: Dimensions.get("window").height * 0.1,
          marginLeft: 20,
        }}
      >
        <Grid>
          <Col
            style={{
              justifyContent: "center",
              width: Dimensions.get("window").width * 0.7 * 0.3,
            }}
          >
            <Text key={index}>{item.name}</Text>
          </Col>
          <Col
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              // width: Dimensions.get("window").width * 0.18,
            }}
          >
            <Icon
              name="plus-box"
              style={{ color: "green" }}
              size={Dimensions.get("window").width * 0.035}
              onPress={() => this.props.addDevice(item, index)}
            />
            {/*<Button*/}
            {/*style={{*/}
            {/*justifyContent: "center",*/}
            {/*width: Dimensions.get("window").width * 0.08,*/}
            {/*}}*/}
            {/*onPress={() => this.props.addDevice(item, index)}*/}
            {/*>*/}
            {/*<Text style={{fontSize: Dimensions.get("window").height * 0.70 * 0.030}}>Add</Text>*/}
            {/*</Button>*/}
          </Col>
        </Grid>
      </View>
    );
  };
  render() {
    return (
      <View>
        <Card
          style={{
            height: Dimensions.get("window").height * 0.7,
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem
            style={{
              backgroundColor: "#4B4C9D",
              height: Dimensions.get("window").height * 0.7 * 0.1,
            }}
          >
            <Grid>
              <Col
                style={{
                  justifyContent: "center",
                  width: Dimensions.get("window").width * 0.7,
                }}
              >
                <Text
                  style={{
                    fontSize: Dimensions.get("window").width * 0.7 * 0.03,
                    color: "white",
                  }}
                >
                  Printer
                </Text>
              </Col>
              <Col
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  width: Dimensions.get("window").width * 0.7 * 0.1,
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: Dimensions.get("window").width * 0.15,
                  }}
                  onPress={() => this.onCreate()}
                >
                  <Icon
                    name="magnify"
                    size={Dimensions.get("window").width * 0.7 * 0.04}
                    style={{ color: "white" }}
                  />
                </TouchableOpacity>
              </Col>
            </Grid>
          </CardItem>
          <CardItem>
            <View
              style={{ width: Dimensions.get("window").width * 0.7 * 0.47 }}
            >
              <List
                style={{
                  width: Dimensions.get("window").width * 0.7 * 0.47,
                  height: Dimensions.get("window").height * 0.7 * 0.1,
                }}
              >
                <ListItem
                  style={{
                    width: Dimensions.get("window").width * 0.7 * 0.47,
                    height: Dimensions.get("window").height * 0.7 * 0.1,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Registered Devices</Text>
                </ListItem>
              </List>
            </View>
            <View
              style={{
                marginLeft: 20,
                width: Dimensions.get("window").width * 0.7 * 0.47,
              }}
            >
              <List
                style={{
                  width: Dimensions.get("window").width * 0.7 * 0.47,
                  height: Dimensions.get("window").height * 0.7 * 0.1,
                }}
              >
                <ListItem
                  style={{
                    width: Dimensions.get("window").width * 0.7 * 0.47,
                    height: Dimensions.get("window").height * 0.7 * 0.1,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Available Devices</Text>
                </ListItem>
              </List>
            </View>
          </CardItem>
          <CardItem>
            <View
              style={{
                width: Dimensions.get("window").width * 0.7 * 0.47,
                height: Dimensions.get("window").height * 0.7 * 0.6,
              }}
            >
              <FlatList
                extraData={this.props}
                data={this.props.addedDevice}
                keyExtractor={(item, index) => item.id}
                renderItem={this._renderItem}
              />
            </View>
            <View
              style={{
                marginLeft: 20,
                width: Dimensions.get("window").width * 0.7 * 0.47,
                height: Dimensions.get("window").height * 0.7 * 0.5,
              }}
            >
              {this.props.availableDevices ? (
                <FlatList
                  extraData={this.props}
                  data={JSON.parse(this.props.printers)}
                  keyExtractor={(item, index) => item.id}
                  renderItem={this._renderPrintersItem}
                />
              ) : null}
            </View>
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default PrinterSettingsComponent;
