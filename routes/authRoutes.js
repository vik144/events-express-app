// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

//login page
router.get("/login", async (req, res) => {
  res.render("login", { session: req.session });
});

//signup page
router.get("/signup", async (req, res) => {
  res.render("signup", { session: req.session });
});

// User Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 6);

    // Create new user with hashing
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    //Create user without hashing
    // const newUser = new User({
    //   username,
    //   password,
    //   role,
    // });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error in user signup" });
  }
});

// Login logic
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    // const passwordMatch = password === user.password;

    // Debugging: Print the result of password comparison
    console.log("Password Match:", passwordMatch);

    if (passwordMatch) {
      // Create session
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.render("user-home", { user: user, session: req.session });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in user login" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ message: "Error logging out" });
    } else {
      res.render("index", { session: req.session });
      // res.status(200).json({ message: "Logged out successfully" });
    }
  });
});

module.exports = router;
