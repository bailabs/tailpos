import * as React from "react";
import { Alert } from "react-native";
import { observer, inject } from "mobx-react/native";
import { NavigationActions } from "react-navigation";
import SplashScreen from "react-native-splash-screen";
import { BluetoothStatus } from "react-native-bluetooth-status";
import Pin from "@screens/Pin";
import { currentLanguage } from "../../translations/CurrentLanguage";

import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
@inject("attendantStore", "shiftStore", "receiptStore","printerStore")
@observer
export default class PinContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }
  componentWillMount() {
    this.getBluetoothState();
  }

  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if (isEnabled) {
      BluetoothStatus.disable(true);
    }
  }
  componentDidMount() {
    SplashScreen.hide();
  }

  onFulfill(isValid) {
    if (isValid) {
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "Drawer" })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      Alert.alert(strings.PINError, strings.PleaseEnterTheCorrectPINNumber);
    }
  }

  onNext() {
    const { defaultAttendant } = this.props.attendantStore;

    if (defaultAttendant) {
      this.setState({ selected: true });
    } else {
      Alert.alert(strings.NoAttendant, strings.PleaseSelectAnyAttendant);
    }
  }

  async onAttendantChange(attendant, index) {
    const currentAttendant = await this.props.attendantStore.find(attendant);

    this.props.attendantStore.setAttendant(currentAttendant);
  }

  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
    const att = !this.props.attendantStore.defaultAttendant
      ? ""
      : this.props.attendantStore.defaultAttendant._id;

    const pin_code = !this.props.attendantStore.defaultAttendant
      ? ""
      : this.props.attendantStore.defaultAttendant.pin_code;

    return (
      <Pin
        code={pin_code}
        currentAttendant={att}
        onNext={() => this.onNext()}
        selected={this.state.selected}
        onFulfill={isValid => this.onFulfill(isValid)}
        attendants={this.props.attendantStore.rows
          .slice()
          .filter(e => e.canLogin)}
        onAttendantChange={(attendant, index) =>
          this.onAttendantChange(attendant, index)
        }
      />
    );
  }
}
