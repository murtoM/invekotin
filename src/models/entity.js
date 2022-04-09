const mongoose = require("mongoose");
const config = require("../config");

function getEntityModels() {
  const models = {}

  for (const [key, value] of Object.entries(config.entityTypes)) {
    let schema = new mongoose.Schema(value.schema);
    models[key] = mongoose.model(key, schema);
  }

  return models;
}

module.exports = getEntityModels();
