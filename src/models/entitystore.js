const mongoose = require("mongoose");
const config = require("../config");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  allowedTypes: {
    type: [String],
    enum: Object.keys(config.entityTypes),
  },
  entities: [{}],
});

schema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
}

module.exports = mongoose.model("EntityStore", schema);
