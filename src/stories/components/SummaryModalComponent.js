import * as React from "react";
import { View, Dimensions, Modal, Alert } from "react-native";
import { Text, Container, Button } from "native-base";
import { formatNumber } from "accounting-js";
import { Col, Row, Grid } from "react-native-easy-grid";
let MoneyCurrency = require("money-currencies");

export default class SummaryModalComponent extends React.Component {
  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visibility}
        onRequestClose={() => {
          Alert.alert("Modal has been closed");
        }}
      >
        <View
          style={{
            backgroundColor: "#00000090",
            alignItems: "center",
            justifyContent: "center",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("window").width * 0.4,
              height: Dimensions.get("window").height * 0.6,
            }}
          >
            <Container>
              <View
                style={{
                  marginBottom: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  height: Dimensions.get("window").height * 0.1,
                  backgroundColor: "#4B4C9D",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Transaction Summary
                </Text>
              </View>
              <View
                style={{
                  marginBottom: "3%",
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.4 * 0.9,
                  height: Dimensions.get("window").height * 0.45,
                }}
              >
                <Grid>
                  <Row style={{ paddingBottom: 5 }}>
                    <Col
                      style={{
                        width: Dimensions.get("window").width * 0.4 * 0.9 * 0.5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Sub-Total</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                        width: Dimensions.get("window").width * 0.4 * 0.9 * 0.5,
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.details.subtotal)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 5 }}>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Tax</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(
                            parseFloat(this.props.details.taxesValue),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 25 }}>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Discount</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(
                            parseFloat(this.props.details.discounts),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 5 }}>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Total Amount</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.details.netTotal)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 5 }}>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Cash Paid</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.cash, 10)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 10 }}>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Change</Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(
                            parseFloat(this.props.cash, 10) -
                              parseFloat(this.props.details.netTotal),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                </Grid>
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                  <Button
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => this.props.onClose()}
                  >
                    <Text>Close</Text>
                  </Button>
                </View>
              </View>
            </Container>
          </View>
        </View>
      </Modal>
    );
  }
}
