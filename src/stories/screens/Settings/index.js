/**
 * Created by jan on 4/20/18.
 * Last modified by Ivan on 4/25/18.
 */
import * as React from "react";
import {
  Container,
  Header,
  Title,
  Left,
  Body,
  Right,
  Content,
  Text,
  Card,
  List,
  ListItem,
  Grid,
  Col,
} from "native-base";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import PrinterSettings from "@components/PrinterSettingsComponent";
import CompanySettings from "@components/CompanyComponent";
import BluetoothScanner from "../../components/BluetoothScannerComponent";
import AddAttendant from "../../components/AddAttendantComponent";
import Sync from "../../components/SyncComponent";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      checkBoxValue: 0,
      editStatus: false,
      checkBoxBluetoothValue: "disable",
      returnValue: "Bluetooth",
      pressedTab: "Bluetooth",
    };
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout() {
    const { width, height } = Dimensions.get("window");

    this.setState({ midComponentWidth: width * 0.5406 });
    this.setState({ rightComponentWidth: width * 0.3906 });
    this.setState({ leftComponentWidth: width * 0.0688 });
    this.setState({ screenHeight: height });
  }
  render() {
    // Logout owner
    // let Attendant = null;
    //
    // if (this.props.attendant && this.props.attendant.role === "Owner") {
    //     Attendant = (
    //     <AddAttendant
    //         attendantsData={this.props.attendantsData}
    //         onSave={values => this.props.onSaveAttendant(values)}/>
    //   );
    // }
    let menuItems = [
      { name: "Bluetooth" },
      { name: "Company" },
      { name: "Sync" },
    ];
    if (this.props.attendant && this.props.attendant.role === "Owner") {
      menuItems = [
        { name: "Bluetooth" },
        { name: "Company" },
        { name: "Attendant" },
        { name: "Sync" },
      ];
    }

    return (
      <Container>
        <Header
          style={{
            backgroundColor: "#4B4C9D",
            height: Dimensions.get("window").height * 0.08,
          }}
        >
          <Left>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
              >
                <Icon
                  name="bars"
                  size={25}
                  color="white"
                  style={{ paddingLeft: 5 }}
                />
              </TouchableOpacity>
              <Title style={{ marginLeft: 10 }}>Settings</Title>
            </View>
          </Left>
          <Body />
          <Right />
        </Header>
        <Content padder>
          <View style={{ flexDirection: "row" }}>
            <Card
              style={{
                flexDirection: "row",
                height: Dimensions.get("window").height * 0.8,
              }}
            >
              <List
                dataArray={menuItems}
                renderRow={item => (
                  <ListItem
                    onPress={() =>
                      this.setState({
                        returnValue: item.name,
                        pressedTab: item.name,
                      })
                    }
                    style={{ width: Dimensions.get("window").width * 0.23 }}
                  >
                    <Grid>
                      <Col
                        style={{
                          width: Dimensions.get("window").width * 0.19,
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "flex-start",
                            marginLeft: 20,
                            fontSize:
                              Dimensions.get("window").height * 0.8 * 0.04,
                          }}
                        >
                          {item.name}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {this.state.pressedTab === item.name ? (
                          <Right>
                            <Icon
                              name="chevron-right"
                              size={20}
                              style={{ color: "gray" }}
                            />
                          </Right>
                        ) : null}
                      </Col>
                    </Grid>
                  </ListItem>
                )}
              />
            </Card>
            {this.state.returnValue === "Bluetooth" ? (
              <View>
                <PrinterSettings
                  currentAddress={this.props.currentAddress}
                  connectionStatus={this.props.connectionStatus}
                  connected={this.props.connected}
                  connectDevice={(address, index) =>
                    this.props.connectDevice(address, index)
                  }
                  checkBoxValue={this.props.checkBoxValue}
                  checkBoxValueOnChange={printer =>
                    this.props.checkBoxValueOnChange(printer)
                  }
                  availableDevices={this.props.availableDevices}
                  availableDevicesChangeValue={text =>
                    this.props.availableDevicesChangeValue(text)
                  }
                  navigation={this.props.navigation}
                  printerStore={value => this.props.printerStore(value)}
                  printers={this.props.printers}
                  addDevice={(value, index) =>
                    this.props.addDevice(value, index)
                  }
                  addedDevice={this.props.addedDevice}
                  removeDevice={value => this.props.removeDevice(value)}
                />
                <BluetoothScanner
                  value={this.props.values}
                  onCheckBoxValueChange={text =>
                    this.props.bluetoothScannerStatus(text)
                  }
                />
              </View>
            ) : this.state.returnValue === "Company" ? (
              <CompanySettings
                values={this.props.values}
                changeName={text => this.props.changeName(text)}
                changeCountry={text => this.props.changeCountry(text)}
                changeHeader={text => this.props.changeHeader(text)}
                changeFooter={text => this.props.changeFooter(text)}
                editStatus={this.state.editStatus}
                onCompanyEdit={text => this.setState({ editStatus: text })}
                onCompanySave={() => {
                  this.setState({ editStatus: false });
                  this.props.onCompanySave();
                }}
                companyCountry={this.props.companyCountry}
              />
            ) : this.state.returnValue === "Attendant" &&
            this.props.attendant &&
            this.props.attendant.role === "Owner" ? (
              <AddAttendant
                onDeleteAttendant={values =>
                  this.props.onDeleteAttendant(values)
                }
                onClickAttendant={attendant =>
                  this.props.onClickAttendant(attendant)
                }
                attendantsData={this.props.attendantsData}
                attendantsInfo={this.props.attendantsInfo}
                onSave={values => this.props.attendantForm(values)}
                onEdit={values => this.props.attendantForm(values)}
                onChangeRoleStatus={text => this.props.onChangeRoleStatus(text)}
                roleStatus={this.props.roleStatus}
                rolesData={this.props.rolesData}
                onAddRoles={values => this.props.onAddRoles(values)}
                onDeleteRoles={values => this.props.onDeleteRoles(values)}
                onClickRole={values => this.props.onClickRole(values)}
                selectedRole={this.props.selectedRole}
              />
            ) : this.state.returnValue === "Sync" ? (
              <Sync
                sync={status => this.props.syncAll(status)}
                onSyncEdit={status => this.props.onSyncEdit(status)}
                onSyncSave={() => this.props.onSyncSave()}
                changeUrl={status => this.props.changeUrl(status)}
                changeUserName={status => this.props.changeUserName(status)}
                changePassword={status => this.props.changePassword(status)}
                syncEditStatus={this.props.syncEditStatus}
                url={this.props.url}
                user_name={this.props.user_name}
                password={this.props.password}
              />
            ) : null}
          </View>
        </Content>
      </Container>
    );
  }
}

export default Settings;
