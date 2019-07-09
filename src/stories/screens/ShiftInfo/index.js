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
import { currentLanguage } from "../../../translations/CurrentLanguage";

import SingleReportComponent from "@components/SingleReportComponent";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class ShiftInfo extends React.Component {
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
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
            <Title>{strings.ShiftInfo}</Title>
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
