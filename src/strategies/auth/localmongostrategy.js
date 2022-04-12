const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const localMongoStrategy = new LocalStrategy(
  async (username, password, done) => {
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
