const config = require("../config");
const EntityStore = require("../models/entitystore");

exports.getEntityStoresByType = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    next({code: 404});
  }

  EntityStore.find({allowedTypes: req.params.typeStr}, (error, stores) => {
    if (error) next(error);
    req.typeStores = stores;
    next();
  });
};

exports.getSingleEntityStore = (req, res, next) => {
  if (req.params.slug == "") {
    next();
  }

  EntityStore.findOne({slug: req.params.slug}, (error, store) => {
    if (error) next(error);
    req.entityStore = store;
    next();
  });
};

exports.renderEntityStore = (req, res, next) => {
  res.render("entitystore", { 
    typeStr: req.params.typeStr,
    typeStores: req.typeStores,
    entityStore: req.entityStore,
  });
};

exports.renderNewForm = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    next({code: 404});
  }
  res.render("entitystore-form", {
    typeStr: req.params.typeStr,
    availableTypes: config.entityTypes,
  });
}

exports.saveNewEntityStore = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    next({code: 404});
  }

  let newEntityStore = new EntityStore({
    name: req.body.name,
    allowedTypes: req.body.allowedTypes,
  });

  newEntityStore.save((error, result) => {
    if (error) res.send(error);
    res.redirect(`/${req.params.typeStr}`);
  });
};

exports.getAllStores = (req, res, next) => {
  EntityStore.find({}, (error, stores) => {
    if (error) next(error);
    req.stores = stores;
    next();
  });
};

exports.renderStoresDashboard = (req, res, next) => {
  res.render("entitystores-dashboard", { 
    stores: req.stores,
  });
};
