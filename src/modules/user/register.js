const User = require("../../models/user");

const register =  async (user) => {
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

module.exports = register;
