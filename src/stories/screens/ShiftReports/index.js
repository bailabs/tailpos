import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
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

class ShiftReports extends React.PureComponent {
  navigate = () => this.props.navigation.navigate("DrawerOpen")
  zReadingOnClick = () => this.props.onClickReport("")
  xReadingOnClick = (shift) => this.props.onClickReport(shift)

  reports = (report, index) => {
    if (report.attendant === this.props.attendant) {
      return (
       <ShiftReportCardComponents
        key={report._id}
        date={report.date}
        shift={report.shift}
        attendant={report.attendant}
        shiftNumber={report.shiftNumber}
        onPress={this.xReadingOnClick}
       />
      );
    }
  }

  render() {
    const shiftReportCardComponents = this.props.shiftReportsStore.map(this.reports);

    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent>
              <Icon
                active
                name="menu"
                onPress={this.navigate}
                size={24}
                color="white"
              />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title>Shift Reports</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem bordered style={styles.cardItem}>
              <Text style={styles.cardItemText}>
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
              <TouchableOpacity onPress={this.zReadingOnClick}>
                <CardItem bordered style={styles.cardItem}>
                  <View>
                    <Text style={styles.reportText}>
                      Z Reading
                    </Text>
                  </View>
                  <Text style={styles.shiftText}>
                    {this.props.zReading.shift_beginning !== null
                      ? this.props.zReading.shift_beginning.toLocaleDateString()
                      : ""}
                  </Text>
                </CardItem>
              </TouchableOpacity>
            ) : (
              <CardItem bordered style={styles.noZReading}>
                <View>
                  <Text style={styles.reportText}>
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4b4c9d",
  },
  headerBody: {
    flex: 3,
  },
  cardItem: {
    justifyContent: "space-between",
  },
  cardItemText: {
    fontSize: 21,
    fontWeight: "bold",
  },
  reportText: {
    fontSize: 21,
    color: "#294398",
    fontWeight: "bold",
    textAlignVertical: "center",
  },
  shiftText: {
    fontSize: 21,
    color: "#294398",
  },
  noZReading: {
    alignItems: "center",
    justifyContent: "center",
  }
});

export default ShiftReports;
