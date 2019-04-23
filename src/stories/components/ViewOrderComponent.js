import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Header,
  Left,
  Body,
  Right,
  Icon,
  Button,
  Container,
  Content,
  Spinner,
  Text,
} from "native-base";

import OrderItemComponent from "./OrderItemComponent";

class ViewOrderComponent extends React.PureComponent {
  renderOrderItem = ({ item, index }) => {
    const { onTableClick } = this.props;
    return (
      <OrderItemComponent
        index={index}
        id={item.id} // from db
        tableNo={item.table_no}
        isTakeAway={item.is_takeaway}
        onTableClick={onTableClick}
      />
    );
  };

  renderOrders() {
    const { orders } = this.props;

    if (orders.length === 0) {
      return (
        <View style={styles.helpView}>
          <Icon
            active
            name="list"
            style={[styles.center, styles.helpIcon]}
          />
          <Text style={[styles.center, styles.helpText]}>
            No orders yet
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        numColumns={2}
        renderItem={this.renderOrderItem}
      />
    );
  }

  render() {
    const { length, isLoadingOrder, onCloseViewOrder } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Text style={styles.leftText}>Orders ({length})</Text>
          </Left>
          <Body />
          <Right>
            <Button transparent onPress={onCloseViewOrder}>
              <Icon name="close" />
            </Button>
          </Right>
        </Header>
        <Content
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {isLoadingOrder ? <Spinner color="#4b4c9d" /> : this.renderOrders()}
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
  content: {
    paddingTop: 15,
  },
  contentContainer: {
    flex: 1,
  },
  helpIcon: {
    fontSize: 48,
    color: "#afafaf",
  },
  helpText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#afafaf",
  },
  helpView: {
    flex: 1,
    justifyContent: "center",
  },
  center: {
    textAlign: "center",
  }
});

export default ViewOrderComponent;
