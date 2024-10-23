const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  profilePics: { type: [String], required: true }, // Array to store multiple file names
});

const User = mongoose.model("User", userSchema);

module.exports = User;
