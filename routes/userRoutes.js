// routes/userRoutes.js
const Booking = require("../models/Booking");
const User = require("../models/User");

const express = require("express");
const Event = require("../models/Event");
const { isLoggedIn, checkRole } = require("../middleware/auth");
const router = express.Router();

//user home
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).exec();
    res.render("user-home", { user: user, session: req.session });
  } catch (err) {
    res.status(500).json({ message: "Error getting user" });
  }
});

// Book an event
router.post("/book-event/:eventId", isLoggedIn, async (req, res) => {
  try {
    const booking = new Booking({
      user: req.session.user._id,
      event: req.params.eventId,
    });
    await booking.save();

    res.redirect("/user/bookings/");
    // res.status(201).json({ message: "Event booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking event" });
  }
});
router.get("/bookings/", isLoggedIn, async (req, res) => {
  try {
    // Get the user ID from the request (assuming it's stored in req.user)
    const userId = req.session.user._id; // Adjust this based on how you store user information in your app

    // Use Mongoose to find all bookings made by the user
    const booking = await Booking.find({ user: userId })
      .populate("event") // If you want to populate the event details
      .exec();

    res.render("bookings", { booking: booking, session: req.session });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Unable to fetch user bookings" });
  }
});

module.exports = router;
