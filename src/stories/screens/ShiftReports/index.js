import * as React from "react";
import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
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
  navigate = () => this.props.navigation.navigate("DrawerOpen");
  zReadingOnClick = () => this.props.onClickReport("");
  xReadingOnClick = shift => this.props.onClickReport(shift);

  reports = (report, index) => {
    if (report.attendant === this.props.attendant.user_name) {
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
  };

  render() {
    const shiftReportCardComponents = this.props.shiftReportsStore.map(
      this.reports,
    );
    const ShiftRerorts =
      this.props.shiftReportsStore.length === 0 ? (
        <CardItem>
          <Text>No shift report available</Text>
        </CardItem>
      ) : (
        shiftReportCardComponents
      );
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
            <CardItem bordered>
              <Text style={styles.cardItemText}>
                <Icon name="file-document-box" size={21} /> Shift Reports
              </Text>
              <View style={styles.cardItemTop}>
                {this.props.attendant.role === "Owner" ? (
                  <Button
                    onPress={this.props.itemSales}
                    style={styles.buttonMargin}
                  >
                    <Text>Item Sales Report</Text>
                  </Button>
                ) : null}
                {this.props.attendant.role === "Owner" ? (
                  <Button
                    onPress={this.props.commission}
                    style={styles.buttonMargin}
                  >
                    <Text>Commission Report</Text>
                  </Button>
                ) : null}
                {this.props.attendant.role === "Owner" ? (
                  <Button onPress={this.props.ZReading}>
                    <Text>Generate Z Reading</Text>
                  </Button>
                ) : null}
              </View>
            </CardItem>
            {this.props.attendant.role === "Owner" ? (
              this.props.loading ? (
                <Spinner color="#427ec6" />
              ) : this.props.zReading ? (
                <TouchableOpacity onPress={this.zReadingOnClick}>
                  <CardItem bordered style={styles.cardItem}>
                    <View>
                      <Text style={styles.reportText}>Z Reading</Text>
                    </View>
                    <Text style={styles.shiftText}>
                      {this.props.zReading.shift_beginning !== null
                        ? this.props.zReading.shift_beginning.toLocaleDateString()
                        : ""}
                    </Text>
                  </CardItem>
                </TouchableOpacity>
              ) : (
                <CardItem bordered>
                  <Text>No Z Reading Generated</Text>
                </CardItem>
              )
            ) : null}
            {ShiftRerorts}
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
  cardItemTop: {
    alignSelf: "flex-end",
    width: Dimensions.get("window").width * 0.82,
    justifyContent: "flex-end",
    flexDirection: "row",
  },

  cardItemText: {
    fontSize: 21,
    fontWeight: "bold",
    justifyContent: "flex-start",
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
  },
  buttonMargin: {
    marginRight: 5,
  },
});

export default ShiftReports;
