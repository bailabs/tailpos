/**
 * Created by jan on 4/20/18.
 * Last modified by Ivan on 4/25/18.
 */
import * as React from "react";
import { Dimensions, View } from "react-native";
import { Text, Input, Textarea, Card, CardItem, Picker } from "native-base";
import Constants from "../.././container/SettingsContainer/constants.json";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class CompanyComponent extends React.Component {
  constructor(props) {
    super(props);
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
        <Card
          style={{
            height: Dimensions.get("window").height * 0.8,
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem
            style={{
              backgroundColor: "#4B4C9D",
              height: Dimensions.get("window").height * 0.8 * 0.1,
            }}
          >
            <Grid style={{}}>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.7 * 0.83,
                }}
              >
                <Text
                  style={{
                    fontSize: Dimensions.get("window").width * 0.02,
                    color: "white",
                  }}
                >
                  Company Settings
                </Text>
              </Col>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.05,
                }}
              >
                <Icon
                  name="pencil"
                  size={30}
                  style={{ color: "white" }}
                  onPress={() => this.props.onCompanyEdit(true)}
                />
              </Col>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.05,
                }}
              >
                <Icon
                  name="content-save"
                  size={30}
                  style={{ color: "white" }}
                  onPress={() => this.props.onCompanySave()}
                />
              </Col>
            </Grid>
          </CardItem>

          {this.props.editStatus ? (
            <CardItem
              style={{
                borderBottomWidth: 0.5,
                borderColor: "gray",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginLeft: 10,
                  color: "gray",
                }}
              >
                Currently editing. Please save your changes.
              </Text>
            </CardItem>
          ) : null}

          <CardItem>
            <Input
              disabled={!this.props.editStatus}
              style={{
                borderColor: this.props.editStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
              }}
              rowSpan={5}
              value={this.props.values.companyName}
              onChangeText={text => this.props.changeName(text)}
              placeholder="Company Name"
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: Dimensions.get("window").width * 0.015,
              }}
            >
              Currency :{" "}
            </Text>
            <View
              style={{
                width: Dimensions.get("window").width * 0.7 * 0.4,
                marginRight: 30,
                borderWidth: 1,
              }}
            >
              <Picker
                mode="dropdown"
                textStyle={{ borderWidth: 1 }}
                selectedValue={this.props.companyCountry}
                onValueChange={value => this.props.changeCountry(value)}
              >
                {countryCodes}
              </Picker>
            </View>
          </CardItem>
          <CardItem>
            <Textarea
              editable={this.props.editStatus}
              style={{
                borderColor: this.props.editStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
                width: Dimensions.get("window").width * 0.7 * 0.45,
              }}
              rowSpan={5}
              value={this.props.values.companyHeader}
              onChangeText={text => this.props.changeHeader(text)}
              placeholder="Company Header"
            />
            <Textarea
              editable={this.props.editStatus}
              style={{
                borderColor: this.props.editStatus ? "blue" : "gray",
                borderWidth: 1,
                margin: 10,
                width: Dimensions.get("window").width * 0.7 * 0.45,
              }}
              rowSpan={5}
              value={this.props.values.companyFooter}
              onChangeText={text => this.props.changeFooter(text)}
              placeholder="Company Footer"
            />
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default CompanyComponent;
