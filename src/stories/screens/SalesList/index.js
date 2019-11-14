import * as React from "react";
import { TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Header,
  Left,
  Body,
  Right,
  Container,
  Col,
  Row,
  Grid,
  Footer,
  Button,
} from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

import SearchComponent from "@components/SearchComponent";
import EntriesComponent from "@components/EntriesComponent";
import BarcodeInput from "@components/BarcodeInputComponent";
import CategoriesComponent from "@components/CategoriesComponent";

export default class SalesList extends React.PureComponent {
  onPressItem = index => this.props.onItemClick(index);
  onPressCategory = (id, index) => this.props.onCategoryClick(id, index);

  onItemEndReached = () => this.props.onEndReached("item");
  onCategoryEndReached = () => this.props.onEndReached("category");

  ref = c => {
    this.barcode = c;
  };

  onFocusInput() {
    this.barcode.focus();
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
          <Button transparent>
            <Icon
              active
              name="menu"
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
              size={24}
              color="white"
            />
          </Button>
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

  renderBarcode() {
    const { onCloseClick, onBarcodeRead } = this.props;
    return (
      <BarcodeInput
        status="Sales"
        onBarcodeRead={onBarcodeRead}
        onChangeSalesStatus={onCloseClick}
      />
    );
  }

  render() {
    const {
      searchStatus,
      salesListStatus,
      bluetoothStatus,

      // EntriesComponent
      currency,
      itemData,
      itemsLength,
      onLongPressItem,

      // CategoriesComponent
      categoryData,
      categoryLengths,
      selectedCategoryIndex,

      // TextInput
      onChangeBarcodeScannerInput,

      // Descriptive items
      useDescription,
      listStatus,
      isCurrencyDisabled,
      company,
    } = this.props;

    return (
      <Container>
        {salesListStatus ? (
          this.renderBarcode()
        ) : (
          <Container>
            <Grid>
              <Row>
                <Col size={75}>
                  <EntriesComponent
                    company={company}
                    listStatus={listStatus}
                    isCurrencyDisabled={isCurrencyDisabled}
                    data={itemData}
                    currency={currency}
                    itemsLength={itemsLength}
                    onPressItem={this.onPressItem}
                    onLongPressItem={onLongPressItem}
                    onEndReached={this.onItemEndReached}
                    useDescription={useDescription}
                  />
                </Col>
                <Col size={25}>
                  <CategoriesComponent
                    data={categoryData}
                    disabled={searchStatus}
                    itemsLength={itemsLength}
                    catLengths={categoryLengths}
                    bluetoothStatus={bluetoothStatus}
                    onCategoryClick={this.onPressCategory}
                    onEndReached={this.onCategoryEndReached}
                    selectedCategoryIndex={selectedCategoryIndex}
                  />
                </Col>
              </Row>
            </Grid>
            {bluetoothStatus ? (
              <Footer style={styles.footer}>
                <View style={styles.footerView}>
                  <TextInput
                    ref={this.ref}
                    autoFocus={true}
                    style={styles.footerBarcode}
                    underlineColorAndroid="transparent"
                    value={this.props.barcodeScannerInput}
                    onChangeText={onChangeBarcodeScannerInput}
                    onSubmitEditing={() => {
                      this.props.onBluetoothScan(
                        this.props.barcodeScannerInput,
                      );
                      this.onFocusInput();
                    }}
                    blurOnSubmit={false}
                  />
                </View>
              </Footer>
            ) : null}
          </Container>
        )}
      </Container>
    );
  }
}

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
