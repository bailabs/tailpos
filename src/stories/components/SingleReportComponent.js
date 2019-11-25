import * as React from "react";
import { Dimensions } from "react-native";
import { Card, CardItem, Text, Button } from "native-base";
import { formatNumber } from "accounting-js";
import { Col, Row, Grid } from "react-native-easy-grid";
import { currentLanguage } from "../../translations/CurrentLanguage";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let MoneyCurrency = require("money-currencies");
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);

const SingleReportComponent = props => {
  strings.setLanguage(currentLanguage().companyLanguage);
  const categoryAmounts = JSON.parse(props.report.categories_total_amounts).map(
    category => {
      return (
        <Row>
          <Col>
            <Text>{category.name}</Text>
          </Col>
          <Col style={{ alignItems: "flex-end" }}>
            <Text>
              {props.isCurrencyDisabled
                ? formatNumber(parseFloat(category.total_amount, 10))
                : new MoneyCurrency(
                    props.currency ? props.currency : "PHP",
                  ).moneyFormat(
                    formatNumber(parseFloat(category.total_amount, 10)),
                  )}
            </Text>
          </Col>
        </Row>
      );
    },
  );
  const mopAmounts = JSON.parse(props.report.mop_total_amounts).map(mop => {
    return (
      <Row>
        <Col>
          <Text>{mop.name}</Text>
        </Col>
        <Col style={{ alignItems: "flex-end" }}>
          <Text>
            {props.isCurrencyDisabled
              ? formatNumber(parseFloat(mop.total_amount, 10))
              : new MoneyCurrency(
                  props.currency ? props.currency : "PHP",
                ).moneyFormat(formatNumber(parseFloat(mop.total_amount, 10)))}
          </Text>
        </Col>
      </Row>
    );
  });
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
          {strings.Opened}{" "}
          {props.report.shift_beginning !== null
            ? props.report.shift_beginning.toLocaleString()
            : ""}{" "}
          {strings.By} {props.report.attendant}
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
            <Text>{strings.TotalNetSales}</Text>
            <Text>
              {props.isCurrencyDisabled
                ? formatNumber(parseFloat(props.report.totalNetSales, 10))
                : new MoneyCurrency(
                    props.currency ? props.currency : "PHP",
                  ).moneyFormat(
                    formatNumber(parseFloat(props.report.totalNetSales, 10)),
                  )}
            </Text>
          </Col>
          <Col style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>{strings.Transactions}</Text>
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
              <Text>{strings.OpeningAmount}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.beginning_cash, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.beginning_cash, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.ExpectedDrawer}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.ending_cash, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.ending_cash, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.ActualMoney}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.actual_money, 10))
                  : new MoneyCurrency(
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
                  ? strings.Overage
                  : strings.Short}
              </Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.report.status === "Opened"
                  ? props.isCurrencyDisabled
                    ? formatNumber(parseFloat("0.00", 10))
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(formatNumber(parseFloat("0.00", 10)))
                  : props.report.status === "Closed"
                    ? props.isCurrencyDisabled
                      ? formatNumber(parseFloat(props.report.computeShort, 10))
                      : new MoneyCurrency(
                          props.currency ? props.currency : "PHP",
                        ).moneyFormat(
                          formatNumber(
                            parseFloat(props.report.computeShort, 10),
                          ),
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
              <Text>{strings.CashSales}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.totalCashSales, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.totalCashSales, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.Payouts}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.totalPayOut, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.totalPayOut, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.Payins}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.totalPayIn, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.totalPayIn, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.Taxes}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.total_taxes, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.total_taxes, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.Discounts}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.total_discounts, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(
                        parseFloat(props.report.total_discounts, 10),
                      ),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>{strings.Commissions}</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {props.isCurrencyDisabled
                  ? formatNumber(parseFloat(props.report.commissions, 10))
                  : new MoneyCurrency(
                      props.currency ? props.currency : "PHP",
                    ).moneyFormat(
                      formatNumber(parseFloat(props.report.commissions, 10)),
                    )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Cancelled</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>
                {
                  props.isCurrencyDisabled
                  ? formatNumber(props.report.cancelled)
                  : new MoneyCurrency(props.currency ? props.currency : "PHP")
                    .moneyFormat(formatNumber(props.report.cancelled))
                }
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text>Voided</Text>
            </Col>
            <Col style={{ alignItems: "flex-end" }}>
              <Text>{props.report.voided}</Text>
            </Col>
          </Row>
        </Grid>
      </CardItem>

      {props.hasTailOrder ? (
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
                <Text>Dine-in</Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Text>
                  {props.isCurrencyDisabled
                    ? formatNumber(
                        parseFloat(
                          props.report.getOrderTypesTotal.dineInTotal,
                          10,
                        ),
                      )
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(
                          parseFloat(
                            props.report.getOrderTypesTotal.dineInTotal,
                            10,
                          ),
                        ),
                      )}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>Takeaway</Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Text>
                  {props.isCurrencyDisabled
                    ? formatNumber(
                        parseFloat(
                          props.report.getOrderTypesTotal.takeawayTotal,
                          10,
                        ),
                      )
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(
                          parseFloat(
                            props.report.getOrderTypesTotal.takeawayTotal,
                            10,
                          ),
                        ),
                      )}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>Delivery</Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Text>
                  {props.isCurrencyDisabled
                    ? formatNumber(
                        parseFloat(
                          props.report.getOrderTypesTotal.deliveryTotal,
                          10,
                        ),
                      )
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(
                          parseFloat(
                            props.report.getOrderTypesTotal.deliveryTotal,
                            10,
                          ),
                        ),
                      )}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>Online</Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Text>
                  {props.isCurrencyDisabled
                    ? formatNumber(
                        parseFloat(
                          props.report.getOrderTypesTotal.onlineTotal,
                          10,
                        ),
                      )
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(
                          parseFloat(
                            props.report.getOrderTypesTotal.onlineTotal,
                            10,
                          ),
                        ),
                      )}
                </Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Text>Family</Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Text>
                  {props.isCurrencyDisabled
                    ? formatNumber(
                        parseFloat(
                          props.report.getOrderTypesTotal.familyTotal,
                          10,
                        ),
                      )
                    : new MoneyCurrency(
                        props.currency ? props.currency : "PHP",
                      ).moneyFormat(
                        formatNumber(
                          parseFloat(
                            props.report.getOrderTypesTotal.familyTotal,
                            10,
                          ),
                        ),
                      )}
                </Text>
              </Col>
            </Row>
          </Grid>
        </CardItem>
      ) : null}
      {props.hasTailOrder &&
      JSON.parse(props.report.categories_total_amounts).length > 0 ? (
        <CardItem
          style={{
            borderBottomWidth: 1,
            width: Dimensions.get("window").width * 0.3,
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          <Grid>{categoryAmounts}</Grid>
        </CardItem>
      ) : null}
      {props.hasTailOrder &&
      JSON.parse(props.report.mop_total_amounts).length > 0 ? (
        <CardItem
          style={{
            borderBottomWidth: 1,
            width: Dimensions.get("window").width * 0.3,
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          <Grid>{mopAmounts}</Grid>
        </CardItem>
      ) : null}
      <CardItem
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.report.reportType === "XReading" ? (
          <Button onPress={() => props.onPrintReport(props.report)}>
            <Text>{strings.PrintXReport}</Text>
          </Button>
        ) : props.report.reportType === "ZReading" ? (
          <Button onPress={() => props.onPrintReport(props.report)}>
            <Text>{strings.PrintZReport}</Text>
          </Button>
        ) : (
          <Text>{strings.ErrorButton}</Text>
        )}
      </CardItem>
    </Card>
  );
};

export default SingleReportComponent;
