// routes/eventRoutes.js
const express = require("express");
const Event = require("../models/Event");
const { isLoggedIn, checkRole } = require("../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");

// //event create page
// router.get("/create-event", isLoggedIn, async (req, res) => {
//   res.render("create-event");
// });
// //event update page
// router.get("/update-event/:eventId", isLoggedIn, async (req, res) => {
//   const eventId = req.params.eventId;
//   const event = await Event.findById(eventId);
//   res.render("update-event", { event });
// });

// Fetch event details
router.get("/event-detail/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details" });
  }
});

// Create Event with a more descriptive URL
router.post("/create-event", [isLoggedIn, checkRole(["Admin"])], async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const newEvent = new Event({ title, description, date, time });
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
});

// Update Event
router.put("/:eventId", [isLoggedIn, checkRole(["Admin"])], async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
});

// Delete Event
router.delete("/:eventId", [isLoggedIn, checkRole(["Admin"])], async (req, res) => {
  try {
    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const deletedEvent = await Event.findOneAndDelete({ _id: req.params.eventId });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Failed to delete event: ${error.message}` });
  }
});

module.exports = router;
