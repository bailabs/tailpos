// @flow
import React from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./container/LoginContainer";
import Signup from "./container/SignupContainer";
import Sales from "./container/SalesContainer";
import Sidebar from "./container/SidebarContainer";
import Receipts from "./container/ReceiptsContainer";
import Settings from "./container/SettingsContainer";
import Payment from "./container/PaymentContainer";
import ReceiptInfo from "./container/ReceiptInfoContainer";
import Loading from "./container/LoadingContainer";
import LostPassword from "./container/LostPasswordContainer";
import Listing from "./container/ListingContainer";
import Shift from "./container/ShiftContainer";
import ShiftReports from "./container/ShiftReportsContainer";
import ShiftInfo from "./container/ShiftInfoContainer";
import Pin from "./container/PinContainer";
import SetOwnerPin from "./container/SetOwnerPinContainer";
// import ReceiptListing from "./container/ReceiptListingContainer";

const Drawer = DrawerNavigator(
  {
    Sales: { screen: Sales },
    Receipts: { screen: Receipts },
    Settings: { screen: Settings },
    Listing: { screen: Listing },
    Shift: { screen: Shift },
    ShiftReports: { screen: ShiftReports },
  },
  {
    contentComponent: props => <Sidebar {...props} />,
  },
);

const App = StackNavigator(
  {
    Pin: { screen: Pin },
    Login: { screen: Login },
    SetOwnerPin: { screen: SetOwnerPin },
    Signup: { screen: Signup },
    Drawer: { screen: Drawer },
    Payment: { screen: Payment },
    ReceiptInfo: { screen: ReceiptInfo },
    ShiftInfo: { screen: ShiftInfo },
    Loading: { screen: Loading },
    LostPassword: { screen: LostPassword },
  },
  {
    initialRouteName: "Loading",
    headerMode: "none",
  },
);

export default () => (
  <Root>
    <App />
  </Root>
);
