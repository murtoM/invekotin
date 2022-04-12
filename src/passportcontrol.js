const passport = require("passport");

const User = require("./models/user");
const localMongoStrategy = require("./strategies/auth/localmongostrategy");

passport.use(localMongoStrategy);

passport.serializeUser((user, done) => {
  try {
    done(null, user._id);
  } catch (error) {
    done(error);
  }
});
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
