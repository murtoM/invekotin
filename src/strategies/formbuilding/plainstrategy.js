class PlainStrategy {
  determineView(data) {
    return "text";
  }

  determineValidators(data) {
    return "";
  }
}

module.exports = PlainStrategy;
