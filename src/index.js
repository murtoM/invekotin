const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const MongoDBStore = require("connect-mongodb-session")(expressSession);

const config = require("./config");
const DB_URI = `mongodb://${config.db.user}:${config.db.pwd}@${config.db.host}:${config.db.port}/${config.db.name}?authMechanism=DEFAULT&authSource=admin`;

const ErrorHandler = require("./modules/error/errorhandler");
const EntityStore = require("./controllers/entitystore");
const Entity = require("./controllers/entity");
const passportControl = require("./passportcontrol");
const User = require("./controllers/user");
const Flash = require("./modules/flash");

const app = express();

mongoose.connect(DB_URI, config.mongoose.connect);

const db = mongoose.connection;

// Register a static test user
User.registerTest({
  username: "root3",
  password: "password",
  email: "foo3@bar",
});

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", config.appPort);
app.set("view engine", config.viewEngine);
app.set("views", config.views);

app.use(express.static(config.express.static));
app.use(express.urlencoded(config.express.urlencoded));
app.use(layouts);

// Setup mongodb as the session store
const store = new MongoDBStore({
  uri: DB_URI,
  collection: "sessions",
});

// session and parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
app.use(
  expressSession({
    ...config.express.session,
    store: store,
  })
);
app.use(Flash());

// passport
app.use(passportControl.initialize());
app.use(passportControl.session());

app.use((req, res, next) => {
  console.log(`A request was made from ${req.url}`);
  next();
});

// Load common data for views
app.use((req, res, next) => {
  res.locals.firstPathElement = req.path.split("/")[1]; // Path always starts with forward slash
  res.locals.config = config;
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

app.get(
  "/",
  User.isAuthenticated,
  EntityStore.getAllStores,
  EntityStore.renderStoresDashboard
);

// User account specific routes
app.get("/login", User.renderLogin);
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  User.login
);
app.get("/logout", User.logout);
app.get("/register", User.renderRegister);
app.post("/register", User.register, User.renderLogin);

// Entity-specific routes

app
  .route("/entity/add")
  .get(User.isAuthenticated, Entity.respondWithEntityTypeSelectPage)
  .post(User.isAuthenticated, Entity.handleNewEntityPost);
app.get("/entity/add/type/:typeStr/store/:storeID", Entity.respondWithNewForm);
app
  .route("/:typeStr/entity/:entityID/edit")
  .get(User.isAuthenticated, Entity.respondWithEditForm)
  .post(User.isAuthenticated, Entity.handleUpdateEntityPost);
app.get(
  "/:typeStr/entity/:entityID/delete",
  User.isAuthenticated,
  Entity.deleteEntity
);

// EntityStore-specific routes

app.get(
  "/entitystore",
  User.isAuthenticated,
  EntityStore.getAllStores,
  EntityStore.renderStoresDashboard
);
app
  .route("/entitystore/add")
  .get(User.isAuthenticated, EntityStore.renderForm)
  .post(User.isAuthenticated, EntityStore.saveNewEntityStore);
app.get(
  "/entitystore/add/type/:typeStr",
  User.isAuthenticated,
  EntityStore.renderForm
);
app
  .route("/entitystore/:entityID/edit")
  .get(User.isAuthenticated, EntityStore.renderForm)
  .post(User.isAuthenticated, EntityStore.updateEntityStore);
app.get(
  "/entitystore/:entityID/delete",
  User.isAuthenticated,
  EntityStore.deleteEntityStore
);

app.get(
  "/:typeStr",
  User.isAuthenticated,
  EntityStore.getEntityStoresByType,
  User.isAuthenticated,
  EntityStore.renderEntityStore
);
app.get(
  "/:typeStr/:slug",
  User.isAuthenticated,
  EntityStore.getEntityStoresByType,
  EntityStore.getSingleEntityStore,
  EntityStore.getEntitiesInStore,
  EntityStore.renderEntityStore
);

// Error handling

app.use(ErrorHandler.logErrorMiddleWare);
app.use(ErrorHandler.respondWithError);

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error) => {
  ErrorHandler.logError("Uncaught Exception!");
  ErrorHandler.logError(error);

  if (!ErrorHandler.isOperationalError(error)) {
    process.exit(1);
  }
});

// Now we're ready to start the server

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
