import * as React from "react";
import { Alert } from "react-native";
import { Container, Toast } from "native-base";
import SplashScreen from "react-native-splash-screen";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { BluetoothStatus } from "react-native-bluetooth-status";

import { observer, inject } from "mobx-react/native";

import isFloat from "is-float";

import Sales from "@screens/Sales";

// TODO: receipt line (no access here to receipt lines)
import { ReceiptLine } from "../../store/PosStore/ReceiptStore";

import PriceModalComponent from "@components/PriceModalComponent";
import SummaryModalComponent from "@components/SummaryModalComponent";
import QuantityModalComponent from "@components/QuantityModalComponent";
import DiscountSelectionModalComponent from "@components/DiscountSelectionModalComponent";

// TailOrder
import {
  sendOrder,
  tailOrderLine,
  printOrder,
  cancelOrder,
  changeOrderTable,
} from "../../services/tailorder";

const Sound = require("react-native-sound");
Sound.setCategory("Playback");
const beep = new Sound("beep.mp3", Sound.MAIN_BUNDLE);

@inject(
  "itemStore",
  "customerStore",
  "receiptStore",
  "discountStore",
  "categoryStore",
  "paymentStore",
  "printerStore",
  "shiftStore",
  "attendantStore",
  "stateStore",
)
@observer
export default class SalesContainer extends React.Component {
  componentWillMount() {
    const { initializeState } = this.props.stateStore;

    // Initializing the state store
    initializeState();
    this.getBluetoothState();

    const { params } = this.props.navigation.state;

    if (params) {
      this.props.stateStore.changeValue(
        "cash",
        parseFloat(params.cash),
        "Sales",
      );
      this.props.stateStore.changeValue(
        "change",
        parseFloat(params.change),
        "Sales",
      );
    }
  }

  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if (!isEnabled) {
      BluetoothStatus.enable(true);
    }
  }

  componentDidMount() {
    // Selected Category Index
    const { selectedCategoryIndex } = this.props.stateStore.sales_state[0];
    const { itemsBasedOnCategorySelected, favorites } = this.props.itemStore;

    if (selectedCategoryIndex === -1) {
      itemsBasedOnCategorySelected("All");
    } else if (selectedCategoryIndex === -2) {
      favorites();
    }

    SplashScreen.hide();
  }

  onItemClick = index => {
    const { changeValue } = this.props.stateStore;
    const { setReceiptLine } = this.props.receiptStore;
    const { defaultReceipt } = this.props.receiptStore;

    const line = ReceiptLine.create({
      item: index.name,
      sold_by: index.soldBy,
      item_name: index.description,
      qty: parseInt(1, 10),
      price: parseFloat(index.price),
      date: Date.now(),
    });

    setReceiptLine(line);

    if (index.price <= 0) {
      changeValue("priceModalVisible", true, "Sales");
    } else {
      defaultReceipt.add(line);
    }
  };

  onBarcodeRead = barcodeValue => {
    const { changeValue } = this.props.stateStore;
    const { searchByBarcode } = this.props.itemStore;
    const { barcodeStatus } = this.props.stateStore.sales_state[0];
    const {
      defaultReceipt,
      setReceiptLine,
      lastScannedBarcode,
      setLastScannedBarcode,
    } = this.props.receiptStore;

    if (barcodeStatus === "idle") {
      if (barcodeValue.toString() !== lastScannedBarcode) {
        setLastScannedBarcode(barcodeValue);

        beep.play();

        searchByBarcode(barcodeValue).then(resultItem => {
          if (resultItem) {
            const line = ReceiptLine.create({
              item: resultItem._id,
              item_name: resultItem.name,
              qty: parseInt(1, 10),
              price: parseFloat(resultItem.price),
              date: Date.now(),
            });
            const lineIndex = defaultReceipt.add(line);
            setReceiptLine(defaultReceipt.lines[lineIndex]);
          } else {
            Toast.show({
              text: "No corresponding item based from the barcode found.",
              duration: 5000,
              type: "danger",
            });
          }
          changeValue("barcodeStatus", "idle", "Sales");
        });
        changeValue("barcodeStatus", "pending", "Sales");
      }
    }
  };

  onChangeSalesSearchText = text => {
    const { search } = this.props.itemStore;
    search(text);
  };

  onChangeBarcodeScannerInput = text => {
    const { changeValue } = this.props.stateStore;
    changeValue("barcodeScannerInput", text, "Sales");
  };

  searchStatusChange = async bool => {
    const { changeValue } = this.props.stateStore;

    BluetoothStatus.disable(bool);
    BluetoothStatus.enable(!bool);

    this.onCategoryClick(-1);

    changeValue("searchStatus", bool, "Sales");
  };

  onCategoryClick = (id, index) => {
    const { changeValue } = this.props.stateStore;
    const { itemsBasedOnCategorySelected, favorites } = this.props.itemStore;

    changeValue("selectedCategoryIndex", index, "Sales");

    if (index >= 0) {
      changeValue("categoryFilter", true, "Sales");
      changeValue("categoryValue", id, "Sales");
      itemsBasedOnCategorySelected(id);
    } else if (index === -1) {
      changeValue("categoryFilter", false, "Sales");
      itemsBasedOnCategorySelected("All");
    } else if (index === -2) {
      favorites();
    }
  };

  onDeleteClick = () => {
    const { changeValue } = this.props.stateStore;
    changeValue("deleteDialogVisible", true, "Sales");
  };

  onDeleteReceiptLine = () => {
    const { hideDeleteDialog } = this.props.stateStore;
    const { unselectReceiptLine, defaultReceipt } = this.props.receiptStore;

    unselectReceiptLine();
    defaultReceipt.clear();
    hideDeleteDialog();
  };

  onBarcodeClick = () => {
    this.props.stateStore.changeValue("salesListStatus", true, "Sales");
  };

  onCloseClick = text => {
    this.props.stateStore.changeValue("salesListStatus", false, "Sales");
  };

  onDiscountClick = () => {
    const { changeValue } = this.props.stateStore;
    const { defaultReceipt } = this.props.receiptStore;

    if (defaultReceipt.lines.length === 0) {
      Alert.alert("Discount", "Please add an item.", [{ text: "Ok" }]);
    } else {
      changeValue("discountSelection", true, "Sales");
    }
  };

  onPaymentClick = text => {
    const { navigate } = this.props.navigation;
    const { defaultShift } = this.props.shiftStore;
    const { setAmountDue } = this.props.stateStore;
    const { defaultAttendant } = this.props.attendantStore;

    if (defaultShift.shiftStarted && !defaultShift.shiftEnded) {
      if (defaultShift.attendant === defaultAttendant.user_name) {
        setAmountDue(text.netTotal.toFixed(2));
        navigate("Payment", { receipt: true });
      } else {
        Toast.show({
          text: "Its not your shift",
          buttonText: "Okay",
          type: "danger",
        });
      }
    } else {
      Toast.show({
        text: "Set the shift!",
        buttonText: "Okay",
        type: "danger",
      });
    }
  };

  onBluetoothScan = text => {
    const { changeValue } = this.props.stateStore;
    const { searchByBarcode } = this.props.itemStore;
    const { defaultReceipt, setReceiptLine } = this.props.receiptStore;

    let barcodeValue = text;

    changeValue("barcodeScannerInput", "", "Sales");
    searchByBarcode(barcodeValue).then(result => {
      if (result) {
        const line = ReceiptLine.create({
          item: result._id,
          item_name: result.name,
          qty: parseInt(1, 10),
          price: parseFloat(result.price),
          date: Date.now(),
        });

        const lineIndex = defaultReceipt.add(line);
        setReceiptLine(defaultReceipt.lines[lineIndex]);

        if (result.price <= 0) {
          changeValue("priceModalVisible", true, "Sales");
        }
      } else {
        Toast.show({
          text: "No corresponding item based from the barcode found.",
          duration: 1000,
          buttonText: "Okay",
          type: "danger",
        });
      }
    });
  };
  onCancelDiscount(value) {
    const { unsetDiscount } = this.props.discountStore;
    const { defaultReceipt } = this.props.receiptStore;

    unsetDiscount();
    defaultReceipt.cancelDiscount();
  }
  onDiscountChange(discount, index) {
    const { changeValue } = this.props.stateStore;

    changeValue("selectedDiscount", discount, "Sales");
    changeValue("selectedDiscountIndex", index, "Sales");
  }

  onDiscountEdit = val => {
    const { changeValue } = this.props.stateStore;
    const { defaultReceipt } = this.props.receiptStore;
    const { rows, setDiscount } = this.props.discountStore;
    const {
      discountSelectionStatus,
      selectedDiscountIndex,
    } = this.props.stateStore.sales_state[0];

    if (discountSelectionStatus) {
      defaultReceipt.addOnTheFlyReceiptDiscount({
        value: parseFloat(val.onTheFlyDiscountValue, 10),
        percentageType: val.percentageType,
      });
    } else {
      const discount = rows[selectedDiscountIndex];

      setDiscount(discount);
      defaultReceipt.addReceiptDiscount(discount);
    }

    // hide modal
    changeValue("discountSelection", false, "Sales");
  };

  confirmReceiptDeleteDialog() {
    const { hideDeleteDialog } = this.props.stateStore;
    const { deleteDialogVisible } = this.props.stateStore.sales_state[0];

    return (
      <ConfirmDialog
        title="Confirm Delete"
        message="Are you sure to delete receipt lines?"
        visible={deleteDialogVisible}
        onTouchOutside={hideDeleteDialog}
        positiveButton={{
          title: "YES",
          onPress: this.onDeleteReceiptLine,
        }}
        negativeButton={{
          title: "NO",
          onPress: hideDeleteDialog,
        }}
      />
    );
  }

  discountSelectionDialog() {
    const { rows, selectedDiscount } = this.props.discountStore;

    return (
      <DiscountSelectionModalComponent
        discountData={rows.slice()}
        currentDiscount={selectedDiscount ? selectedDiscount : ""}
        onCancelDiscount={value => this.onCancelDiscount(value)}
        onDiscountChange={(discount, index) =>
          this.onDiscountChange(discount, index)
        }
        selectedDiscount={this.props.stateStore.sales_state[0].selectedDiscount}
        discountSelection={
          this.props.stateStore.sales_state[0].discountSelection
        }
        discountSelectionStatus={
          this.props.stateStore.sales_state[0].discountSelectionStatus
        }
        onClick={() =>
          this.props.stateStore.changeValue("discountSelection", false, "Sales")
        }
        onDiscountEdit={this.onDiscountEdit}
        changeSelectionStatus={value =>
          this.props.stateStore.changeValue(
            "discountSelectionStatus",
            value,
            "Sales",
          )
        }
      />
    );
  }

  // function is never used...
  // note to future: ikaw na bahala remove ani.
  onPriceExit(price) {
    const { hidePriceModal } = this.props.stateStore;
    if (!price) {
      Toast.show({
        text: "Zero-price items are not allowed. Please set the price.",
        buttonText: "Okay",
        duration: 5000,
        type: "warning",
      });
    } else {
      hidePriceModal();
    }
  }

  onPriceSubmit = value => {
    const { hidePriceModal, changeValue } = this.props.stateStore;
    const {
      selectedLine,
      defaultReceipt,
      unselectReceiptLine,
    } = this.props.receiptStore;

    if (selectedLine) {
      selectedLine.setPrice(value);
      defaultReceipt.add(selectedLine);

      hidePriceModal();
      changeValue("addReceiptLineStatus", false, "Sales");

      // kwan bug(?)
      unselectReceiptLine();
    }
  };

  priceInputDialog() {
    const { hidePriceModal } = this.props.stateStore;
    const { priceModalVisible } = this.props.stateStore.sales_state[0];

    return (
      <PriceModalComponent
        visible={priceModalVisible}
        onClose={hidePriceModal}
        onSubmit={this.onPriceSubmit}
      />
    );
  }

  onQuantityExit = () => {
    const { changeValue, hideQuantityModal } = this.props.stateStore;

    hideQuantityModal();
    changeValue("commissionArray", "[]", "Sales");
  };

  filterSystemUser = e => e.role !== "Cashier" && e.role !== "Owner";

  quantityEditDialog() {
    const { rows } = this.props.attendantStore;
    const { selectedLine } = this.props.receiptStore;
    const {
      commissionArray,
      quantityModalVisible,
    } = this.props.stateStore.sales_state[0];

    let qty = 0;
    let price = 0;
    let soldBy = "";
    let discount_rate = 0;

    if (selectedLine !== null) {
      qty = selectedLine.qty;
      price = selectedLine.price;
      soldBy = selectedLine.sold_by;
      discount_rate = selectedLine.discount_rate;
      if (JSON.parse(commissionArray).length === 0) {
        this.props.stateStore.changeValue(
          "commissionArray",
          selectedLine.commission_details,
          "Sales",
        );
      }
    }

    return (
      <QuantityModalComponent
        price={price}
        quantity={qty}
        soldBy={soldBy}
        discount_rate={discount_rate}
        onClick={this.onQuantityExit}
        visible={quantityModalVisible}
        onSubmit={this.onQuantitySubmit}
        commissionArray={JSON.parse(commissionArray).slice()}
        attendants={rows.slice().filter(this.filterSystemUser)}
        addCommissionArray={objectData => this.addCommissionToArray(objectData)}
      />
    );
  }

  addCommissionToArray(objectData) {
    const { changeValue } = this.props.stateStore;
    const { commissionArray } = this.props.stateStore.sales_state[0];

    let commissions = JSON.parse(commissionArray);

    let commissionValue = commissions.filter(
      attendant =>
        attendant.commission_attendant_id ===
        objectData.commission_attendant_id,
    );

    if (commissionValue.length === 0) {
      commissions.push(objectData);
      changeValue("commissionArray", JSON.stringify(commissions), "Sales");
    } else {
      Toast.show({
        text: "Attendant already added",
        buttonText: "Okay",
        type: "danger",
      });
    }
  }

  closeSummary = () => {
    const { changeValue } = this.props.stateStore;
    const { setPreviuosReceiptToNull } = this.props.receiptStore;

    setPreviuosReceiptToNull();
    changeValue("visibleSummaryModal", false, "Sales");
  };

  summaryDialog() {
    const { previousReceipt } = this.props.receiptStore;
    const { cash, change } = this.props.stateStore.sales_state[0];
    const { countryCode } = this.props.printerStore.companySettings[0];

    return (
      <SummaryModalComponent
        cash={cash}
        change={change}
        onClose={this.closeSummary}
        visibility={previousReceipt ? true : false}
        lines={previousReceipt ? previousReceipt.lines.slice() : []}
        details={
          previousReceipt && previousReceipt.lines ? previousReceipt : {}
        }
        currency={countryCode !== undefined ? countryCode : "PHP"}
      />
    );
  }
  onQuantitySubmit = quantity => {
    // line
    this.setState({ onChangeStatues: false });
    const line = this.props.receiptStore.selectedLine;

    const qty = parseFloat(quantity.quantity)
      ? parseFloat(quantity.quantity)
      : parseFloat(quantity.defaultQty);

    if (line.sold_by === "Each") {
      if (isFloat(qty)) {
        Toast.show({
          text: "Quantity not possible for each.",
          buttonText: "Okay",
          type: "warning",
        });
      } else {
        // Toast boy
        Toast.show({
          text: "Receipt line is modified.",
          buttonText: "Okay",
          duration: 5000,
        });
        line.setQuantity(Number(qty.toFixed(2)));
      }
    } else {
      // Toast boy
      Toast.show({
        text: "Receipt line is modified.",
        buttonText: "Okay",
        duration: 5000,
      });
      line.setQuantity(Number(qty.toFixed(2)));
    }

    const price = parseFloat(quantity.price)
      ? parseFloat(quantity.price)
      : parseFloat(quantity.defaultPrice);

    // set the price
    line.setPrice(Number(price.toFixed(2)));
    line.setDiscountRate(
      parseFloat(quantity.discount) > 0 ? parseFloat(quantity.discount) : 0,
    );
    // if (
    //   quantity.attendantName !== "No Attendant" &&
    //   quantity.commission_amount
    // ) {
    //   this.props.attendantStore.find(quantity.attendantName).then(result => {
    //     if (result) {
    //       let discountValue =
    //         parseFloat(quantity.discount) > 0
    //           ? price * qty -
    //             parseFloat(quantity.discount) / 100 * (price * qty)
    //           : price * qty;
    //       line.setCommissionAttendantName(result.user_name);
    //       line.setCommissionAttendantId(quantity.attendantName);
    //       line.setCommissionRate(result.commission, 10);
    //       line.setCommissionAmount(
    //         parseFloat(result.commission, 10) / 100 * discountValue,
    //       );
    //     }
    //   });
    // }
    // unselect the line
    line.setCommissionDetails(
      this.props.stateStore.sales_state[0].commissionArray,
    );
    this.props.receiptStore.unselectReceiptLine();
    this.props.stateStore.changeValue("commissionArray", "[]", "Sales");

    // remove the receipt store
    this.props.stateStore.changeValue("quantityModalVisible", false, "Sales");
  };

  onReceiptLineDelete = index => {
    // Unselect
    this.props.receiptStore.unselectReceiptLine();

    // Receipt
    const receipt = this.props.receiptStore.defaultReceipt;

    // Lines
    const receiptLine = receipt.lines[index];

    // Delete the receipt
    receipt.deleteLine(receiptLine);

    // Toast boy.
    Toast.show({
      text: "Receipt line is deleted.",
      buttonText: "Okay",
      duration: 5000,
    });

    // Unselect
  };

  onReceiptLineEdit = index => {
    const receipt = this.props.receiptStore.defaultReceipt;

    const receiptLine = receipt.lines[index];
    this.props.receiptStore.setReceiptLine(receiptLine);

    this.props.stateStore.changeValue("quantityModalVisible", true, "Sales");
  };

  onViewOrders = () => {
    const {
      setViewingOrder,
      setLoadingOrder,
      setOrders,
      queueOrigin,
    } = this.props.stateStore;

    setViewingOrder(true);
    setLoadingOrder(true);

    const url = `${queueOrigin}/api/v1/orders/`;

    fetch(url)
      .then(res => res.json())
      .then(data => setOrders(data))
      .finally(() => setLoadingOrder(false));
  };

  onCancelOrder = () => {
    const {
      currentTable,
      queueOrigin,
      setCurrentTable,
    } = this.props.stateStore;
    const { defaultReceipt } = this.props.receiptStore;

    cancelOrder(queueOrigin, { id: currentTable }).then(res => {
      Toast.show({
        text: `Order ${res.table_no} is cancelled.`,
        buttonText: "Okay",
      });
      setCurrentTable(-1);
      defaultReceipt.clear();
    });
  };

  onCloseViewOrder = () => {
    this.props.stateStore.setViewingOrder(false);
  };

  onTableClick = index => {
    const { orders, setCurrentTable } = this.props.stateStore;

    setCurrentTable(orders[index].id);
    const lines = JSON.parse(orders[index].lines);

    // Default Receipt
    const { defaultReceipt } = this.props.receiptStore;

    // Clear receipts
    defaultReceipt.clear();

    // Add all of the items to the receipt
    for (let i = 0; i < lines.length; i++) {
      defaultReceipt.add({
        item: lines[i].itemCode,
        item_name: lines[i].itemCode,
        price: lines[i].rate,
        qty: parseInt(1, 10),
        date: Date.now(),
      });
    }
  };

  onTableLongPress = index => {
    const { orders, setCurrentTable, setInTableOptions } = this.props.stateStore;
    setCurrentTable(orders[index].id);
    setInTableOptions();
  }

  changeTable = () => {
    const {
      queueOrigin,
      currentTable,
      setInNotTableOptions,
      newTableNumber,
      setCurrentTable,
    } = this.props.stateStore;

    changeOrderTable(queueOrigin, {
      id: currentTable,
      table: newTableNumber
    }).then(res => {
      Toast.show({
        text: "Table Number is changed.",
        buttonText: "Okay",
        duration: 5000,
      });
      setCurrentTable(-1);
      setInNotTableOptions();
    });
  }

  onChangeTable = () => {
    Alert.alert(
      "Change Table",
      "Are you sure you want to change the table?",
      [
        {text: "Cancel", style: "cancel"},
        {text: "OK", onPress: this.changeTable}
      ]
    );
  }

  takeAway = () => {
    const { queueOrigin } = this.props.stateStore;
    const { defaultReceipt, unselectReceiptLine } = this.props.receiptStore;

    let orders = [];

    for (let i = 0; i < defaultReceipt.lines.length; i++) {
      const line = defaultReceipt.lines[i];
      orders.push(tailOrderLine(line));
    }

    sendOrder(queueOrigin, {
      is_takeaway: true,
      table_no: -200,
      lines: JSON.stringify(orders),
    })
      .then(res => printOrder(queueOrigin, { id: res.id }))
      .then(res => {
        unselectReceiptLine();
        defaultReceipt.clear();
      })
      .catch(err => {
        Toast.show({
          text: `Unable to take away order. [${err}]`,
          position: "top",
          type: "danger",
        });
      });
  };

  onTakeAwayClick = () => {
    Alert.alert(
      "Confirm Take Away", // title
      "Are you sure you want to take away your order?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: this.takeAway },
      ],
    );
  };

  onEndReached = text => {
    this.props.stateStore.changeValue("fetching", true, "Sales");
    if (this.props.stateStore.sales_state[0].fetching) {
      if (text === "item") {
        this.props.itemStore.getFromDb(20);
        this.props.stateStore.changeValue("fetching", false, "Sales");
      } else if (text === "category") {
        this.props.categoryStore.getFromDb(20);
        this.props.stateStore.changeValue("fetching", false, "Sales");
      }
    }
  };

  removeItemAsFavorite = () => {
    const { itemStore } = this.props;
    itemStore.selectedItem.setUnfavorite();
    itemStore.detachItemFromFavorites(itemStore.selectedItem);
    itemStore.unselectItem();
  };

  setItemAsFavorite = () => {
    const { itemStore } = this.props;
    itemStore.selectedItem.setFavorite();
    itemStore.unselectItem();
  };

  onLongPressItem = item => {
    const { setItem } = this.props.itemStore;
    const { selectedCategoryIndex } = this.props.stateStore.sales_state[0];

    setItem(item);

    if (selectedCategoryIndex === -2) {
      Alert.alert(
        "Favorite Item", // title
        "Are you sure you want to remove item from favorites?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: this.removeItemAsFavorite },
        ],
      );
    } else {
      Alert.alert(
        "Favorite Item", // title
        "Are you sure you want to set item as favorite?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: this.setItemAsFavorite },
        ],
      );
    }
  };

  sortByName = (a, b) => (a.name < b.name ? -1 : 1);

  render() {
    return (
      <Container>
        {this.discountSelectionDialog()}
        {this.summaryDialog()}
        {this.confirmReceiptDeleteDialog()}
        {this.quantityEditDialog()}
        {this.priceInputDialog()}
        <Sales
          currency={
            this.props.printerStore.companySettings[0].countryCode !== undefined
              ? this.props.printerStore.companySettings[0].countryCode
              : "PHP"
          }
          categoryLengths={JSON.parse(this.props.itemStore.categoryLengths)}
          itemsLength={this.props.itemStore.itemsLength}
          bluetoothStatus={
            this.props.printerStore.bluetooth.length > 0
              ? this.props.printerStore.bluetooth[0].status
              : false
          }
          onBluetoothScan={this.onBluetoothScan}
          onChangeSalesSearchText={this.onChangeSalesSearchText}
          searchStatus={this.props.stateStore.sales_state[0].searchStatus}
          barcodeScannerInput={
            this.props.stateStore.sales_state[0].barcodeScannerInput
          }
          onChangeBarcodeScannerInput={this.onChangeBarcodeScannerInput}
          onSearchClick={this.searchStatusChange}
          onBarcodeRead={this.onBarcodeRead}
          onCloseClick={this.onCloseClick}
          salesListStatus={this.props.stateStore.sales_state[0].salesListStatus}
          categoryData={this.props.categoryStore.rows
            .slice()
            .sort(this.sortByName)}
          itemData={
            this.props.stateStore.sales_state[0].categoryFilter ||
            this.props.stateStore.sales_state[0].searchStatus ||
            this.props.stateStore.sales_state[0].selectedCategoryIndex === -2
              ? this.props.itemStore.queriedRows.slice().sort(this.sortByName)
              : this.props.itemStore.rows.slice().sort(this.sortByName)
          }
          receiptDefault={this.props.receiptStore.defaultReceipt}
          onCategoryClick={this.onCategoryClick}
          navigation={this.props.navigation}
          onItemClick={this.onItemClick}
          selectedCategoryIndex={
            this.props.stateStore.sales_state[0].selectedCategoryIndex
          }
          // footer
          onDeleteClick={this.onDeleteClick}
          onBarcodeClick={this.onBarcodeClick}
          onDiscountClick={this.onDiscountClick}
          // receipt line
          onPaymentClick={this.onPaymentClick}
          onReceiptLineEdit={this.onReceiptLineEdit}
          onReceiptLineDelete={this.onReceiptLineDelete}
          // empty rows
          onEndReached={this.onEndReached}
          onLongPressItem={this.onLongPressItem}
          isDiscountsEmpty={this.props.discountStore.isEmptyRows}
          // On View Orders
          onViewOrders={this.onViewOrders}
          onTableClick={this.onTableClick}
          onCloseViewOrder={this.onCloseViewOrder}
          orders={this.props.stateStore.orders.slice()}
          isViewingOrder={this.props.stateStore.isViewingOrder}
          isLoadingOrder={this.props.stateStore.isLoadingOrder}
          onTakeAwayClick={this.onTakeAwayClick}
          // has order
          hasTailOrder={this.props.stateStore.hasTailOrder}
          useDescription={this.props.stateStore.useDescription}
          // Current Table
          currentTable={this.props.stateStore.currentTable}
          onCancelOrder={this.onCancelOrder}
          onTableLongPress={this.onTableLongPress}

          // Table Options
          inTableOptions={this.props.stateStore.inTableOptions}
          newTableNumber={this.props.stateStore.newTableNumber}
          setNewTableNumber={this.props.stateStore.setNewTableNumber}
          onChangeTable={this.onChangeTable}
        />
      </Container>
    );
  }
}
