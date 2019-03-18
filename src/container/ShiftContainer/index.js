import * as React from "react";
import { Toast } from "native-base";
import BluetoothSerial from "react-native-bluetooth-serial";
import TinyPOS from "tiny-esc-pos";
import { observer, inject } from "mobx-react/native";
const moment = require("moment");

import ShiftScreen from "@screens/Shift";

@inject(
  "shiftStore",
  "attendantStore",
  "shiftReportsStore",
  "printerStore",
  "untypedState",
)
@observer
export default class ShiftContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: "",
    };
  }
  openShift() {
    this.props.shiftStore.defaultShift.setBeginCash(parseFloat(this.state.pay));
    const { defaultShift } = this.props.shiftStore;

    if (defaultShift.beginning_cash) {
      const attendant = this.props.attendantStore.defaultAttendant.user_name;
      defaultShift.beginShift(attendant);

      this.props.shiftReportsStore.add({
        date: Date.now(),
        shift: defaultShift._id,
        status: "Opened",
        shiftNumber: this.props.shiftReportsStore.rows.length + 1,
        attendant: this.props.attendantStore.defaultAttendant.user_name,
      });
      // Yeah
      this.props.navigation.navigate("Sales");
    } else {
      Toast.show({
        text: "Enter a beginning cash!",
        buttonText: "Okay",
        type: "danger",
        position: "top",
      });
    }
    this.setState({ pay: "" });
  }

  closeShift(money) {
    if (money) {
      const { untypedState } = this.props;
      const { defaultShift } = this.props.shiftStore;

      defaultShift.closeShift(money);
      untypedState.addShift(defaultShift._id);
    } else {
      Toast.show({
        text: "Invalid Amount",
        buttonText: "Okay",
        type: "danger",
        position: "top",
      });
    }
  }

  reshift() {
    this.props.shiftStore.newShift();
  }

  onAmountChange(text) {
    this.props.shiftStore.defaultShift.setBeginCash(parseFloat(text));
  }

  onAttendantChange(index) {
    // nononononone
    if (index !== 0) {
      const attendant = this.props.attendantStore.rows[index - 1];

      this.props.attendantStore.setAttendant(attendant);
      this.props.shiftStore.defaultShift.setAttendant(attendant.user_name);
    } else {
      this.props.attendantStore.setAttendant(null);
      this.props.shiftStore.defaultShift.setAttendant("");
    }
  }

  payInClick(money) {
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
                        "Date: " +
                          `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                        { size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Cashier: " + `${defaultShift.attendant}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Type: " + `${money.type}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Amount: " + `${money.pay}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Reason: " + `${money.reason}` + "\n\n\n",
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
                            "Date: " +
                              `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                            { size: "normal" },
                            true,
                          ),
                        ),
                      );
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            "Cashier: " + `${defaultShift.attendant}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );

                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            "Type: " + `${money.type}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            "Amount: " + `${money.pay}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );

                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            "Reason: " + `${money.reason}` + "\n\n\n",
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
                        buttonText: "Okay",
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
          text: "Added Cash",
          buttonText: "Okay",
          duration: 3000,
        });
      } else {
        Toast.show({
          text: "Input valid reason",
          buttonText: "Okay",
          type: "danger",
          position: "bottom",
          duration: 2000,
        });
      }
    } else {
      Toast.show({
        text: "Its not your shift",
        buttonText: "Okay",
        type: "danger",
        position: "bottom",
        duration: 2000,
      });
    }
  }

  payOutClick(money) {
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
            text: "Cash pay-out is greater than the cash available.",
            buttonText: "Okay",
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
                          "Date: " +
                            `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                          { size: "normal" },
                          true,
                        ),
                      ),
                    );
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          "Cashier: " + `${defaultShift.attendant}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );

                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          "Type: " + `${money.type}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          "Amount: " + `${money.pay}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );

                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          "Reason: " + `${money.reason}` + "\n\n\n",
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
                              "Date: " +
                                `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                              { size: "normal" },
                              true,
                            ),
                          ),
                        );
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              "Cashier: " + `${defaultShift.attendant}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );

                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              "Type: " + `${money.type}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              "Amount: " + `${money.pay}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );

                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              "Reason: " + `${money.reason}` + "\n\n\n",
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
                          buttonText: "Okay",
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
            text: "Removed Cash",
            buttonText: "Okay",
            type: "danger",
            position: "bottom",
            duration: 3000,
          });
        }
      } else {
        Toast.show({
          text: "Input valid reason",
          buttonText: "Okay",
          type: "danger",
          position: "bottom",
          duration: 2000,
        });
      }
    } else {
      Toast.show({
        text: "Its not your shift",
        buttonText: "Okay",
        type: "danger",
        position: "bottom",
        duration: 2000,
      });
    }
  }

  onNumberPress(text) {
    this.setState({ pay: this.state.pay + text });
  }
  onDeletePress() {
    this.setState({ pay: this.state.pay.slice(0, -1) });
  }

  render() {
    return (
      <ShiftScreen
        currency={
          this.props.printerStore.companySettings[0].countryCode
            ? this.props.printerStore.companySettings[0].countryCode
            : ""
        }
        pay={this.state.pay}
        onNumberPress={text => this.onNumberPress(text)}
        onDeletePress={text => this.onDeletePress(text)}
        navigation={this.props.navigation}
        openShift={() => this.openShift()}
        closeShift={money => this.closeShift(money)}
        reshift={() => this.reshift()}
        payInClick={money => this.payInClick(money)}
        payOutClick={money => this.payOutClick(money)}
        dropsClick={money => this.dropsClick(money)}
        shiftStarted={this.props.shiftStore.defaultShift.shiftStarted}
        shiftEnded={this.props.shiftStore.defaultShift.shiftEnded}
        shiftBeginning={this.props.shiftStore.defaultShift.shift_beginning}
        shiftEnd={this.props.shiftStore.defaultShift.shift_end}
        cashBeginning={this.props.shiftStore.defaultShift.beginning_cash}
        cashEnd={this.props.shiftStore.defaultShift.ending_cash}
        shiftAttendant={this.props.shiftStore.defaultShift.attendant}
        attendant={this.props.attendantStore.defaultAttendant}
        pays={this.props.shiftStore.defaultShift.pays.slice()}
        amountOnChange={text => this.onAmountChange(text)}
        attendantOnChange={text => this.onAttendantChange(text)}
        attendants={this.props.attendantStore.rows.slice()}
      />
    );
  }
}
