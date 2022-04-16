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
  sessionSecret: process.env.SESSION_SECRET || "kisse",
  secureCookies: JSON.parse(process.env.SESSION_SECURE_COOKIES) || false,
}
