class ObjectStrategy {
  determineView(data) {
    return "text";
  }

  determineValidators(data) {
    let validatorStr = "";
    if (data.required) {
      validatorStr += " required"
    }
    return validatorStr;
  }
}

module.exports = ObjectStrategy;
