// routes/ContactRoutes.js
const express = require("express");
const ContactController = require("../controllers/ContactController");

const router = express.Router();

// Contact messages
router.post("/add-contact-message", ContactController.addContactMessage);
router.get("/all-messages", ContactController.getAllMessages);
router.get("/reply-message/:id", ContactController.getMessageById);
router.post("/give-message-reply/:id/reply", ContactController.replyToMessage);
router.get("/messages/unread-count", ContactController.getUnreadCount);
router.post("/messages/mark-as-read", ContactController.markAsRead);

module.exports = router;
