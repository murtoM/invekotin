const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const config = require("./config");
const DB_URI = `mongodb://${config.db.user}:${config.db.pwd}@${config.db.host}:${config.db.port}/${config.db.name}?authMechanism=DEFAULT&authSource=admin`;

const ErrorHandler = require("./modules/error/errorhandler");
const EntityStore = require("./controllers/entitystore");
const Entity = require("./controllers/entity");
const passportControl = require("./passportcontrol");
const registerUser = require("./modules/user/register");

const app = express();

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

// Register a static test user
registerUser({username:'root3', password: "password", email: "foo3@bar"});

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
app.use(layouts);

// Load common data for views
app.use((req, res, next) => {
  res.locals.config = config;
  next()
});

// session and parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "kisse", // TODO: get from env
    resave: false,
    saveUninitialized: false,
  })
);

// passport
app.use(passportControl.initialize());
app.use(passportControl.session());

app.use((req, res, next) => {
  console.log(`A request was made from ${req.url}`);
  next();
});

app.get("/", EntityStore.getAllStores, EntityStore.renderStoresDashboard);

app.get("/login", (req, res) => {
  console.log(req.session.messages);
  res.render("login", {user: req.user, isAuthenticated: req.isAuthenticated()});
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res, next) => {
    req.session.save((error) => {
      if (error) {
      return next(error);
      } 
      res.redirect("/");
    });
  }
);

app.get("/logout", (req, res, next) => {
  req.logout();
  req.session.save((error) => {
    if (error) return next(error);
    res.redirect("/login");
  });
});


// Entity-specific routes

app
  .route("/entity/add")
  .get(Entity.renderEntityTypeSelectPage)
  .post(Entity.saveNewEntity);
app.get("/entity/add/type/:typeStr/store/:storeID", Entity.renderForm);


// EntityStore-specific routes

app.get("/entitystore", EntityStore.getAllStores, EntityStore.renderStoresDashboard);
app
  .route("/entitystore/add")
  .get(EntityStore.renderForm)
  .post(EntityStore.saveNewEntityStore);
app.get("/entitystore/add/type/:typeStr", EntityStore.renderForm);
app
  .route("/entitystore/:entityID/edit")
  .get(EntityStore.renderForm)
  .post(EntityStore.updateEntityStore);
app.get("/entitystore/:entityID/delete", EntityStore.deleteEntityStore);

app.get(
  "/:typeStr",
  EntityStore.getEntityStoresByType,
  EntityStore.renderEntityStore
);
app.get(
  "/:typeStr/:slug", 
  EntityStore.getEntityStoresByType,
  EntityStore.getSingleEntityStore,
  EntityStore.getEntitiesInStore,
  EntityStore.renderEntityStore
);


// Error handling

app.use(ErrorHandler.logErrorMiddleWare);
app.use(ErrorHandler.respondWithError);

process.on("unhandledRejection", error => {
  throw error;
});

process.on("uncaughtException", error => {
  ErrorHandler.logError(error);

  if (!ErrorHandler.isOperationalError(error)) {
    process.exit(1);
  }
})

// Now we're ready to start the server

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
