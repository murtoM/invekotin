class PlainStrategy {
  determineView(data) {
    switch (typeof data()) {
      case "string":
        return "text";
      case "boolean":
        return "checkbox";
      default:
        return "text";
    }
  }

  determineValidators(data) {
    return "";
  }
}

module.exports = PlainStrategy;
