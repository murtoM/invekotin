const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  entityStores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EntityStore",
    },
  ],
  roles: [{}],
});

userSchema.pre("save", async function(next) {
  let user = this;

  // lets do the hashing only if the password is new or changed
  if (!user.isModified("password")) return next();

  try {
    // TODO: how many salt rounds we need?
    let hash = await bcrypt.hash(user.password, 12);
    user.password = hash;

    next();
  } catch (error) {
    return next(error);
  }
})

module.exports = mongoose.model("User", userSchema);
