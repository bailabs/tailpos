import * as React from "react";

import ReceiptListing from "@screens/ReceiptListing";

export default class ReceiptListingContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ReceiptListing navigation={this.props.navigation} />;
  }
}
