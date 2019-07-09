import * as React from "react";
import { inject, observer } from "mobx-react/native";
import BluetoothSerial from "react-native-bluetooth-serial";
import TinyPOS from "tiny-esc-pos";
import { formatNumber } from "accounting-js";
import ShiftInfo from "@screens/ShiftInfo";
import { currentLanguage } from "../../translations/CurrentLanguage";

// Opening Amount
// Expected Drawer
// Actual Money
// Short
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
@inject(
  "paymentStore",
  "receiptStore",
  "printerStore",
  "itemStore",
  "shiftReportsStore",
)
@observer
export default class ShiftInfoContainer extends React.Component {
  onPrintReport(report) {
    BluetoothSerial.isConnected().then(res => {
      if (res) {
        const writePromises = [];

        writePromises.push(BluetoothSerial.write(TinyPOS.init()));

        // Header
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${
                this.props.printerStore.companySettings.length > 0
                  ? this.props.printerStore.companySettings[0].name.toString()
                  : "Bai Web and Mobile Lab"
              }`,
              { align: "center", size: "doubleheight" },
              true,
            ),
          ),
        );

        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${
                this.props.printerStore.companySettings.length > 0
                  ? this.props.printerStore.companySettings[0].header.toString()
                  : ""
              }`,
              { align: "center", size: "normal" },
              true,
            ),
          ),
        );

        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${
                report.reportType === "XReading"
                  ? strings.XReading
                  : report.reportType === "ZReading"
                    ? strings.ZReading
                    : ""
              }`,
              { size: "normal" },
              true,
            ),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );

        // Date
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              strings.Opened +
                " " +
                `${report.shift_beginning.toLocaleDateString()}`,
              { size: "normal" },
              true,
            ),
          ),
        );

        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              strings.Closed +
                " " +
                `${report.shift_beginning.toLocaleDateString()}`,
              { size: "normal" },
              true,
            ),
          ),
        );

        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );
        let totalNetSalesString = strings.TotalNetSales;
        let totalNetSalesValue = formatNumber(report.totalNetSales);
        for (let net = 0; net < 17 - totalNetSalesValue.length; net += 1) {
          totalNetSalesString = totalNetSalesString + " ";
        }
        totalNetSalesString = totalNetSalesString + totalNetSalesValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${totalNetSalesString}`,
              { size: "normal" },
              true,
            ),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );
        let beginningCashString = strings.OpeningAmount;
        let beginningCashValue = formatNumber(report.beginning_cash);
        for (let z = 0; z < 18 - beginningCashValue.length; z += 1) {
          beginningCashString = beginningCashString + " ";
        }
        beginningCashString += beginningCashValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${beginningCashString}`,
              { size: "normal" },
              true,
            ),
          ),
        );
        let expectedDrawerString = strings.ExpectedDrawer;
        let expectedDrawerValue = formatNumber(report.ending_cash);
        for (let z = 0; z < 17 - expectedDrawerValue.length; z += 1) {
          expectedDrawerString = expectedDrawerString + " ";
        }
        expectedDrawerString += expectedDrawerValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${expectedDrawerString}`,
              { size: "normal" },
              true,
            ),
          ),
        );
        let actualMoneyString = strings.ActualMoney;
        let actualMoneyValue = formatNumber(report.actual_money);
        for (let aMon = 0; aMon < 20 - actualMoneyValue.length; aMon += 1) {
          actualMoneyString = actualMoneyString + " ";
        }
        actualMoneyString += actualMoneyValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${actualMoneyString}`,
              { size: "normal" },
              true,
            ),
          ),
        );
        let shortString =
          report.computeShort < 0 ? strings.Short : strings.Overage;
        let shortValue = formatNumber(report.computeShort);
        let stringFirst = 32 - shortString.length;
        for (let sh = 0; sh < stringFirst - shortValue.length; sh += 1) {
          shortString = shortString + " ";
        }
        shortString += shortValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(`${shortString}`, { size: "normal" }, true),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );
        let totalCashSalesString = strings.CashSales;
        let totalCashSalesValue = formatNumber(report.totalCashSales);
        for (
          let tCashSales = 0;
          tCashSales < 22 - totalCashSalesValue.length;
          tCashSales += 1
        ) {
          totalCashSalesString = totalCashSalesString + " ";
        }
        totalCashSalesString += totalCashSalesValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${totalCashSalesString}`,
              { size: "normal" },
              true,
            ),
          ),
        );

        let taxValue = strings.Tax;
        let tax = formatNumber(report.total_taxes);
        for (let t = 0; t < 29 - tax.length; t += 1) {
          taxValue = taxValue + " ";
        }
        taxValue = taxValue + tax;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${taxValue}`,
              { align: "left", size: "normal" },
              true,
            ),
          ),
        );
        let discountValue = strings.Discount;
        let discount = formatNumber(report.total_discounts);
        for (let d = 0; d < 24 - discount.length; d += 1) {
          discountValue = discountValue + " ";
        }
        discountValue = discountValue + discount;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${discountValue}`,
              { align: "left", size: "normal" },
              true,
            ),
          ),
        );

        let payoutsString = strings.Payouts;
        let payoutsValue = formatNumber(report.totalPayOut);
        for (let pay = 0; pay < 25 - payoutsValue.length; pay += 1) {
          payoutsString = payoutsString + " ";
        }
        payoutsString += payoutsValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(`${payoutsString}`, { size: "normal" }, true),
          ),
        );
        let payinsString = strings.Payins;
        let payinsValue = formatNumber(report.totalPayIn);
        for (let payI = 0; payI < 25 - payinsValue.length; payI += 1) {
          payinsString = payinsString + " ";
        }
        payinsString += payinsValue;
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(`${payinsString}`, { size: "normal" }, true),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "================================",
              { size: "normal" },
              true,
            ),
          ),
        );
        const datePrinted = new Date();
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              strings.PrintedOn + " " + `${datePrinted.toLocaleString()}`,
              { align: "center", size: "normal" },
              true,
            ),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              `${
                this.props.printerStore.companySettings.length > 0
                  ? this.props.printerStore.companySettings[0].footer.toString()
                  : ""
              }`,
              { align: "center", size: "normal" },
              true,
            ),
          ),
        );
        writePromises.push(
          BluetoothSerial.write(
            TinyPOS.bufferedText(
              "\n" +
                strings.POSProvider +
                "Bai Web and Mobile Lab\n" +
                "Insular Life Bldg, Don Apolinar\n" +
                "Velez cor. Oldarico Akut St.,\n" +
                "Cagayan de Oro, 9000,\n" +
                "Misamis Oriental\n" +
                strings.AccredNo +
                strings.DateIssued +
                strings.ValidUntil,
              { align: "left", size: "normal" },
              true,
            ),
          ),
        );

        // Add 3 new lines
        writePromises.push(BluetoothSerial.write(TinyPOS.bufferedLine(3)));
      }
    });
  }
  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    return (
      <ShiftInfo
        currency={
          this.props.printerStore.companySettings[0].countryCode
            ? this.props.printerStore.companySettings[0].countryCode
            : ""
        }
        numberOfTransaction={this.props.shiftReportsStore.numberOfTransaction}
        onPrintReport={report => this.onPrintReport(report)}
        navigation={this.props.navigation}
        // payment={this.props.paymentStore.defaultPayment}
        report={this.props.shiftReportsStore.defaultReport}
        // customer={this.props.paymentStore.paymentCustomer}
        // onReceiptCancel={() => this.onReceiptCancel()}
      />
    );
  }
}
