// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { Toast, Container } from "native-base";
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
    };
  }
  componentWillMount() {
    this.getBluetoothState();
    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        this.setState({
          currentAddress: this.props.printerStore.rows[i].macAddress,
          connectionStatus: "Connecting...",
          checkBoxValue: this.props.printerStore.rows[i]._id,
        });

        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            this.setState({
              connected: this.props.printerStore.rows[i].macAddress,
              checkBoxValue: this.props.printerStore.rows[i]._id,
            });
          })
          .catch(() => {
            this.setState({ connectionStatus: "Not Connected" });
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
      report = index.shift;
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
  async printItemSalesReports(dates) {
    let itemArray = [];
    let date1 = new Date(dates.dateFrom);
    let date2 = new Date(dates.dateTo);

    if (date1.getTime() <= date2.getTime()) {
      for (let v = 0; v < 1 && new Date(date1).getTime() <= date2; v = 0) {
        await this.props.receiptStore
          .getReceiptsForItemSalesReport(moment(date1).format("YYYY-MM-DD"))
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

    printReport(itemArray, this.props);
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
              if (result[x].lines[i].commission_attendant_name) {
                await this.props.receiptStore.updateCommissions(
                  result[x].lines[i],
                );
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
  commissionsModal() {
    return (
      <CommissionsModal
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
              ? this.props.attendantStore.defaultAttendant.user_name
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
