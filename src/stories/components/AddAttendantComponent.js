import * as React from "react";
import { Dimensions, View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card, CardItem } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AttendantList from "@components/AttendantListComponent";
import AttendantsForm from "@components/AttendantsFormComponent";
import RolesList from "../../stories/components/RoleListComponent";
import AddRoles from "../../stories/components/AddRoleComponent";

class AddAttendantComponent extends React.PureComponent {
  onChangeStatus = () => {
    const { onChangeRoleStatus, roleStatus } = this.props;
    onChangeRoleStatus(
      roleStatus === "Role" ? "Attendant" : "Role"
    );
  }

  renderAttendant() {
    const {
      attendantsData,
      onDeleteAttendant,
      onClickAttendant,
      rolesData,
      onEdit,
      onSave,
      attendantsInfo,
    } = this.props;

    return (
      <CardItem>
        <AttendantList
          attendantsData={attendantsData}
          onClickAttendant={onClickAttendant}
          onDeleteAttendant={onDeleteAttendant}
        />
        <AttendantsForm
          onEdit={onEdit}
          onSave={onSave}
          rolesData={rolesData}
          attendantInfo={attendantsInfo}
        />
      </CardItem>
    );
  }

  renderRole() {
    const {
      rolesData,
      onClickRole,
      onDeleteRoles,
      selectedRole,
      onAddRoles,
    } = this.props;

    return (
      <CardItem>
        <RolesList
          rolesData={rolesData}
          onClickRole={onClickRole}
          onDeleteRoles={onDeleteRoles}
        />
        <AddRoles
          onAddRoles={onAddRoles}
          selectedRole={selectedRole}
        />
      </CardItem>
    );
  }

  render() {
    const {
      roleStatus,
    } = this.props;

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col>
                <Text style={styles.titleText}>
                  Attendant
                </Text>
              </Col>
              <Col>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={this.onChangeStatus}
                >
                  <Icon name="plus-circle-outline" size={30} color="white" />
                  <Text style={styles.buttonText}>
                    Add {roleStatus}
                  </Text>
                </TouchableOpacity>
              </Col>
            </Grid>
          </CardItem>
          {
            roleStatus === "Role"
              ? this.renderAttendant()
              : this.renderRole()
          }
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
  },
  cardItem: {
    marginBottom: 15,
    backgroundColor: "#4b4c9d",
  },
  titleText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.02,
  },
  headerButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  buttonText: {
    marginLeft: 5,
    color: "white",
    textAlignVertical: "center",
  },
});

export default AddAttendantComponent;
