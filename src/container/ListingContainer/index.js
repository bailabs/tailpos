import * as React from "react";
import { Alert } from "react-native";
import { Tab, Toast } from "native-base";
import { observer, inject } from "mobx-react/native";

import TinyPOS from "tiny-esc-pos";
import BluetoothSerial from "react-native-bluetooth-serial";
import { BluetoothStatus } from "react-native-bluetooth-status";
import { listing } from "../../store/StateStore/DefaultValues";

import { unformat } from "accounting-js";

import TabComponent from "@components/TabComponent";

// Input
import Listing from "@screens/Listing";
import InputCategory from "@screens/InputCategory";
import InputDiscount from "@screens/InputDiscount";
import InputItem from "@screens/InputItem";

@inject(
  "categoryStore",
  "discountStore",
  "itemStore",
  "taxesStore",
  "printerStore",
  "syncStore",
  "stateStore",
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
        // this.setState({
        //   printerStatus: "Connecting...",
        // });
        this.props.stateStore.changeValue(
          "printerStatus",
          "Connecting...",
          "Listing",
        );
        BluetoothSerial.connect(this.props.printerStore.rows[i].macAddress)
          .then(() => {
            // this.setState({
            //   printerStatus: "Online",
            // });
            this.props.stateStore.changeValue(
              "printerStatus",
              "Online",
              "Listing",
            );
          })
          .catch(() => {
            // this.setState({ connectionStatus: "Not Connected" });
            this.props.stateStore.changeValue(
              "connectionStatus",
              "Not Connected",
              "Listing",
            );
          });
      }
    }
  }
  async getBluetoothState(text) {
    const isEnabled = await BluetoothStatus.state();
    if (isEnabled && !text) {
      BluetoothStatus.disable(true);
    } else {
      BluetoothStatus.enable(true);
    }
  }
  // Editing
  onCategoryClick(index) {
    // this.setState({ categoryStatus: "edit" });
    this.props.stateStore.changeValue("categoryStatus", "edit", "Listing");

    this.props.categoryStore.setCategory(index);
  }

  onCategoryDelete(index) {
    // const category = this.props.categoryStore.rows[index];
    this.props.syncStore.addToTrash({
      trashId: index._id,
      table_name: "Categories",
    });
    this.props.itemStore.itemsExistsBasedOnCategory(index._id).then(res => {
      if (res) {
        Toast.show({
          text:
            "There are items associated with this category. Change or delete the items.",
          duraction: 5000,
          type: "warning",
        });
      } else {
        this.props.categoryStore.unsetCategory();
        index.delete();
        Toast.show({
          text: "Successfully Deleted Category",
          duration: 5000,
        });
      }
    });
  }

  onCategoryLongPress(index) {
    Alert.alert(
      "Delete category", // title
      "Would you like to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
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
  }

  onCategoryIdleClick() {
    // this.setState({ categoryStatus: "add" });
    this.props.stateStore.changeValue("categoryStatus", "add", "Listing");
  }
  async onCategoryAdd(category) {
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
        text: "Successfully Added Category",
        duration: 5000,
      });
    } else {
      Toast.show({
        text: "Enter Valid Category Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onCategoryEdit(category) {
    if (category.name) {
      this.props.categoryStore.selectedCat.edit({
        name: category.name,
        colorAndShape: JSON.stringify(category.colorAndShape),
        dateUpdated: Date.now(),
        syncStatus: false,
      });
      this.props.categoryStore.unsetCategory();
      // this.setState({ categoryStatus: "idle" });
      this.props.stateStore.changeValue("categoryStatus", "idle", "Listing");

      Toast.show({
        text: "Successfully Updated Category",
        duration: 5000,
      });
    } else {
      Toast.show({
        text: "Enter Valid Category Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onCategoryCancel() {
    this.props.categoryStore.unsetCategory();
    // this.setState({ categoryStatus: "idle" });
    this.props.stateStore.changeValue("categoryStatus", "idle", "Listing");
  }

  onDiscountClick(index) {
    // this.setState({ discountStatus: "edit" });
    this.props.stateStore.changeValue("discountStatus", "edit", "Listing");

    this.props.discountStore.setDiscount(index);
  }

  onDiscountLongPress(index) {
    Alert.alert(
      "Delete discount", // title
      "Would you like to delete this discount tag?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
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
              text: "Successfully Deleted Discount",
              duration: 5000,
            });
          },
        },
      ],
    );
  }

  onDiscountIdleClick() {
    // this.setState({ discountStatus: "add" });
    this.props.stateStore.changeValue("discountStatus", "add", "Listing");
  }

  onDiscountAdd(discount) {
    const value = unformat(discount.value);
    if (discount.name) {
      if (value) {
        if (
          (value < 0 || value > 100) &&
          discount.percentageType !== "fixDiscount"
        ) {
          Alert.alert(
            "Discount Value Error",
            "Value can't be greater than 100% or less than 0%",
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
            text: "Successfully Added Discount",
            duration: 5000,
          });
        }
        return false;
      } else {
        Toast.show({
          text: "Enter Valid Discount Value",
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      Toast.show({
        text: "Enter Valid Discount Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onDiscountEdit(discount) {
    const value = unformat(discount.value);
    if (discount.name) {
      if (
        (value < 0 || value > 100) &&
        discount.percentageType !== "fixDiscount"
      ) {
        Alert.alert(
          "Discount Value Error",
          "Value can't be greater than 100% or less than 0%",
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
          text: "Successfully Updated Discount",
          duration: 5000,
        });
      }
      return false; // if no error
    } else {
      Toast.show({
        text: "Enter Valid Discount Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onDiscountCancel() {
    this.props.discountStore.unsetDiscount();
    // this.setState({ discountStatus: "idle" });
    this.props.stateStore.changeValue("discountStatus", "idle", "Listing");
  }

  onItemClick(index) {
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
  }

  onItemDelete(index) {
    // const item = this.props.itemStore.rows[index];
    this.props.syncStore.addToTrash({
      trashId: index._id,
      table_name: "Item",
    });
    this.props.itemStore.unselectItem();
    this.props.itemStore.updateLengthDelete();
    this.props.itemStore.updateLengthObjectsDelete(index.category);

    index.delete();
  }

  onItemLongPress(index) {
    Alert.alert(
      "Delete item", // title
      "Would you like to delete an item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            // this.setState({ itemStatus: "idle" });
            this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

            this.onItemDelete(index);
            Toast.show({
              text: "Successfully Deleted Item",
              duration: 5000,
            });
          },
        },
      ],
    );
  }

  onItemIdleClick() {
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
  }

  onItemAdd(item) {
    if (item.name) {
      // this.props.itemStore.findName(item.name,item.price).then( duplicateResult => {
      //   console.log("duplicaaaaaaaaaaaate")
      //   console.log(duplicateResult)
      //   if(!duplicateResult){
      if (item.barcode) {
        this.props.itemStore.setDuplicateBarcodeObject("");
        this.props.itemStore.searchByBarcode(item.barcode).then(result => {
          if (result) {
            let dupBarcode = {
              name: item.name,
              soldBy: item.soldBy,
              price: item.price,
              sku: item.sku,
              barcode: item.barcode,
              colorAndShape: item.colorAndShape,
              category: item.category,
              dateUpdated: item.dateUpdated,
              syncStatus: item.syncStatus,
            };
            Toast.show({
              text: "Barcode already been used",
              duration: 5000,
              type: "danger",
            });
            this.props.itemStore.setDuplicateBarcodeObject(
              JSON.stringify(dupBarcode),
            );
          } else {
            this.props.itemStore.add({
              name: item.name,
              soldBy: item.soldBy,
              price: unformat(item.price),
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
            this.props.itemStore.updateLengthObjects(item.category);
            // this.setState({ itemStatus: "idle" });
            this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

            Toast.show({
              text: "Successfully Added Item",
              duration: 5000,
            });
          }
        });
      } else {
        this.props.itemStore.add({
          name: item.name,
          soldBy: item.soldBy,
          price: unformat(item.price),
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
        this.props.itemStore.updateLengthObjects(item.category);
        this.props.itemStore.updateLength();
        // this.setState({ itemStatus: "idle" });
        this.props.stateStore.changeValue("itemStatus", "idle", "Listing");

        Toast.show({
          text: "Successfully Added Item",
          duration: 5000,
        });
      }
    } else {
      let dupBarcode = {
        name: item.name,
        soldBy: item.soldBy,
        price: item.price,
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
        text: "Enter Valid Item Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onItemEdit(item) {
    if (item.name) {
      if (item.barcode) {
        this.props.itemStore.setDuplicateBarcodeObject("");
        this.props.itemStore.searchByBarcode(item.barcode).then(result => {
          if (result && result.name !== item.name) {
            let dupBarcode = {
              name: item.name,
              soldBy: item.soldBy,
              price: item.price,
              sku: item.sku,
              barcode: item.barcode,
              colorAndShape: item.colorAndShape,
              category: item.category,
            };

            Toast.show({
              text: "Barcode already been used",
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
              text: "Successfully Updated Item",
              duration: 5000,
            });
          }
        });
      } else {
        this.props.itemStore.selectedItem.edit({
          name: item.name,
          soldBy: item.soldBy,
          price: unformat(item.price),
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
          text: "Successfully Updated Item",
          duration: 5000,
        });
      }
      this.props.itemStore.setDuplicateBarcodeObject("");
    } else {
      let dupBarcode = {
        name: item.name,
        soldBy: item.soldBy,
        price: item.price,
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
        text: "Enter Valid Item Name",
        duration: 3000,
        type: "danger",
      });
    }
  }

  onItemCancel() {
    this.props.itemStore.unselectItem();
    // this.setState({ itemStatus: "idle" });
    this.props.stateStore.changeValue("itemStatus", "idle", "Listing");
  }
  changeTabStatus(text) {
    // this.setState({ tabStatus: parseInt(text, 10) });
    this.props.stateStore.changeValue(
      "tabStatus",
      parseInt(text, 10),
      "Listing",
    );
  }
  onChangeText(text) {
    this.props.itemStore.search(text, "No Categories");
  }
  onItemMaintenanceStatusChange(text) {
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
  }
  onActivateTax(text) {
    this.props.taxesStore
      .edit(text, this.props.stateStore.listing_state[0].taxObjects)
      .then(result => {
        // this.setState({ taxObjects: result.slice() });
        this.props.stateStore.changeValue(
          "taxObjects",
          result.slice(),
          "Listing",
        );
      });
  }
  onPrintBarcode(barcode) {
    if (barcode) {
      BluetoothSerial.isConnected()
        .then(res =>
          BluetoothSerial.write(TinyPOS.bufferedBarcode(barcode))
            .then(result =>
              Toast.showShortBottom("Successfully printed the barcode."),
            )
            .catch(err => Toast.showShortBottom(err.message)),
        )
        .catch(() =>
          Alert.alert("Unable to Print", "Please connect your printer."),
        );
    } else {
      Alert.alert("Unable to Print", "Please enter the barcode.");
    }
  }
  onEndReached(value) {
    if (value === "itemStore") {
      this.props.itemStore.getFromDb(20);
    } else if (value === "categoryStore") {
      this.props.categoryStore.getFromDb(20);
    } else if (value === "discountStore") {
      this.props.discountStore.getFromDb(20);
    }
  }
  render() {
    const itemTab = (
      <Tab heading="Items">
        <TabComponent
          data={
            this.props.itemStore.queriedRows.slice().length > 0
              ? this.props.itemStore.queriedRows.slice().sort(function(a, b) {
                  return a.name < b.name ? -1 : 1;
                })
              : this.props.itemStore.rows.slice().sort(function(a, b) {
                  return a.name < b.name ? -1 : 1;
                })
          }
          currency={
            this.props.printerStore.companySettings[0].countryCode
              ? this.props.printerStore.companySettings[0].countryCode
              : ""
          }
          onClick={index => this.onItemClick(index)}
          onLongPress={item => this.onItemLongPress(item)}
          onEndReached={() => this.onEndReached("itemStore")}
        >
          <InputItem
            changeBluetoothStatus={text => this.getBluetoothState(text)}
            printerStatus={this.props.stateStore.listing_state[0].printerStatus}
            onActivateTax={text => this.onActivateTax(text)}
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
            categories={this.props.categoryStore.rows
              .slice()
              .sort(function(a, b) {
                return a.name < b.name ? -1 : 1;
              })}
            onAdd={item => this.onItemAdd(item)}
            onEdit={item => this.onItemEdit(item)}
            onCancel={() => this.onItemCancel()}
            onIdleClick={() => this.onItemIdleClick()}
            onPrintBarcode={barcode => this.onPrintBarcode(barcode)}
            status={this.props.stateStore.listing_state[0].itemStatus}
            currency={
              this.props.printerStore.companySettings[0].countryCode
                ? this.props.printerStore.companySettings[0].countryCode
                : ""
            }
          />
        </TabComponent>
      </Tab>
    );

    const categoryTab = (
      <TabComponent
        data={this.props.categoryStore.rows.slice().sort(function(a, b) {
          return a.name < b.name ? -1 : 1;
        })}
        onClick={index => this.onCategoryClick(index)}
        onLongPress={category => this.onCategoryLongPress(category)}
        onEndReached={() => this.onEndReached("categoryStore")}
      >
        <InputCategory
          data={this.props.categoryStore.selectedCat}
          onAdd={category => this.onCategoryAdd(category)}
          onEdit={category => this.onCategoryEdit(category)}
          onIdleClick={() => this.onCategoryIdleClick()}
          onCancel={() => this.onCategoryCancel()}
          status={this.props.stateStore.listing_state[0].categoryStatus}
        />
      </TabComponent>
    );

    const discountTab = (
      <TabComponent
        data={this.props.discountStore.rows.slice().sort(function(a, b) {
          return a.name < b.name ? -1 : 1;
        })}
        onClick={index => this.onDiscountClick(index)}
        onLongPress={discount => this.onDiscountLongPress(discount)}
        onEndReached={() => this.onEndReached("discountStore")}
      >
        <InputDiscount
          currency={
            this.props.printerStore.companySettings[0].countryCode
              ? this.props.printerStore.companySettings[0].countryCode
              : ""
          }
          data={this.props.discountStore.selectedDiscount}
          onAdd={discount => this.onDiscountAdd(discount)}
          onEdit={discount => this.onDiscountEdit(discount)}
          onIdleClick={() => this.onDiscountIdleClick()}
          onCancel={() => this.onDiscountCancel()}
          status={this.props.stateStore.listing_state[0].discountStatus}
        />
      </TabComponent>
    );

    return (
      <Listing
        onChangeText={text => this.onChangeText(text)}
        itemMaintenanceStatus={
          this.props.stateStore.listing_state[0].itemMaintenanceStatus
        }
        itemMaintenanceStatusChange={text =>
          this.onItemMaintenanceStatusChange(text)
        }
        tabStatus={this.props.stateStore.listing_state[0].tabStatus}
        changeTabStatus={text => this.changeTabStatus(text)}
        navigation={this.props.navigation}
        itemTab={itemTab}
        categoryTab={categoryTab}
        discountTab={discountTab}
      />
    );
  }
}
