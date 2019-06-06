import * as React from "react";
import { Alert } from "react-native";
import { NavigationActions } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import { Toast } from "native-base";
import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import Settings from "@screens/Settings";
import { syncObjectValues } from "../../store/PosStore/syncInBackground";
import { saveConfig } from "../../services/storage";

// import { syncData } from "./sync";

@inject(
  "printerStore",
  "itemStore",
  "categoryStore",
  "discountStore",
  "attendantStore",
  "receiptStore",
  "paymentStore",
  "syncStore",
  "shiftStore",
  "shiftReportsStore",
  "stateStore",
  "customerStore",
  "roleStore",
  "headSyncStore",
)
@observer
export default class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendants: [],
      attendantsInfo: {},
      companyCountry: "PHP",
      roleStatus: "Role",
    };
  }
  componentWillMount() {
    if (this.props.printerStore.sync.length > 0) {
      // this.setState({
      //     url: this.props.printerStore.sync[0].url.toString(),
      //     user_name: this.props.printerStore.sync[0].user_name.toString(),
      //     password: this.props.printerStore.sync[0].password.toString(),
      // });
      this.props.stateStore.changeValue(
        "url",
        this.props.printerStore.sync[0].url.toString(),
        "Settings",
      );
      this.props.stateStore.changeValue(
        "user_name",
        this.props.printerStore.sync[0].user_name.toString(),
        "Settings",
      );
      this.props.stateStore.changeValue(
        "password",
        this.props.printerStore.sync[0].password.toString(),
        "Settings",
      );
    }
    if (this.props.attendantStore.rows.length > 0) {
      this.setState({ attendants: this.props.attendantStore.rows.slice() });
      // this.props.stateStore.changeValue("attendants", JSON.stringify(this.props.attendantStore.rows.slice()), "Settings")
    }
    this.getBluetoothState();
    if (this.props.printerStore.bluetooth.length > 0) {
      // this.setState({
      //   checkBoxBluetoothValue: this.props.printerStore.bluetooth[0].status,
      // });
      this.props.stateStore.changeValue(
        "checkBoxBluetoothValue",
        this.props.printerStore.bluetooth[0].status,
        "Settings",
      );
    }
    if (this.props.printerStore.companySettings.length > 0) {
      // Alert.alert("", this.props.printerStore.companySettings[0].name + " " + this.props.printerStore.companySettings[0].header + " " + this.props.printerStore.companySettings[0].footer)
      // this.setState({
      //   companyName: this.props.printerStore.companySettings[0].name.toString(),
      //   companyHeader: this.props.printerStore.companySettings[0].header.toString(),
      //   companyFooter: this.props.printerStore.companySettings[0].footer.toString(),
      // });
      this.props.stateStore.changeValue(
        "companyName",
        this.props.printerStore.companySettings[0].name.toString(),
        "Settings",
      );
      this.props.stateStore.changeValue(
        "tax",
        this.props.printerStore.companySettings[0].tax.toString(),
        "Settings",
      );
      this.props.stateStore.changeValue(
        "companyHeader",
        this.props.printerStore.companySettings[0].header.toString(),
        "Settings",
      );
      this.props.stateStore.changeValue(
        "companyFooter",
        this.props.printerStore.companySettings[0].footer.toString(),
        "Settings",
      );

      this.setState({
        companyCountry: this.props.printerStore.companySettings[0].countryCode.toString(),
      });
    }

    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        // this.setState({
        //   currentAddress: this.props.printerStore.rows[i].macAddress,
        //   connectionStatus: "Connecting...",
        //   checkBoxValue: this.props.printerStore.rows[i]._id,
        // });
        this.props.stateStore.changeValue(
          "currentAddress",
          this.props.printerStore.rows[i].macAddress,
          "Settings",
        );
        this.props.stateStore.changeValue(
          "connectionStatus",
          "Connecting...",
          "Settings",
        );
        this.props.stateStore.changeValue(
          "checkBoxValue",
          this.props.printerStore.rows[i]._id,
          "Settings",
        );

        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            // this.setState({
            //   connected: this.props.printerStore.rows[i].macAddress,
            //   checkBoxValue: this.props.printerStore.rows[i]._id,
            // });
            this.props.stateStore.changeValue(
              "connected",
              this.props.printerStore.rows[i].macAddress,
              "Settings",
            );
            this.props.stateStore.changeValue(
              "checkBoxValue",
              this.props.printerStore.rows[i]._id,
              "Settings",
            );
          })
          .catch(() => {
            // this.setState({ connectionStatus: "Not Connected" });
            this.props.stateStore.changeValue(
              "connectionStatus",
              "Not Connected",
              "Settings",
            );
          });
      }
    }
    // }
  }
  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if (!isEnabled) {
      BluetoothStatus.enable(true);
    }
  }
  onButtonPress = value => {
    this.props.printerStore.addFoundDevices(value);
  };
  onAddDevice = (value, index) => {
    Alert.alert(
      "Add Device", // title
      "Are you sure you want to add this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            this.props.printerStore.add(value);
            const foundDevicesParse = JSON.parse(
              this.props.printerStore.foundDevices,
            );
            foundDevicesParse.splice(index, 1);
            this.props.printerStore.addFoundDevices(foundDevicesParse);
            Toast.show({
              text: "Successfully Added Device",
              duration: 5000,
            });
          },
        },
      ],
    );
  };
  onRemoveDevice = value => {
    Alert.alert(
      "Remove Device", // title
      "Are you sure you want to remove this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            if (
              this.props.printerStore.rows[value].macAddress ===
              this.props.stateStore.settings_state[0].currentAddress
            ) {
              this.props.stateStore.changeValue(
                "currentAddress",
                "",
                "Settings",
              );
              this.props.stateStore.changeValue(
                "connectionStatus",
                "Not Connected",
                "Settings",
              );
            }
            this.props.printerStore.rows[value].delete();

            Toast.show({
              text: "Successfully Removed Device",
              duration: 5000,
            });
          },
        },
      ],
    );
  };
  onConnectDevice = (printer, index) => {
    this.props.stateStore.changeValue(
      "connectionStatus",
      "Connecting...",
      "Settings",
    );
    this.props.stateStore.changeValue(
      "currentAddress",
      printer.macAddress,
      "Settings",
    );

    if (printer.macAddress) {
      BluetoothSerial.connect(printer.macAddress)
        .then(() => {
          this.props.stateStore.changeValue(
            "connection",
            printer.macAddress,
            "Settings",
          );
          this.props.stateStore.changeValue(
            "checkBoxValue",
            printer._id,
            "Settings",
          );

          let prevDefaultPrinterObject = this.props.printerStore.find(
            printer._id,
          );
          prevDefaultPrinterObject.edit({
            _id: prevDefaultPrinterObject._id,
            name: prevDefaultPrinterObject.name,
            macAddress: prevDefaultPrinterObject.macAddress,
            defaultPrinter: !prevDefaultPrinterObject.defaultPrinter,
          });
          // this.setState({ connectionStatus: "Online" });
          this.props.stateStore.changeValue(
            "connectionStatus",
            "Online",
            "Settings",
          );
        })
        .catch(() => {
          BluetoothSerial.connect(printer.macAddress)
            .then(() => {
              this.props.stateStore.changeValue(
                "checkBoxValue",
                printer._id,
                "Settings",
              );

              let prevDefaultPrinterObject = this.props.printerStore.find(
                printer._id,
              );
              prevDefaultPrinterObject.edit({
                _id: prevDefaultPrinterObject._id,
                name: prevDefaultPrinterObject.name,
                macAddress: prevDefaultPrinterObject.macAddress,
                defaultPrinter: !prevDefaultPrinterObject.defaultPrinter,
              });
              this.props.stateStore.changeValue(
                "connectionStatus",
                "Online",
                "Settings",
              );
            })
            .catch(() => {
              this.props.stateStore.changeValue(
                "connectionStatus",
                "Offline",
                "Settings",
              );
            });
        });
    }
  };
  onCheckBoxValueOnChange = printer => {
    if (printer._id === this.props.stateStore.settings_state[0].checkBoxValue) {
      this.props.stateStore.changeValue("checkBoxValue", "", "Settings");
      let prevDefaultPrinterObject = this.props.printerStore.find(printer._id);
      prevDefaultPrinterObject.edit({
        _id: prevDefaultPrinterObject._id,
        name: prevDefaultPrinterObject.name,
        macAddress: prevDefaultPrinterObject.macAddress,
        defaultPrinter: !prevDefaultPrinterObject.defaultPrinter,
      });
    } else {
      this.props.stateStore.changeValue(
        "checkBoxValue",
        printer._id,
        "Settings",
      );

      let prevDefaultPrinterObject = this.props.printerStore.find(printer._id);
      prevDefaultPrinterObject.edit({
        _id: prevDefaultPrinterObject._id,
        name: prevDefaultPrinterObject.name,
        macAddress: prevDefaultPrinterObject.macAddress,
        defaultPrinter: !prevDefaultPrinterObject.defaultPrinter,
      });
    }
  };

  onCompanySave = () => {
    this.props.receiptStore.defaultReceipt.changeTaxes(
      this.props.stateStore.settings_state[0].tax,
    );
    if (this.props.printerStore.companySettings.length > 0) {
      let company = this.props.printerStore.findCompany(
        this.props.printerStore.companySettings[0]._id,
      );

      company.edit({
        _id: this.props.printerStore.companySettings[0]._id,
        tax: this.props.stateStore.settings_state[0].tax,
        name: this.props.stateStore.settings_state[0].companyName,
        header: this.props.stateStore.settings_state[0].companyHeader,
        footer: this.props.stateStore.settings_state[0].companyFooter,
        countryCode: this.state.companyCountry,
      });
    } else {
      this.props.printerStore.addCompany({
        name: this.props.stateStore.settings_state[0].companyName,
        tax: this.props.stateStore.settings_state[0].tax,
        header: this.props.stateStore.settings_state[0].companyHeader,
        footer: this.props.stateStore.settings_state[0].companyFooter,
        countryCode: this.state.companyCountry,
      });
    }
  };
  bluetoothScannerStatus(text) {
    if (this.props.printerStore.bluetooth.length > 0) {
      let bluetoothScanner = this.props.printerStore.findBluetoothScanner(
        this.props.printerStore.bluetooth[0]._id,
      );
      bluetoothScanner.edit({
        _id: this.props.printerStore.bluetooth[0]._id,
        status: text,
      });
    } else {
      this.props.printerStore.addBluetoothScannerStatus({
        status: text,
      });
    }
  }

  onLogout = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Login",
          params: { isLogout: true },
        }),
      ],
    });

    Alert.alert(
      "Confirm Logout",
      "All data will be lost when you are logged out as owner. Would you like to proceed?",
      [
        { text: "Cancel" },
        {
          text: "Logout",
          onPress: () => this.props.navigation.dispatch(resetAction),
        },
      ],
    );
  };

  checkForSpecialChar(string) {
    let specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

    for (let i = 0; i < specialChars.length; i++) {
      if (string.indexOf(specialChars[i]) > -1) {
        return true;
      }
    }
    return false;
  }
  attendantForm = async values => {
    if (values.attendantName) {
      if (values.canLogin) {
        if (values.pin) {
          if (values.pin.length === 4) {
            if (!this.checkForSpecialChar(values.pin)) {
              if (values.confirmPin) {
                if (values.pin === values.confirmPin) {
                  if (values.status === "Save Attendant") {
                    this.props.attendantStore
                      .findAttendant(values.attendantName)
                      .then(result => {
                        if (!result) {
                          this.props.attendantStore.add({
                            user_name: values.attendantName,
                            pin_code: values.pin,
                            role: values.role,
                            canLogin: values.canLogin,
                            commission:
                              parseInt(values.commission, 10) > 0
                                ? parseInt(values.commission, 10)
                                : 0,
                            dateUpdated: Date.now(),
                            syncStatus: false,
                          });
                          Toast.show({
                            text: "Successfully Added Attendant",
                            duration: 5000,
                          });
                          this.setState({
                            attendants: this.props.attendantStore.rows.slice(),
                            attendantsInfo: {},
                          });
                        } else {
                          Toast.show({
                            text: "Attendant Already Exist",
                            type: "danger",
                            duration: 5000,
                          });
                        }
                      });

                    // this.props.stateStore.changeValue("attendants", JSON.stringify(this.props.attendantStore.rows.slice()), "Settings")
                    // this.props.stateStore.changeValue("attendantsInfo",{}, "Settings")
                  } else if (values.status === "Edit Attendant") {
                    const valueAttendant = await this.props.attendantStore.find(
                      values.id,
                    );

                    valueAttendant.edit({
                      _id: values.id,
                      user_name: values.attendantName,
                      pin_code: values.pin,
                      role: values.role,
                      canLogin: values.canLogin,
                      commission:
                        parseInt(values.commission, 10) > 0
                          ? parseInt(values.commission, 10)
                          : 0,

                      dateUpdated: Date.now(),
                      syncStatus: false,
                    });
                    Toast.show({
                      text: "Successfully Updated Attendant",
                      duration: 5000,
                    });
                    this.setState({
                      attendants: this.props.attendantStore.rows.slice(),
                      attendantsInfo: {},
                    });
                    // this.props.stateStore.changeValue("attendants", JSON.stringify(this.props.attendantStore.rows.slice()), "Settings")
                    // this.props.stateStore.changeValue("attendantsInfo",{}, "Settings")
                  }
                } else {
                  Toast.show({
                    text: "Pin code does not match",
                    type: "danger",
                    duration: 5000,
                  });
                  this.setState({
                    attendantsInfo: values,
                  });
                  // this.props.stateStore.changeValue("attendantsInfo",values, "Settings")
                }
              } else {
                Toast.show({
                  text: "Please confirm pin",
                  type: "danger",
                  duration: 5000,
                });
                this.setState({
                  attendantsInfo: values,
                });
                // this.props.stateStore.changeValue("attendantsInfo",values, "Settings")
              }
            } else {
              Toast.show({
                text: "Pin code contains special characters",
                type: "danger",
                duration: 5000,
              });
            }
          } else {
            Toast.show({
              text: "Pin must be exactly 4 characters",
              type: "danger",
              duration: 5000,
            });
            this.setState({
              attendantsInfo: values,
            });
            // this.props.stateStore.changeValue("attendantsInfo",values, "Settings")
          }
        } else {
          Toast.show({
            text: "Enter Valid Pin",
            type: "danger",
            duration: 5000,
          });
          this.setState({
            attendantsInfo: values,
          });
          // this.props.stateStore.changeValue("attendantsInfo",values, "Settings")
        }
      } else {
        if (values.status === "Save Attendant") {
          this.props.attendantStore
            .findAttendant(values.attendantName)
            .then(result => {
              if (!result) {
                this.props.attendantStore.add({
                  user_name: values.attendantName,
                  pin_code: values.pin,
                  role: values.role,
                  canLogin: values.canLogin,
                  commission:
                    parseInt(values.commission, 10) > 0
                      ? parseInt(values.commission, 10)
                      : 0,
                  dateUpdated: Date.now(),
                  syncStatus: false,
                });
                Toast.show({
                  text: "Successfully Added Attendant",
                  duration: 5000,
                });
                this.setState({
                  attendants: this.props.attendantStore.rows.slice(),
                  attendantsInfo: {},
                });
              } else {
                Toast.show({
                  text: "Attendant Already Exist",
                  type: "danger",
                  duration: 5000,
                });
              }
            });

          // this.props.stateStore.changeValue("attendants", JSON.stringify(this.props.attendantStore.rows.slice()), "Settings")
          // this.props.stateStore.changeValue("attendantsInfo",{}, "Settings")
        } else if (values.status === "Edit Attendant") {
          const valueAttendant = await this.props.attendantStore.find(
            values.id,
          );

          valueAttendant.edit({
            _id: values.id,
            user_name: values.attendantName,
            pin_code: values.pin,
            role: values.role,
            canLogin: values.canLogin,
            commission:
              parseInt(values.commission, 10) > 0
                ? parseInt(values.commission, 10)
                : 0,

            dateUpdated: Date.now(),
            syncStatus: false,
          });
          Toast.show({
            text: "Successfully Updated Attendant",
            duration: 5000,
          });
          this.setState({
            attendants: this.props.attendantStore.rows.slice(),
            attendantsInfo: {},
          });
          // this.props.stateStore.changeValue("attendants", JSON.stringify(this.props.attendantStore.rows.slice()), "Settings")
          // this.props.stateStore.changeValue("attendantsInfo",{}, "Settings")
        }
      }
    } else {
      Toast.show({
        text: "Enter Valid Attendant Name",
        type: "danger",
        duration: 5000,
      });
      this.setState({
        attendantsInfo: values,
      });
      // this.props.stateStore.changeValue("attendantsInfo",values, "Settings")
    }
  };
  async deleteAttendant(index) {
    index.delete();
    this.setState({
      attendants: this.props.attendantStore.rows.slice(),
    });
  }
  onDeleteAttendant = index => {
    Alert.alert(
      "Delete attendant", // title
      "Are you sure you want to delete attendant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            this.deleteAttendant(index);
            Toast.show({
              text: "Successfully Deleted Attendant",
              duration: 5000,
            });
          },
        },
      ],
    );
  };

  syncAll = status => {
    const storeProps = this.props;
    this.props.stateStore.setIsSyncing();
    syncObjectValues(status, storeProps, false);
  };

  onSyncSave = () => {
    if (this.props.printerStore.sync.length > 0) {
      let sync = this.props.printerStore.findSync(
        this.props.printerStore.sync[0]._id,
      );
      sync.edit({
        _id: this.props.printerStore.sync[0]._id,
        url: this.props.stateStore.settings_state[0].url,
        user_name: this.props.stateStore.settings_state[0].user_name,
        password: this.props.stateStore.settings_state[0].password,
      });
    } else {
      this.props.printerStore.addSync({
        url: this.props.stateStore.settings_state[0].url,
        user_name: this.props.stateStore.settings_state[0].user_name,
        password: this.props.stateStore.settings_state[0].password,
      });
    }
    saveConfig(this.props.stateStore);
    this.props.stateStore.changeValue("syncEditStatus", false, "Settings");
  };

  onAddRoles(values) {
    this.props.roleStore.add({
      role: values.role,
      dateUpdated: Date.now(),
      syncStatus: false,
      canLogin: values.checkBoxValue,
    });
  }

  onDeleteRoles = values => {
    Alert.alert(
      "Delete attendant", // title
      "Are you sure you want to delete role?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            values.delete();
            Toast.show({
              text: "Successfully Deleted Role",
              duration: 5000,
            });
          },
        },
      ],
    );
  };

  onClickRole = values => {
    this.props.roleStore.setRole(values);
  };

  async editRoles(values) {
    const role = await this.props.roleStore.find(values.id);
    role.edit({
      role: values.role,
    });
    this.props.roleStore.unselectRole();
  }

  onQueueSave = () => {
    const { setQueueNotEditing } = this.props.stateStore;

    saveConfig(this.props.stateStore);
    setQueueNotEditing();
  };

  render() {
    const {
      roleStore,
      stateStore,
      attendantStore,
      printerStore,
      navigation,
    } = this.props;

    return (
      <Settings
        navigation={navigation}
        values={stateStore.settings_state[0].toJSON()}
        connected={stateStore.settings_state[0].connected}
        checkBoxValue={stateStore.settings_state[0].checkBoxValue}
        currentAddress={stateStore.settings_state[0].currentAddress}
        connectionStatus={stateStore.settings_state[0].connectionStatus}
        availableDevices={stateStore.settings_state[0].availableDevices}
        attendant={attendantStore.defaultAttendant}
        companyValues={printerStore.companySettings}
        connectDevice={this.onConnectDevice}
        availableDevicesChangeValue={text =>
          stateStore.changeValue("availableDevices", text, "Settings")
        }
        checkBoxValueOnChange={this.onCheckBoxValueOnChange}
        bluetoothScannerStatus={text => {
          stateStore.changeValue("checkBoxBluetoothValue", text, "Settings");
          this.bluetoothScannerStatus(text);
        }}
        addDevice={this.onAddDevice}
        printerStore={this.onButtonPress}
        printers={printerStore.foundDevices.slice()}
        addedDevice={printerStore.rows.slice()}
        removeDevice={this.onRemoveDevice}
        onCompanySave={this.onCompanySave}
        changeName={text =>
          stateStore.changeValue("companyName", text, "Settings")
        }
        changeTax={text => stateStore.changeValue("tax", text, "Settings")}
        changeCountry={text => this.setState({ companyCountry: text })}
        changeHeader={text =>
          stateStore.changeValue("companyHeader", text, "Settings")
        }
        changeFooter={text =>
          stateStore.changeValue("companyFooter", text, "Settings")
        }
        attendantForm={this.attendantForm}
        attendantsData={this.state.attendants}
        onClickAttendant={attendant =>
          this.setState({ attendantsInfo: attendant })
        }
        attendantsInfo={this.state.attendantsInfo}
        onDeleteAttendant={this.onDeleteAttendant}
        syncAll={this.syncAll}
        onSyncEdit={status =>
          stateStore.changeValue("syncEditStatus", status, "Settings")
        }
        onSyncSave={this.onSyncSave}
        changeUrl={status => stateStore.changeValue("url", status, "Settings")}
        changeUserName={status =>
          stateStore.changeValue("user_name", status, "Settings")
        }
        changePassword={status =>
          stateStore.changeValue("password", status, "Settings")
        }
        url={stateStore.settings_state[0].url}
        companyCountry={this.state.companyCountry}
        user_name={stateStore.settings_state[0].user_name}
        password={stateStore.settings_state[0].password}
        syncEditStatus={stateStore.settings_state[0].syncEditStatus}
        onAddRole={text => this.setState({ roleStatus: text })}
        roleStatus={this.state.roleStatus}
        onChangeRoleStatus={text => this.setState({ roleStatus: text })}
        rolesData={roleStore.rows.slice()}
        onAddRoles={values => {
          if (values.status === "Add") {
            this.onAddRoles(values);
          } else {
            this.editRoles(values);
          }
        }}
        onDeleteRoles={this.onDeleteRoles}
        onClickRole={this.onClickRole}
        selectedRole={roleStore.roleSelected ? roleStore.roleSelected : ""}
        queueHost={stateStore.queueHost}
        setQueueHost={stateStore.setQueueHost}
        hasTailOrder={stateStore.hasTailOrder}
        toggleTailOrder={stateStore.toggleTailOrder}
        onQueueSave={this.onQueueSave}
        // Queue Settings
        isEditingQueue={stateStore.isEditingQueue}
        setQueueEditing={stateStore.setQueueEditing}
        setQueueNotEditing={stateStore.setQueueNotEditing}
        useDescription={stateStore.useDescription}
        toggleUseDescription={stateStore.toggleUseDescription}
        useDefaultCustomer={stateStore.useDefaultCustomer}
        toggleUseDefaultCustomer={stateStore.toggleUseDefaultCustomer}
        // Sync Settings
        isSyncing={stateStore.isSyncing}
        isHttps={stateStore.isHttps}
        toggleHttps={stateStore.toggleHttps}
        deviceId={stateStore.deviceId}
        setDeviceId={stateStore.setDeviceId}
        isStackItem={stateStore.isStackItem}
        toggleIsStackItem={stateStore.toggleIsStackItem}
      />
    );
  }
}
