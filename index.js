const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const Event = require("./models/Event");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use(cors());

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.DB_API, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

//routes
app.use("/auth", authRoutes);
app.use("/admin", eventRoutes); // Assuming eventRoutes are for admin
app.use("/user", userRoutes);

//main route
app.get("/", async (req, res) => {
  res.render("index", { session: req.session });
});

//about page
app.get("/about", async (req, res) => {
  res.render("about", { session: req.session });
});

// View all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.render("events", { events: events, session: req.session });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});
//View event details
app.get("/event-detail/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.render("event-detail", { event: event, session: req.session });
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
