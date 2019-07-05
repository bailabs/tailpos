import * as React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Text, Button } from "native-base";
import DatePicker from "react-native-datepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ItemSalesReportModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: "",
      dateTo: "",
    };
  }
  componentWillMount() {
    const dateNow = Date.now();

    const fullYear = new Date(dateNow).getFullYear();
    const fullMonth = new Date(dateNow).getMonth() + 1;
    const checkMonth = (new Date(dateNow).getMonth() + 1).toString().length === 1 ? "-0" : "-";
    const checkDate = new Date(dateNow).getDate().toString().length === 1 ? "-0" : "-";
    const fullDate = new Date(dateNow).getDate();

    this.setState({
      dateFrom: fullYear + checkMonth + fullMonth + checkDate + fullDate,
      dateTo: fullYear + checkMonth + fullMonth + checkDate + fullDate,
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
          <View style={{ backgroundColor: "white", width: 240 }}>
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
                Item Sales Report
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.onClose()}
              >
                <Icon name="close" size={21} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                // flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold" }}>From:</Text>
              <DatePicker
                style={{ width: 200 }}
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
                }}
              />
            </View>
            <View
              style={{
                // flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#bbb",
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold" }}>To:</Text>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.dateTo}
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
                  this.setState({ dateTo: date });
                }}
              />
            </View>
            <Button
              block
              success
              onPress={() => {
                this.props.onSubmit(this.state);
              }}
              style={{ borderRadius: 0 }}
            >
              <Text>Print Report</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
