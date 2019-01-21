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

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import SingleReportComponent from "@components/SingleReportComponent";

class ShiftInfo extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
                size={24}
                color="white"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>Shift Info</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <SingleReportComponent
            currency={this.props.currency}
            numberOfTransaction={this.props.numberOfTransaction}
            onPrintReport={report => this.props.onPrintReport(report)}
            report={this.props.report}
            pays={this.props.report.pays.slice()}
          />
        </Content>
      </Container>
    );
  }
}

export default ShiftInfo;
