import * as React from "react";
import { View, FlatList, Dimensions } from "react-native";
import { Text, CheckBox } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class TaxesComponent extends React.Component {
  _renderItem = ({ item, index }) => {
    return (
      <View style={{ width: Dimensions.get("window").width * 0.305 }}>
        <Grid>
          <Col>
            <Grid>
              <Col>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: Dimensions.get("window").height * 0.03,
                  }}
                >
                  {item.name} ({item.rate})
                </Text>
              </Col>
              <Col style={{ alignItems: "center", justifyContent: "center" }}>
                <CheckBox
                  checked={item.activate}
                  color="green"
                  onPress={() => this.props.onActivateTax(index)}
                />
              </Col>
            </Grid>
          </Col>
        </Grid>
      </View>
    );
  };
  render() {
    return (
      <View style={{ marginBottom: 10 }}>
        {this.props.taxes.length > 0 ? (
          <Text style={{ fontWeight: "bold" }}>Taxes</Text>
        ) : (
          <Text />
        )}

        <FlatList
          numColumns={2}
          data={this.props.taxes}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}
