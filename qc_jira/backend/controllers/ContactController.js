// controllers/ContactController.js
const ContactMessage = require("../models/ContactModel");

exports.addContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message_text, agreeToLicense } =
      req.body;

    if (!email || !firstName || !lastName || !message_text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const msg = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      message_text,
      agreeToLicense,
    });

    await msg.save();
    res
      .status(201)
      .json({ message: "Contact message successfully submitted!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      error: "An error occurred while submitting the contact message.",
    });
  }
};

exports.getAllMessages = async (_req, res) => {
  try {
    const messages = await ContactMessage.find().lean();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving contact messages and replies:", error);
    res.status(500).json({
      error:
        "An error occurred while retrieving the contact messages and replies.",
    });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error retrieving message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the message." });
  }
};

exports.replyToMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    const newReply = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      timestamp: new Date(),
    };

    message.replies.push(newReply);
    await message.save();

    res.status(200).json({ message: "Reply added successfully", newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the reply." });
  }
};

exports.getUnreadCount = async (_req, res) => {
  try {
    const unreadCount = await ContactMessage.countDocuments({ isRead: false });
    res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId)
      return res.status(400).json({ error: "Message ID is required" });

    const result = await ContactMessage.updateOne(
      { _id: messageId },
      { $set: { isRead: true } }
    );

    const modified = result.modifiedCount ?? result.nModified ?? 0;
    if (modified === 0)
      return res
        .status(404)
        .json({ error: "Message not found or already marked as read" });

    res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
