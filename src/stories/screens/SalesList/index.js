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
} from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

import EntriesComponent from "@components/EntriesComponent";
import CategoriesComponent from "@components/CategoriesComponent";
import BarcodeInput from "@components/BarcodeInputComponent";
import SearchComponent from "@components/SearchComponent";

export default class SalesList extends React.PureComponent {
  onPressItem = (index) => this.props.onItemClick(index);
  onPressCategory = (id, index) => this.props.onCategoryClick(id, index);

  ref = c => { this.barcode = c; }

  onFocusInput() {
    this.barcode.focus();
  }

  render() {
    return (
      <Container>
        {this.props.searchStatus ? (
          <SearchComponent
            status="Sales"
            onSearchClick={text => this.props.onSearchClick(text)}
            onChangeText={text => this.props.onChangeSalesSearchText(text)}
          />
        ) : (
          <Header style={styles.header}>
            <Left>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                <Icon
                  name="bars"
                  size={25}
                  color="white"
                  style={styles.headerLeftIcon}
                />
              </TouchableOpacity>
            </Left>
            <Body />
            <Right>
              <TouchableOpacity onPress={() => this.props.onSearchClick(true)}>
                <Icon
                  name="search"
                  size={25}
                  color="white"
                  style={styles.headerRightIcon}
                />
              </TouchableOpacity>
            </Right>
          </Header>
        )}

        {this.props.salesListStatus ? (
          <BarcodeInput
            status="Sales"
            onChangeSalesStatus={text => this.props.onCloseClick(text)}
            onBarcodeRead={text => this.props.onBarcodeRead(text)}
          />
        ) : this.props.bluetoothStatus ? (
          <Container>
            <Grid>
              <Row>
                <Col size={65}>
                  <EntriesComponent
                    currency={this.props.currency}
                    data={this.props.itemData}
                    onPressItem={this.onPressItem}
                    onEndReached={() => this.props.onEndReached("item")}
                    itemsLength={this.props.itemsLength}
                    onLongPressItem={values =>
                      this.props.onLongPressItem(values)
                    }
                  />
                </Col>
                <Col size={35}>
                  <CategoriesComponent
                    bluetoothStatus={this.props.bluetoothStatus}
                    itemsLength={this.props.itemsLength}
                    catLengths={this.props.categoryLengths}
                    disabled={this.props.searchStatus}
                    data={this.props.categoryData}
                    selectedCategoryIndex={this.props.selectedCategoryIndex}
                    onCategoryClick={this.onCategoryClick}
                    onEndReached={() => this.props.onEndReached("category")}
                  />
                </Col>
              </Row>
            </Grid>
            <Footer style={styles.footer}>
              <View style={styles.footerView}>
                <TextInput
                  ref={this.ref}
                  underlineColorAndroid="transparent"
                  style={styles.footerBarcode}
                  autoFocus={true}
                  value={this.props.barcodeScannerInput}
                  onChangeText={text =>
                    this.props.onChangeBarcodeScannerInput(text)
                  }
                  onSubmitEditing={() => {
                    this.props.onBluetoothScan(this.props.barcodeScannerInput);
                    this.onFocusInput();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </Footer>
          </Container>
        ) : (
          <Grid>
            <Row>
              <Col size={65}>
                <EntriesComponent
                  currency={this.props.currency}
                  itemsLength={this.props.itemsLength}
                  data={this.props.itemData}
                  onPressItem={this.onPressItem}
                  onEndReached={() => this.props.onEndReached("item")}
                  onLongPressItem={values => this.props.onLongPressItem(values)}
                />
              </Col>
              <Col size={35}>
                <CategoriesComponent
                  itemsLength={this.props.itemsLength}
                  catLengths={this.props.categoryLengths}
                  disabled={this.props.searchStatus}
                  data={this.props.categoryData}
                  selectedCategoryIndex={this.props.selectedCategoryIndex}
                  onCategoryClick={(id, index) =>
                    this.props.onCategoryClick(id, index)
                  }
                  onEndReached={() => this.props.onEndReached("category")}
                />
              </Col>
            </Row>
          </Grid>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4b4c9d"
  },
  headerLeftIcon: {
    paddingLeft: 5
  },
  headerRightIcon: {
    paddingRight: 5
  },
  footer: {
    backgroundColor: "transparent"
  },
  footerView: {
    marginTop: 10,
    width: "98%"
  },
  footerBarcode: {
    borderWidth: 1,
    borderColor: "gray"
  },
});
