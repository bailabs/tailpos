import * as React from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Col, Grid } from "react-native-easy-grid";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class SearchableDropdownComponent extends React.PureComponent {
  modalVisibleChange = () => this.props.modalVisibleChange(true);
  searchCustomer = text => {
    if (text) {
      this.props.searchCustomer(text);
    }
  };

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);

      return (
      <Grid>
        <Col size={75} style={styles.leftCol}>
          <SearchableDropdown
            enableEmptySections
            onTextChange={this.searchCustomer}
            onItemSelect={item => item}
            defaultIndex={0}
            editable={false}
            resetValue={false}
            placeholder={strings.Customer}
            underlineColorAndroid="transparent"
            items={this.props.searchedCustomers}
            textInputStyle={{
              fontSize: 18,
              padding: 12,
              borderWidth: 2,
              borderColor: "#DCDCDC",
            }}
            itemStyle={styles.item}
            itemTextStyle={styles.itemText}
            itemsContainerStyle={styles.itemsContainer}
          />
        </Col>
        <Col size={25} style={styles.rightCol}>
          <Button style={styles.button} onPress={this.modalVisibleChange}>
            <Text>{strings.AddCustomer}</Text>
          </Button>
        </Col>
      </Grid>
    );
  }
}

const styles = StyleSheet.create({
  leftCol: {
    justifyContent: "center",
  },
  rightCol: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginLeft: 10,
  },
  item: {
    padding: 10,
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#bbb",
    backgroundColor: "#ddd",
  },
  itemText: {
    color: "#222",
  },
  itemsContainer: {
    maxHeight: 140,
  },
});
