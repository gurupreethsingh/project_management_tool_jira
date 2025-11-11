// routes/EventRoutes.js
const router = require("express").Router();
const C = require("../controllers/EventController");

// CRUD + listing
router.post("/events", C.createEvent);
router.get("/events", C.listEvents);
router.get("/events/visible", C.listVisibleToMe);
router.get("/events/count/all", C.countAll);
router.get("/events/count/status", C.countByStatus);
router.get("/events/count/upcoming", C.countUpcoming);
router.get("/events/count/live", C.countLive);
router.get("/events/count/audience", C.countByAudienceMode);
router.get("/events/:id/visible", C.getVisibleEventForUser);
router.get("/events/:id", C.getEventById);

router.put("/events/:id", C.updateEvent);
router.delete("/events/:id", C.softDeleteEvent);
router.post("/events/:id/restore", C.restoreEvent);
router.delete("/events/:id/hard", C.hardDeleteEvent);

// status & schedule
router.post("/events/:id/publish", C.publishEvent);
router.post("/events/:id/unpublish", C.unpublishEvent);
router.post("/events/:id/reschedule", C.rescheduleEvent);
router.post("/events/:id/restart", C.restartEvent);
router.post("/events/:id/cancel", C.cancelEvent);
router.post("/events/:id/postpone", C.postponeEvent);

// audience & details
router.post("/events/:id/audience/mode", C.setAudienceMode);
router.post("/events/:id/audience/roles/add", C.addAudienceRoles);
router.post("/events/:id/audience/roles/remove", C.removeAudienceRole);
router.post("/events/:id/audience/users/add", C.addAudienceUsers);
router.post("/events/:id/audience/users/remove", C.removeAudienceUser);
router.post("/events/:id/reminders/add", C.addReminder);
router.post("/events/:id/reminders/remove", C.removeReminder);
router.post("/events/:id/attachments/add", C.addAttachment);
router.post("/events/:id/attachments/remove", C.removeAttachment);
router.post("/events/:id/tags/add", C.addTag);
router.post("/events/:id/tags/remove", C.removeTag);

// transfers
router.post("/events/:id/transfer/owner", C.transferOwnership);
router.post("/events/:id/transfer/entity", C.transferToEntity);
router.post("/events/:id/organizers/replace", C.replaceOrganizers);

// bulk
router.post("/events/bulk/publish", C.bulkPublish);
router.post("/events/bulk/unpublish", C.bulkUnpublish);
router.post("/events/bulk/soft-delete", C.bulkSoftDelete);
router.post("/events/bulk/restore", C.bulkRestore);
router.post("/events/bulk/hard-delete", C.bulkHardDelete);
router.post("/events/bulk/status", C.bulkStatus);
router.post("/events/bulk/reschedule", C.bulkReschedule);
router.post("/events/bulk/transfer-owner", C.bulkTransferOwnership);

// === Minimal endpoints your SingleUserEvent.jsx calls ===
// Use .all to accept POST (your code) and any other method (defensive).
router.all("/events/:id/seen", C.markSeen);
router.all("/events/:id/rsvp", C.rsvp);

// === No-op notification endpoints to silence 404s from the UI ===
router.all("/notifications/:id/read", C.markNotificationReadById);
router.all("/notifications/mark-read", C.markNotificationReadLegacy);

module.exports = router;
