import { types } from "mobx-state-tree";

const Signup = types
  .model("SignupList", {
    email: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    confirmPassword: types.optional(types.string, ""),
    firstName: types.optional(types.string, ""),
    lastName: types.optional(types.string, ""),
    emailError: types.optional(types.string, ""),
    passwordError: types.optional(types.string, ""),
    confirmPasswordError: types.optional(types.string, ""),
    firstNameError: types.optional(types.string, ""),
    lastNameError: types.optional(types.string, ""),
    isValid: types.optional(types.boolean, false),
  })
  .actions(self => ({
    validateEmail() {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const required = self.email ? undefined : "Required";
      self.emailError = required
        ? required
        : emailPattern.test(self.email)
          ? undefined
          : "Invalid email address";
    },
    validatePassword() {
      const alphaNumeric = /[^a-zA-Z0-9 ]/i.test(self.password)
        ? "Only alphanumeric characters"
        : undefined;
      const maxLength =
        self.password.length > 15 ? "Must be 15 characters or less" : undefined;
      const minLength =
        self.password.length < 8 ? "Must be 8 characters or more" : undefined;
      const required = self.password ? undefined : "Required";
      self.passwordError = required
        ? required
        : alphaNumeric
          ? alphaNumeric
          : maxLength
            ? maxLength
            : minLength;
    },
    validateConfirmPassword() {
      const required = self.confirmPassword
        ? undefined
        : "Should match with the password";
      const match =
        self.confirmPassword === self.password
          ? undefined
          : "Should match with the password";
      self.confirmPasswordError = required ? required : match;
    },
    validateFirstName() {
      const minLength =
        self.firstName.length < 2 ? "Must be 2 characters or more" : undefined;
      const required = self.firstName ? undefined : "Required";
      self.firstNameError = required ? required : minLength;
    },
    validateLastName() {
      const minLength =
        self.lastName.length < 2 ? "Must be 2 characters or more" : undefined;
      const required = self.lastName ? undefined : "Required";
      self.lastNameError = required ? required : minLength;
    },
    validateForm() {
      if (
        self.emailError === "" &&
        self.passwordError === "" &&
        self.confirmPasswordError === "" &&
        self.firstNameError === "" &&
        self.lastNameError === "" &&
        self.email !== "" &&
        self.password !== "" &&
        self.confirmPassword !== "" &&
        self.firstName !== "" &&
        self.lastName !== ""
      ) {
        self.isValid = true;
      } else {
        self.validateFirstName();
        self.validateLastName();
        self.validateEmail();
        self.validatePassword();
        self.validateConfirmPassword();
      }
    },
    emailOnChange(id) {
      self.email = id;
      self.validateEmail();
    },
    passwordOnChange(pwd) {
      self.password = pwd;
      self.validatePassword();
    },
    confirmPasswordOnChange(pwd) {
      self.confirmPassword = pwd;
      self.validateConfirmPassword();
    },
    firstNameOnChange(firstName) {
      self.firstName = firstName;
      self.validateFirstName();
    },
    lastNameOnChange(lastName) {
      self.lastName = lastName;
      self.validateLastName();
    },
    emailNotAvailable() {
      self.emailError = "Not available";
    },
    register() {
      return fetch(
        "https://app.tailpos.com/api/method/tailpos_erpnext.rests.register_user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: self.firstName,
            last_name: self.lastName,
            email: self.email,
            password: self.password,
          }),
        },
      )
        .then(response => response.json())
        .then(responseJson => responseJson.message);
    },
    emailCheck() {
      return fetch(
        "https://app.tailpos.com/api/method/tailpos_erpnext.rests.check_email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: self.email,
          }),
        },
      )
        .then(response => response.json())
        .then(responseJson => responseJson.message);
    },
  }));

const SignupStore = Signup.create({
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
  firstNameError: "",
  lastNameError: "",
  isValid: false,
});

export default SignupStore;
