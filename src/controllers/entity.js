const NotFoundError = require("../modules/error/NotFoundError");
const config = require("../config");
const EntityStore = require("../models/entitystore");
const entityModels = require("../models/entity");
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

function getSchemaReadingStrategy(content) {
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
      throw new NotFoundError("Unknown content type in Entity Form Builder");
  }
}

function buildParts(typeStr) {
  let parts = [];
  const schema = config.entityTypes[typeStr].schema;
  const schemaParser = new SchemaElementParser();

  for (const [key, value] of Object.entries(schema)) {
    let part = {name: "", view: "", validation: ""};
    schemaParser.setStrategy(getSchemaReadingStrategy(value));
    part.view = schemaParser.determineView(value);
    part.validation = schemaParser.determineValidators(value);
    part.name = key;
    parts.push(part);
  };

  return parts;
}

exports.respondWithNewForm = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    res.redirect("/entity/add");
    return;
  }

  EntityStore.findById(req.params.storeID, (error, store) => {
    if (error) {
      next(error);
      return;
    }

    if (store == null) {
      next(new NotFoundError("Store not found. Please check URL."));
      return;
    }

    try {
      let parts = buildParts(req.params.typeStr);

      res.render("entity-form", {
        typeStr: req.params.typeStr,
        store: store,
        id: null,
        parts: parts,
      });
    } catch(error) {
      next(error);
      return;
    }
  });
}

exports.respondWithEntityTypeSelectPage = (req, res, next) => {
  res.render("entitytype-select", {entityTypes: config.entityTypes});
}

exports.saveNewEntity = async (req, res, next) => {
  if (!(req.body.typeStr in config.entityTypes)) {
    res.redirect("/entity/add");
  }

  const schema = config.entityTypes[req.body.typeStr].schema;
  const model = entityModels[req.body.typeStr];

  let store = await EntityStore.findById(req.body.storeID).exec();
  if (store == null) {
    next(new NotFoundError("Store not found"));
    return;
  }

  let data = {}
  for (const key of Object.keys(schema)) {
    data[key] = req.body[key];
  }
  
  let entityObject = new model(data);

  entityObject.save((error) => {
    if (error) {
      try {
        let parts = buildParts(req.body.typeStr);

        res.render("entity-form", {
          errors: error.errors,
          typeStr: req.body.typeStr,
          store: store,
          id: req.body.id,
          parts: parts,
        });
      } catch(error) {
        next(error);
      }
      return;
    }

    store.entities.push(entityObject._id);
    store.save((error) => {
      if (error) {
        next(error);
        return;
      }
      res.redirect(`/${req.body.typeStr}/${store.slug}`);
    });
  });
}
