import * as React from "react";
import { Container } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import SalesReceipt from "../SalesReceipt/index";
import SalesList from "../SalesList/index";

class Sales extends React.PureComponent {
  onItemClick = index => this.props.onItemClick(index);
  onReceiptLineDelete = index => this.props.onReceiptLineDelete(index);

  render() {
    return (
      <Container>
        <Grid>
          <Col style={{ width: "50%" }}>
            <SalesList
              currency={this.props.currency}
              itemData={this.props.itemData}
              navigation={this.props.navigation}
              categoryData={this.props.categoryData}
              searchStatus={this.props.searchStatus}
              onChangeSalesSearchText={text =>
                this.props.onChangeSalesSearchText(text)
              }
              bluetoothStatus={this.props.bluetoothStatus}
              salesListStatus={this.props.salesListStatus}
              onChangeBarcodeScannerInput={text =>
                this.props.onChangeBarcodeScannerInput(text)
              }
              onCloseClick={text => this.props.onCloseClick(text)}
              onItemClick={this.onItemClick}
              barcodeScannerInput={this.props.barcodeScannerInput}
              onSearchClick={text => this.props.onSearchClick(text)}
              onBarcodeRead={text => this.props.onBarcodeRead(text)}
              selectedCategoryIndex={this.props.selectedCategoryIndex}
              onBluetoothScan={text => this.props.onBluetoothScan(text)}
              onCategoryClick={(id, index) =>
                this.props.onCategoryClick(id, index)
              }
              onEndReached={text => this.props.onEndReached(text)}
              itemsLength={this.props.itemsLength}
              categoryLengths={this.props.categoryLengths}
              onLongPressItem={values => this.props.onLongPressItem(values)}
            />
          </Col>
          <Col style={{ width: "50%" }}>
            <SalesReceipt
              currency={this.props.currency}
              receipt={this.props.receiptDefault}
              isDiscountsEmpty={this.props.isDiscountsEmpty}
              onDeleteClick={() => this.props.onDeleteClick()}
              onBarcodeClick={() => this.props.onBarcodeClick()}
              onDiscountClick={() => this.props.onDiscountClick()}
              onPaymentClick={text => this.props.onPaymentClick(text)}
              onReceiptLineEdit={index => this.props.onReceiptLineEdit(index)}
              onReceiptLineDelete={this.onReceiptLineDelete}
            />
          </Col>
        </Grid>
      </Container>
    );
  }
}

export default Sales;
