/**
 * Created by jan on 4/20/18.
 */
import * as React from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Body,
  Right,
  Content,
  Card,
  CardItem,
  Text,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ReceiptCardComponent from "@components/ReceiptCardComponent";

class Receipts extends React.PureComponent {
  onReceiptClick = data => this.props.onReceiptClick(data);

  render() {
    const ReceiptCardComponents = this.props.receipts.map((obj, index) => {
      if (
        obj.status !== "current" &&
        (obj.attendant === this.props.currentAttendant.user_name ||
          this.props.currentAttendant.role === "Owner")
      ) {
        return (
          <ReceiptCardComponent
            role={this.props.currentAttendant.role}
            currency={this.props.currency}
            obj={obj}
            key={index}
            date={obj.date}
            status={obj.status}
            receipt={obj.receipt}
            number={obj.receiptNumber}
            amount={obj.netTotal.toFixed(2)}
            onPress={this.onReceiptClick}
          />
        );
      }
    });

    const ReceiptComponents =
      this.props.receipts.length === 0 ? (
        <CardItem>
          <Text>No receipts available</Text>
        </CardItem>
      ) : (
        ReceiptCardComponents
      );

    return (
      <Container>
        <Header style={{ backgroundColor: "#4B4C9D" }}>
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
            <Title>Receipts</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card>
            <CardItem bordered style={{ justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold", fontSize: 21 }}>
                <Icon name="receipt" size={21} /> Receipts
              </Text>
            </CardItem>
            {ReceiptComponents}
          </Card>
        </Content>
      </Container>
    );
  }
}

export default Receipts;
