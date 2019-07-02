import * as React from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Content,
  Icon,
  Button,
  Item,
  Input,
  Text,
  View,
} from "native-base";

class ChangeTableComponent extends React.PureComponent {
  render() {
    const { newTableNumber, setNewTableNumber, onChangeTable, onReprintOrder } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Text style={styles.leftText}>Order Info</Text>
          </Left>
          <Body />
          <Right>
            <Button transparent>
              <Icon name="close" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Item regular style={styles.item}>
            <Input
              placeholder="Table Number"
              value={newTableNumber}
              onChangeText={setNewTableNumber}
            />
          </Item>
          <View style={{ flexDirection: "row" }}>
            <Button onPress={onChangeTable}>
              <Text>Change Table</Text>
            </Button>
            <Button style={{marginLeft: 20 }} onPress={onReprintOrder}>
              <Text>Reprint Order</Text>
            </Button>
          </View>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  leftText: {
    color: "white",
    fontWeight: "bold",
  },
  item: {
    width: "50%",
    marginBottom: 15,
  },
});

export default ChangeTableComponent;
