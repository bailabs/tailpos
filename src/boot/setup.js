import * as React from "react";
import { Provider } from "mobx-react/native";
import { StyleProvider } from "native-base";
import Orientation from "react-native-orientation";
import BackgroundJob from "react-native-background-job";
import config from "./configureStore";
import { syncObjectValues } from "../store/PosStore/syncInBackground";

import App from "../App";
import getTheme from "../theme/components";
import variables from "../theme/variables/platform";

const stores2 = config();
const backgroundJob = {
  jobKey: "myJob",
  job: () => syncObjectValues("sync", stores2, true),
};
BackgroundJob.register(backgroundJob);
var backgroundSchedule = {
  jobKey: "myJob",
  period: 360000,
  allowExecutionInForeground: true,
  networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
};
BackgroundJob.schedule(backgroundSchedule);

export default function(stores) {
  return class Setup extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      Orientation.lockToLandscape();
    }
    render() {
      return (
        <StyleProvider style={getTheme(variables)}>
          <Provider {...stores}>
            <App />
          </Provider>
        </StyleProvider>
      );
    }
  };
}
