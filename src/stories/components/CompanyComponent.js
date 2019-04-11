import * as React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Input, Textarea, Card, CardItem, Picker } from "native-base";
import Constants from "../.././container/SettingsContainer/constants.json";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class CompanyComponent extends React.PureComponent {
  onCompanyEdit = () => this.props.onCompanyEdit(true)

  renderHelpText() {
    const { editStatus } = this.props;

    if (!editStatus) {
      return null;
    }

    return (
      <CardItem style={styles.cardItemHelp}>
        <Text style={styles.cardItemText}>
          Currently editing. Please save your changes.
        </Text>
      </CardItem>
    );
  }

  render() {
    const countryCodes = Constants.map(country => (
      <Picker.Item
        label={country.name}
        value={country.name}
        key={country.name}
      />
    ));

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col style={styles.col}>
                <Text style={styles.titleText}>
                  Company Settings
                </Text>
              </Col>
              <Col>
                <View style={styles.viewRight}>
                  <TouchableOpacity onPress={this.onCompanyEdit}>
                    <Icon
                      size={30}
                      name="pencil"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.props.onCompanySave}>
                    <Icon
                      size={30}
                      name="content-save"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </Col>
            </Grid>
          </CardItem>
          {this.renderHelpText()}
          <CardItem>
            <View style={styles.cardItemView}>
              <Text style={styles.text}>
                Currency
              </Text>
              <View style={styles.pickerView}>
                <Picker
                  mode="dropdown"
                  style={styles.picker}
                  selectedValue={this.props.companyCountry}
                  onValueChange={this.props.changeCountry}
                >
                  {countryCodes}
                </Picker>
              </View>
            </View>
          </CardItem>
          <CardItem>
            <View style={styles.cardItemView}>
              <Text style={styles.text}>
                Company
              </Text>
              <Input
                style={{
                  borderWidth: 1,
                  borderColor: this.props.editStatus ? "blue" : "#cfcfcf",
                }}
                rowSpan={5}
                disabled={!this.props.editStatus}
                value={this.props.values.companyName}
                onChangeText={this.props.changeName}
                placeholder="ABC Company"
              />
            </View>
          </CardItem>
          <CardItem>
            <View style={styles.cardItemViewTextArea}>
              <Text style={styles.text}>
                Company Header
              </Text>
              <Textarea
                style={{
                  borderColor: this.props.editStatus ? "blue" : "#cfcfcf",
                  borderWidth: 1,
                }}
                rowSpan={5}
                editable={this.props.editStatus}
                value={this.props.values.companyHeader}
                onChangeText={this.props.changeHeader}
                placeholder="01234 ABC Street, ABC Building, Cagayan de Oro City"
              />
            </View>
          </CardItem>
          <CardItem>
            <View style={styles.cardItemViewTextArea}>
              <Text style={styles.text}>
                Company Footer
              </Text>
              <Textarea
                editable={this.props.editStatus}
                style={{
                  borderColor: this.props.editStatus ? "blue" : "#cfcfcf",
                  borderWidth: 1,
                }}
                rowSpan={5}
                value={this.props.values.companyFooter}
                onChangeText={this.props.changeFooter}
                placeholder="You are always welcome to ABC Company"
              />
            </View>
          </CardItem>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
  },
  cardItem: {
    marginBottom: 15,
    backgroundColor: "#4b4c9d",
  },
  col: {
    alignSelf: "center",
  },
  titleText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.02,
  },
  icon: {
    color: "white",
    marginLeft: 10,
  },
  viewRight: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  cardItemHelp: {
    borderColor: "gray",
    borderBottomWidth: 0.5,
  },
  cardItemText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "gray",
  },
  cardItemView: {
    width: "50%",
  },
  cardItemViewTextArea: {
    width: "60%",
  },
  pickerView: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
  },
  picker: {
    width: "100%",
  },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default CompanyComponent;
