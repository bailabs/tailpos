import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  ListItem,
  Text,
  Separator,
  Icon,
} from "native-base";

import FAIcon from "react-native-vector-icons/FontAwesome";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import ReceiptComponent from "@components/ReceiptComponent";
import ReceiptListItemComponent from "@components/ReceiptListItemComponent";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class ReceiptListing extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
    return (
      <Container>
        <Header style={{ backgroundColor: "#4b4c9d" }}>
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <FAIcon
                name="bars"
                size={25}
                color="white"
                style={{ paddingLeft: 5 }}
              />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>{strings.Receipts}</Title>
          </Body>
          <Right>
            <TouchableOpacity>
              <FAIcon
                name="print"
                size={25}
                color="white"
                style={{ paddingRight: 5 }}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <Grid>
          <Col
            style={{
              width: "35%",
              borderRightWidth: 1,
              borderColor: "#DEDEDE",
            }}
          >
            <Content style={{ backgroundColor: "white" }}>
              <Separator bordered>
                <Text>Due February 2018</Text>
              </Separator>
              <ReceiptListItemComponent
                name="RE-004"
                date="Feb 14"
                amount="P1000.00"
                type="Cash"
              />
              <ListItem last>
                <Body>
                  <Text>RE-003</Text>
                  <Text note>Feb 14</Text>
                </Body>
                <Right>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                      <Text>300.00</Text>
                      <Text note style={{ textAlign: "right" }}>
                        Cash
                      </Text>
                    </View>
                    <Icon
                      active
                      name="arrow-forward"
                      style={{ marginLeft: 5 }}
                    />
                  </View>
                </Right>
              </ListItem>
              <Separator bordered>
                <Text>Due January 2018</Text>
              </Separator>
              <ListItem>
                <Body>
                  <Text>RE-002</Text>
                  <Text note>Jan 11</Text>
                </Body>
                <Right>
                  <Text>250.00</Text>
                  <Text note>Cash</Text>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem last>
                <Body>
                  <Text>RE-001</Text>
                  <Text note>Jan 3</Text>
                </Body>
                <Right>
                  <Text>200.00</Text>
                  <Text note>Cash</Text>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
            </Content>
          </Col>
          <Col
            style={{
              width: "65%",
              backgroundColor: "#e9eaf4",
            }}
          >
            <Content padder>
              <ReceiptComponent />
            </Content>
          </Col>
        </Grid>
      </Container>
    );
  }
}
