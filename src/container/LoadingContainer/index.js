import * as React from "react";
import { inject, observer } from "mobx-react/native";
import { NavigationActions } from "react-navigation";

import Loading from "@screens/Loading";

@inject(
  "tokenStore",
  "categoryStore",
  "discountStore",
  "paymentStore",
  "itemStore",
  "receiptStore",
  "customerStore",
  "attendantStore",
  "shiftStore",
)
@observer
export default class LoadingContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.attendantStore.getData().then(res => {
      let routeName = "";
      if (res.result || res.rowsLength > 0) {
        routeName = "Pin";
      } else {
        routeName = "Login";
      }
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: routeName })],
      });

      this.props.navigation.dispatch(resetAction);
    });
  }

  render() {
    return <Loading />;
  }
}
