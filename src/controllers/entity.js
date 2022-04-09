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

class SchemaDecrypter {
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

function determineStrategy(content) {
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
  if (!(typeStr in config.entityTypes)) {
    return null;
  }

  let parts = [];
  const schema = config.entityTypes[typeStr].schema;
  const decrypter = new SchemaDecrypter();

  for (const [key, value] of Object.entries(schema)) {
    let partial = {name: "", view: "", validation: ""};
    let strategy = determineStrategy(value);
    decrypter.setStrategy(strategy);
    partial.view = decrypter.determineView(value);
    partial.validation = decrypter.determineValidators(value);
    partial.name = key;
    parts.push(partial);
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
