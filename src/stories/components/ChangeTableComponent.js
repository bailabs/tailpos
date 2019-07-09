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
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
class ChangeTableComponent extends React.PureComponent {
  render() {
    const {
      newTableNumber,
      setNewTableNumber,
      onChangeTable,
      onReprintOrder,
      onCloseTable,
    } = this.props;
      strings.setLanguage(currentLanguage().companyLanguage);

    return (
      <Container>
        <Header>
          <Left>
            <Text style={styles.leftText}>Order Info</Text>
          </Left>
          <Body />
          <Right>
            <Button transparent onPress={onCloseTable}>
              <Icon name="close" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Item regular style={styles.item}>
            <Input
              placeholder={strings.TableNumber}
              value={newTableNumber}
              onChangeText={setNewTableNumber}
            />
          </Item>
          <View style={{ flexDirection: "row" }}>
            <Button onPress={onChangeTable}>
              <Text>{strings.ChangeTable}</Text>
            </Button>
            <Button style={{ marginLeft: 20 }} onPress={onReprintOrder}>
              <Text>{strings.ReprintOrder}</Text>
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
