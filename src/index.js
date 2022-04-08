const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const config = require("./config");
const DB_URI = `mongodb://${config.db.user}:${config.db.pwd}@${config.db.host}:${config.db.port}/${config.db.name}?authMechanism=DEFAULT&authSource=admin`;

const ErrorHandler = require("./controllers/errorhandler");
const EntityStore = require("./controllers/entitystore");

const app = express();

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", config.appPort);
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(layouts);

app.use((req, res, next) => {
  console.log(`A request was made from ${req.url}`);
  next();
});

app.get(
  "/:typeStr",
  EntityStore.getEntityStores,
  EntityStore.renderEntityStore
);
app
  .route("/:typeStr/new")
  .get(EntityStore.renderNewForm)
  .post(EntityStore.saveNewEntityStore);
app
  .route("/:typeStr/:storeID")
  .get(
    EntityStore.getEntityStores,
    EntityStore.getEntitiesInStore,
    EntityStore.renderEntityStore
  );

app.use(ErrorHandler.logErrors);

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
