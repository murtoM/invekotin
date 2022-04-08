const mongoose = require("mongoose");
const config = require("../config");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  allowedTypes: {
    type: [String],
    enum: Object.keys(config.entityTypes),
  },
  entities: [{}]
});

module.exports = mongoose.model("EntityStore", schema);