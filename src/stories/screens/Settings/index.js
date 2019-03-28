import * as React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
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

import Icon from "react-native-vector-icons/FontAwesome";

import CompanySettings from "@components/CompanyComponent";
import PrinterSettings from "@components/PrinterSettingsComponent";
import BluetoothScanner from "../../components/BluetoothScannerComponent";
import AddAttendant from "../../components/AddAttendantComponent";
import Sync from "../../components/SyncComponent";
import Queue from "../../components/QueueComponent";

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

  renderRow = item => {
    return (
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
                fontSize: Dimensions.get("window").height * 0.8 * 0.04,
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
    );
  };

  renderMenu = () => {
    const {
      // PrinterStatus
      currentAddress,
      connectionStatus,
      connected,
      connectDevice,
      checkBoxValue,
      checkBoxValueOnChange,
      availableDevices,
      availableDevicesChangeValue,
      printerStore,
      printers,
      addDevice,
      addedDevice,
      removeDevice,

      // Bluetooth Scanner
      values,
      bluetoothScannerStatus,

      // CompanySettings
      changeName,
      changeHeader,
      changeFooter,
      changeCountry,
      onCompanySave,
      companyCountry,

      // Sync
      syncAll,
      onSyncEdit,
      onSyncSave,
      changeUrl,
      changeUserName,
      changePassword,
      syncEditStatus,
      url,
      user_name,
      password,

      // Attendant
      attendant,
      onDeleteAttendant,
      onClickAttendant,
      attendantsData,
      attendantsInfo,
      attendantForm,
      onChangeRoleStatus,
      roleStatus,
      rolesData,
      onAddRoles,
      onDeleteRoles,
      onClickRole,
      selectedRole,

      // Queue
      queueHost,
      setQueueHost,

      // navigation
      navigation,
    } = this.props;

    if (this.state.returnValue === "Bluetooth") {
      return (
        <View>
          <PrinterSettings
            navigation={navigation}
            printers={printers}
            addDevice={addDevice}
            connected={connected}
            addedDevice={addedDevice}
            removeDevice={removeDevice}
            printerStore={printerStore}
            connectDevice={connectDevice}
            checkBoxValue={checkBoxValue}
            currentAddress={currentAddress}
            connectionStatus={connectionStatus}
            availableDevices={availableDevices}
            checkBoxValueOnChange={checkBoxValueOnChange}
            availableDevicesChangeValue={availableDevicesChangeValue}
          />
          <BluetoothScanner
            value={values}
            onCheckBoxValueChange={bluetoothScannerStatus}
          />
        </View>
      );
    }

    if (this.state.returnValue === "Company") {
      return (
        <CompanySettings
          values={values}
          changeName={changeName}
          changeHeader={changeHeader}
          changeFooter={changeFooter}
          changeCountry={changeCountry}
          companyCountry={companyCountry}
          editStatus={this.state.editStatus}
          onCompanyEdit={text => this.setState({ editStatus: text })}
          onCompanySave={() => {
            this.setState({ editStatus: false });
            onCompanySave();
          }}
        />
      );
    }

    if (this.state.returnValue === "Sync") {
      return (
        <Sync
          sync={syncAll}
          onSyncEdit={onSyncEdit}
          onSyncSave={onSyncSave}
          changeUrl={changeUrl}
          changeUserName={changeUserName}
          changePassword={changePassword}
          syncEditStatus={syncEditStatus}
          url={url}
          user_name={user_name}
          password={password}
        />
      );
    }

    if (this.state.returnValue === "Attendant") {
      if (attendant && attendant.role === "Owner") {
        return (
          <AddAttendant
            onDeleteAttendant={onDeleteAttendant}
            onClickAttendant={onClickAttendant}
            attendantsData={attendantsData}
            attendantsInfo={attendantsInfo}
            onSave={attendantForm}
            onEdit={attendantForm}
            onChangeRoleStatus={onChangeRoleStatus}
            roleStatus={roleStatus}
            rolesData={rolesData}
            onAddRoles={onAddRoles}
            onDeleteRoles={onDeleteRoles}
            onClickRole={onClickRole}
            selectedRole={selectedRole}
          />
        );
      }
    }

    if (this.state.returnValue === "Queueing") {
      return (
        <Queue
          queueHost={queueHost}
          setQueueHost={setQueueHost}
        />
      );
    }

    return null;
  }

  render() {
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
        { name: "Queueing" },
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
              <List dataArray={menuItems} renderRow={this.renderRow} />
            </Card>
            {this.renderMenu()}
          </View>
        </Content>
      </Container>
    );
  }
}

export default Settings;
