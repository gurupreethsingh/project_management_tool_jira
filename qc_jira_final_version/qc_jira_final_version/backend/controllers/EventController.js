const Event = require("../models/EventModel");
const mongoose = require("mongoose");

// ✅ Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      startTime,
      endTime,
      duration,
      description,
      agenda,
      eventType,
      status,
      coordinator,
      guestName,
      location,
      department,
      tags,
      attendees,
      maxParticipants,
      isOnline,
      meetingLink
    } = req.body;

    const newEvent = new Event({
      eventName,
      eventDate,
      startTime,
      endTime,
      duration,
      description,
      agenda,
      eventType,
      status,
      coordinator,
      guestName,
      location,
      department,
      tags,
      attendees,
      maxParticipants,
      isOnline,
      meetingLink
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// ✅ Get all events (sorted by date)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 }).populate("coordinator attendees");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("coordinator attendees");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// ✅ Update event by ID
// ✅ Update event using route parameter :id
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id; // Get ID from the route

    const {
      eventName,
      eventDate,
      startTime,
      endTime,
      duration,
      description,
      agenda,
      eventType,
      status,
      coordinator,
      guestName,
      location,
      department,
      tags,
      attendees,
      maxParticipants,
      isOnline,
      meetingLink
    } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        eventName,
        eventDate,
        startTime,
        endTime,
        duration,
        description,
        agenda,
        eventType,
        status,
        coordinator,
        guestName,
        location,
        department,
        tags,
        attendees,
        maxParticipants,
        isOnline,
        meetingLink
      },
      { new: true, runValidators: true }
    ).populate("coordinator attendees");

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};


// ✅ Delete event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// ✅ Count all events
exports.countAllEvents = async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count events" });
  }
};

// ✅ Get upcoming events (eventDate in future)
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ eventDate: { $gt: now } }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
};

// ✅ Get ongoing events (event happening today)
exports.getOngoingEvents = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const events = await Event.find({
      eventDate: { $gte: startOfDay, $lte: endOfDay },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ongoing events" });
  }
};

// ✅ Get past/completed events
exports.getCompletedEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ eventDate: { $lt: now } }).sort({ eventDate: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch completed events" });
  }
};

// ✅ Get events by coordinator
exports.getEventsByCoordinator = async (req, res) => {
  try {
    const coordinatorId = req.params.id;
    const events = await Event.find({ coordinator: coordinatorId }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events by coordinator" });
  }
};

// ✅ Search events by keyword (eventName or description)
exports.searchEvents = async (req, res) => {
  try {
    const { keyword } = req.query;
    const events = await Event.find({
      $or: [
        { eventName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { agenda: { $regex: keyword, $options: "i" } }
      ]
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to search events" });
  }
};

// ✅ Filter by type (Seminar, Workshop, etc.)
exports.getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const events = await Event.find({ eventType: type }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events by type" });
  }
};

// ✅ Get events by department
exports.getEventsByDepartment = async (req, res) => {
  try {
    const { dept } = req.params;
    const events = await Event.find({ department: dept }).sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events by department" });
  }
};
