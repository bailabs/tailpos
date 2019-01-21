import * as React from "react";
import { Image, View, Dimensions, Alert } from "react-native";
import { Text, Container, List, ListItem, Content } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Orientation from "react-native-orientation";

const routes = [
  {
    route: "Sales",
    caption: "Sales",
    icon: "cart-plus",
  },
  {
    route: "Receipts",
    caption: "Receipts",
    icon: "file",
  },
  {
    route: "Listing",
    caption: "Listings",
    icon: "list-ul",
  },
  {
    route: "Shift",
    caption: "Shift",
    icon: "clock-o",
  },
  {
    route: "ShiftReports",
    caption: "Shift Reports",
    icon: "clock-o",
  },
  {
    route: "Settings",
    caption: "Settings",
    icon: "cog",
  },
  {
    route: "Pin",
    caption: "Logout Attendant",
    icon: "arrow-right",
  },
];

// const resetAction = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({
//       routeName: "Login",
//       params: { isLogout: true },
//     }),
//   ],
// });

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
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel" },
        {
          text: "Logout",
          onPress: () => this.props.onLogoutClick(),
        },
      ],
      { cancelable: false },
    );
  }

  render() {
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
