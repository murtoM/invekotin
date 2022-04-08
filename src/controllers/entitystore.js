const config = require("../config");
const EntityStore = require("../models/entitystore");

exports.getEntityStoresByType = (req, res, next) => {
  if (!(req.params.typeStr in config.entityTypes)) {
    next({ code: 404 });
  }

  EntityStore.find({ allowedTypes: req.params.typeStr }, (error, stores) => {
    if (error) next(error);
    req.typeStores = stores;
    next();
  });
};

exports.getSingleEntityStore = (req, res, next) => {
  if (req.params.slug == "") {
    next();
  }

  EntityStore.findOne({ slug: req.params.slug }, (error, store) => {
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
    res.redirect(`/`);
  });
};

exports.updateEntityStore = (req, res, next) => {
  EntityStore.findById(req.params.entityID, (error, store) => {
    if (error) {
      next(error);
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
  let store = await EntityStore.findById(req.params.entityID).exec();
  if (store == null) {
    res.redirect("/");
  }

  EntityStore.deleteOne({ _id: req.params.entityID }, (error, result) => {
    if (error) {
      return next(error);
    }
    res.redirect(`/${store.allowedTypes[0]}`);
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
