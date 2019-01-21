/**
 * Created by jan on 4/20/18.
 * Last modified by Iva
 */
import * as React from "react";
import { Dimensions, View } from "react-native";
import { Text, Input, Button, Item } from "native-base";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class AddRoleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      id: "",
      status: "Add",
    };
  }
  componentWillReceiveProps(nextProps) {
    const { selectedRole } = nextProps;
    if (selectedRole) {
      this.setState({
        id: selectedRole._id ? selectedRole._id : "",
        status: "Edit",
        role: selectedRole.role ? selectedRole.role : "",
      });
    }
  }
  render() {
    return (
      <View
        style={{
          marginLeft: 10,
          width: Dimensions.get("window").width * 0.7 * 0.45,
          height: Dimensions.get("window").height * 0.8 * 0.8,
        }}
      >
        <Item
          regular
          style={{
            marginTop: 10,
            borderColor: this.state.attendantName ? "black" : "red",
            height: Dimensions.get("window").height * 0.8 * 0.09,
            width: Dimensions.get("window").width * 0.7 * 0.48,
          }}
        >
          <Input
            value={this.state.role}
            onChangeText={text => this.setState({ role: text })}
            placeholder="Role"
          />
        </Item>
        <View
          style={{
            marginTop: 10,
            height: Dimensions.get("window").height * 0.8 * 0.09,
            width: Dimensions.get("window").width * 0.7 * 0.48,
          }}
        >
          <Button
            block
            success
            onPress={() => {
              const role = this.state;
              this.setState({ role: "" });
              this.props.onAddRoles(role);
            }}
          >
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>
              Add Role
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default AddRoleComponent;
