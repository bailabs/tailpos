import * as React from "react";
import { Container, Content, Spinner } from "native-base";

import styles from "./styles";

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.contentContainer}>
          <Spinner color="white" />
        </Content>
      </Container>
    );
  }
}
