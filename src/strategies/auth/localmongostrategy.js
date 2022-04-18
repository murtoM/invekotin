const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../../models/user");

const localMongoStrategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      if (!validator.isAlphanumeric(username, "fi-FI", {ignore: ".,'\"@+-_"}))
        throw new Error("Username must contain only alphanumeric characters!");

      if (!validator.isLength(username, { min: 3, max: 128 }))
        throw new Error("Username length must be between 3 and 128 characters!");

      if (!validator.isLength(password, { min: 8, max: 71 }))
        throw new Error("Password length must be between 8 and 71 characters!");
    } catch (error) {
      return done(null, false, {
        message: error.message,
      });
    }
    try {
      let user = await User.findOne({ username: username });

      // does the user exist in the db?
      if (!user)
        return done(null, false, {
          message: "User not found.",
        });

      // verify password
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return done(null, false, {
          message: "Incorrect password.",
        });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = localMongoStrategy;
