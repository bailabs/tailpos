import { types } from "mobx-state-tree";
import { sales, listing, login, payment, settings } from "./DefaultValues";
import {
  ModelSales,
  ModelListing,
  ModelLogin,
  ModelPayment,
  ModelSettings,
} from "./Models";

export const Sales = types.model("Sales", ModelSales);
export const Listing = types.model("Listing", ModelListing);
export const Login = types.model("Login", ModelLogin);
export const Payment = types.model("Payment", ModelPayment);
export const Settings = types.model("Settings", ModelSettings);

const StateStore = types
  .model("StateStore", {
    sales_state: types.optional(types.array(Sales), []),
    listing_state: types.optional(types.array(Listing), []),
    login_state: types.optional(types.array(Login), []),
    payment_state: types.optional(types.array(Payment), []),
    settings_state: types.optional(types.array(Settings), []),

    // Value from payment state
    payment_value: types.optional(types.string, "0"),
    amount_due: types.optional(types.string, "0.00"),
  })
  .actions(self => ({
    initializeState() {
      self.sales_state.push(sales);
      self.listing_state.push(listing);
      self.login_state.push(login);
      self.payment_state.push(payment);
      self.settings_state.push(settings);
    },
    setDefaultValues(containerName, objectValue) {
      let containerNameValue = "";
      if (containerName === "Sales") {
        containerNameValue = self.sales_state;
      } else if (containerName === "Listing") {
        containerNameValue = self.listing_state;
      } else if (containerName === "Login") {
        containerNameValue = self.login_state;
      } else if (containerName === "Payment") {
        containerNameValue = self.payment_state;
      } else if (containerName === "Settings") {
        containerNameValue = self.settings_state;
      }
      Object.keys(containerNameValue[0]).forEach(function(key) {
        Object.keys(objectValue).forEach(function(key1) {
          if (key === key1) {
            containerNameValue[0][key] = objectValue[key1];
          }
        });
      });
    },
    changeValue(fieldName, value, containerName) {
      let containerNameValue = "";
      if (containerName === "Sales") {
        containerNameValue = self.sales_state;
      } else if (containerName === "Listing") {
        containerNameValue = self.listing_state;
      } else if (containerName === "Login") {
        containerNameValue = self.login_state;
      } else if (containerName === "Payment") {
        containerNameValue = self.payment_state;
      } else if (containerName === "Settings") {
        containerNameValue = self.settings_state;
      }

      Object.keys(containerNameValue[0]).forEach(function(key) {
        if (key === fieldName) {
          containerNameValue[0][key] = value;
        }
      });
    },
    setPaymentValue(value) {
      self.payment_value = value;
    },
    setAmountDue(value) {
      self.amount_due = value;
    },
  }));

const Store = StateStore.create({});

export default Store;
