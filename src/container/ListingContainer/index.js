import * as React from "react";
import { Alert } from "react-native";
import { Tab, Toast } from "native-base";
import { observer, inject } from "mobx-react/native";

import TinyPOS from "tiny-esc-pos";
import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import { listing } from "../../store/StateStore/DefaultValues";
import { currentLanguage } from "../../translations/CurrentLanguage";
import { sortByName, getCountryCode } from "../../utils";

import { unformat } from "accounting-js";

import TabComponent from "@components/TabComponent";

// Input
import Listing from "@screens/Listing";
import InputCategory from "@screens/InputCategory";
import InputDiscount from "@screens/InputDiscount";
import InputItem from "@screens/InputItem";
import { automatic_sync_background_job } from "../../store/SyncStore/SyncAutomatic";

import translation from "../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

@inject(
  "categoryStore",
  "discountStore",
  "itemStore",
  "taxesStore",
  "printerStore",
  "syncStore",
  "stateStore",
  "attendantStore",
  "receiptStore",
  "paymentStore",
  "shiftStore",
  "shiftReportsStore",
  "customerStore",
  "roleStore",
  "headSyncStore",
)
@observer
export default class ListingContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.stateStore.setDefaultValues("Listing", listing);
    this.getBluetoothState(false);
    this.props.itemStore.clearQueriedRows();
    for (let i = 0; i < this.props.printerStore.rows.length; i += 1) {
      if (this.props.printerStore.rows[i].defaultPrinter) {
        this.props.stateStore.changeValue(
          "printerStatus",
          "Connecting...",
          "Listing",
        );
        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            this.props.stateStore.changeValue(
              "printerStatus",
              "Online",
              "Listing",
            );
          })
          .catch(() => {
            this.props.stateStore.changeValue(
              "connectionStatus",
              "Not Connected",
              "Listing",
            );
          });
      }
    }
  }

  getBluetoothState = async text => {
    const isEnabled = await BluetoothStatus.state();
    if (isEnabled && !text) {
      BluetoothStatus.disable(true);
    } else {
      BluetoothStatus.enable(true);
    }
  };

  onCategoryClick = index => {
    this.props.stateStore.changeValue("categoryStatus", "edit", "Listing");
    this.props.categoryStore.setCategory(index);
  };

  onCategoryDelete = index => {
    this.props.syncStore.addToTrash({
      trashId: index._id,
      table_name: "Categories",
    });

    this.props.itemStore.itemsExistsBasedOnCategory(index._id).then(res => {
      if (res) {
        Toast.show({
          text:
            strings.ThereAreItemsAssociatedWithThisCategoryChangeOrDeleteTheItems,
          duraction: 5000,
          type: "warning",
        });
      } else {
        this.props.categoryStore.unsetCategory();
        index.delete();
        Toast.show({
          text: strings.SuccessfullyDeletedCategory,
          duration: 5000,
        });
      }
    });
  };

  onCategoryLongPress = index => {
    Alert.alert(
      strings.DeleteCategory, // title
      strings.WouldYouLikeToDeleteThisCategory,
      [
        { text: strings.Cancel, style: "cancel" },
        {
          text: strings.OK,
          onPress: () => {
            // this.setState({ categoryStatus: "idle" });
            this.props.stateStore.changeValue(
              "categoryStatus",
              "idle",
              "Listing",
            );

            this.onCategoryDelete(index);
          },
        },
      ],
    );
  };

  onCategoryIdleClick = () => {
    this.props.stateStore.changeValue("categoryStatus", "add", "Listing");
  };

  onCategoryAdd = async category => {
    if (category.name) {
      await this.props.categoryStore.add({
        name: category.name,
        colorAndShape: JSON.stringify(category.colorAndShape),
        dateUpdated: Date.now(),
        syncStatus: false,
      });
      await this.props.categoryStore
        .searchLengthName(category.name)
        .then(result => {
          this.props.itemStore.addCategoryLength({
            categoryId: result._id,
            categoryLength: 0,
          });
        });
      // this.setState({ categoryStatus: "idle" });
      this.props.stateStore.changeValue("categoryStatus", "idle", "Listing");

      Toast.show({
        text: strings.SuccessfullyAddedCategory,
        duration: 5000,
      });
    } else {
      Toast.show({
        text: strings.EnterValidCategoryName,
        duration: 3000,
        type: "danger",
      });
    }
  };

  onCategoryEdit = category => {
    if (category.name) {
      this.props.categoryStore.selectedCat.edit({
        name: category.name,
        colorAndShape: JSON.stringify(category.colorAndShape),
        dateUpdated: Date.now(),
        syncStatus: false,
      });

      this.props.categoryStore.unsetCategory();
      this.props.stateStore.changeValue("categoryStatus", "idle", "Listing");

      Toast.show({
        text: strings.SuccessfullyUpdatedCategory,
        duration: 5000,
      });
    } else {
      Toast.show({
        text: strings.EnterValidCategoryName,
        duration: 3000,
        type: "danger",
      });
    }
  };

  onCategoryCancel = () => {
    this.props.categoryStore.unsetCategory();
    this.props.stateStore.changeValue("categoryStatus", "idle", "Listing");
  };

  onDiscountClick = index => {
    this.props.stateStore.changeValue("discountStatus", "edit", "Listing");
    this.props.discountStore.setDiscount(index);
  };

  onDiscountLongPress = index => {
    Alert.alert(
      strings.DeleteDiscount, // title
      strings.WouldYouLikeToDeleteThisDiscount,
      [
        { text: strings.Cancel, style: "cancel" },
        {
          text: strings.OK,
          onPress: () => {
            // this.setState({ discountStatus: "idle" });
            this.props.stateStore.changeValue(
              "discountStatus",
              "idle",
              "Listing",
            );

            this.props.discountStore.unsetDiscount();
            this.props.syncStore.addToTrash({
              trashId: index._id,
              table_name: "Discounts",
            });
            // const discount = this.props.discountStore.rows[index];
            index.delete();
            Toast.show({
              text: strings.SuccessfullyDeletedDiscount,
              duration: 5000,
            });
          },
        },
      ],
    );
  };

  onDiscountIdleClick = () => {
    this.props.stateStore.changeValue("discountStatus", "add", "Listing");
  };

  onDiscountAdd = discount => {
    const value = unformat(discount.value);
    if (discount.name) {
      if (value) {
        if (
          (value < 0 || value > 100) &&
          discount.percentageType !== "fixDiscount"
        ) {
          Alert.alert(
            strings.DiscountValueError,
            strings.ValueCantBeGreateTthan100OrLessThan0,
          );
          return true;
        } else {
          this.props.discountStore.add({
            name: discount.name,
            value: value,
            percentageType: discount.percentageType,
            dateUpdated: Date.now(),
            syncStatus: false,
          });
          // this.setState({ discountStatus: "idle" });
          this.props.stateStore.changeValue(
            "discountStatus",
            "idle",
            "Listing",
          );

          Toast.show({
            text: strings.SuccessfullyAddedDiscount,
            duration: 5000,
          });
        }
        return false;
      } else {
        Toast.show({
          text: strings.EnterValidDiscountValue,
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      Toast.show({
        text: strings.EnterValidDiscountName,
        duration: 3000,
        type: "danger",
      });
    }
  };

  onDiscountEdit = discount => {
    const value = unformat(discount.value);
    if (discount.name) {
      if (
        (value < 0 || value > 100) &&
        discount.percentageType !== "fixDiscount"
      ) {
        Alert.alert(
          strings.DiscountValueError,
          strings.ValueCantBeGreaterThan100OrLessThan0,
        );
        return true;
      } else {
        this.props.discountStore.selectedDiscount.edit({
          name: discount.name,
          value: value,
          percentageType: discount.percentageType,
          dateUpdated: Date.now(),
          syncStatus: false,
        });
        this.props.discountStore.unsetDiscount();
        // this.setState({ discountStatus: "idle" });
        this.props.stateStore.changeValue("discountStatus", "idle", "Listing");

        Toast.show({
          text: strings.SuccessfullyUpdatedDiscount,
          duration: 5000,
        });
      }
      return false; // if no error
    } else {
      Toast.show({
        text: strings.EnterValidDiscountName,
        duration: 3000,
        type: "danger",
      });
    }
  };

  onDiscountCancel = () => {
    this.props.discountStore.unsetDiscount();
    // this.setState({ discountStatus: "idle" });
    this.props.stateStore.changeValue("discountStatus", "idle", "Listing");
  };

  onItemClick = index => {
    this.props.stateStore.changeValue("itemStatus", "edit", "Listing");
    this.props.stateStore.changeValue(
      "taxObjects",
      JSON.stringify(index.taxesValue),
      "Listing",
    );

    if (this.props.stateStore.listing_state[0].itemMaintenanceStatus) {
      this.props.itemStore.setItem(index);
    } else {
      this.props.itemStore.setItem(index);
    }
  };

  onItemDelete = index => {
    // const item = this.props.itemStore.rows[index];
    this.props.syncStore.addToTrash({
      trashId: index._id,
      table_name: "Item",
    });
    this.props.itemStore.unselectItem();
    this.props.itemStore.updateLengthDelete();
    this.props.itemStore.updateLengthObjectsDelete(index.category);

    index.delete();
  };

  onItemLongPress = index => {
    Alert.alert(
      strings.DeleteItem, // title
      strings.WouldYouLikeToDeleteAnItem,
      [
        { text: strings.Cancel, style: "cancel" },
        {
          text: strings.OK,
          onPress: () => {
            // this.setState({ itemStatus: "idle" });
            this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

            this.onItemDelete(index);
            Toast.show({
              text: strings.SuccessfullyDeletedItem,
              duration: 5000,
            });
          },
        },
      ],
    );
  };

  onItemIdleClick = () => {
    if (this.props.taxesStore.rows.length > 0) {
      for (let i = 0; i < this.props.taxesStore.rows.length; i += 1) {
        this.props.stateStore.listing_state[0].taxObjects.push({
          _id: this.props.taxesStore.rows[i]._id,
          name: this.props.taxesStore.rows[i].name,
          rate: this.props.taxesStore.rows[i].rate,
          type: this.props.taxesStore.rows[i].type,
          option: this.props.taxesStore.rows[i].option,
          activate: this.props.taxesStore.rows[i].activate,
        });
      }
    }
    // this.setState({ itemStatus: "add" });
    this.props.stateStore.changeValue("itemStatus", "add", "Listing");
  };

  onItemAdd = item => {
    const {
      add,
      searchByBarcode,
      updateLength,
      updateLengthObjects,
      setDuplicateBarcodeObject,
    } = this.props.itemStore;

    const { changeValue } = this.props.stateStore;

    if (item.name) {
      if (item.barcode) {
        setDuplicateBarcodeObject("");
        searchByBarcode(item.barcode).then(result => {
          if (result) {
            let dupBarcode = {
              name: item.name,
              sku: item.sku,
              price: item.price,
              tax: item.tax,
              soldBy: item.soldBy,
              barcode: item.barcode,
              description: item.name,
              category: item.category,
              colorAndShape: item.colorAndShape,
              dateUpdated: item.dateUpdated,
              syncStatus: item.syncStatus,
            };
            Toast.show({
              text: strings.BarcodeAlreadyBeenUsed,
              duration: 5000,
              type: "danger",
            });
            setDuplicateBarcodeObject(JSON.stringify(dupBarcode));
          } else {
            add({
              name: item.name,
              description: item.name,
              soldBy: item.soldBy,
              price: unformat(item.price),
              tax: unformat(item.tax),
              sku: item.sku,
              syncStatus: false,
              barcode: item.barcode,
              category: item.category,
              dateUpdated: Date.now(),
              colorAndShape: JSON.stringify(item.colorAndShape),
              taxes: JSON.stringify(
                this.props.stateStore.listing_state[0].taxObjects,
              ),
            });
            updateLengthObjects(item.category);
            updateLength();
            changeValue("itemStatus", "idle", "Listing");
            Toast.show({
              text: strings.SuccessfullyAddedNewItem,
              duration: 5000,
            });
          }
        });
      } else {
        add({
          name: item.name,
          description: item.name,
          soldBy: item.soldBy,
          price: unformat(item.price),
          tax: unformat(item.tax),
          sku: item.sku,
          barcode: item.barcode,
          category: item.category,
          colorAndShape: JSON.stringify(item.colorAndShape),
          taxes: JSON.stringify(
            this.props.stateStore.listing_state[0].taxObjects,
          ),
          dateUpdated: Date.now(),
          syncStatus: false,
        });
        updateLengthObjects(item.category);
        updateLength();
        changeValue("itemStatus", "idle", "Listing");
        Toast.show({
          text: strings.SuccessfullyAddedNewItem,
          duration: 5000,
        });
      }
    } else {
      let dupBarcode = {
        name: item.name,
        soldBy: item.soldBy,
        price: item.price,
        sku: item.sku,
        tax: item.tax,
        barcode: item.barcode,
        colorAndShape: item.colorAndShape,
        category: item.category,
        dateUpdated: item.dateUpdated,
        syncStatus: item.syncStatus,
      };
      setDuplicateBarcodeObject(JSON.stringify(dupBarcode));
      Toast.show({
        text: strings.EnterAValidItemName,
        duration: 3000,
        type: "danger",
      });
    }
    automatic_sync_background_job(this.props);
  };

  onItemEdit = item => {
    if (item.name) {
      if (item.barcode) {
        this.props.itemStore.setDuplicateBarcodeObject("");
        this.props.itemStore.searchByBarcode(item.barcode).then(result => {
          if (result && result.name !== item.name) {
            let dupBarcode = {
              name: item.name,
              soldBy: item.soldBy,
              price: item.price,
              tax: item.tax,
              sku: item.sku,
              barcode: item.barcode,
              colorAndShape: item.colorAndShape,
              category: item.category,
            };

            Toast.show({
              text: strings.BarcodeAlreadyBeenUsed,
              duration: 5000,
              type: "danger",
            });
            this.props.itemStore.setDuplicateBarcodeObject(
              JSON.stringify(dupBarcode),
            );
          } else {
            this.props.itemStore.selectedItem.edit({
              name: item.name,
              soldBy: item.soldBy,
              price: unformat(item.price),
              tax: unformat(item.tax),
              sku: item.sku,
              barcode: item.barcode,
              category: item.category,
              colorAndShape: JSON.stringify(item.colorAndShape),
              taxes: JSON.stringify(item.taxes),
              dateUpdated: Date.now(),
              syncStatus: false,
            });

            this.props.itemStore.updateLengthObjects(item.category);
            this.props.itemStore.unselectItem();
            // this.setState({ itemStatus: "idle" });
            this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

            Toast.show({
              text: strings.SuccessfullyUpdatedItem,
              duration: 5000,
            });
          }
        });
      } else {
        this.props.itemStore.selectedItem.edit({
          name: item.name,
          soldBy: item.soldBy,
          price: unformat(item.price),
          tax: unformat(item.tax),
          sku: item.sku,
          barcode: item.barcode,
          category: item.category,
          colorAndShape: JSON.stringify(item.colorAndShape),
          taxes: JSON.stringify(item.taxes),
          dateUpdated: Date.now(),
          syncStatus: false,
        });

        this.props.itemStore.updateLengthObjects(item.category);
        this.props.itemStore.unselectItem();
        // this.setState({ itemStatus: "idle" });
        this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

        Toast.show({
          text: strings.SuccessfullyUpdatedItem,
          duration: 5000,
        });
      }
      this.props.itemStore.setDuplicateBarcodeObject("");
    } else {
      let dupBarcode = {
        name: item.name,
        soldBy: item.soldBy,
        price: item.price,
        tax: item.tax,
        sku: item.sku,
        barcode: item.barcode,
        colorAndShape: item.colorAndShape,
        category: item.category,
        dateUpdated: item.dateUpdated,
        syncStatus: item.syncStatus,
      };
      this.props.itemStore.setDuplicateBarcodeObject(
        JSON.stringify(dupBarcode),
      );
      Toast.show({
        text: strings.EnterValidItemName,
        duration: 3000,
        type: "danger",
      });
    }
  };

  onItemCancel = () => {
    this.props.itemStore.unselectItem();
    this.props.stateStore.changeValue("itemStatus", "idle", "Listing");
  };

  changeTabStatus = text => {
    this.props.stateStore.changeValue(
      "tabStatus",
      parseInt(text, 10),
      "Listing",
    );
  };

  onChangeText = text => {
    this.props.itemStore.search(text, "No Categories");
  };

  onItemMaintenanceStatusChange = text => {
    BluetoothStatus.disable(text);
    BluetoothStatus.enable(!text);
    if (text) {
      // this.setState({ itemMaintenanceStatus: text });
      this.props.stateStore.changeValue(
        "itemMaintenanceStatus",
        text,
        "Listing",
      );
    } else {
      // this.setState({ itemMaintenanceStatus: text });
      this.props.stateStore.changeValue(
        "itemMaintenanceStatus",
        text,
        "Listing",
      );

      this.props.itemStore.clearQueriedRows();
    }
  };

  onActivateTax = text => {
    this.props.taxesStore
      .edit(text, this.props.stateStore.listing_state[0].taxObjects)
      .then(result => {
        this.props.stateStore.changeValue(
          "taxObjects",
          result.slice(),
          "Listing",
        );
      });
  };

  onPrintBarcode = barcode => {
    if (barcode) {
      BluetoothSerial.isConnected()
        .then(res =>
          BluetoothSerial.write(TinyPOS.bufferedBarcode(barcode))
            .then(result =>
              Toast.showShortBottom(strings.SuccessfullyPrintedTheBarcode),
            )
            .catch(err => Toast.showShortBottom(err.message)),
        )
        .catch(() =>
          Alert.alert(strings.UnableToPrint, strings.PleaseConnectYourPrinter),
        );
    } else {
      Alert.alert(strings.UnableToPrint, strings.PleaseConnectYourPrinter);
    }
  };

  onEndReached = () => {
    const { tabStatus } = this.props.stateStore.listing_state[0];
    if (tabStatus === "0") {
      this.props.itemStore.getFromDb(20);
    } else if (tabStatus === "1") {
      this.props.categoryStore.getFromDb(20);
    } else if (tabStatus === "2") {
      this.props.discountStore.getFromDb(20);
    }
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    const itemTab = (
      <Tab heading="Items">
        <TabComponent
          data={
            this.props.itemStore.queriedRows.slice().length > 0
              ? this.props.itemStore.queriedRows.slice().sort(sortByName)
              : this.props.itemStore.rows.slice().sort(sortByName)
          }
          currency={getCountryCode(this.props.printerStore)}
          onClick={this.onItemClick}
          onLongPress={this.onItemLongPress}
          onEndReached={this.onEndReached}
        >
          <InputItem
            changeBluetoothStatus={this.getBluetoothState}
            printerStatus={this.props.stateStore.listing_state[0].printerStatus}
            onActivateTax={this.onActivateTax}
            taxes={JSON.parse(
              this.props.stateStore.listing_state[0].taxObjects,
            ).slice()}
            navigation={this.props.navigation}
            data={this.props.itemStore.selectedItem}
            dataDetails={
              this.props.itemStore.duplicateBarcodeObject
                ? this.props.itemStore.duplicateBarcodeObject
                : ""
            }
            categories={this.props.categoryStore.rows.slice().sort(sortByName)}
            onAdd={this.onItemAdd}
            onEdit={this.onItemEdit}
            onCancel={this.onItemCancel}
            onIdleClick={this.onItemIdleClick}
            onPrintBarcode={this.onPrintBarcode}
            status={this.props.stateStore.listing_state[0].itemStatus}
            currency={getCountryCode(this.props.printerStore)}
            isCurrencyDisabled={this.props.stateStore.isCurrencyDisabled}
          />
        </TabComponent>
      </Tab>
    );

    const categoryTab = (
      <TabComponent
        data={this.props.categoryStore.rows.slice().sort(sortByName)}
        onClick={this.onCategoryClick}
        onLongPress={this.onCategoryLongPress}
        onEndReached={this.onEndReached}
      >
        <InputCategory
          data={this.props.categoryStore.selectedCat}
          onAdd={this.onCategoryAdd}
          onEdit={this.onCategoryEdit}
          onIdleClick={this.onCategoryIdleClick}
          onCancel={this.onCategoryCancel}
          status={this.props.stateStore.listing_state[0].categoryStatus}
        />
      </TabComponent>
    );

    const discountTab = (
      <TabComponent
        data={this.props.discountStore.rows.slice().sort(sortByName)}
        onClick={this.onDiscountClick}
        onLongPress={this.onDiscountLongPress}
        onEndReached={this.onEndReached}
      >
        <InputDiscount
          currency={getCountryCode(this.props.printerStore)}
          data={this.props.discountStore.selectedDiscount}
          onAdd={this.onDiscountAdd}
          onEdit={this.onDiscountEdit}
          onIdleClick={this.onDiscountIdleClick}
          onCancel={this.onDiscountCancel}
          status={this.props.stateStore.listing_state[0].discountStatus}
        />
      </TabComponent>
    );

    return (
      <Listing
        onChangeText={this.onChangeText}
        itemMaintenanceStatus={
          this.props.stateStore.listing_state[0].itemMaintenanceStatus
        }
        itemMaintenanceStatusChange={this.onItemMaintenanceStatusChange}
        tabStatus={this.props.stateStore.listing_state[0].tabStatus}
        changeTabStatus={this.changeTabStatus}
        navigation={this.props.navigation}
        itemTab={itemTab}
        categoryTab={categoryTab}
        discountTab={discountTab}
      />
    );
  }
}
