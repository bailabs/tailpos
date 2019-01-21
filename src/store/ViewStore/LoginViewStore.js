import { types } from "mobx-state-tree";
import DeviceInfo from "react-native-device-info";

const Login = types
  .model("List", {
    email: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    emailError: types.optional(types.string, ""),
    passwordError: types.optional(types.string, ""),
    isValid: types.optional(types.boolean, false),
    isRegistered: types.optional(types.boolean, false),
  })
  .actions(self => ({
    registered() {
      self.isRegistered = true;
    },
    registeredClose() {
      self.isRegistered = false;
    },
    emailOnChange(id) {
      self.email = id;
      self.validateEmail();
    },
    validateEmail() {
      const emailPatter = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const required = self.email ? undefined : "Required";
      self.emailError = required
        ? required
        : emailPatter.test(self.email)
          ? undefined
          : "Invalid email address";
    },
    passwordOnChange(pwd) {
      self.password = pwd;
      self.validatePassword();
    },
    validatePassword() {
      const alphaNumeric = /[^a-zA-Z0-9 ]/i.test(self.password)
        ? "Only alphanumeric characters"
        : undefined;
      const maxLength =
        self.password.length > 15
          ? "Password must be 15 characters or less"
          : undefined;
      const minLength =
        self.password.length < 8
          ? "Password must be 8 characters or more"
          : undefined;
      const required = self.password ? undefined : "Required";
      self.passwordError = required
        ? required
        : alphaNumeric
          ? alphaNumeric
          : maxLength
            ? maxLength
            : minLength;
    },
    validateForm() {
      if (
        self.emailError === "" &&
        self.passwordError === "" &&
        self.email !== "" &&
        self.password !== ""
      ) {
        self.isValid = true;
      }
    },
    clearStore() {
      self.email = "";
      self.isValid = false;
      self.isRegistered = false;
      self.emailError = "";
      self.password = "";
      self.passwordError = "";
    },
    login() {
      return fetch(
        "https://app.tailpos.com/api/method/tailpos_erpnext.rests.login_device",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: self.email,
            password: self.password,
            device_id: DeviceInfo.getDeviceId(),
          }),
        },
      )
        .then(
          response =>
            response.status === 200
              ? response.json()
              : Promise.reject(response.status),
        )
        .then(response => response.message);
    },
    register() {},
  }));

const LoginStore = Login.create({
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
  isValid: false,
});

export default LoginStore;
