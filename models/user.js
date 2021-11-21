const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  role: String
});

userSchema.plugin(passportLocalMongoose); //to hash and salt password

const User = mongoose.model("User", userSchema);

module.exports = User;
