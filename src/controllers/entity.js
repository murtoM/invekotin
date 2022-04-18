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

function buildParts(typeStr, data = {}) {
  let parts = [];
  const schema = config.entityTypes[typeStr].schema;
  const schemaParser = new SchemaElementParser();

  for (const [key, value] of Object.entries(schema)) {
    let part = {name: "", view: "", validation: ""};
    schemaParser.setStrategy(getSchemaReadingStrategy(value));
    part.view = schemaParser.determineView(value);
    part.validation = schemaParser.determineValidators(value);
    part.value = (key in data ? data[key] : "");
    part.name = key;
    parts.push(part);
  };

  return parts;
}

function getTypeStr(req) {
  let typeStr = req.body.typeStr || req.params.typeStr || req.path.split("/")[1];
  if (!(typeStr in config.entityTypes)) {
    throw new NotFoundError("Entity type not found");
  }
  return typeStr;
}

async function getStore(id) {
  let store = await EntityStore.findById(id).exec();
  if (store == null) {
    throw new NotFoundError("Store not found");
  }
  return store;
}

function buildDataObject(typeStr, req) {
  const schema = config.entityTypes[typeStr].schema;
  let data = {}
  for (const key of Object.keys(schema)) {
    data[key] = req.body[key];
  }
  return data;
}

async function saveNewEntity(typeStr, data) {
  const model = entityModels[typeStr];
  let entityObject = new model(data);

  return await entityObject.save();
}

async function updateEntity(entityID, typeStr, data) {
  const model = entityModels[typeStr];
  entityObject = await model.findById(entityID).exec();

  if (entityObject === null) {
    throw new NotFoundError("Entity not found.");
  }

  for (const key in data) {
    entityObject[key] = data[key];
  }

  return await entityObject.save();
}

function addEntityToStore(store, entityID) {
  store.entities.push(entityID);
  store.save((error) => {
    if (error) {
      throw new InternalServerError(error);
    }
  });
  return;
}

exports.handleNewEntityPost = async (req, res, next) => {
  try {
    let typeStr = getTypeStr(req);
    res.locals.typeStr = typeStr;
    let store = await getStore(req.body.storeID);
    res.locals.storeID = store._id;
    let data = buildDataObject(typeStr, req);
    try {
      let result = await saveNewEntity(typeStr, data);
      addEntityToStore(store, result._id);
      res.locals.flash.push("info", `New ${typeStr} saved!`);
      res.redirect(`/${typeStr}/${store.slug}`);
    } catch (error) {
      let parts = buildParts(typeStr, data);
      res.render("entity-form", {
        errors: error.errors,
        typeStr: typeStr,
        store: store,
        id: null,
        parts: parts,
      });
    }
  } catch (error) {
    next(error);
    return;
  }
  next();
}

exports.handleUpdateEntityPost = async (req, res, next) => {
  try {
    let typeStr = getTypeStr(req);
    res.locals.typeStr = typeStr;
    let data = buildDataObject(typeStr, req);
    try {
      await updateEntity(req.body.id, typeStr, data);
      res.locals.flash.push("info", `Existing ${typeStr} updated!`);
      res.redirect(`/${typeStr}`);
    } catch (error) {
      let parts = buildParts(typeStr, data);
      res.render("entity-form", {
        errors: error.errors,
        typeStr: typeStr,
        store: null,
        id: req.body.id,
        entity: await entityModels[typeStr].findById(req.body.id).exec(),
        parts: parts,
      });
    }
  } catch (error) {
    next(error);
    return;
  }
  next();
}

exports.respondWithEntityTypeSelectPage = (req, res, next) => {
  res.render("entitytype-select", {entityTypes: config.entityTypes});
}

exports.respondWithNewForm = (req, res, next) => {
  let typeStr = getTypeStr(req);
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
      let parts = buildParts(typeStr);

      res.render("entity-form", {
        typeStr: typeStr,
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

exports.respondWithEditForm = (req, res, next) => {
  let typeStr = getTypeStr(req);
  const schema = config.entityTypes[typeStr].schema;
  const model = entityModels[typeStr];

  model.findById(req.params.entityID, (error, entity) => {
    if (error) {
      next(error);
      return;
    }

    if (entity == null) {
      next(new NotFoundError("Entity not found. Please check URL."));
      return;
    }

    let data = {}
    for (const key of Object.keys(schema)) {
      data[key] = entity[key];
    }
    data["id"] = entity._id;

    try {
      let parts = buildParts(typeStr, data);

      res.render("entity-form", {
        typeStr: typeStr,
        store: null,
        id: entity.id,
        entity: entity,
        parts: parts,
      });
    } catch(error) {
      next(error);
      return;
    }
  });
}

exports.deleteEntity = async (req, res, next) => {
  let typeStr = getTypeStr(req);
  const model = entityModels[typeStr];
  model.findOneAndDelete({ _id: req.params.entityID }, (error, doc) => {
    if (error) {
      next(error);
      return;
    }
    res.locals.flash.push("info", `${typeStr} deleted!`);
    res.redirect(`/${typeStr}`);
  });
};
