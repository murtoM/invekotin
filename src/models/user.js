const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
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

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
