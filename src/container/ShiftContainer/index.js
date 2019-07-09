import * as React from "react";
import { Toast } from "native-base";
import { observer, inject } from "mobx-react/native";
import BluetoothSerial from "react-native-bluetooth-serial";
import TinyPOS from "tiny-esc-pos";
const moment = require("moment");
import { currentLanguage } from "../../translations/CurrentLanguage";

import ShiftScreen from "@screens/Shift";
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
@inject("shiftStore", "attendantStore", "shiftReportsStore", "printerStore")
@observer
export default class ShiftContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: "",
    };
  }

  openShift = () => {
    const { navigate } = this.props.navigation;
    const { defaultShift } = this.props.shiftStore;
    const { rows, add } = this.props.shiftReportsStore;
    const { defaultAttendant } = this.props.attendantStore;

    defaultShift.setBeginCash(parseFloat(this.state.pay));

    if (defaultShift.beginning_cash) {
      const attendant = defaultAttendant.user_name;

      defaultShift.beginShift(attendant);

      add({
        date: Date.now(),
        status: "Opened",
        shift: defaultShift._id,
        shiftNumber: rows.length + 1,
        attendant: defaultAttendant.user_name,
      });

      navigate("Sales");
    } else {
      Toast.show({
        text: strings.EnterABeginningCash,
        buttonText: strings.Okay,
        type: "danger",
        position: "top",
      });
    }
    this.setState({ pay: "" });
  };

  closeShift = money => {
    if (money) {
      const { defaultShift } = this.props.shiftStore;
      defaultShift.closeShift(money);
    } else {
      Toast.show({
        text: strings.InvalidAmount,
        buttonText: strings.Okay,
        type: "danger",
        position: "top",
      });
    }
  };

  reshift = () => {
    this.props.shiftStore.newShift();
  };

  onAmountChange = text => {
    this.props.shiftStore.defaultShift.setBeginCash(parseFloat(text));
  };

  onAttendantChange = index => {
    const { attendantStore, shiftStore } = this.props;

    let attendant = null;
    let attendantName = "";

    if (index !== 0) {
      attendant = attendantStore.rows[index - 1];
      attendantName = attendant.user_name;
    }

    attendantStore.setAttendant(attendant);
    shiftStore.defaultShift.setAttendant(attendantName);
  };

  payInClick = money => {
    if (
      this.props.shiftStore.defaultShift.attendant ===
      this.props.attendantStore.defaultAttendant.user_name
    ) {
      if (money.reason) {
        this.setState({ pay: "" });

        const { defaultShift } = this.props.shiftStore;

        // Pay in

        defaultShift.addPay({
          date: Date.now(),
          amount: parseFloat(money.pay),
          reason: money.reason,
          flow: "In",
        });
        // End cash
        defaultShift.setEndCash(
          defaultShift.ending_cash + parseFloat(money.pay),
        );
        if (this.props.printerStore.rows.length > 0) {
          for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
            if (this.props.printerStore.rows[i].defaultPrinter) {
              BluetoothSerial.connect(
                this.props.printerStore.rows[i].macAddress,
              )
                .then(() => {
                  const writePromises = [];

                  writePromises.push(BluetoothSerial.write(TinyPOS.init()));
                  // Header
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Date +
                          ": " +
                          `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                        { size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Cashier + ": " + `${defaultShift.attendant}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Type + ": " + `${money.type}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Amount + ": " + `${money.pay}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Reason + ": " + `${money.reason}` + "\n\n\n",
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  Promise.all(writePromises);
                })
                .catch(e => {
                  BluetoothSerial.connect(
                    this.props.printerStore.rows[i].macAddress,
                  )
                    .then(() => {
                      const writePromises = [];

                      writePromises.push(BluetoothSerial.write(TinyPOS.init()));
                      // Header
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            strings.Date +
                              ": " +
                              `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                            { size: "normal" },
                            true,
                          ),
                        ),
                      );
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            strings.Cashier +
                              ": " +
                              `${defaultShift.attendant}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );

                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            strings.Type + ": " + `${money.type}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            strings.Amount + ": " + `${money.pay}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );

                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            strings.Reason +
                              ": " +
                              `${money.reason}` +
                              "\n\n\n",
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );
                      Promise.all(writePromises);
                    })
                    .catch(err => {
                      Toast.show({
                        text: err.message,
                        buttonText: strings.Okay,
                        type: "danger",
                        position: "bottom",
                        duration: 3000,
                      });
                    });
                });
            }
          }
        }

        Toast.show({
          text: strings.AddedCash,
          buttonText: strings.Okay,
          duration: 3000,
        });
      } else {
        Toast.show({
          text: strings.InputValidReason,
          buttonText: strings.Okay,
          type: "danger",
          position: "bottom",
          duration: 2000,
        });
      }
    } else {
      Toast.show({
        text: strings.ItsNotYourShift,
        buttonText: strings.Okay,
        type: "danger",
        position: "bottom",
        duration: 2000,
      });
    }
  };

  payOutClick = money => {
    if (
      this.props.shiftStore.defaultShift.attendant ===
      this.props.attendantStore.defaultAttendant.user_name
    ) {
      if (money.reason) {
        this.setState({ pay: "" });
        const { defaultShift } = this.props.shiftStore;

        const newCash = defaultShift.ending_cash - parseFloat(money.pay);

        if (defaultShift.ending_cash < parseFloat(money.pay)) {
          Toast.show({
            text: strings.CashPayoutIsGreaterThanTheCashAvailable,
            buttonText: strings.Okay,
            type: "danger",
            position: "bottom",
            duration: 3000,
          });
        } else {
          defaultShift.addPay({
            date: Date.now(),
            amount: parseFloat(money.pay),
            reason: money.reason,
            flow: "Out",
          });

          defaultShift.setEndCash(newCash);
          if (this.props.printerStore.rows.length > 0) {
            for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
              if (this.props.printerStore.rows[i].defaultPrinter) {
                BluetoothSerial.connect(
                  this.props.printerStore.rows[i].macAddress,
                )
                  .then(() => {
                    const writePromises = [];

                    writePromises.push(BluetoothSerial.write(TinyPOS.init()));
                    // Header
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          strings.Date +
                            ": " +
                            `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                          { size: "normal" },
                          true,
                        ),
                      ),
                    );
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          strings.Cashier + ": " + `${defaultShift.attendant}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );

                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          strings.Type + ": " + `${money.type}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          strings.Amount + ": " + `${money.pay}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );

                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          strings.Reason + ": " + `${money.reason}` + "\n\n\n",
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );
                    Promise.all(writePromises);
                  })
                  .catch(e => {
                    BluetoothSerial.connect(
                      this.props.printerStore.rows[i].macAddress,
                    )
                      .then(() => {
                        const writePromises = [];

                        writePromises.push(
                          BluetoothSerial.write(TinyPOS.init()),
                        );
                        // Header
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              strings.Date +
                                ": " +
                                `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                              { size: "normal" },
                              true,
                            ),
                          ),
                        );
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              strings.Cashier +
                                ": " +
                                `${defaultShift.attendant}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );

                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              strings.Type + ": " + `${money.type}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              strings.Amount + ": " + `${money.pay}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );

                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              strings.Reason +
                                ": " +
                                `${money.reason}` +
                                "\n\n\n",
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );
                        Promise.all(writePromises);
                      })
                      .catch(err => {
                        Toast.show({
                          text: err.message,
                          buttonText: strings.Okay,
                          type: "danger",
                          position: "bottom",
                          duration: 3000,
                        });
                      });
                  });
              }
            }
          }
          Toast.show({
            text: strings.RemovedCash,
            buttonText: strings.Okay,
            type: "danger",
            position: "bottom",
            duration: 3000,
          });
        }
      } else {
        Toast.show({
          text: strings.InputValidReason,
          buttonText: strings.Okay,
          type: "danger",
          position: "bottom",
          duration: 2000,
        });
      }
    } else {
      Toast.show({
        text: strings.ItsNotYourShift,
        buttonText: strings.Okay,
        type: "danger",
        position: "bottom",
        duration: 2000,
      });
    }
  };

  onNumberPress = text => {
    this.setState({ pay: this.state.pay + text });
  };

  onDeletePress = () => {
    this.setState({ pay: this.state.pay.slice(0, -1) });
  };

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
    return (
      <ShiftScreen
        currency={
          this.props.printerStore.companySettings[0].countryCode
            ? this.props.printerStore.companySettings[0].countryCode
            : ""
        }
        pay={this.state.pay}
        onNumberPress={this.onNumberPress}
        onDeletePress={this.onDeletePress}
        navigation={this.props.navigation}
        closeShift={this.closeShift}
        payInClick={this.payInClick}
        payOutClick={money => this.payOutClick(money)}
        dropsClick={money => this.dropsClick(money)}
        reshift={this.reshift}
        openShift={this.openShift}
        amountOnChange={this.onAmountChange}
        attendantOnChange={this.onAttendantChange}
        pays={this.props.shiftStore.defaultShift.pays.slice()}
        attendants={this.props.attendantStore.rows.slice()}
        shiftStarted={this.props.shiftStore.defaultShift.shiftStarted}
        shiftEnded={this.props.shiftStore.defaultShift.shiftEnded}
        shiftBeginning={this.props.shiftStore.defaultShift.shift_beginning}
        shiftEnd={this.props.shiftStore.defaultShift.shift_end}
        cashBeginning={this.props.shiftStore.defaultShift.beginning_cash}
        cashEnd={this.props.shiftStore.defaultShift.ending_cash}
        shiftAttendant={this.props.shiftStore.defaultShift.attendant}
        attendant={this.props.attendantStore.defaultAttendant}
      />
    );
  }
}
