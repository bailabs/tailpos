import * as React from "react";
import { Image, View, Dimensions, Alert } from "react-native";
import { Text, Container, List, ListItem, Content } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Orientation from "react-native-orientation";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);


export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayImage: false };
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    if (initial === "LANDSCAPE") {
      this.setState({ displayImage: true });
    } else {
      setTimeout(() => {
        this.setState({ displayImage: true });
      }, 1500);
    }
  }

  displayImage() {
    if (this.state.displayImage) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 0.5,
            borderColor: "#c9c9c9",
          }}
        >
          <Image
            style={{
              width: Dimensions.get("window").width * 0.35,
              height: Dimensions.get("window").height * 0.35,
            }}
            source={{ uri: "logo" }}
          />
        </View>
      );
    } else {
      return <View />;
    }
  }

  confirmLogout() {
    Alert.alert(
      strings.ConfirmLogout,
      strings.AreYouSureYouWantToLogout,
      [
        { text: strings.Cancel },
        {
          text: strings.Logout,
          onPress: () => this.props.onLogoutClick(),
        },
      ],
      { cancelable: false },
    );
  }
  render() {
      strings.setLanguage(currentLanguage().companyLanguage);
      const routes = [
          {
              route: "Sales",
              caption: strings.Sales,
              icon: "cart-plus",
          },
          {
              route: "Receipts",
              caption: strings.Receipts,
              icon: "file",
          },
          {
              route: "Listing",
              caption: strings.Listings,
              icon: "list-ul",
          },
          {
              route: "Shift",
              caption: strings.Shift,
              icon: "clock-o",
          },
          {
              route: "ShiftReports",
              caption: strings.ShiftReports,
              icon: "clock-o",
          },
          {
              route: "Settings",
              caption: strings.Settings,
              icon: "cog",
          },
          {
              route: "Pin",
              caption: strings.LogoutAttendant,
              icon: "arrow-right",
          },
      ];
    return (
      <Container>
        {this.displayImage()}
        <Content>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => {
                    if (data.route === "Pin") {
                      this.confirmLogout();
                    } else if (data.route === "Listing") {
                      this.props.onListingClick();
                    } else {
                      this.props.navigation.navigate(data.route);
                    }
                  }}
                  style={{ paddingLeft: 17, marginLeft: 0 }}
                >
                  <Icon name={data.icon} size={25} color="#203c38" />
                  <Text
                    style={{
                      color: "#203c38",
                      paddingLeft: 8,
                      fontWeight: "bold",
                    }}
                  >
                    {data.caption}
                  </Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
