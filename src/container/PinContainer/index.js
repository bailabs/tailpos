import * as React from "react";
import { Alert } from "react-native";
import { observer, inject } from "mobx-react/native";
import { NavigationActions } from "react-navigation";
import SplashScreen from "react-native-splash-screen";
import { BluetoothStatus } from "react-native-bluetooth-status";
import Pin from "@screens/Pin";

@inject("attendantStore", "shiftStore", "receiptStore")
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
      Alert.alert("PIN Error", "Please enter the correct PIN number.");
    }
  }

  onNext() {
    const { defaultAttendant } = this.props.attendantStore;

    if (defaultAttendant) {
      this.setState({ selected: true });
    } else {
      Alert.alert("No Attendant", "Please select any attendant!");
    }
  }

  async onAttendantChange(attendant, index) {
    const currentAttendant = await this.props.attendantStore.find(attendant);

    this.props.attendantStore.setAttendant(currentAttendant);
  }

  render() {
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
