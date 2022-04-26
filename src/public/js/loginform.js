import formValidationFailure from "./formvalidationfailure.js";
import togglePasswordVisibility from "./togglepasswordvisibility.js";

const init = () => {
  const form = document.forms.namedItem("login-form");

  // add basic validation feedback on all fields
  for (let i = 0; i < form.elements.length; i++) {
    form[i].addEventListener("blur", () => {
      if (!form[i].checkValidity()) {
        formValidationFailure.add(form[i]);
      } else {
        form[i].removeAttribute("aria-invalid");
      }
    });
  }
  let password = form["password"];

  // toggle password visibilty, if it is checked
  togglePasswordVisibility(password);
  const passwordVisibilityToggle = document.getElementById(
    "passwordVisibilityToggle"
  );
  passwordVisibilityToggle.addEventListener("change", () => {
    togglePasswordVisibility(password);
  });
};

window.addEventListener("load", () => {
  init();
});
