import * as React from "react";
import { View, Modal, TouchableOpacity, FlatList } from "react-native";
import { Text, Grid, Row, Col } from "native-base";
import DatePicker from "react-native-datepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ItemSalesReportModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: "",
    };
  }
  _renderItem = ({ item }) => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col
          style={{
            marginLeft: 10,
            alignItems: "flex-start",
            justifyContent: "center",
            height: 50,
            fontSize: 16,
          }}
        >
          <Text>{item.name}</Text>
        </Col>
        <Col
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            fontSize: 16,
          }}
        >
          <Text>{item.amount}</Text>
        </Col>
      </Row>
    );
  };
  componentWillMount() {
    const dateNow = Date.now();

    const fullYear = new Date(dateNow).getFullYear();
    const fullMonth = new Date(dateNow).getMonth() + 1;
    const checkDate =
      new Date(dateNow).getDate().toString().length === 1 ? "-0" : "-";
    const fullDate = new Date(dateNow).getDate();

    this.setState({
      dateFrom: fullYear + "-" + fullMonth + checkDate + fullDate,
    });
  }

  render() {
    return (
      <Modal
        onRequestClose={() => null}
        animationType="slide"
        transparent={true}
        visible={this.props.visibility}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000090",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ backgroundColor: "white", width: 400, height: 600 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                Commissions Report
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.onClose()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <DatePicker
              style={{ width: 200, margin: 15 }}
              date={this.state.dateFrom}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2000-01-01"
              maxDate="2100-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                this.setState({ dateFrom: date });
                this.props.commission(date);
              }}
            />
            <View style={{ marginBottom: 30 }}>
              <Grid>
                <Col
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    fontSize: 16,
                  }}
                >
                  <Text>Name</Text>
                </Col>
                <Col
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    fontSize: 16,
                  }}
                >
                  <Text>Amount</Text>
                </Col>
              </Grid>
            </View>
            <View>
              <FlatList
                numColumns={1}
                data={this.props.commissionsData}
                keyExtractor={(item, index) => index}
                renderItem={this._renderItem}
                // onEndReachedThreshold={1}
                // onEndReached={() => this.props.onEndReached()}
              />
              {/*</Grid>*/}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
