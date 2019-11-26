import { Alert } from "react-native";
import NfcManager from "react-native-nfc-manager";
import { showToastDanger, showToast } from "../../utils";
import config from "../../boot/configureStore";
import { on_pay } from "./on_pay";
import { NetInfo } from "react-native";

import FrappeFetch from "react-native-frappe-fetch";
let validUrl = require("valid-url");
const stores = config();

export function nfc_initialization(props, deviceId) {
  NfcManager.isSupported().then(result => {
    if (result) {
      check_tagged_nfc_card(props, deviceId);
    } else {
      showToastDanger("Device does not support NFC");
    }
  });
}

export function check_tagged_nfc_card(props, deviceId) {
  NfcManager.isEnabled().then(status => {
    if (status) {
      register_tag_event(props, deviceId);
    } else {
      showToastDanger("NFC is disabled");
    }
  });
}

export function register_tag_event(props, deviceId) {
  const nfc_props = {
    invalidateAfterFirstRead: true,
    isReaderModeEnabled: true,
  };
  const message = "Scanning NFC Card";
  showToast("Please Scan Customer Card Now");
  NfcManager.registerTagEvent(
    tag => validate_tag_event(tag, props, deviceId),
    message,
    nfc_props,
  );
}

export function unregister_tag_event() {
  NfcManager.unregisterTagEvent();
}

export function set_attendant(props) {
  const { defaultReceipt } = props.receiptStore;
  const { defaultAttendant } = props.attendantStore;
  defaultReceipt.setAttendant(defaultAttendant.user_name);
}

export async function validate_tag_event(tag, props, deviceId) {
  set_attendant(props);
  check_internet_connection(tag, props, deviceId);
}

export async function check_internet_connection(tag, props, deviceId) {
  NetInfo.isConnected.fetch().then(async isConnected => {
    if (isConnected) {
      on_check_tag_event(tag, props, deviceId);
    } else {
      showToastDanger("No Internet Connection. Please Check");
    }
  });
}

export async function on_check_tag_event(tag, props, deviceId) {
  let scanned_nfc = JSON.parse(props.stateStore.scanned_nfc);
  if (!("customer" in scanned_nfc)) {
      check_customer_tag(tag, props, deviceId);
  } else if (!("attendant" in scanned_nfc) && props.stateStore.customers_pin_value) {
      check_attendant_tag(tag, props, deviceId);
  } else if (!("attendant" in scanned_nfc) && !props.stateStore.customers_pin_value){
      showToastDanger("Please enter customers pin first");
  }
}
export async function check_customers_pin(scanned_nfc, customers_pin, props, deviceId) {
  if (scanned_nfc) {
    if (validUrl.isWebUri(returnUrl().url)) {
      FrappeFetch.createClient(returnUrl())
        .then(() => {
          const { Client } = FrappeFetch;
          return Client.postApi(
            "tailpos_sync.wallet_sync.check_customers_pin",
            {
              wallet_card_number: scanned_nfc,
                customers_pin: customers_pin,
            },
          );
        })
        .catch(() => {})
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message.failed) {
            showToastDanger(responseJson.message.message);
          } else {
            showToast(responseJson.message.message);
              props.stateStore.is_customers_pin();
          }

        })
        .catch(() =>
          showToastDanger("Please check your credentials in Sync settings and Error Logs in ERPNext"),
        );
    } else {
      showToastDanger("Invalid URL. Please set valid URL in Sync Settings");
    }
  }
}
export async function check_attendant_tag(tag, props, deviceId) {
  if (tag) {
    if (validUrl.isWebUri(returnUrl().url)) {
      FrappeFetch.createClient(returnUrl())
        .then(() => {
          const { Client } = FrappeFetch;
          return Client.postApi(
            "tailpos_sync.wallet_sync.validate_if_attendant_wallet_exists",
            {
              wallet_card_number: tag.id,
            },
          );
        })
        .catch(() => {})
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message.failed) {
            showToastDanger(responseJson.message.message);
          } else {
            props.stateStore.updateScannedNfc("attendant", tag.id);

              proceed_to_validate_sync(props,deviceId);
          }
        })
        .catch(() =>
          showToastDanger("Please check your credentials in Sync settings and Error Logs in ERPNext"),
        );
    } else {
      showToastDanger("Invalid URL. Please set valid URL in Sync Settings");
    }
  }
}
export async function proceed_to_validate_sync(props, deviceId) {
    Alert.alert(
        "Confirm Wallet Transaction",
        "Are you sure you want to proceed wallet transaction?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes",onPress: () => { on_sync_tag_event(props.stateStore.scanned_nfc, props, deviceId); } },
        ]
    );
}
export async function check_customer_tag(tag, props,deviceId) {
  if (tag) {
    const { defaultReceipt } = stores.receiptStore;
    if (validUrl.isWebUri(returnUrl().url)) {
      FrappeFetch.createClient(returnUrl())
        .then(() => {
          const { Client } = FrappeFetch;
          return Client.postApi(
            "tailpos_sync.wallet_sync.validate_if_customer_wallet_exists",
            {
              wallet_card_number: tag.id,
              receipt: json_object(defaultReceipt),
            },
          );
        })

        .catch(() => {})
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message.failed){
              showToastDanger(responseJson.message.message);
          } else {
              props.stateStore.updateScannedNfc("customer", tag.id);
              showToast(responseJson.message.message);

          }
        })

        .catch(() =>
          showToastDanger("Please check your credentials in Sync settings and Error Logs in ERPNext"),
        );
    } else {
      showToastDanger("Invalid URL. Please set valid URL in Sync Settings");
    }
  }
}

export async function on_sync_tag_event(scanned_nfc, props, deviceId) {
  if (scanned_nfc) {
    const { defaultReceipt } = stores.receiptStore;
    if (validUrl.isWebUri(returnUrl().url)) {
      FrappeFetch.createClient(returnUrl())
        .then(() => {
          const { Client } = FrappeFetch;
          return Client.postApi("tailpos_sync.wallet_sync.validate_wallet", {
            wallet: scanned_nfc,
            receipt: json_object(defaultReceipt),
            device_id: deviceId,
          });
        })
        .catch(() => {})
        .then(response => response.json())
        .then(responseJson => {
          validate_return_from_server(responseJson.message, props);
        })
        .catch(() =>
          showToastDanger("Please check your credentials in Sync settings and Error Logs in ERPNext"),
        );
    } else {
      showToastDanger("Invalid URL. Please set valid URL in Sync Settings");
    }
  }
}

export function validate_return_from_server(data, props) {
  if (data.failed) {
    showToastDanger(data.message);
  } else {
    showToast("Wallet Scanned Successfully");

    stores.navigation = props.navigation;
    on_pay(stores);
  }
}
export function json_object(obj) {
  let receipt_json_object = {};
  Object.keys(obj).forEach(function(key) {
    if (!(key === "_id")) {
      receipt_json_object[key] = obj[key];
    }
  });

  return receipt_json_object;
}
export function returnUrl() {
  const { url, user_name, password, isHttps } = stores.printerStore.sync[0];

  const protocol = isHttps ? "https://" : "http://";
  let site_url = protocol + url;

  return {
    url: site_url.toLowerCase(),
    username: user_name,
    password: password,
  };
}
