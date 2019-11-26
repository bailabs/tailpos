import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { Header, Left, Body, Right, Container } from "native-base";
import { Col, Grid, Row } from "react-native-easy-grid";
import { observer } from "mobx-react/native";

import SalesList from "../SalesList/index";
import SalesReceipt from "../SalesReceipt/index";
import GrandTotalComponent from "@components/GrandTotalComponent";

import ViewOrderComponent from "../../components/ViewOrderComponent";
import ChangeTableComponent from "../../components/ChangeTableComponent";
import CategoriesComponent from "@components/CategoriesComponent";

import Icon from "react-native-vector-icons/FontAwesome";

import SearchComponent from "@components/SearchComponent";
@observer
class Sales extends React.PureComponent {
  onItemClick = index => this.props.onItemClick(index);
  onReceiptLineDelete = index => this.props.onReceiptLineDelete(index);
  onCategoryClick = (id, index) => this.props.onCategoryClick(id, index);
  navigate = () => this.props.navigation.navigate("DrawerOpen");
  onSearchClick = () => this.props.onSearchClick(true);
  onCategoryEndReached = () => this.props.onEndReached("category");
  onPressCategory = (id, index) => this.props.onCategoryClick(id, index);

  renderOrder() {
    const {
      onCloseViewOrder,
      isLoadingOrder,
      onTableClick,
      orders,
      onTableLongPress,
      inTableOptions,
      newTableNumber,
      setNewTableNumber,
      onChangeTable,
      onCloseTable,
      onReprintOrder,
      company,
    } = this.props;

    return inTableOptions ? (
      <ChangeTableComponent
        newTableNumber={newTableNumber}
        setNewTableNumber={setNewTableNumber}
        onChangeTable={onChangeTable}
        onCloseTable={onCloseTable}
        onReprintOrder={onReprintOrder}
      />
    ) : (
      <ViewOrderComponent
        company={company}
        orders={orders}
        length={orders.length}
        onTableClick={onTableClick}
        isLoadingOrder={isLoadingOrder}
        onCloseViewOrder={onCloseViewOrder}
        onTableLongPress={onTableLongPress}
      />
    );
  }
  renderSearch() {
    const { onSearchClick, onChangeSalesSearchText } = this.props;
    return (
      <SearchComponent
        status="Sales"
        onSearchClick={onSearchClick}
        onChangeText={onChangeSalesSearchText}
      />
    );
  }

  renderHeader() {
    return (
      <Header>
        <Left>
          <TouchableOpacity onPress={this.navigate}>
            <Icon
              size={25}
              name="bars"
              color="white"
              style={styles.headerLeftIcon}
            />
          </TouchableOpacity>
        </Left>
        <Body />
        <Right>
          <TouchableOpacity onPress={this.onSearchClick}>
            <Icon
              size={25}
              name="search"
              color="white"
              style={styles.headerRightIcon}
            />
          </TouchableOpacity>
        </Right>
      </Header>
    );
  }

