import * as React from "react";
import { View } from "react-native";
import { Card, CardItem, Text, Button } from "native-base";
import translation from "../.././translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
const ReceiptComponent = props => (
  <Card
    style={{
      padding: 21,
    }}
  >
    <CardItem style={{ paddingBottom: 0 }}>
      <Text
        style={{
          fontWeight: "bold",
          color: "#5e5e5e",
          fontSize: 28,
          marginRight: 15,
        }}
      >
        {strings.PaymentReceipt}
      </Text>
      <Button>
        <Text>{strings.Cancel}</Text>
      </Button>
    </CardItem>
    <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          color: "gray",
          fontSize: 18,
        }}
      >
        {strings.TransactedOn} 08:24 AM
      </Text>
    </CardItem>
    <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          color: "gray",
          fontSize: 18,
        }}
      >
        February 14, 2018
      </Text>
    </CardItem>
    <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          fontSize: 18,
          color: "gray",
          textAlign: "center",
        }}
      >
        RE-004
      </Text>
    </CardItem>
    <CardItem>
      <Text
        style={{
          fontSize: 18,
          color: "gray",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Sold to Default Customer
      </Text>
    </CardItem>
    <CardItem
      style={{
        flexDirection: "column",
        borderTopWidth: 0.5,
        borderColor: "gray",
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          color: "#7f7f7f",
        }}
      >
        Items
      </Text>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{ fontWeight: "bold", fontSize: 18, flex: 0.5, color: "gray" }}
        >
          Apple iPhone X
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            flex: 0.15,
            color: "gray",
          }}
        >
          Each
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            flex: 0.35,
            color: "#5f5f5f",
            textAlign: "right",
          }}
        >
          1 x P50,000.00
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{ fontWeight: "bold", fontSize: 18, flex: 0.5, color: "gray" }}
        >
          Samsung Face In Your X
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            flex: 0.15,
            color: "gray",
          }}
        >
          Each
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            flex: 0.35,
            color: "#5f5f5f",
            textAlign: "right",
          }}
        >
          1 x P50,000.00
        </Text>
      </View>
    </CardItem>
    <CardItem
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        borderTopWidth: 0.5,
        borderColor: "gray",
        paddingBottom: 0,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        Total
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        P100,000.00
      </Text>
    </CardItem>
    <CardItem
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 0,
        paddingTop: 5,
      }}
    >
      <Text
        style={{
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        Discounts
      </Text>
      <Text
        style={{
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        P0.00
      </Text>
    </CardItem>
    <CardItem
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        paddingTop: 5,
      }}
    >
      <Text
        style={{
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        Discount Name
      </Text>
      <Text
        style={{
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        Next to you
      </Text>
    </CardItem>
    <CardItem
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        Grand Total
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: "#5e5e5e",
          fontSize: 18,
        }}
      >
        P100,000.00
      </Text>
    </CardItem>
  </Card>
);

export default ReceiptComponent;
