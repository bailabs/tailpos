import * as React from "react";
import { Container } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import SalesReceipt from "../SalesReceipt/index";
import SalesList from "../SalesList/index";

class Sales extends React.PureComponent {
  onItemClick = index => this.props.onItemClick(index);
  onReceiptLineDelete = index => this.props.onReceiptLineDelete(index);
  onCategoryClick = (id, index) => this.props.onCategoryClick(id, index);

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
      onDeleteClick,
      onBarcodeClick,
      onDiscountClick,
      onPaymentClick,
      onReceiptLineEdit,
    } = this.props;

    return (
      <Container>
        <Grid>
          <Col size={1}>
            <SalesList
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
            />
          </Col>
          <Col size={1}>
            <SalesReceipt
              currency={currency}
              receipt={receiptDefault}
              isDiscountsEmpty={isDiscountsEmpty}
              onDeleteClick={onDeleteClick}
              onBarcodeClick={onBarcodeClick}
              onDiscountClick={onDiscountClick}
              onPaymentClick={onPaymentClick}
              onReceiptLineEdit={onReceiptLineEdit}
              onReceiptLineDelete={this.onReceiptLineDelete}
            />
          </Col>
        </Grid>
      </Container>
    );
  }
}

export default Sales;
