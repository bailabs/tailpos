// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { Toast, Container } from "native-base";
import TinyPOS from "tiny-esc-pos";
import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import ShiftReports from "@screens/ShiftReports";
import ItemSalesReportModal from "../../stories/components/ItemSalesReportModalComponent";
import CommissionsModal from "../../stories/components/CommissionsModalComponent";
import { printReport } from "../../stories/components/PrintItemSalesReportComponent";
import { printCommissions } from "../../stories/components/PrintItemSalesReportComponent";
const moment = require("moment");

@inject(
  "paymentStore",
  "receiptStore",
  "customerStore",
  "shiftReportsStore",
  "shiftStore",
  "attendantStore",
  "printerStore",
)
@observer
export default class ShiftReportsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visibility: false,
      visibilityCommission: false,
      bluetoothConnection: false,
    };
  }
  componentWillMount() {
    this.getBluetoothState();
    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            this.setState({
              bluetoothConnection: true,
            });
          })
          .catch(() => {
            this.setState({
              bluetoothConnection: false,
            });
          });
      }
    }
  }
  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if (!isEnabled) {
      BluetoothStatus.enable(true);
    }
  }

  onClickReport(index) {
    let report = "";
    if (index === "") {
      report = this.props.shiftStore.zReading._id;
    } else {
      report = index;
    }
    this.props.shiftStore.find(report).then(result => {
      this.props.shiftReportsStore.setReport(result);
      this.props.navigation.navigate("ShiftInfo");
    });
  }
  ZReading() {
    if (this.props.shiftReportsStore.rows.length > 0) {
      this.props.shiftStore.setZReading();
      this.props.shiftReportsStore.rows.map(async values => {
        await this.props.shiftStore.find(values.shift).then(result => {
          if (
            result.attendant ===
            this.props.attendantStore.defaultAttendant.user_name
          ) {
            if (result.short === null) {
              this.props.shiftStore.zReading.changeShort();
            }
            this.props.shiftStore.zReading.changeValues(result);
            this.props.shiftStore.zReading.setAttendant("Owner");

            this.props.shiftStore.zReading.startShift();

            this.props.shiftStore.zReading.setType();

            this.props.shiftStore.zReading.changeStatus();

            this.props.shiftStore.zReading.endShift();

            result.pays.map(val => {
              this.props.shiftStore.zReading.addPay({
                date: val.date,
                amount: val.amount,
                flow: val.flow,
              });
            });
          }
        });
      });

      this.setState({ loading: true });
    } else {
      Toast.show({
        text: "No shifts created",
        duration: 3000,
        type: "danger",
      });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 10000);
  }
  printItemSalesReports(dates) {
    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(async () => {
            let itemArray = [];
            let date1 = new Date(dates.dateFrom);
            let date2 = new Date(dates.dateTo);

            if (date1.getTime() <= date2.getTime()) {
              for (
                let v = 0;
                v < 1 && new Date(date1).getTime() <= date2;
                v = 0
              ) {
                await this.props.receiptStore
                  .getReceiptsForItemSalesReport(
                    moment(date1).format("YYYY-MM-DD"),
                  )
                  .then(result => {
                    if (result) {
                      for (let x = 0; x < result.length; x += 1) {
                        itemArray.push(result[x]);
                      }
                    }
                  });
                date1 = moment(date1)
                  .add(1, "day")
                  .format("YYYY-MM-DD");
              }
              //
            } else {
              Toast.show({
                text: "(From) date must be greater than or equal (To) date",
                duration: 3000,
                type: "danger",
              });
            }
            if (itemArray.length > 0) {
              printReport(itemArray, this.props);
            } else {
              Toast.show({
                text:
                  "No Item Sales from" + dates.dateFrom + "to" + dates.dateTo,
                duration: 2000,
                type: "danger",
              });
            }
          })
          .catch(() => {
            Toast.show({
              text: "Bluetooth Connection Failed",
              duration: 2000,
              type: "danger",
            });
          });
      }
    }
  }
  itemSalesReport() {
    return (
      <ItemSalesReportModal
        visibility={this.state.visibility}
        onClose={() => this.setState({ visibility: false })}
        onSubmit={dates => this.printItemSalesReports(dates)}
      />
    );
  }
  async commissions(dates, firstLoad) {
    if (firstLoad === undefined) {
      firstLoad = true;
    }
    let date1 = new Date(dates);
    await this.props.receiptStore
      .getReceiptsForItemSalesReport(moment(date1).format("YYYY-MM-DD"))
      .then(async result => {
        if (result.length > 0) {
          await this.props.receiptStore.emptyCommissions();
          for (let x = 0; x < result.length; x += 1) {
            for (let i = 0; i < result[x].lines.length; i += 1) {
              let commissionArrayObject = JSON.parse(
                result[x].lines[i].commission_details,
              );

              if (commissionArrayObject.length > 0) {
                for (let ii = 0; ii < commissionArrayObject.length; ii += 1) {
                  if (commissionArrayObject[ii].commission_attendant_name) {
                    await this.props.receiptStore.updateCommissions(
                      commissionArrayObject[ii],
                    );
                  }
                }
              }
            }
          }
        } else {
          if (!firstLoad) {
            await this.props.receiptStore.emptyCommissions();
          }
        }
      });
  }

  onPrintCommission() {
    printCommissions(
      this.props,
      JSON.parse(this.props.receiptStore.commissions).slice(),
    );
  }
  async onCommissionCashOut(dates, item) {
    await this.props.receiptStore.updateCommissionsStatus(item);
    let date1 = new Date(dates);
    await this.props.receiptStore
      .getReceiptsForItemSalesReport(moment(date1).format("YYYY-MM-DD"))
      .then(async result => {
        if (result.length > 0) {
          for (let x = 0; x < result.length; x += 1) {
            for (let i = 0; i < result[x].lines.length; i += 1) {
              let commissionArrayObject = JSON.parse(
                result[x].lines[i].commission_details,
              );

              if (commissionArrayObject.length > 0) {
                for (let ii = 0; ii < commissionArrayObject.length; ii += 1) {
                  if (
                    commissionArrayObject[ii].commission_attendant_name ===
                    item.name
                  ) {
                    let returnReceiptObject = await this.props.receiptStore.findReceipt(
                      result[x]._id,
                    );
                    if (returnReceiptObject) {
                      returnReceiptObject.changeStatusCommission(item.name);
                    }
                  }
                }
              }
            }
          }
          const { defaultShift } = this.props.shiftStore;
          defaultShift.addCommission(parseInt(item.amount, 10));
        }
      });

    const { defaultShift } = this.props.shiftStore;

    if (this.props.printerStore.rows.length > 0) {
      for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
        if (this.props.printerStore.rows[i].defaultPrinter) {
          BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
            .then(() => {
              const writePromises = [];

              writePromises.push(BluetoothSerial.write(TinyPOS.init()));
              // Header
              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    "Date: " + `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
                    { size: "normal" },
                    true,
                  ),
                ),
              );
              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    "Cashier: " + `${item.name}`,
                    { align: "left", size: "normal" },
                    true,
                  ),
                ),
              );

              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    "Type: " + "PayOut",
                    { align: "left", size: "normal" },
                    true,
                  ),
                ),
              );
              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    "Amount: " + `${item.amount}`,
                    { align: "left", size: "normal" },
                    true,
                  ),
                ),
              );

              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    "Reason: " + " Commission" + "\n\n\n",
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
                        "Printed By: " + `${defaultShift.attendant}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Attendant: " + `${item.name}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Type: " + " PayOut",
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Amount: " + `${item.amount}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "Reason: " + " Commission" + "\n\n\n",
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
  }

  commissionsModal() {
    return (
      <CommissionsModal
        onCommissionCashOut={(dates, item) =>
          this.onCommissionCashOut(dates, item)
        }
        commission={(date, firstLoad) => this.commissions(date, firstLoad)}
        visibility={this.state.visibilityCommission}
        commissionsData={JSON.parse(
          this.props.receiptStore.commissions,
        ).slice()}
        onClose={() => this.setState({ visibilityCommission: false })}
        onSubmit={dates => this.printItemSalesReports(dates)}
        onPrint={dates => this.onPrintCommission(dates)}
      />
    );
  }

  render() {
    return (
      <Container>
        {this.itemSalesReport()}
        {this.commissionsModal()}
        <ShiftReports
          itemSales={() => this.setState({ visibility: true })}
          commission={() => {
            const dateNow = Date.now();

            const fullYear = new Date(dateNow).getFullYear();
            const fullMonth = new Date(dateNow).getMonth() + 1;
            const checkDate =
              new Date(dateNow).getDate().toString().length === 1 ? "-0" : "-";
            const fullDate = new Date(dateNow).getDate();
            this.commissions(fullYear + "-" + fullMonth + checkDate + fullDate);
            this.setState({ visibilityCommission: true });
          }}
          loading={this.state.loading}
          zReading={
            this.props.shiftStore.zReading ? this.props.shiftStore.zReading : ""
          }
          attendant={
            this.props.attendantStore.defaultAttendant
              ? this.props.attendantStore.defaultAttendant
              : ""
          }
          ZReading={() => this.ZReading()}
          navigation={this.props.navigation}
          onClickReport={index => this.onClickReport(index)}
          shiftReportsStore={this.props.shiftReportsStore.rows
            .slice()
            .sort(function(a, b) {
              a = new Date(a.date);
              b = new Date(b.date);
              return a > b ? -1 : a < b ? 1 : 0;
            })}
        />
      </Container>
    );
  }
}
