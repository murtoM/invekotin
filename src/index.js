const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const config = require("./config");
const DB_URI = `mongodb://${config.db.user}:${config.db.pwd}@${config.db.host}:${config.db.port}/${config.db.name}?authMechanism=DEFAULT&authSource=admin`;

const ErrorHandler = require("./controllers/errorhandler");
const EntityStore = require("./controllers/entitystore");
const Entity = require("./controllers/entity");
const User = require("./models/user");

const app = express();

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

// Register a static test user
User.register({username:'root3', email: "foo3@bar"}, 'password', function(err, user) {
  if (err) { console.log(err); }
});

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
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

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

app.get("/entity/add/type/:typeStr", Entity.renderForm);

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
  EntityStore.renderEntityStore
);


app.use(ErrorHandler.logErrors);

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
