import Frappe from "react-native-frappe-fetch";

module.exports.syncData = function(url, credentials) {
  const { username, password } = credentials;

  return Frappe.createClient({ url, username, password })
    .then(res => Frappe.Client.postApi("tailpos_sync.sync"))
    .then(res => res.json())
    .then(res => res.message);
};