  render() {
    const {
      currency,
      itemData,
      navigation,
      categoryData,
      searchStatus,
      onCloseClick,
      onSearchClick,
      bluetoothStatus,
      salesListStatus,
      onBarcodeRead,
      onBluetoothScan,
      onEndReached,
      itemsLength,
      categoryLengths,
      barcodeScannerInput,
      onChangeSalesSearchText,
      onChangeBarcodeScannerInput,
      selectedCategoryIndex,
      onLongPressItem,

      // Sales Receipt
      receiptDefault,
      isDiscountsEmpty,
      onViewOrders,
      onDeleteClick,
      onBarcodeClick,
      onDiscountClick,
      onPaymentClick,
      onReceiptLineEdit,

      // New feature
      isViewingOrder,
      onTakeAwayClick,
      hasTailOrder,
      useDescription,
      currentTable,
      onCancelOrder,
      isCurrencyDisabled,
      listStatus,
      company,
      enableOverallTax,
      roundOff,
    } = this.props;
    return (
      <Container>
        <Grid>
          {!company.hideMenuBar ? (
            <Row size={10}>
              <Col size={45}>
                {searchStatus ? this.renderSearch() : this.renderHeader()}
              </Col>
              <Col size={55}>
                <GrandTotalComponent
                  onTakeAwayClick={onTakeAwayClick}
                  isViewingOrder={isViewingOrder}
                  currentTable={currentTable}
                  onCancelOrder={onCancelOrder}
                  receipt={receiptDefault}
                  isCurrencyDisabled={isCurrencyDisabled}
                  currency={currency}
                  hasTailOrder={hasTailOrder}
                  onViewOrders={onViewOrders}
                  grandTotal={
                    receiptDefault
                      ? roundOff
                        ? receiptDefault.netTotalRoundOff
                        : receiptDefault.netTotal.toFixed(2)
                      : "0.00"
                  }
                />
              </Col>
            </Row>
          ) : null}

          <Row size={90}>
            <Col size={40}>
              {isViewingOrder ? (
                this.renderOrder()
              ) : (
                <SalesList
                  company={company}
                  listStatus={listStatus}
                  isCurrencyDisabled={isCurrencyDisabled}
                  currency={currency}
                  itemData={itemData}
                  navigation={navigation}
                  categoryData={categoryData}
                  searchStatus={searchStatus}
                  bluetoothStatus={bluetoothStatus}
                  salesListStatus={salesListStatus}
                  onChangeSalesSearchText={onChangeSalesSearchText}
                  onChangeBarcodeScannerInput={onChangeBarcodeScannerInput}
                  onCloseClick={onCloseClick}
                  onItemClick={this.onItemClick}
                  barcodeScannerInput={barcodeScannerInput}
                  onSearchClick={onSearchClick}
                  onBarcodeRead={onBarcodeRead}
                  selectedCategoryIndex={selectedCategoryIndex}
                  onBluetoothScan={onBluetoothScan}
                  onCategoryClick={this.onCategoryClick}
                  onEndReached={onEndReached}
                  itemsLength={itemsLength}
                  categoryLengths={categoryLengths}
                  onLongPressItem={onLongPressItem}
                  // Descriptive items
                  useDescription={useDescription}
                />
              )}
            </Col>
            <Col size={50}>
              {company.hideMenuBar ? (
                <Row size={10}>
                  <Col>
                    <GrandTotalComponent
                      onTakeAwayClick={onTakeAwayClick}
                      isViewingOrder={isViewingOrder}
                      currentTable={currentTable}
                      onCancelOrder={onCancelOrder}
                      receipt={receiptDefault}
                      isCurrencyDisabled={isCurrencyDisabled}
                      currency={currency}
                      hasTailOrder={hasTailOrder}
                      onViewOrders={onViewOrders}
                      grandTotal={
                        receiptDefault
                          ? roundOff
                            ? receiptDefault.netTotalRoundOff
                            : receiptDefault.netTotal.toFixed(2)
                          : "0.00"
                      }
                    />
                  </Col>
                </Row>
              ) : null}

              <Row size={90}>
                <Col size={15}>
                  <CategoriesComponent
                    data={categoryData}
                    hideMenuBar={company.hideMenuBar}
                    disabled={searchStatus}
                    itemsLength={itemsLength}
                    catLengths={categoryLengths}
                    bluetoothStatus={bluetoothStatus}
                    onCategoryClick={this.onPressCategory}
                    onEndReached={this.onCategoryEndReached}
                    selectedCategoryIndex={selectedCategoryIndex}
                  />
                </Col>
                <Col size={35}>
                  <SalesReceipt
                    enableOverallTax={enableOverallTax}
                    isCurrencyDisabled={isCurrencyDisabled}
                    currency={currency}
                    receipt={receiptDefault}
                    isDiscountsEmpty={isDiscountsEmpty}
                    onViewOrders={onViewOrders}
                    onDeleteClick={onDeleteClick}
                    onBarcodeClick={onBarcodeClick}
                    onPaymentClick={onPaymentClick}
                    onDiscountClick={onDiscountClick}
                    onReceiptLineEdit={onReceiptLineEdit}
                    onReceiptLineDelete={this.onReceiptLineDelete}
                    onTakeAwayClick={onTakeAwayClick}
                    hasTailOrder={hasTailOrder}
                    // Table
                    currentTable={currentTable}
                    onCancelOrder={onCancelOrder}
                    // Order
                    isViewingOrder={isViewingOrder}
                    roundOff={roundOff}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

export default Sales;
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4b4c9d",
  },
  headerLeftIcon: {
    paddingLeft: 5,
  },
  headerRightIcon: {
    paddingRight: 5,
  },
  footer: {
    backgroundColor: "transparent",
  },
  footerView: {
    marginTop: 10,
    width: "98%",
  },
  footerBarcode: {
    borderWidth: 1,
    borderColor: "gray",
  },
});
