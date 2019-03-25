import * as React from "react";
import { Header, Left, Body, Right, Icon, Button } from "native-base";

class ViewOrderComponent extends React.PureComponent {
  render() {
    const { onCloseViewOrder } = this.props;
    return (
      <Header>
        <Left />
        <Body />
        <Right>
          <Button transparent onPress={onCloseViewOrder}>
            <Icon name="close" />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default ViewOrderComponent;
