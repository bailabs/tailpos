import * as React from "react";
import { inject, observer } from "mobx-react/native";
import { NavigationActions } from "react-navigation";

import Loading from "@screens/Loading";

@inject("attendantStore")
@observer
export default class LoadingContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.attendantStore.getData().then(res => {
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "Pin" })],
      });
      this.props.navigation.dispatch(resetAction);
    });
  }

  render() {
    return <Loading />;
  }
}
