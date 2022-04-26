import formValidationFailure from "./formvalidationfailure.js";
import togglePasswordVisibility from "./togglepasswordvisibility.js";

const init = () => {
  const form = document.forms.namedItem("registeration-form");

  // add basic validation feedback on all fields
  for (let i = 0; i < form.elements.length; i++) {
    form[i].addEventListener("blur", () => {
      if (!form[i].checkValidity()) {
        formValidationFailure.add(form[i]);
      } else {
        form[i].setAttribute("aria-invalid", "false");
      }
    });
  }
  let password = form["password"];
  let passwordCheck = form["password-check"];

  // toggle password visibilty, if it is checked
  togglePasswordVisibility(password, passwordCheck);
  const passwordVisibilityToggle = document.getElementById(
    "passwordVisibilityToggle"
  );
  passwordVisibilityToggle.addEventListener("change", () => {
    togglePasswordVisibility(password, passwordCheck);
  });

  const validatePasswords = (event) => {
    if (password.value != passwordCheck.value) {
      event.preventDefault();
      formValidationFailure.add(password, "Passwords do not match!", false);
      formValidationFailure.add(
        passwordCheck,
        "Passwords do not match!",
        false
      );
      password.addEventListener("blur", validatePasswords);
      passwordCheck.addEventListener("blur", validatePasswords);
    } else {
      formValidationFailure.remove(password);
      formValidationFailure.remove(passwordCheck);
    }
  };

  form.addEventListener("submit", (event) => {
    validatePasswords(event);
  });
};

window.addEventListener("load", () => {
  init();
});
