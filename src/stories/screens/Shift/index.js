import * as React from "react";
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Title,
  Right,
  Content,
} from "native-base";

import { Col, Grid } from "react-native-easy-grid";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CardShiftEndComponent from "@components/CardShiftEndComponent";
import CardShiftBeginComponent from "@components/CardShiftBeginComponent";
import CardShiftFinishedComponent from "@components/CardShiftFinishedComponent";
import CardShiftAttendantComponent from "@components/CardShiftAttendantComponent";

export default class Shift extends React.PureComponent {

  onDeletePress = () => this.props.onDeletePress();
  onNumberPress = (text) => this.props.onNumberPress(text);

  render() {
    const CardShift = this.props.shiftStarted ? (
      <CardShiftEndComponent
        currency={this.props.currency}
        pay={this.props.pay}
        cashEnd={this.props.cashEnd.toFixed(2)}
        shiftBeginning={this.props.shiftBeginning}
        dropsClick={money => this.props.dropsClick(money)}
        shiftClick={money => this.props.closeShift(money)}
        payInClick={money => this.props.payInClick(money)}
        cashBeginning={this.props.cashBeginning.toFixed(2)}
        payOutClick={money => this.props.payOutClick(money)}
        shiftAttendant={this.props.attendant}
        attendant={this.props.shiftAttendant}
      />
    ) : (
      <CardShiftBeginComponent
        currency={this.props.currency}
        pay={this.props.pay}
        shiftAttendant={this.props.attendant}
        shiftClick={() => this.props.openShift()}
        amountOnChange={text => this.props.amountOnChange(text)}
        attendantOnChange={text => this.props.attendantOnChange(text)}
      />
    );

    const CardShiftDetails = this.props.shiftEnded ? (
      <CardShiftFinishedComponent
        currency={this.props.currency}
        pays={this.props.pays}
        shiftEnd={this.props.shiftEnd}
        shiftAttendant={this.props.attendant}
        shiftClick={() => this.props.reshift()}
        cashEnd={this.props.cashEnd.toFixed(2)}
        shiftBeginning={this.props.shiftBeginning}
        cashBeginning={this.props.cashBeginning.toFixed(2)}
      />
    ) : (
      CardShift
    );

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name="menu"
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
                size={24}
                color="white"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>Shift</Title>
          </Body>
          <Right />
        </Header>
        <Grid>
          <Col style={{ width: "35%" }}>
            <Content padder>
              <CardShiftAttendantComponent
                attendants={this.props.attendants}
                shiftAttendant={this.props.attendant}
                shiftStarted={this.props.shiftStarted}
                onDeletePress={this.onDeletePress}
                onNumberPress={this.onNumberPress}
                attendantOnChange={text => this.props.attendantOnChange(text)}
              />
            </Content>
          </Col>
          <Col style={{ width: "65%" }}>
            <Content padder>{CardShiftDetails}</Content>
          </Col>
        </Grid>
      </Container>
    );
  }
}
