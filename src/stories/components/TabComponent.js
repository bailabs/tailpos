import * as React from "react";
import { Col, Grid } from "react-native-easy-grid";
import EntriesComponent from "./EntriesComponent";

const TabComponent = props => (
  <Grid>
    <Col style={{ backgroundColor: "#eee", width: "35%" }}>
      <EntriesComponent
        data={props.data}
        currency={props.currency}
        onPressItem={index => props.onClick(index)}
        onLongPressItem={index => props.onLongPress(index)}
        onEndReached={() => props.onEndReached()}
      />
    </Col>
    <Col style={{ width: "65%" }}>{props.children}</Col>
  </Grid>
);

export default TabComponent;
