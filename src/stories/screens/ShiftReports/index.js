/**
 * Created by jan on 4/20/18.
 */
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Body,
  Right,
  Content,
  Card,
  CardItem,
  Text,
  Spinner,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ShiftReportCardComponents from "@components/ShiftReportCardComponents";

class ShiftReports extends React.Component {
  render() {
    const shiftReportCardComponents = this.props.shiftReportsStore.map(
      (obj, index) => {
        if (obj.attendant === this.props.attendant) {
          return (
            <ShiftReportCardComponents
              shiftNumber={obj.shiftNumber}
              attendant={obj.attendant}
              onPress={() => this.props.onClickReport(obj)}
              date={obj.date}
            />
          );
        }
      },
    );

    return (
      <Container>
        <Header style={{ backgroundColor: "#4B4C9D" }}>
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
          <Body style={{ flex: 3 }}>
            <Title>Shift Reports</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem bordered style={{ justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold", fontSize: 21 }}>
                Shift Reports
              </Text>
              <Button onPress={this.props.itemSales}>
                <Text>Item Sales Report</Text>
              </Button>
              <Button onPress={this.props.commission}>
                <Text>Commission Report</Text>
              </Button>
              <Button onPress={this.props.ZReading}>
                <Text>Generate Z Reading</Text>
              </Button>
            </CardItem>
            {this.props.loading ? (
              <Spinner color="#427ec6" />
            ) : this.props.zReading ? (
              <TouchableOpacity onPress={() => this.props.onClickReport("")}>
                <CardItem bordered style={{ justifyContent: "space-between" }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 21,
                        fontWeight: "bold",
                        textAlignVertical: "center",
                        color: "#294398",
                      }}
                    >
                      Z Reading
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 21,
                      color: "#294398",
                    }}
                  >
                    {this.props.zReading.shift_beginning !== null
                      ? this.props.zReading.shift_beginning.toLocaleDateString()
                      : ""}
                  </Text>
                </CardItem>
              </TouchableOpacity>
            ) : (
              <CardItem
                bordered
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: "bold",
                      textAlignVertical: "center",
                      color: "#294398",
                    }}
                  >
                    No Z Reading Generated
                  </Text>
                </View>
              </CardItem>
            )}
            {shiftReportCardComponents}
          </Card>
        </Content>
      </Container>
    );
  }
}

export default ShiftReports;
