import NfcManager  from "react-native-nfc-manager";
import { showToastDanger } from "../../utils";
import config from "../../boot/configureStore";
import { on_pay } from "./on_pay";

import FrappeFetch from "react-native-frappe-fetch";
let validUrl = require("valid-url");
const stores = config();

export function nfc_initialization(props,deviceId) {
    NfcManager.isSupported()
        .then((result) => {

            if (result) {
                check_tagged_nfc_card(props,deviceId);

            } else {
                showToastDanger("Device does not support NFC");

            }

        });
}

export function check_tagged_nfc_card(props,deviceId) {
    NfcManager.isEnabled()
        .then(status => {
            if (status){
                register_tag_event(props,deviceId);
            } else {
                showToastDanger("NFC is disabled");
            }});
}

export function register_tag_event(props,deviceId) {
    const nfc_props = {invalidateAfterFirstRead: true, isReaderModeEnabled: true};
    const message = "Scanning NFC Card";
    NfcManager.registerTagEvent(tag => validate_tag_event(tag,props,deviceId), message, nfc_props);
}


export function unregister_tag_event() {
    NfcManager.unregisterTagEvent();
}
export function set_attendant(props) {
    const { defaultReceipt } = props.receiptStore;
    const { defaultAttendant } = props.attendantStore;
    defaultReceipt.setAttendant(defaultAttendant.user_name);
}
export async function validate_tag_event(tag, props,deviceId) {
    set_attendant(props);
   on_sync_tag_event(tag, props,deviceId);
}

export async function on_sync_tag_event(tag, props,deviceId) {
    if (tag){
        const { url, user_name, password } = stores.printerStore.sync[0];
        const { defaultReceipt } = stores.receiptStore;
        const protocol = stores.stateStore.isHttps ? "https://" : "http://";
        let site_url = protocol + url;

        const site_info = {
            url: site_url.toLowerCase(),
            username: user_name,
            password: password,
        };
        if (validUrl.isWebUri(site_url.toLowerCase())) {
            FrappeFetch.createClient(site_info).then(() => {
                const { Client } = FrappeFetch;
                return Client.postApi(
                    "tailpos_sync.wallet_sync.validate_customer_wallet",
                    {
                        wallet: tag.id,
                        receipt: json_object(defaultReceipt),
                        device_id: deviceId
                    },
                );
            })

                .catch(() => {})
                .then(response => response.json())
                .then(responseJson => {
                    validate_return_from_server(responseJson.message, props);
                });
        } else {
            showToastDanger("Invalid URL. Please set valid URL in Sync Settings");
        }

    }

}

export function validate_return_from_server(data, props){
    if (data.failed) {
        showToastDanger(data.message);
    } else {
        stores.navigation = props.navigation;
        on_pay(stores);
    }
}
export function json_object(obj){
    let receipt_json_object = {};
    Object.keys(obj).forEach(function(key) {
        if (!(key === "_id")) {
            receipt_json_object[key] = obj[key];
        }
    });


    return receipt_json_object;
}
