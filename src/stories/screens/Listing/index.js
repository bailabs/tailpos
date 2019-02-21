import * as React from "react";
import {
  Container,
  Header,
  Tab,
  Tabs,
  Left,
  Body,
  Title,
  Right,
} from "native-base";
import { Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import SearchComponent from "@components/SearchComponent";

// Style
import styles from "./styles";

// TODO: Make a future utils for measuring boys
export default class ItemListing extends React.PureComponent {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get("window");
    this.state = { width, height };
  }

  /**
   * Update the state width and height for responsiveness.
   */
  onLayout() {
    const { width, height } = Dimensions.get("window");
    this.setState({ width, height });
  }

  render() {
    return (
      <Container style={styles.container} onLayout={() => this.onLayout()}>
        {this.props.itemMaintenanceStatus ? (
          <SearchComponent
            status="Item"
            onChangeText={text => this.props.onChangeText(text)}
            itemMaintenanceStatusChange={text =>
              this.props.itemMaintenanceStatusChange(text)
            }
          />
        ) : (
          <Header hasTabs style={{ backgroundColor: "#4B4C9D" }}>
            <Left>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
              >
                <Icon
                  name="bars"
                  size={25}
                  color="white"
                  style={{ paddingLeft: 5 }}
                />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 3 }}>
              <Title>Listing</Title>
            </Body>
            {this.props.tabStatus === 0 ? (
              <Right>
                <TouchableOpacity
                  onPress={() => this.props.itemMaintenanceStatusChange(true)}
                >
                  <Icon name="search" size={30} style={{ color: "white" }} />
                </TouchableOpacity>
              </Right>
            ) : (
              <Right />
            )}
          </Header>
        )}

        <Tabs
          initialPage={0}
          onChangeTab={({ i, ref, from }) =>
            this.props.changeTabStatus(i.toString())
          }
        >
          <Tab
            heading="Items"
            tabStyle={{ backgroundColor: "#4B4C9D" }}
            activeTabStyle={{ backgroundColor: "#4B4C9D" }}
            textStyle={{ color: "white" }}
            activeTextStyle={{ color: "white" }}
          >
            {this.props.itemTab}
          </Tab>
          <Tab
            heading="Categories"
            tabStyle={{ backgroundColor: "#4B4C9D" }}
            activeTabStyle={{ backgroundColor: "#4B4C9D" }}
            textStyle={{ color: "white" }}
            activeTextStyle={{ color: "white" }}
          >
            {this.props.categoryTab}
          </Tab>
          <Tab
            heading="Discounts"
            tabStyle={{ backgroundColor: "#4B4C9D" }}
            activeTabStyle={{ backgroundColor: "#4B4C9D" }}
            textStyle={{ color: "white" }}
            activeTextStyle={{ color: "white" }}
          >
            {this.props.discountTab}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
