/**
 * Created by jan on 4/20/18.
 * Last modified by Iva
 */
import * as React from "react";
import { Dimensions, View } from "react-native";
import {
    Text,
    Input,
    Button,
    Item,
    Picker,
    Grid,
    Col,
    CheckBox,
} from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class AddAttendantComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            attendantName: "",
            pin: "",
            confirmPin: "",
            securityPinStatus: true,
            securityConfirmPinStatus: true,
            status: "Save Attendant",
            role: "Owner",
            canLogin: false,
            commission: "",
        };
    }
    componentWillReceiveProps(nextProps) {
        const { attendantInfo } = nextProps;
        if (attendantInfo._id) {
            this.setState({ status: "Edit Attendant" });
        }
        if (attendantInfo.user_name || attendantInfo.attendantName) {
            this.setState({
                id: attendantInfo._id
                    ? attendantInfo._id
                    : attendantInfo.id
                        ? attendantInfo.id
                        : "",
                attendantName: attendantInfo.user_name
                    ? attendantInfo.user_name
                    : attendantInfo.attendantName
                        ? attendantInfo.attendantName
                        : "",
                role: attendantInfo.role
                    ? attendantInfo.role
                    : attendantInfo.role
                        ? attendantInfo.role
                        : "Cashier",
                pin: attendantInfo.pin_code
                    ? attendantInfo.pin_code
                    : attendantInfo.pin
                        ? attendantInfo.pin
                        : "",
                confirmPin: attendantInfo.pin_code
                    ? attendantInfo.pin_code
                    : attendantInfo.confirmPin
                        ? attendantInfo.confirmPin
                        : "",
                securityPinStatus: true,
                securityConfirmPinStatus: true,
                canLogin: attendantInfo.canLogin,
                commission: attendantInfo.commission.toString(),
            });
        } else {
            this.setState({
                id: "",
                attendantName: "",
                pin: "",
                confirmPin: "",
                securityPinStatus: true,
                securityConfirmPinStatus: true,
                status: "Save Attendant",
                role: "Owner",
                canLogin: false,
                commission: "",
            });
        }
    }
    render() {
        const rolesData = this.props.rolesData.map(roles => (
            <Picker.Item label={roles.role} value={roles.role} key={roles.role} />
        ));
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
                    value={this.state.attendantName}
                    onChangeText={text => this.setState({ attendantName: text })}
                    placeholder="Attendant Name"
                />
              </Item>
                {/*<Item*/}
                {/*regular*/}
                {/*style={{*/}
                {/*marginTop: 10,*/}
                {/*height: Dimensions.get("window").height * 0.8 * 0.09,*/}
                {/*width: Dimensions.get("window").width * 0.7 * 0.48,*/}
                {/*}}*/}
                {/*>*/}
                {/*<Input*/}
                {/*editable={false}*/}
                {/*value="Cashier"*/}
                {/*onChangeText={text => this.setState({ attendantName: text })}*/}
                {/*/>*/}
              <Picker
                  mode="dropdown"
                  textStyle={{ borderWidth: 1 }}
                  selectedValue={this.state.role}
                  onValueChange={value => this.setState({ role: value })}
              >
                  {rolesData}
              </Picker>
                {this.state.role !== "Owner" ? (
                    <Item>
                        <Input
                            value={this.state.commission}
                            keyboardType="numeric"
                            onChangeText={text => this.setState({ commission: text })}
                            placeholder="Commission"
                        />
                        <Icon name="percent" size={21} />
                    </Item>
                ) : null}
              <Item style={{ width: Dimensions.get("window").width * 0.7 * 0.48 }}>
                <Grid>
                  <Col
                      style={{
                          width: Dimensions.get("window").width * 0.7 * 0.48 * 0.2,
                          alignItems: "flex-start",
                          justifyContent: "center",
                      }}
                  >
                    <CheckBox
                        checked={this.state.canLogin}
                        onPress={() =>
                            this.setState({
                                canLogin: !this.state.canLogin,
                            })
                        }
                        color="gray"
                    />
                  </Col>

                  <Col
                      style={{
                          alignItems: "flex-start",
                          justifyContent: "center",
                      }}
                  >
                    <Text>Can login</Text>
                  </Col>
                </Grid>
              </Item>

                {/*</Item>*/}
                {this.state.canLogin ? (
                    <Item
                        regular
                        style={{
                            marginTop: 10,
                            borderColor: this.state.pin ? "black" : "red",
                            height: Dimensions.get("window").height * 0.8 * 0.09,
                            width: Dimensions.get("window").width * 0.7 * 0.48,
                        }}
                    >
                      <Input
                          value={this.state.pin}
                          keyboardType="numeric"
                          onChangeText={text => this.setState({ pin: text })}
                          placeholder="Pin"
                          secureTextEntry={this.state.securityPinStatus}
                      />
                      <Icon
                          active
                          name={this.state.securityPinStatus ? "eye-off" : "eye"}
                          size={30}
                          onPress={() =>
                              this.setState({
                                  securityPinStatus: !this.state.securityPinStatus,
                              })
                          }
                      />
                    </Item>
                ) : null}
                {this.state.canLogin ? (
                    <Item
                        regular
                        style={{
                            marginTop: 10,
                            borderColor: this.state.confirmPin ? "black" : "red",
                            height: Dimensions.get("window").height * 0.8 * 0.09,
                            width: Dimensions.get("window").width * 0.7 * 0.48,
                        }}
                    >
                      <Input
                          keyboardType="numeric"
                          value={this.state.confirmPin}
                          onChangeText={text => this.setState({ confirmPin: text })}
                          placeholder="Confirm Pin"
                          secureTextEntry={this.state.securityConfirmPinStatus}
                      />
                      <Icon
                          active
                          name={this.state.securityConfirmPinStatus ? "eye-off" : "eye"}
                          size={30}
                          onPress={() =>
                              this.setState({
                                  securityConfirmPinStatus: !this.state
                                      .securityConfirmPinStatus,
                              })
                          }
                      />
                    </Item>
                ) : null}

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
                        if (this.state.status === "Save Attendant") {
                            this.props.onSave(this.state);
                        } else if (this.state.status === "Edit Attendant") {
                            this.props.onEdit(this.state);
                        }
                    }}
                >
                    {this.state.status === "Save Attendant" ? (
                        <Text
                            style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                        >
                            {this.state.status}
                        </Text>
                    ) : this.state.status === "Edit Attendant" ? (
                        <Text
                            style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                        >
                            {this.state.status}
                        </Text>
                    ) : null}
                </Button>
              </View>
            </View>
        );
    }
}

export default AddAttendantComponent;
