import * as React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, Card, CardItem, Spinner } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Easy life
import EditInput from "./EditInputComponent";
import EditCheckBox from "./EditCheckBoxComponent";

class CompanyComponent extends React.PureComponent {
  onSync = () => this.props.sync("sync");
  onForceSync = () => this.props.sync("forceSync");
  onSyncEdit = () => this.props.onSyncEdit(true);

  renderSyncButtons() {
    const { url, user_name, password } = this.props;

    let component = null;

    if (url && user_name && password) {
      component = (
        <View style={styles.view}>
          <Button onPress={this.onSync}>
            <Text>Sync</Text>
          </Button>
          <Button style={styles.lastButton} onPress={this.onForceSync}>
            <Text>Force Sync</Text>
          </Button>
        </View>
      );
    }

    return component;
  }

  render() {
    const {
      url,
      user_name,
      password,
      syncEditStatus,
      onSyncSave,
      changeUrl,
      changeUserName,
      changePassword,
      isSyncing,
      isHttps,
      toggleIsHttps,
    } = this.props;

    const SyncStatus = isSyncing ? (
      <View style={styles.viewSync}>
        <Spinner color="#4B4C9D" />
        <Text style={styles.helpText}>Syncing ERPNext data</Text>
      </View>
    ) : null;

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Grid>
              <Col style={styles.col}>
                <Text style={styles.textHeader}>Sync Settings</Text>
              </Col>
              <Col>
                <View style={styles.viewRight}>
                  <TouchableOpacity onPress={this.onSyncEdit}>
                    <Icon name="pencil" size={30} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon
                      name="content-save"
                      size={30}
                      style={styles.icon}
                      onPress={onSyncSave}
                    />
                  </TouchableOpacity>
                </View>
              </Col>
            </Grid>
          </CardItem>
          {SyncStatus}
          <EditInput
            secure={false}
            value={url}
            disabled={!syncEditStatus}
            onChange={changeUrl}
            placeholder="https://erpnext.com"
            label="ERPNext Server"
          />
          <EditCheckBox
            label="Is HTTPs"
            checked={isHttps}
            onPress={toggleIsHttps}
          />
          <EditInput
            secure={false}
            value={user_name}
            disabled={!syncEditStatus}
            onChange={changeUserName}
            placeholder="Administrator"
            label="Username"
          />
          <EditInput
            secure={true}
            value={password}
            disabled={!syncEditStatus}
            onChange={changePassword}
            placeholder="Password"
            label="Password"
          />
          <CardItem>{this.renderSyncButtons()}</CardItem>
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
  col: {
    alignSelf: "center",
  },
  textHeader: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.02,
  },
  icon: {
    color: "white",
    marginLeft: 10,
  },
  view: {
    flexDirection: "row",
  },
  lastButton: {
    marginLeft: 10,
  },
  viewRight: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  viewSync: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  helpText: {
    marginLeft: 10,
  },
});

export default CompanyComponent;
