const config = require("../config");
const models = require("../models/entity");
const ObjectStrategy = require("../strategies/formbuilding/objectstrategy");
const ArrayStrategy = require("../strategies/formbuilding/arraystrategy");
const PlainStrategy = require("../strategies/formbuilding/plainstrategy");

const availStrategies = {
  objectStrategy: new ObjectStrategy(),
  arrayStrategy: new ArrayStrategy(),
  plainStrategy: new PlainStrategy(),
}

class SchemaElementParser {
  constructor() {
    this._strategy = null;
  }
  setStrategy(strategy) {
    this._strategy = strategy;
  }
  determineView(data) {
    return this._strategy.determineView(data);
  }
  determineValidators(data) {
    return this._strategy.determineValidators(data);
  }
}

function getStrategy(content) {
  switch (typeof content) {
    case "object":
      if (Array.isArray(content)) {
        return availStrategies.arrayStrategy;
      } else {
        return availStrategies.objectStrategy;
      }
      break;

    case "function":
      return availStrategies.plainStrategy;
      break;
  
    default:
      next("Unknown content type in Entity Form Builder");
  }
}

function buildParts(typeStr) {
  let parts = [];
  const schema = config.entityTypes[typeStr].schema;
  const decrypter = new SchemaElementParser();

  for (const [key, value] of Object.entries(schema)) {
    let part = {name: "", view: "", validation: ""};
    decrypter.setStrategy(getStrategy(value));
    part.view = decrypter.determineView(value);
    part.validation = decrypter.determineValidators(value);
    part.name = key;
    parts.push(part);
  };

  return parts;
}

exports.renderForm = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    res.redirect("/entity/new");
  }

  let parts = buildParts(req.params.typeStr);
  res.render("entity-form", {
    typeStr: req.params.typeStr,
    id: null,
    parts: parts,
  });
}
