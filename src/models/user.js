const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
  },
  entityStores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EntityStore",
    },
  ],
  roles: [{}],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
