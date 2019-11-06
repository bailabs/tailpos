import * as React from "react";
import { Provider } from "mobx-react/native";
import { StyleProvider } from "native-base";
import Orientation from "react-native-orientation";
import config from "./configureStore";
import { background_job_initialization } from "./background_job";

import App from "../App";
import getTheme from "../theme/components";
import variables from "../theme/variables/platform";

const stores2 = config();
background_job_initialization(stores2);
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
