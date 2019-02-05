import Frappe from "react-native-frappe-fetch";
var validUrl = require("valid-url");
import { Toast } from "native-base";

module.exports.syncData = function(url, credentials) {
  const { username, password } = credentials;

  if (validUrl.isWebUri(url.toLowerCase())) {
    return Frappe.createClient({ url, username, password })
      .then(res => {
        Frappe.Client.postApi("tailpos_sync.sync");
      })
      .then(res => {
        res.json();
      })
      .then(res => {
        res.message;
      });
  } else {
    Toast.show({
      text: "Invalid URL",
      type: "danger",
      duration: 5000,
    });
  }
};
