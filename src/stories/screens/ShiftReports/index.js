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
import { currentLanguage } from "../../../translations/CurrentLanguage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ShiftReportCardComponents from "@components/ShiftReportCardComponents";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
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
          <Text>{strings.NoShiftReportAvailable}</Text>
        </CardItem>
      ) : (
        shiftReportCardComponents
      );
      strings.setLanguage(currentLanguage().companyLanguage);
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
            <Title>{strings.ShiftReports}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem bordered style={styles.cardItem}>
              <Text style={styles.cardItemText}>
                <Icon name="file-document-box" size={21} />{" "}
                {strings.ShiftReports}
              </Text>
              <View style={styles.cardItemTop}>
                {this.props.attendant.role === "Owner" ? (
                  <Button
                    onPress={this.props.itemSales}
                    style={styles.buttonMargin}
                  >
                    <Text>{strings.ItemSalesReport}</Text>
                  </Button>
                ) : null}
                {this.props.attendant.role === "Owner" ? (
                  <Button
                    onPress={this.props.commission}
                    style={styles.buttonMargin}
                  >
                    <Text>{strings.CommissionReport}</Text>
                  </Button>
                ) : null}
                {this.props.attendant.role === "Owner" ? (
                  <Button
                    onPress={this.props.ZReading}
                    style={styles.buttonMargin}
                  >
                    <Text>{strings.GenerateZReading}</Text>
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
                      <Text style={styles.reportText}>{strings.ZReading}</Text>
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
                  <Text>{strings.NoZReadingGenerated}</Text>
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
    justifyContent: "flex-end",
    width: "86%",
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
