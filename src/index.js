const DB_USER = process.env.MONGO_USERNAME;
const DB_PWD = process.env.MONGO_PWD;
const DB_HOST = process.env.MONGO_HOST;
const DB_PORT = process.env.MONGO_PORT;
const DB_NAME = process.env.MONGO_DB_NAME;

const DB_URI = `mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authMechanism=DEFAULT&authSource=admin`;

const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const TypeController = require("./controllers/TypeController");

const app = express();

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
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

app.get("/:typeStr", TypeController.renderTypePage);

app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
