/**
 * Created by jan on 4/20/18.
 * Last modified by Iva
 */
import * as React from "react";
import { Dimensions, View, TouchableOpacity } from "react-native";
import { Text, Card, CardItem } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AttendantList from "@components/AttendantListComponent";
import AttendantsForm from "@components/AttendantsFormComponent";
import RolesList from "../../stories/components/RoleListComponent";
import AddRoles from "../../stories/components/AddRoleComponent";

class AddAttendantComponent extends React.Component {
  render() {
    return (
      <View>
        <Card
          style={{
            height: Dimensions.get("window").height * 0.7,
            width: Dimensions.get("window").width * 0.7,
            alignSelf: "center",
          }}
        >
          <CardItem
            style={{
              backgroundColor: "#4B4C9D",
              height: Dimensions.get("window").height * 0.8 * 0.1,
            }}
          >
            <Grid>
              <Col
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.7 * 0.83,
                }}
              >
                <Text
                  style={{
                    fontSize: Dimensions.get("window").width * 0.02,
                    color: "white",
                  }}
                >
                  Attendant
                </Text>
              </Col>
            </Grid>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() =>
                this.props.onChangeRoleStatus(
                  this.props.roleStatus === "Role" ? "Attendant" : "Role",
                )
              }
            >
              <Icon name="plus-circle-outline" size={30} color="white" />

              <Text
                style={{
                  fontSize: Dimensions.get("window").width * 0.015,
                  color: "white",
                  marginLeft: 1,
                  marginRight: 10,
                }}
              >
                {" "}
                Add {this.props.roleStatus}
              </Text>
            </TouchableOpacity>
          </CardItem>
          {this.props.roleStatus === "Role" ? (
            <CardItem>
              <AttendantList
                onDeleteAttendant={values =>
                  this.props.onDeleteAttendant(values)
                }
                attendantsData={this.props.attendantsData}
                onClickAttendant={attendant =>
                  this.props.onClickAttendant(attendant)
                }
              />
              <AttendantsForm
                rolesData={this.props.rolesData}
                onEdit={values => {
                  this.setState({ attendant: {} });
                  this.props.onEdit(values);
                }}
                onSave={values => this.props.onSave(values)}
                attendantInfo={this.props.attendantsInfo}
              />
            </CardItem>
          ) : (
            <CardItem>
              <RolesList
                onClickRole={values => this.props.onClickRole(values)}
                rolesData={this.props.rolesData}
                onDeleteRoles={obj => this.props.onDeleteRoles(obj)}
              />
              <AddRoles
                selectedRole={this.props.selectedRole}
                onAddRoles={values => this.props.onAddRoles(values)}
              />
            </CardItem>
          )}
        </Card>
      </View>
    );
  }
}

export default AddAttendantComponent;
