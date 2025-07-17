const express = require("express");
const router = express.Router();

router.post("/create-event", eventController.createEvent);
router.get("/get-all-events", eventController.getAllEvents);
router.get("/count-all-events", eventController.countAllEvents);
router.get("/get-upcoming-events", eventController.getUpcomingEvents);
router.get("/get-ongoing-events", eventController.getOngoingEvents);
router.get("/get-completed-events", eventController.getCompletedEvents);
router.get("/get-event-by-coordinator/:id", eventController.getEventsByCoordinator);
router.get("/get-event-by-type/:type", eventController.getEventsByType);
router.get("/get-events-by-department/:dept", eventController.getEventsByDepartment);
router.get("/search-event", eventController.searchEvents);
router.get("/get-event-by-id/:id", eventController.getEventById);
router.put("/update-event/:id", eventController.updateEvent);
router.delete("delete-event/:id", eventController.deleteEvent);
