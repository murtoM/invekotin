const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  allowedTypes: [String],
  entities: [{}]
});

module.exports = mongoose.model("EntityStore", schema);