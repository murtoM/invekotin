const passwordVisibilityToggle = document.getElementById(
  "passwordVisibilityToggle"
);

const togglePasswordVisibility = (password, passwordCheck) => {
  if (passwordVisibilityToggle.checked == true) {
    password.type = "text";
    password.placeholder = "Password";
    if (passwordCheck != undefined) {
      passwordCheck.type = "text";
      passwordCheck.placeholder = "Password";
    }
  } else {
    password.type = "password";
    password.placeholder = "********";
    if (passwordCheck != undefined) {
      passwordCheck.type = "password";
      passwordCheck.placeholder = "********";
    }
  }
};

export default togglePasswordVisibility;
