import * as React from "react";
import { Content, Form, Item, Input } from "native-base";
import { Dimensions, Text } from "react-native";

import ButtonComponent from "@components/ButtonComponent";
import ColorShapeInput from "@components/ColorShapeInputComponent";
import IdleComponent from "@components/IdleComponent";

export default class InputCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      colorAndShape: [{ color: "gray", shape: "square" }],
      status: "category",
    };
  }

  clear() {
    this.setState({
      name: "",
      colorAndShape: [{ color: "gray", shape: "square" }],
    }); // doesn't work if props is present (read more below)
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

  render() {
    if (this.props.status === "idle") {
      return (
        <IdleComponent
          type="Category"
          onPress={() => this.props.onIdleClick()}
        />
      );
    } else {
      return (
        <Content padder>
          <Form>
            <Text
              style={{ fontWeight: "bold", marginBottom: 10, color: "black" }}
            >
              Category Name
            </Text>
            <Item regular style={{ marginBottom: 10, width: 400 }}>
              <Input
                placeholder="Category Name"
                value={this.state.name}
                onChangeText={text => this.setState({ name: text })}
              />
            </Item>
            <ColorShapeInput
              status={this.state.status}
              value={this.state.colorAndShape}
              onChangeColor={text =>
                this.setState({
                  colorAndShape: [
                    { color: text, shape: this.state.colorAndShape[0].shape },
                  ],
                })
              }
            />
            <Text
              style={{
                fontStyle: "italic",
                fontSize: Dimensions.get("window").height * 0.031,
                color: "grey",
              }}
            >
              Color will apply to all items under this categeory for which color
              is not set
            </Text>
          </Form>
          <ButtonComponent
            status={this.props.status}
            onAdd={() => {
              this.props.onAdd(this.state);
              this.clear();
            }}
            onEdit={() => {
              this.props.onEdit(this.state);
              this.clear();
            }}
            onCancel={() => {
              this.props.onCancel();
              this.clear();
            }}
            text="Category"
          />
        </Content>
      );
    }
  }
}
