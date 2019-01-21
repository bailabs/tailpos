// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";

import SetOwnerPin from "@screens/SetOwnerPin";

@inject(
  "categoryStore",
  "discountStore",
  "itemStore",
  "taxesStore",
  "printerStore",
)
@observer
export default class SetOwnerPinContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      confirmPin: "",
    };
  }
  render() {
    return (
      <SetOwnerPin
        values={this.state}
        onChangePin={text => this.setState({ pin: text })}
        onChangeConfirmPin={text => this.setState({ confirmPin: text })}
        navigation={this.props.navigation}
      />
    );
  }
}
