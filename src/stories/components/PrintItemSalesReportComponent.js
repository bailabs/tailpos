import { formatNumber } from "accounting-js";
import BluetoothSerial from "react-native-bluetooth-serial";
import TinyPOS from "tiny-esc-pos";
const moment = require("moment");

let arrayOfItems = [];
export function printReport(arrayOfObjects, store) {
  for (let i = 0; i < arrayOfObjects.length; i += 1) {
    for (let v = 0; v < arrayOfObjects[i].lines.length; v += 1) {
      const checkArray = arrayOfItems.find(
        findObject =>
          findObject.item_name === arrayOfObjects[i].lines[v].item_name,
      );
      if (checkArray) {
        checkArray.qty = checkArray.qty + arrayOfObjects[i].lines[v].qty;
      } else {
        arrayOfItems.push(arrayOfObjects[i].lines[v]);
      }
    }
  }

  printReportFinal(store);
  arrayOfItems = [];
}

export function printReportFinal(store) {
  const writePromises = [];

  writePromises.push(BluetoothSerial.write(TinyPOS.init()));

  // Header
  writePromises.push(
    BluetoothSerial.write(
      TinyPOS.bufferedText(
        `${
          store.printerStore.companySettings[0].name.toString() !== ""
            ? store.printerStore.companySettings[0].name.toString()
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
          store.printerStore.companySettings[0].header.toString() !== ""
            ? store.printerStore.companySettings[0].header.toString()
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
        "================================\n",
        { size: "normal" },
        true,
      ),
    ),
  );
  writePromises.push(
    BluetoothSerial.write(
      TinyPOS.bufferedText(
        "Item Sales Report\n",
        { size: "normal", align: "center" },
        true,
      ),
    ),
  );
  writePromises.push(
    BluetoothSerial.write(
      TinyPOS.bufferedText(
        "  Item          Qty      Amount ",
        { size: "normal", align: "center" },
        true,
      ),
    ),
  );
  let totalQty = 0;
  let totalAmount = 0;
  arrayOfItems.map(val => {
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
        for (let n = currentCounter; n < (quotient + 1) * 14; n += 1) {
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
    let priceString = formatNumber(parseFloat(val.price, 10)).toString();
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
    totalQty = totalQty + val.qty;
    totalAmount =
      totalAmount + parseFloat(val.price, 10) * parseFloat(val.qty, 10);
  });
  let total = "Total";
  let totalQtyString = totalQty.toString();
  let totalAmountString = formatNumber(totalAmount).toString();
  for (let t = 0; t < 13 - totalQtyString.length; t += 1) {
    total = total + " ";
  }
  total = total + totalQtyString;

  for (let tt = 0; tt < 33 - total.length; tt += 1) {
    total = total + " ";
  }
  total = total + totalAmountString;

  writePromises.push(
    BluetoothSerial.write(
      TinyPOS.bufferedText(
        "===============================",
        { size: "normal" },
        true,
      ),
    ),
  );

  writePromises.push(
    BluetoothSerial.write(
      TinyPOS.bufferedText(
        `${total}` + "\n\n\n",
        { align: "left", size: "normal" },
        true,
      ),
    ),
  );
}

export function printCommissions(store, data) {
  const writePromises = [];
  if (store.printerStore.rows.length > 0) {
    for (let i = 0; i < store.printerStore.rows.length; i += 1) {
      if (store.printerStore.rows[i].defaultPrinter) {
        BluetoothSerial.connect(store.printerStore.rows[i].macAddress)
          .then(() => {
            writePromises.push(BluetoothSerial.write(TinyPOS.init()));

            // Header
            writePromises.push(
              BluetoothSerial.write(
                TinyPOS.bufferedText(
                  `${
                    store.printerStore.companySettings[0].name.toString() !== ""
                      ? store.printerStore.companySettings[0].name.toString()
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
                    store.printerStore.companySettings[0].header.toString() !==
                    ""
                      ? store.printerStore.companySettings[0].header.toString()
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
                  "================================\n",
                  { size: "normal" },
                  true,
                ),
              ),
            );
            writePromises.push(
              BluetoothSerial.write(
                TinyPOS.bufferedText(
                  "Commission Report\n",
                  { size: "normal", align: "center" },
                  true,
                ),
              ),
            );
            writePromises.push(
              BluetoothSerial.write(
                TinyPOS.bufferedText(
                  "   Attendant             Amount ",
                  { size: "normal", align: "center" },
                  true,
                ),
              ),
            );
            let totalAmount = 0;
            data.map(val => {
              let finalLines = "";

              finalLines += val.name;

              let priceString = formatNumber(
                parseFloat(val.amount, 10),
              ).toString();

              for (
                let ps = 0;
                ps < 30 - (priceString.length + val.name.length);
                ps += 1
              ) {
                finalLines = finalLines + " ";
              }

              finalLines = finalLines + priceString;

              writePromises.push(
                BluetoothSerial.write(
                  TinyPOS.bufferedText(
                    `${finalLines}`,
                    { align: "left", size: "normal" },
                    true,
                  ),
                ),
              );
              totalAmount = totalAmount + parseFloat(val.amount, 10);
            });
            let total = "Total";
            let totalAmountString = formatNumber(totalAmount).toString();
            for (let t = 0; t < 30 - (5 + totalAmountString.length); t += 1) {
              total = total + " ";
            }
            total = total + totalAmountString;

            writePromises.push(
              BluetoothSerial.write(
                TinyPOS.bufferedText(
                  "===============================",
                  { size: "normal" },
                  true,
                ),
              ),
            );
            writePromises.push(
              BluetoothSerial.write(
                TinyPOS.bufferedText(
                  `${total}` + "\n\n\n",
                  { align: "left", size: "normal" },
                  true,
                ),
              ),
            );
            Promise.all(writePromises);
          })
          .catch(() => {
            BluetoothSerial.connect(store.printerStore.rows[i].macAddress).then(
              () => {
                writePromises.push(BluetoothSerial.write(TinyPOS.init()));

                // Header
                writePromises.push(
                  BluetoothSerial.write(
                    TinyPOS.bufferedText(
                      `${
                        store.printerStore.companySettings[0].name.toString() !==
                        ""
                          ? store.printerStore.companySettings[0].name.toString()
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
                        store.printerStore.companySettings[0].header.toString() !==
                        ""
                          ? store.printerStore.companySettings[0].header.toString()
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
                      "================================\n",
                      { size: "normal" },
                      true,
                    ),
                  ),
                );
                writePromises.push(
                  BluetoothSerial.write(
                    TinyPOS.bufferedText(
                      "Commission Report\n",
                      { size: "normal", align: "center" },
                      true,
                    ),
                  ),
                );
                writePromises.push(
                  BluetoothSerial.write(
                    TinyPOS.bufferedText(
                      "   Attendant             Amount ",
                      { size: "normal", align: "center" },
                      true,
                    ),
                  ),
                );
                let totalAmount = 0;
                data.map(val => {
                  let finalLines = "";

                  finalLines += val.name;

                  let priceString = formatNumber(
                    parseFloat(val.amount, 10),
                  ).toString();

                  for (
                    let ps = 0;
                    ps < 30 - (priceString.length + val.name.length);
                    ps += 1
                  ) {
                    finalLines = finalLines + " ";
                  }

                  finalLines = finalLines + priceString;

                  writePromises.push(
                    BluetoothSerial.write(
                      TinyPOS.bufferedText(
                        `${finalLines}`,
                        { align: "left", size: "normal" },
                        true,
                      ),
                    ),
                  );
                  totalAmount = totalAmount + parseFloat(val.amount, 10);
                });
                let total = "Total";
                let totalAmountString = formatNumber(totalAmount).toString();
                for (
                  let t = 0;
                  t < 30 - (5 + totalAmountString.length);
                  t += 1
                ) {
                  total = total + " ";
                }
                total = total + totalAmountString;

                writePromises.push(
                  BluetoothSerial.write(
                    TinyPOS.bufferedText(
                      "===============================",
                      { size: "normal" },
                      true,
                    ),
                  ),
                );
                writePromises.push(
                  BluetoothSerial.write(
                    TinyPOS.bufferedText(
                      `${total}` + "\n\n\n\n\n",
                      { align: "left", size: "normal" },
                      true,
                    ),
                  ),
                );
                Promise.all(writePromises);
              },
            );
          });
      }
    }
  }
}
