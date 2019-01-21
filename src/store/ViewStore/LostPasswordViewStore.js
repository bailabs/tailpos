import { types } from "mobx-state-tree";

const LostPassword = types
  .model("LostPassword", {
    email: types.optional(types.string, ""),
    emailError: types.optional(types.string, ""),
    isValid: types.optional(types.boolean, false),
  })
  .actions(self => ({
    emailOnChange(id) {
      self.email = id;
      self.validateEmail();
    },
    validateEmail() {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const required = self.email ? undefined : "Required";
      self.emailError = required
        ? required
        : emailPattern.test(self.email)
          ? undefined
          : "Invalid email address";
    },
    validateForm() {
      if (self.emailError === "" && self.email !== "") {
        self.isValid = true;
      }
    },
    lostPassword() {
      return fetch(
        "https://app.tailpos.com/api/method/tailpos_erpnext.rests.lost_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: self.email,
          }),
        },
      )
        .then(response => response.json())
        .then(response => response.message);
    },
  }));

const LostPasswordStore = LostPassword.create({
  email: "",
  emailError: "",
  isValid: false,
});

export default LostPasswordStore;
