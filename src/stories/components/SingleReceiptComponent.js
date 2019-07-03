import * as React from "react";
import { TouchableOpacity, View, TextInput, Dimensions } from "react-native";
import { Card, CardItem, Text, Button } from "native-base";
import { Row, Col, Grid } from "react-native-easy-grid";
import { formatNumber } from "accounting-js";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

let MoneyCurrency = require("money-currencies");

const SingleReceiptComponent = props => {
  const Lines = props.receiptLines.map((line, index) => {
    const total = line.qty * line.price;

    return (
      <CardItem key={index} style={{ justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "bold", color: "#294398" }}>
            {line.item_name}
          </Text>
          <Text style={{ color: "#aaa" }}>
            {line.qty} x{" "}
            {new MoneyCurrency(
              props.currency ? props.currency : "PHP",
            ).moneyFormat(formatNumber(line.price.toFixed(2)))}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-start" }}>
          <Text style={{ color: "#294398" }}>
            {new MoneyCurrency(
              props.currency ? props.currency : "PHP",
            ).moneyFormat(formatNumber(total.toFixed(2)))}
          </Text>
        </View>
      </CardItem>
    );
  });
  const Discount =
    props.discountName !== "" ? (
      <Text style={{ color: "#aaa" }}>
        {props.discountName} ({props.discountType})
      </Text>
    ) : (
      <Text style={{ color: "#aaa" }}>(No discount)</Text>
    );
  const Tax =
    props.receipt.taxesValue !== "0" ? (
      <Text style={{ color: "#aaa" }}>({props.receipt.taxesValue}%)</Text>
    ) : (
      <Text style={{ color: "#aaa" }}>(No tax)</Text>
    );
  const PrinterColorStatus =
    props.reprintStatus === "Online" ? "green" : "#aaa";

  return (
    <Card>
      <CardItem header style={{ borderBottomWidth: 1, borderColor: "gray" }}>
        <Grid>
          <Col
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: Dimensions.get("window").width * 0.94 * 0.2,
            }}
          >
            <Row>
              <Text style={{ fontWeight: "bold", color: "#294398" }}>
                <Icon name="receipt" size={21} color="#294398" /> Receipt
                Information
              </Text>
            </Row>
            <Row>
              {props.status === "cancelled" ? (
                <Text style={{ color: "#aaa" }}>
                  <Icon name="circle" size={14} color="#aaa" /> Cancelled
                </Text>
              ) : (
                <Button
                  style={{ marginTop: 5 }}
                  onPress={() => props.onChangeCancelStatus(true)}
                  disabled={props.cancelStatus}
                >
                  <Text>Cancel Receipt</Text>
                </Button>
              )}
            </Row>
          </Col>

          {props.status === "cancelled" ? (
            <Col
              style={{
                width: Dimensions.get("window").width * 0.94 * 0.53,
                borderRightWidth: 1,
                marginRight: 15,
              }}
            >
              <Row>
                <Text>Reason: </Text>
              </Row>
              <Row
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TextInput
                  editable={props.editStatus ? true : false}
                  style={{
                    marginLeft: 5,
                    borderBottomWidth: 1,
                    fontSize: 14,
                    width: Dimensions.get("window").width * 0.94 * 0.46,
                    color: "black",
                  }}
                  underlineColorAndroid="transparent"
                  value={props.reasonValue}
                  onChangeText={text => props.onChangeReason(text)}
                  multiline={true}
                />
                {props.editStatus ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => props.onCancel(props)}
                  >
                    <Icon name="content-save" size={30} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                    onPress={() => props.onEditReason(true)}
                  >
                    <Icon name="pencil" size={30} color="black" />
                  </TouchableOpacity>
                )}
              </Row>
            </Col>
          ) : props.cancelStatus ? (
            <Col
              style={{
                width: Dimensions.get("window").width * 0.94 * 0.53,
                borderRightWidth: 1,
                marginRight: 15,
              }}
            >
              <Row>
                <Text>Reason: </Text>
              </Row>
              <Row
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <TextInput
                  editable={true}
                  style={{
                    marginLeft: 5,
                    borderBottomWidth: 1,
                    fontSize: 14,
                    width: Dimensions.get("window").width * 0.94 * 0.46,
                    color: "black",
                  }}
                  underlineColorAndroid="transparent"
                  value={props.reasonValue}
                  onChangeText={text => props.onChangeReason(text)}
                  multiline={true}
                />
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                  onPress={() => props.onCancel(props)}
                >
                  <Icon name="content-save" size={40} color="black" />
                </TouchableOpacity>
              </Row>
            </Col>
          ) : (
            <Col
              style={{
                width: Dimensions.get("window").width * 0.94 * 0.53,
                borderRightWidth: 1,
                marginRight: 15,
              }}
            />
          )}
          <Col
            style={{
              width: Dimensions.get("window").width * 0.94 * 0.25,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              style={{ alignSelf: "center" }}
              onPress={() => props.onReprint(props)}
              disabled={props.reprintStatus !== "Online"}
            >
              <Text>Reprint</Text>
            </Button>
            {/*<TouchableOpacity*/}
            {/*style={{ flexDirection: "row", alignItems: "center" }}*/}
            {/*onPress={() => props.onReprint(props)}*/}
            {/*>*/}
            <Icon name="printer" size={21} color={PrinterColorStatus} />
            <Text style={{ color: PrinterColorStatus }}>
              {props.reprintStatus}
            </Text>
            <Icon
              name="bluetooth-connect"
              style={{ color: "blue" }}
              size={Dimensions.get("window").width * 0.04}
              onPress={() => props.connectDevice()}
            />
            {/*</TouchableOpacity>*/}
          </Col>
        </Grid>
      </CardItem>
      <CardItem>
        <Text style={{ fontWeight: "bold" }}>Sold to: </Text>
        <Text>{props.customer}</Text>
      </CardItem>
      <CardItem>
        <Text style={{ fontWeight: "bold" }}>Receipt Items</Text>
      </CardItem>
      {Lines}
      <CardItem style={{ justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>Total</Text>
        <Text>
          {new MoneyCurrency(
            props.currency ? props.currency : "PHP",
          ).moneyFormat(formatNumber(props.total))}
        </Text>
      </CardItem>
      <CardItem style={{ justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>Tax</Text>
          {Tax}
        </View>
        <Text>
          {new MoneyCurrency(
            props.currency ? props.currency : "PHP",
          ).moneyFormat(formatNumber(props.receipt.taxesAmount))}
        </Text>
      </CardItem>
      <CardItem style={{ justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>Discount</Text>
          {Discount}
        </View>

        <Text>
          {new MoneyCurrency(
            props.currency ? props.currency : "PHP",
          ).moneyFormat(formatNumber(props.discount))}
        </Text>
      </CardItem>
      <CardItem style={{ justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>Amount Paid</Text>
        <Text>
          {new MoneyCurrency(
            props.currency ? props.currency : "PHP",
          ).moneyFormat(formatNumber(props.amountPaid))}
        </Text>
      </CardItem>
      <CardItem style={{ justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>Amount Change</Text>
        <Text>
          {new MoneyCurrency(
            props.currency ? props.currency : "PHP",
          ).moneyFormat(formatNumber(props.change))}
        </Text>
      </CardItem>
      <CardItem footer style={{ justifyContent: "space-between" }}>
        <Text style={{ color: "#aaa", fontWeight: "bold" }}>Transaction</Text>
        <Text style={{ color: "#aaa" }}>{props.date}</Text>
      </CardItem>
    </Card>
  );
};

export default SingleReceiptComponent;
