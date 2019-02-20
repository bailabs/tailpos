import * as React from "react";
import { View, Dimensions, Modal, Alert } from "react-native";
import { Text, Container, Button } from "native-base";
import { formatNumber } from "accounting-js";
import { inject, observer } from "mobx-react/native";
import { Col, Row, Grid } from "react-native-easy-grid";
let MoneyCurrency = require("money-currencies");

@inject("receiptStore")
@observer
export default class SummaryModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Commission_total: 0,
      DataList: [],
      commissioned: [],
    };
  }

  componentWillMount() {
    this.props.receiptStore.defaultReceipt.lines.map(val => {
      let ComHolder = JSON.parse(val.commission_details);
      ComHolder.map(val2 => {
        let AtArray = 0;
        let AtIndex = null;
        for (var i = 0; i < this.state.commissioned.length; i += 1) {
          if (
            this.state.commissioned[i].name === val2.commission_attendant_name
          ) {
            AtArray = 1;
            AtIndex = i;
          }
        }
        if (AtArray !== 1) {
          this.state.commissioned.push({
            name: val2.commission_attendant_name,
            amount: val2.commission_amount,
          });
        } else {
          this.state.commissioned[AtIndex].amount =
            parseFloat(this.state.commissioned[AtIndex].amount) +
            parseFloat(val2.commission_amount);
        }
        this.state.Commission_total =
          parseFloat(this.state.Commission_total, 10) +
          parseFloat(val2.commission_amount, 10);
      });
    });

  }

  _renderItem = ({ item, index }) => {
    return (
      <Row style={{ marginBottom: 10 }}>
        <Col
          style={{
            marginLeft: 40,
            alignItems: "flex-start",
            justifyContent: "center",
            fontSize: 10,
          }}
        >
          <Text>{item.name}</Text>
        </Col>
        <Col
          style={{
            marginLeft: 80,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
          }}
        >
          <Text>
            {parseFloat(item.amount, 10)
              .toFixed(2)
              .toString()}
          </Text>
        </Col>
      </Row>
    );
  };

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
              height: Dimensions.get("window").height * 0.6 + 200,
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
                  <Row>
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
                  <Row>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Commission</Text>
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
                            parseFloat(this.state.Commission_total, 10),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  {/*{this.state.commissioned != null ?(*/}
                  {/*<Row style={{height:30}}>*/}

                  {/*<FlatList*/}
                  {/*data={this.state.commissioned}*/}
                  {/*keyExtractor={this._keyExtractor}*/}
                  {/*renderItem={this._renderItem}*/}
                  {/*/>*/}
                  {/*</Row>)*/}
                  {/*:null}*/}
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
