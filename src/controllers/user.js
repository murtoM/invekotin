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

exports.register = async (req, res, next) => {
  // TODO(murtoM): implement input validation and sanitation
  const userAttribs = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  console.log(userAttribs);
  try {
    const existing = await User.findOne({ username: userAttribs.username });
    if (existing) {
      // TODO(murtoM): show user some sort of error message
      console.log("User already exists!");
      next();
    } else {
      // TODO(murtoM): message user that the registration was successful
      const newUser = new User(userAttribs);
      await newUser.save();
      next();
    }
  } catch (error) {
    // TODO(murtoM): user possibly needs some info here too
    console.error(error);
    next(error);
  }
};

exports.renderRegister = (req, res) => {
  res.render("register");
};

// TODO(murtoM): remove soon, used only for creating the test user
exports.registerTest = async (user) => {
  try {
    let existing = await User.findOne({ username: user.username });
    if (existing) {
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
