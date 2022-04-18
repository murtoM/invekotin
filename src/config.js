module.exports = {
  db: {
    user: process.env.MONGO_USERNAME,
    pwd: process.env.MONGO_PWD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DB_NAME,
  },
  appPort: process.env.APP_PORT || 3000,
  entityTypes: require("./entitytypes"),
  viewEngine: "ejs",
  views: "./src/views",
  express: {
    session: {
      secret: process.env.SESSION_SECRET || "kisse",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.SESSION_SECURE_COOKIES != "false" ? true : false,
      },
    },
    urlencoded: {
      extended: false,
    },
    static: "src/public",
  },
  bodyParser: {
    urlencoded: { extended: false },
  },
  mongoose: {
    connect: {
      useNewUrlParser: true,
    },
  },
};
