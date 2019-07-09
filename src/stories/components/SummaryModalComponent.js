import * as React from "react";
import { View, Dimensions, Modal, StyleSheet } from "react-native";
import { Text, Container, Button } from "native-base";
import { formatNumber } from "accounting-js";
import { inject, observer } from "mobx-react/native";
import { Col, Row, Grid } from "react-native-easy-grid";
let MoneyCurrency = require("money-currencies");
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
@inject("receiptStore")
@observer
export default class SummaryModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comissionTotal: 0,
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
        this.state.comissionTotal =
          parseFloat(this.state.comissionTotal, 10) +
          parseFloat(val2.commission_amount, 10);
      });
    });
  }

  onClose = () => this.props.onClose();
  onRequestClose = () => true;

  render() {
    let mc = new MoneyCurrency(
      this.props.currency ? this.props.currency : "PHP",
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visibility}
        onRequestClose={this.onRequestClose}
      >
        <View style={styles.modalView}>
          <View style={styles.modalViewInner}>
            <Container>
              <View style={styles.containerViewHeader}>
                <Text style={styles.headerText}>
                  {strings.TransactionSummary}
                </Text>
              </View>
              <View style={styles.containerViewContent}>
                <Grid>
                  <Row style={styles.gridRow}>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.SubTotal}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.details.subtotal)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={styles.gridRow}>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.Tax}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(
                            parseFloat(this.props.details.get_tax_total),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.Discount}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
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
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.Commission}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(
                            parseFloat(this.state.comissionTotal, 10),
                          ),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={styles.gridRow}>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.TotalAmount}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.details.netTotal)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={styles.gridRow}>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.CashPaid}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
                      <Text>
                        {mc.moneyFormat(
                          formatNumber(parseFloat(this.props.cash, 10)),
                        )}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={styles.gridRowEnd}>
                    <Col style={styles.leftCol}>
                      <Text style={styles.boldText}>{strings.Change}</Text>
                    </Col>
                    <Col style={styles.rightCol}>
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
                <View style={styles.buttonOuter}>
                  <Button block onPress={this.onClose}>
                    <Text>{strings.Close}</Text>
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

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#00000090",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  modalViewInner: {
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").height * 0.6 + 200,
  },
  containerViewHeader: {
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "#4B4C9D",
  },
  containerViewContent: {
    marginBottom: "3%",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.4 * 0.9,
    height: Dimensions.get("window").height * 0.45,
  },
  boldText: {
    fontWeight: "bold",
  },
  headerText: {
    fontWeight: "bold",
    color: "white",
  },
  leftCol: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rightCol: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  gridRow: {
    paddingBottom: 5,
  },
  gridRowEnd: {
    paddingBottom: 10,
  },
  buttonOuter: {
    marginTop: 5,
    marginBottom: 5,
  },
});
