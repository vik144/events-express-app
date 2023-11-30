// models/User.js
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
    minlength: 60,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
});

// Pre-save hook to hash the password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 6);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
