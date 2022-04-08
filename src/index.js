const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const config = require("./config");
const DB_URI = `mongodb://${config.db.user}:${config.db.pwd}@${config.db.host}:${config.db.port}/${config.db.name}?authMechanism=DEFAULT&authSource=admin`;

const ErrorHandler = require("./controllers/errorhandler");
const EntityStore = require("./controllers/entitystore");
const User = require("./models/user");

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

app.use(cookieParser);
app.use(
  expressSession({
    secret: "kisse", // TODO: get from env
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// create a test user
try {
  let testUser = new User({username: "root", email: "foo@bar"});
  testUser.setPassword("password");
  testUser.save();
} catch (error) {}

app.use((req, res, next) => {
  console.log(`A request was made from ${req.url}`);
  next();
});

app.get("/", EntityStore.getAllStores, EntityStore.renderStoresDashboard);

app
  .route("/entitystore")
  .get(EntityStore.renderNewForm)
  .post(EntityStore.saveNewEntityStore);
app.route("/entitystore/type/:typeStr").get(EntityStore.renderNewForm);

app.get(
  "/:typeStr",
  EntityStore.getEntityStoresByType,
  EntityStore.renderEntityStore
);
app
  .route("/:typeStr/:slug")
  .get(
    EntityStore.getEntityStoresByType,
    EntityStore.getSingleEntityStore,
    EntityStore.renderEntityStore
  );

app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    req.session.save((error) => {
      if (error) return next(error);
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

app.use(ErrorHandler.logErrors);

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
