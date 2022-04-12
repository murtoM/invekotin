const User = require("../models/user");

exports.login = (req, res, next) => {
  req.session.save((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

exports.renderLogin = (req, res) => {
  res.render("login", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
  });
};

exports.logout = (req, res, next) => {
  req.logout();
  req.session.save((error) => {
    if (error) return next(error);
    res.redirect("/login");
  });
};

exports.register = async (user) => {
  try {
    let existing = await User.findOne({ username: user.username });
    if (existing) {
      // TODO(murtoM): do something smart here
      console.log("User already exists");
    } else {
      user = new User(user);
      await user.save();
      console.log(`User ${user.username} registered.`);
    }
  } catch (error) {
    console.error(error);
  }
};
