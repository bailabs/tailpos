import * as React from "react";
import { Dimensions } from "react-native";
import { Card, CardItem, Text, Button } from "native-base";
import { formatNumber } from "accounting-js";
import { Col, Row, Grid } from "react-native-easy-grid";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");

const SingleReportComponent = props => {
  return (
    <Card
      style={{
        width: Dimensions.get("window").width * 0.7,
        alignSelf: "center",
      }}
    >
      <CardItem style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>
          TailPOS
        </Text>
      </CardItem>
      <CardItem
        style={{
          width: Dimensions.get("window").width * 0.7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>
          Opened{" "}
          {props.report.shift_beginning !== null
            ? props.report.shift_beginning.toLocaleString()
            : ""}{" "}
          by {props.report.attendant}
        </Text>
      </CardItem>
      <CardItem
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          width: Dimensions.get("window").width * 0.5,
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <Grid>
          <Col style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>Total Net Sales</Text>
            <Text>
              {new MoneyCurrency(
                props.currency ? props.currency : "PHP",
              ).moneyFormat(
                formatNumber(parseFloat(props.report.totalNetSales, 10)),
              )}
            </Text>
          </Col>
          <Col style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>Transactions</Text>
            <Text>{props.report.numberOfTransaction}</Text>
          </Col>
        </Grid>
      </CardItem>
      <CardItem
        style={{
          borderBottomWidth: 1,
          width: Dimensions.get("window").width * 0.3,
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <Grid>
          <Row>
            <Col>
              <Text>Opening Amount</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.beginning_cash, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Expected Drawer</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.ending_cash, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Actual Money</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.actual_money, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>
                {formatNumber(parseFloat(props.report.computeShort, 10)) > 0
                  ? "Overage"
                  : "Short"}
              </Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.report.status === "Opened"
                  ? "0.00"
                  : props.report.status === "Closed"
                    ? new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(parseFloat(props.report.computeShort, 10)),
                      )
                    : "0.00"}
              </Text>
            </Col>
          </Row>
        </Grid>
      </CardItem>
      <CardItem
        style={{
          borderBottomWidth: 1,
          width: Dimensions.get("window").width * 0.3,
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <Grid>
          <Row>
            <Col>
              <Text>Cash Sales</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.totalCashSales, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Payouts</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.totalPayOut, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Pay Ins</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.totalPayIn, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Taxes</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.total_taxes, 10)),
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Discounts</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(
                  formatNumber(parseFloat(props.report.total_discounts, 10)),
                )}
              </Text>
            </Col>
          </Row>
        </Grid>
      </CardItem>
      <CardItem
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.report.reportType === "XReading" ? (
          <Button onPress={() => props.onPrintReport(props.report)}>
            <Text>Print X Report</Text>
          </Button>
        ) : props.report.reportType === "ZReading" ? (
          <Button onPress={() => props.onPrintReport(props.report)}>
            <Text>Print Z Report</Text>
          </Button>
        ) : (
          <Text>Error Button</Text>
        )}
      </CardItem>
    </Card>
  );
};

export default SingleReportComponent;
