const formValidationFailure = {
  add: (field, message = null, autoRemoveOnValid = true) => {
    field.setAttribute("aria-invalid", "true");
    if (message != null) field.setCustomValidity(message);

    field.addEventListener("blur", () => {
      if (autoRemoveOnValid && field.checkValidity()) {
        field.setAttribute("aria-invalid", "false");
        field.setCustomValidity("");
      }
    });
  },
  remove: (field) => {
    field.setAttribute("aria-invalid", "false");
    field.setCustomValidity("");
  },
};

export default formValidationFailure;
