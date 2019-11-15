import { Alert } from "react-native";
import TinyPOS from "tiny-esc-pos";
import { formatNumber } from "accounting-js";
import BluetoothSerial from "react-native-bluetooth-serial";
import { Toast } from "native-base";
import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
const moment = require("moment");

export async function setOrderCompleted(props) {
  const { queueOrigin, currentTable, setCurrentTable } = props.stateStore;

  const url = `${queueOrigin}/api/v1/complete_order`;
  const fetchData = {
    method: "POST",
    body: JSON.stringify({
      id: currentTable,
    }),
  };

  fetch(url, fetchData)
    .then(res => res.json())
    .then(res => setCurrentTable(-1));
}
export async function on_pay(props) {
  const paymentValue = props.stateStore.settings_state[0].multipleMop
    ? parseFloat(props.stateStore.payment_amount)
    : parseFloat(props.stateStore.payment_value);
  const amountDue = parseFloat(props.stateStore.amount_due);

  if (paymentValue < amountDue) {
    Alert.alert(
      strings.Alert,
      strings.AmountPaidMustBeGreaterThanOrEqualToAmountDue,
    );
  } else if (paymentValue >= amountDue) {
    let receiptNumber = await props.receiptStore.numberOfReceipts();
    let receiptNumberLength = receiptNumber.toString().length;
    let finalReceiptNumber = "";
    for (
      let lengthNumber = 0;
      lengthNumber < 15 - receiptNumberLength;
      lengthNumber += 1
    ) {
      finalReceiptNumber = finalReceiptNumber + "0";
    }
    finalReceiptNumber = finalReceiptNumber + receiptNumber.toString();

    const receiptCurrent = props.receiptStore.defaultReceipt;
    const { deviceId } = props.stateStore;

    if (deviceId) {
      receiptCurrent.setDeviceId(deviceId);
    }

    BluetoothSerial.isConnected().then(res => {
      let totalPurchase = 0.0;
      Alert.alert(
        strings.ReceiptConfirmation, // title
        strings.DoYouWantToPrintReceipt,
        [
          {
            text: strings.No,
            style: "cancel",
            onPress: () => {
              setOrderCompleted(props);
              props.shiftStore.defaultShift.addTotalDiscount(
                receiptCurrent.discounts,
              );
              props.shiftStore.defaultShift.addTotalTaxes(
                parseFloat(props.receiptStore.defaultReceipt.subtotal) *
                  (parseFloat(receiptCurrent.taxesValue) / 100),
              );
              props.shiftStore.defaultShift.addNumberOfTransaction();

              let totalAmountDue = 0.0;

              props.receiptStore.defaultReceipt.lines.map(val => {
                totalAmountDue =
                  parseInt(totalAmountDue, 10) +
                  parseInt(val.price.toFixed(2), 10) *
                    parseInt(val.qty.toFixed(2), 10);
                if (val.category && val.category !== "No Category") {
                  props.shiftStore.defaultShift.categoriesAmounts({
                    name: val.category,
                    total_amount:
                      parseInt(val.price.toFixed(2), 10) *
                      parseInt(val.qty.toFixed(2), 10),
                  });
                }
                if (props.stateStore.payment_state[0].selected) {
                  props.shiftStore.defaultShift.mopAmounts({
                    name: props.stateStore.payment_state[0].selected,
                    total_amount:
                      parseInt(val.price.toFixed(2), 10) *
                      parseInt(val.qty.toFixed(2), 10),
                  });
                }
              });
              if (props.receiptStore.defaultReceipt.orderType !== "None") {
                props.shiftStore.defaultShift.addOrderType({
                  amount: parseFloat(totalAmountDue, 10),
                  type: props.receiptStore.defaultReceipt.orderType,
                });
              }
              props.shiftStore.defaultShift.addTotalSales(totalAmountDue);
              props.receiptStore.defaultReceipt.lines.map(val => {
                totalPurchase =
                  parseFloat(totalPurchase, 10) +
                  parseFloat(val.price, 10) * parseFloat(val.qty, 10);
              });

              receiptCurrent.completed(
                props.attendantStore.defaultAttendant.user_name,
              );
              const { defaultShift } = props.shiftStore;

              // If shift started and shift hasn't ended
              if (defaultShift.shiftStarted && !defaultShift.shiftEnded) {
                // Set the default receipt
                const { defaultReceipt } = props.receiptStore;

                // set shift
                defaultReceipt.setShift(defaultShift._id);

                const { ending_cash } = defaultShift;

                // Set the end cash
                defaultShift.setEndCash(ending_cash + defaultReceipt.netTotal);
              }

              props.receiptStore.defaultReceipt.changeTaxesAmount(
                props.stateStore.enableOverallTax
                  ? props.receiptStore.defaultReceipt.get_tax_total
                  : props.receiptStore.defaultReceipt
                      .get_tax_total_based_on_each_item,
              );

              //  props.receiptStore.defaultReceipt.clear();
              payment_add(props);

              props.receiptStore.add(props.receiptStore.defaultReceipt);
              props.receiptStore.setPreviousReceipt(
                props.receiptStore.defaultReceipt,
              );
              let discountValueForDisplay =
                props.receiptStore.defaultReceipt.discounts;
              let taxesValueForDisplay = props.stateStore.enableOverallTax
                ? props.receiptStore.defaultReceipt.get_tax_total
                : props.receiptStore.defaultReceipt
                    .get_tax_total_based_on_each_item;
              props.receiptStore.newReceipt(
                props.printerStore.companySettings[0].tax,
              );
              props.receiptStore.setLastScannedBarcode("");
              props.receiptStore.unselectReceiptLine();
              props.stateStore.changeValue("selected", "Cash", "Payment");
              change_navigation(
                props,
                totalPurchase,
                discountValueForDisplay,
                taxesValueForDisplay,
              );
            },
          },
          {
            text: strings.Yes,
            onPress: () => {
              setOrderCompleted(props);
              props.shiftStore.defaultShift.addTotalDiscount(
                receiptCurrent.discounts,
              );
              props.shiftStore.defaultShift.addTotalTaxes(
                parseFloat(props.receiptStore.defaultReceipt.subtotal) *
                  (parseFloat(receiptCurrent.taxesValue) / 100),
              );
              props.shiftStore.defaultShift.addNumberOfTransaction();

              // Let me print first
              let totalAmountDue = 0.0;
              let commission_toto = 0.0;
              props.receiptStore.defaultReceipt.lines.map(val => {
                // const { defaultShift } =  props.shiftStore;
                let ComHolder = JSON.parse(val.commission_details);
                ComHolder.map(val2 => {
                  commission_toto =
                    commission_toto + parseInt(val2.commission_amount, 10);
                });
                // defaultShift.addCommission(
                //   parseInt(val.commission_amount, 10),
                // );
                totalAmountDue =
                  parseInt(totalAmountDue, 10) +
                  parseInt(val.price.toFixed(2), 10) *
                    parseInt(val.qty.toFixed(2), 10);
                if (val.category && val.category !== "No Category") {
                  props.shiftStore.defaultShift.categoriesAmounts({
                    name: val.category,
                    total_amount:
                      parseInt(val.price.toFixed(2), 10) *
                      parseInt(val.qty.toFixed(2), 10),
                  });
                }
                if (props.stateStore.payment_state[0].selected) {
                  props.shiftStore.defaultShift.mopAmounts({
                    name: props.stateStore.payment_state[0].selected,
                    total_amount:
                      parseInt(val.price.toFixed(2), 10) *
                      parseInt(val.qty.toFixed(2), 10),
                  });
                }
              });
              if (props.receiptStore.defaultReceipt.orderType !== "None") {
                props.shiftStore.defaultShift.addOrderType({
                  amount: parseFloat(totalAmountDue, 10),
                  type: props.receiptStore.defaultReceipt.orderType,
                });
              }
              props.shiftStore.defaultShift.addTotalSales(totalAmountDue);
              if (res) {
                let writePromises = [];

                for (
                  let printedReceipts = 0;
                  printedReceipts <
                  parseInt(
                    props.printerStore.companySettings[0].changeNoReceipts,
                    10,
                  );
                  printedReceipts += 1
                ) {
                  writePromises = [];

                  writePromises.push(BluetoothSerial.write(TinyPOS.init()));

                  // Header
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${
                          props.printerStore.companySettings.length > 0
                            ? props.printerStore.companySettings[0].name
                              ? props.printerStore.companySettings[0].name.toString()
                              : ""
                            : ""
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
                          props.printerStore.companySettings.length > 0
                            ? props.printerStore.companySettings[0].header.toString()
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

                  // Date
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${moment().format("YYYY/MM/D hh:mm:ss SSS")}`,
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
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Cashier +
                          `${props.attendantStore.defaultAttendant.user_name}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.TransactionNo + `${finalReceiptNumber}`,
                        { align: "left", size: "normal" },
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
                        "Mode of payment: " +
                          props.stateStore.payment_state[0].selected,
                        { align: "left", size: "normal" },
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
                        strings.Purchases,
                        { align: "center", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.Items +
                          "                    " +
                          strings.Amount +
                          " ",
                        { align: "left", size: "normal", weight: "bold" },
                        true,
                      ),
                    ),
                  );

                  props.receiptStore.defaultReceipt.lines.map(val => {
                    let finalLines = "";

                    const name = val.item_name;

                    if (name.length > 14) {
                      let quotientValue = name.length / 14;
                      for (
                        let quotient = 0;
                        quotient < parseInt(quotientValue, 10);
                        quotient += 1
                      ) {
                        let currentCounter = quotient * 14;
                        let nameCounter = "";
                        for (
                          let n = currentCounter;
                          n < (quotient + 1) * 14;
                          n += 1
                        ) {
                          nameCounter = nameCounter + name[n];
                        }
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              `${nameCounter}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );
                      }
                      if (name.length - parseInt(quotientValue, 10) * 14 > 0) {
                        let nameCounterOverflow = "";
                        for (
                          let m = parseInt(quotientValue, 10) * 14;
                          m < name.length;
                          m += 1
                        ) {
                          nameCounterOverflow = nameCounterOverflow + name[m];
                        }
                        writePromises.push(
                          BluetoothSerial.write(
                            TinyPOS.bufferedText(
                              `${nameCounterOverflow}`,
                              { align: "left", size: "normal" },
                              true,
                            ),
                          ),
                        );
                      }
                    } else {
                      writePromises.push(
                        BluetoothSerial.write(
                          TinyPOS.bufferedText(
                            `${name}`,
                            { align: "left", size: "normal" },
                            true,
                          ),
                        ),
                      );
                    }

                    let priceString = formatNumber(
                      parseFloat(val.price, 10),
                    ).toString();
                    let qtyString = val.qty.toString();
                    let amountString = formatNumber(
                      parseFloat(val.price, 10) * parseFloat(val.qty, 10),
                    ).toString();

                    for (let ps = 0; ps < 12 - priceString.length; ps += 1) {
                      finalLines = finalLines + " ";
                    }

                    finalLines = finalLines + priceString;

                    for (let qt = 0; qt < 6 - qtyString.length; qt += 1) {
                      finalLines = finalLines + " ";
                    }
                    finalLines = finalLines + qtyString;

                    for (let as = 0; as < 14 - amountString.length; as += 1) {
                      finalLines = finalLines + " ";
                    }

                    finalLines = finalLines + amountString;
                    writePromises.push(
                      BluetoothSerial.write(
                        TinyPOS.bufferedText(
                          `${finalLines}`,
                          { align: "left", size: "normal" },
                          true,
                        ),
                      ),
                    );
                    if (printedReceipts === 0) {
                      totalPurchase =
                        parseFloat(totalPurchase, 10) +
                        parseFloat(val.price, 10) * parseFloat(val.qty, 10);
                    }
                  });
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        "================================",
                        { align: "left", size: "normal", weight: "bold" },
                        true,
                      ),
                    ),
                  );

                  let subTotal = strings.Subtotal;
                  let sub = formatNumber(
                    parseFloat(props.receiptStore.defaultReceipt.subtotal, 10),
                  ).toString();
                  for (let t = 0; t < 23 - sub.length; t += 1) {
                    subTotal = subTotal + " ";
                  }
                  subTotal = subTotal + sub;
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${subTotal}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  let taxValue = strings.Tax;
                  let tax = formatNumber(
                    parseFloat(
                      props.stateStore.enableOverallTax
                        ? props.receiptStore.defaultReceipt.get_tax_total
                        : props.receiptStore.defaultReceipt
                            .get_tax_total_based_on_each_item,
                      10,
                    ),
                  ).toString();
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
                  let discount = formatNumber(
                    parseFloat(props.receiptStore.defaultReceipt.discounts, 10),
                  ).toString();
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

                  let commissionValue = strings.Commission;

                  let commission_total = formatNumber(
                    parseFloat(commission_toto, 10),
                  ).toString();
                  for (let d = 0; d < 22 - commission_total.length; d += 1) {
                    commissionValue = commissionValue + " ";
                  }
                  commissionValue = commissionValue + commission_total;
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${commissionValue}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );

                  let total = "";
                  total = total + strings.TotalAmount;

                  for (
                    let totalLength = 0;
                    totalLength <
                    20 -
                      formatNumber(parseFloat(totalPurchase, 10)).toString()
                        .length;
                    totalLength += 1
                  ) {
                    total = total + " ";
                  }
                  total =
                    total +
                    formatNumber(
                      parseFloat(totalPurchase, 10) -
                        parseFloat(
                          props.receiptStore.defaultReceipt.discounts,
                          10,
                        ) +
                        parseFloat(
                          props.stateStore.enableOverallTax
                            ? props.receiptStore.defaultReceipt.get_tax_total
                            : props.receiptStore.defaultReceipt
                                .get_tax_total_based_on_each_item,
                          10,
                        ),
                    ).toString();

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${total}`,
                        { align: "left", size: "normal", weight: "bold" },
                        true,
                      ),
                    ),
                  );
                  let cash = strings.Cash;
                  for (
                    let cashLength = 0;
                    cashLength <
                    28 -
                      formatNumber(
                        props.stateStore.settings_state[0].multipleMop
                          ? parseFloat(props.stateStore.payment_amount)
                          : parseFloat(props.stateStore.payment_value, 10),
                      ).toString().length;
                    cashLength += 1
                  ) {
                    cash = cash + " ";
                  }
                  cash =
                    cash +
                    formatNumber(
                      props.stateStore.settings_state[0].multipleMop
                        ? parseFloat(props.stateStore.payment_amount)
                        : parseFloat(props.stateStore.payment_value, 10),
                    ).toString();
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${cash}`,
                        { align: "left", size: "normal", weight: "bold" },
                        true,
                      ),
                    ),
                  );
                  let change = strings.Change;
                  let changeValue = formatNumber(
                    parseFloat(
                      (props.stateStore.settings_state[0].multipleMop
                        ? parseFloat(props.stateStore.payment_amount)
                        : parseFloat(props.stateStore.payment_value, 10)) -
                        (parseFloat(totalPurchase, 10) -
                          parseFloat(
                            props.receiptStore.defaultReceipt.discounts,
                            10,
                          ) +
                          parseFloat(
                            props.stateStore.enableOverallTax
                              ? props.receiptStore.defaultReceipt.get_tax_total
                              : props.receiptStore.defaultReceipt
                                  .get_tax_total_based_on_each_item,
                            10,
                          )),
                      10,
                    ),
                  ).toString();
                  for (
                    let changeLength = 0;
                    changeLength < 26 - changeValue.length;
                    changeLength += 1
                  ) {
                    change = change + " ";
                  }
                  change = change + changeValue;

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${change}`,
                        { align: "left", size: "normal", weight: "bold" },
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
                        strings.ThisServesAsYour,
                        { align: "center", size: "doubleheight" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        strings.OfficialReceipt + "\n",
                        { align: "center", size: "doubleheight" },
                        true,
                      ),
                    ),
                  );
                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${
                          props.printerStore.companySettings.length > 0
                            ? props.printerStore.companySettings[0].footer.toString()
                            : ""
                        }`,
                        { align: "center", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  // Add 3 new lines
                  writePromises.push(
                    BluetoothSerial.write(TinyPOS.bufferedLine(3)),
                  );
                }
                // Push drawer
                writePromises.push(
                  BluetoothSerial.write(TinyPOS.kickCashDrawer()),
                );
                writePromises.push(
                  BluetoothSerial.write(TinyPOS.kickCashDrawer()),
                );
                Promise.all(writePromises)
                  .then(res2 => {
                    receiptCurrent.completed(
                      props.attendantStore.defaultAttendant.user_name,
                    );

                    props.receiptStore.defaultReceipt.changeTaxesAmount(
                      props.stateStore.enableOverallTax
                        ? props.receiptStore.defaultReceipt.get_tax_total
                        : props.receiptStore.defaultReceipt
                            .get_tax_total_based_on_each_item,
                    );
                    // add to row

                    payment_add(props);

                    // Reset payment amount
                    //  setState({
                    //   modalVisible: false,
                    //   paymentAmount: 0,
                    // });
                    props.stateStore.changeValue(
                      "modalVisible",
                      false,
                      "Payment",
                    );
                    props.stateStore.changeValue("paymentAmount", 0, "Payment");

                    Toast.show({
                      text: strings.TransactionCompleted,
                      duration: 5000,
                    });
                  })
                  .catch(err => {
                    receiptCurrent.completed(
                      props.attendantStore.defaultAttendant.user_name,
                    );

                    props.receiptStore.defaultReceipt.changeTaxesAmount(
                      props.stateStore.enableOverallTax
                        ? props.receiptStore.defaultReceipt.get_tax_total
                        : props.receiptStore.defaultReceipt
                            .get_tax_total_based_on_each_item,
                    );

                    payment_add(props);
                    props.stateStore.changeValue(
                      "modalVisible",
                      false,
                      "Payment",
                    );
                    props.stateStore.changeValue("paymentAmount", 0, "Payment");

                    Toast.show({
                      text: err.message + strings.TransactionCompleted,
                      buttonText: strings.Okay,
                      position: "bottom",
                      duration: 5000,
                    });
                  });
              } else {
                receiptCurrent.completed(
                  props.attendantStore.defaultAttendant.user_name,
                );

                props.receiptStore.defaultReceipt.changeTaxesAmount(
                  props.stateStore.enableOverallTax
                    ? props.receiptStore.defaultReceipt.get_tax_total
                    : props.receiptStore.defaultReceipt
                        .get_tax_total_based_on_each_item,
                );

                // add to row
                payment_add(props);

                // this.setState({
                //   modalVisible: false,
                //   paymentAmount: 0,
                // });
                props.stateStore.changeValue("modalVisible", false, "Payment");
                props.stateStore.changeValue("paymentAmount", 0, "Payment");
                Toast.show({
                  text:
                    strings.TransactionCompleted[
                      strings.UnableToConnectPrinter
                    ],
                  buttonText: strings.Okay,
                  position: "bottom",
                  duration: 6000,
                });
              }

              const { defaultShift } = props.shiftStore;

              // If shift started and shift hasn't ended
              if (defaultShift.shiftStarted && !defaultShift.shiftEnded) {
                // Set the default receipt
                const { defaultReceipt } = props.receiptStore;

                // set shift
                defaultReceipt.setShift(defaultShift._id);

                const { ending_cash } = defaultShift;

                // Set the end cash
                defaultShift.setEndCash(ending_cash + defaultReceipt.netTotal);
              }

              //  props.receiptStore.defaultReceipt.clear();
              props.receiptStore.add(props.receiptStore.defaultReceipt);
              props.receiptStore.setPreviousReceipt(
                props.receiptStore.defaultReceipt,
              );
              let discountValueForDisplay =
                props.receiptStore.defaultReceipt.discounts;
              let taxesValueForDisplay = props.stateStore.enableOverallTax
                ? props.receiptStore.defaultReceipt.get_tax_total
                : props.receiptStore.defaultReceipt
                    .get_tax_total_based_on_each_item;
              props.receiptStore.newReceipt(
                props.printerStore.companySettings[0].tax,
              );
              props.receiptStore.setLastScannedBarcode("");
              props.receiptStore.unselectReceiptLine();
              props.stateStore.changeValue("selected", "Cash", "Payment");
              change_navigation(
                props,
                totalPurchase,
                discountValueForDisplay,
                taxesValueForDisplay,
              );
            },
          },
        ],
      );
    });
  }
}

export function payment_add(props) {
  props.paymentStore.add({
    receipt: props.receiptStore.defaultReceipt._id.toString(),
    date: Date.now(),
    paid: props.stateStore.settings_state[0].multipleMop
      ? parseFloat(props.stateStore.payment_amount)
      : parseInt(props.stateStore.payment_value, 10),
    type: props.stateStore.settings_state[0].multipleMop
      ? props.stateStore.payment_types
      : not_multiple_payment(props),
    dateUpdated: Date.now(),
    syncStatus: false,
  });
}

export function not_multiple_payment(props) {
  let single_payment = [];

  single_payment.push({
    type: props.stateStore.payment_state[0].selected,
    amount: parseInt(props.stateStore.amount_due, 10),
  });
  return JSON.stringify(single_payment);
}
export function change_navigation(
  props,
  totalPurchase,
  discountValueForDisplay,
  taxesValueForDisplay,
) {
  props.navigation.navigate("Sales", {
    cash: props.stateStore.settings_state[0].multipleMop
      ? parseFloat(props.stateStore.payment_amount)
      : props.stateStore.payment_value,
    change: parseFloat(
      (props.stateStore.settings_state[0].multipleMop
        ? parseFloat(props.stateStore.payment_amount)
        : parseFloat(props.stateStore.payment_value, 10)) -
        (parseFloat(totalPurchase, 10) -
          parseFloat(discountValueForDisplay, 10) +
          parseFloat(taxesValueForDisplay, 10)),
      10,
    ),
  });
}
