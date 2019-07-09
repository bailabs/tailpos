import * as React from "react";
import { Content, Form, Item, Input } from "native-base";
import { Text, StyleSheet } from "react-native";
import { currentLanguage } from "../../../translations/CurrentLanguage";

import ButtonComponent from "@components/ButtonComponent";
import ColorShapeInput from "@components/ColorShapeInputComponent";
import IdleComponent from "@components/IdleComponent";
import translation from "../../../translations/translation";
import LocalizedStrings from "react-native-localization";
let strings = new LocalizedStrings(translation);
export default class InputCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      status: "category",
      colorAndShape: [{ color: "gray", shape: "square" }],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    if (data) {
      // the state is dependent on the props unless data is null
      this.setState({
        name: data.name,
        colorAndShape: JSON.parse(data.colorAndShape),
      });
    }
  }

  clear = () => {
    this.setState({
      name: "",
      colorAndShape: [{ color: "gray", shape: "square" }],
    }); // doesn't work if props is present (read more below)
  };

  onChangeName = name => {
    this.setState({ name });
  };

  onChangeColor = color => {
    const { shape } = this.state.colorAndShape[0];
    this.setState({
      colorAndShape: [{ color, shape }],
    });
  };

  onAdd = () => {
    this.props.onAdd(this.state);
    this.clear();
  };

  onEdit = () => {
    this.props.onEdit(this.state);
    this.clear();
  };

  onCancel = () => {
    this.props.onCancel();
    this.clear();
  };

  render() {
    strings.setLanguage(currentLanguage().companyLanguage);
    if (this.props.status === "idle") {
      return <IdleComponent type="Category" onPress={this.props.onIdleClick} />;
    } else {
      return (
        <Content padder>
          <Form>
            <Text style={styles.text}>{strings.CategoryName}</Text>
            <Item regular style={styles.item}>
              <Input
                value={this.state.name}
                placeholder={strings.CategoryName}
                onChangeText={this.onChangeName}
              />
            </Item>
            <ColorShapeInput
              status={this.state.status}
              value={this.state.colorAndShape}
              onChangeColor={this.onChangeColor}
            />
            <Text style={styles.helpText}>
              {
                strings.ColorWillApplyToAllItemsUnderThisCategoryForWhichColorIsNotSet
              }
            </Text>
          </Form>
          <ButtonComponent
            text={strings.Category}
            status={this.props.status}
            onAdd={this.onAdd}
            onEdit={this.onEdit}
            onCancel={this.onCancel}
          />
        </Content>
      );
    }
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  item: {
    width: "50%",
    marginBottom: 10,
  },
  helpText: {
    fontSize: 21,
    color: "#afafaf",
    fontStyle: "italic",
  },
});
