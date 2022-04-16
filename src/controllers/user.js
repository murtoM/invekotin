const User = require("../models/user");

exports.login = (req, res, next) => {
  req.session.save((error) => {
    if (error) {
      return next(error);
    }
    if (req.isAuthenticated())
      res.locals.flash.push("info", "Login successful!");
    res.redirect("/");
  });
};

exports.renderLogin = (req, res) => {
  res.render("login", { isAuthenticated: req.isAuthenticated() });
};

exports.logout = (req, res, next) => {
  req.logout();
  req.session.save((error) => {
    if (error) return next(error);
    if (!req.isAuthenticated()) res.locals.flash.push("info", "Logged out!");
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
      res.locals.flash.push("error", "User already exists!");
      next();
    } else {
      const newUser = new User(userAttribs);
      await newUser.save();
      res.locals.flash.push("info", "Registration successful!");
      next();
    }
  } catch (error) {
    console.error(error);
    res.locals.flash.push("error", "An error occured during registration!");
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
