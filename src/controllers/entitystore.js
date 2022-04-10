const config = require("../config");
const EntityStore = require("../models/entitystore");
const entityModels = require("../models/entity");

exports.getEntityStoresByType = (req, res, next) => {
  res.locals.typeStores = [];
  if (!(req.params.typeStr in config.entityTypes)) {
    res.status(404);
    next("Type not found. Please check URL.");
  }

  EntityStore.find({ allowedTypes: req.params.typeStr }, (error, stores) => {
    if (error) next(error);
    res.locals.typeStores = stores;
    next();
  });
};

exports.getSingleEntityStore = (req, res, next) => {
  EntityStore.findOne({ slug: req.params.slug }, (error, store) => {
    if (error) next(error);
    if (store == null) {
      next("Store not found. Please check URL.");
    }
    res.locals.entityStore = store;
    next();
  });
};

exports.getEntitiesInStore = async (req, res, next) => {
  res.locals.entities = [];
  for(typeStr of res.locals.entityStore.allowedTypes) {
    let model = entityModels[typeStr];
    let foundEntities = await model.find({ _id: { $in: res.locals.entityStore.entities } }).exec();
    res.locals.entities.push(...foundEntities);
  }
  next();
}

exports.renderEntityStore = (req, res, next) => {
  res.render("entitystore", {
    typeStr: req.params.typeStr,
    schema: config.entityTypes[req.params.typeStr].schema,
  });
};

exports.renderForm = async (req, res, next) => {
  let allowedTypes = "";
  let name = "";
  let id = null;

  if (typeof req.params.typeStr != "undefined") {
    allowedTypes = req.params.typeStr;
  }

  let store = await EntityStore.findById(req.params.entityID).exec();

  if (store != null) {
    name = store.name;
    allowedTypes = store.allowedTypes;
    id = store.id;
  }

  res.render("entitystore-form", {
    typeStr: req.params.typeStr,
    availableTypes: config.entityTypes,
    name: name,
    allowedTypes: allowedTypes,
    id: id,
    typeStr: req.params.typeStr,
  });
};

exports.saveNewEntityStore = (req, res, next) => {
  let newEntityStore = new EntityStore({
    name: req.body.name,
    allowedTypes: req.body.allowedTypes,
  });

  newEntityStore.save((error, result) => {
    if (error) res.send(error);
    res.redirect(`/${req.body.typeStr in config.entityTypes ? req.body.typeStr : ""}`);
  });
};

exports.updateEntityStore = (req, res, next) => {
  EntityStore.findById(req.params.entityID, (error, store) => {
    if (error) {
      next(error);
      return;
    }

    if (store == null) {
      next("Store not found.");
      return;
    }

    store.name = req.body.name;
    store.allowedTypes = req.body.allowedTypes;

    store.save((error, result) => {
      if (error) res.send(error);
      res.redirect(`/${result.allowedTypes[0]}/${result.slug}`);
    });
  });
};

exports.deleteEntityStore = async (req, res, next) => {
  EntityStore.findOneAndDelete({ _id: req.params.entityID }, (error, doc) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect(`/${doc.allowedTypes[0]}`);
  });
};

exports.getAllStores = (req, res, next) => {
  EntityStore.find({}, (error, stores) => {
    if (error) next(error);
    res.locals.stores = stores;
    next();
  });
};

exports.renderStoresDashboard = (req, res, next) => {
  res.render("entitystores-dashboard");
};
