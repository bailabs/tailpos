import * as React from "react";
import { TouchableOpacity, View, TextInput, Dimensions } from "react-native";
import { Card, CardItem, Text, Button } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
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

  const PrinterColorStatus =
    props.reprintStatus === "Online" ? "green" : "#aaa";

  return (
    <Card>
      <CardItem header style={{ borderBottomWidth: 1, borderColor: "gray" }}>
        <Grid>
          <Col
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#294398" }}>
              <Icon name="receipt" size={21} color="#294398" /> Receipt
              Information
            </Text>
          </Col>
          {props.status === "cancelled" ? (
            <Col
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Icon name="circle" size={14} color="#aaa" />
              <Text style={{ color: "#aaa" }}>Cancelled</Text>
            </Col>
          ) : (
            <Col style={{ justifyContent: "center", alignItems: "center" }}>
              <Button
                onPress={() => props.onChangeCancelStatus(true)}
                disabled={props.cancelStatus}
              >
                <Text>Cancel</Text>
              </Button>
            </Col>
          )}
          {props.status === "cancelled" ? (
            <Col
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 200,
              }}
            >
              <Text>Reason: </Text>
              <TextInput
                editable={false}
                style={{ fontSize: 12, color: "black" }}
                underlineColorAndroid="transparent"
                value={props.reason}
                onChangeText={text => props.onChangeReason(text)}
                multiline={true}
                numberOfLines={3}
              />
              {props.editStatus ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                  onPress={props.onCancel}
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
            </Col>
          ) : props.cancelStatus ? (
            <Col
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Reason: </Text>
              <TextInput
                style={{ borderWidth: 1, fontSize: 12, width: 200 }}
                underlineColorAndroid="transparent"
                value={props.reasonValue}
                onChangeText={text => props.onChangeReason(text)}
                multiline={true}
                numberOfLines={3}
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
            </Col>
          ) : (
            <Col />
          )}
          <Col
            style={{
              width: 250,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
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
