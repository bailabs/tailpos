import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Input, Button, Item } from "native-base";

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
        status: "Edit",
        id: selectedRole._id ? selectedRole._id : "",
        role: selectedRole.role ? selectedRole.role : "",
      });
    }
  }

  onChangeRole = (role) => {
    this.setState({ role });
  }

  onAddRole = () => {
    const role = this.state;
    this.setState({ role: "" });
    this.props.onAddRoles(role);
  }

  render() {
    const { attendantName, role } = this.state;
    return (
      <View style={styles.view}>
        <Item regular style={{ borderColor: attendantName ? "black" : "red" }}>
          <Input
            value={role}
            placeholder="Role"
            onChangeText={this.onChangeRole}
          />
        </Item>
        <Button
          block
          success
          style={styles.button}
          onPress={this.onAddRole}
        >
          <Text style={styles.buttonText}>
            Add Role
          </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: "50%",
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  button: {
    marginTop: 15,
  },
});

export default AddRoleComponent;
