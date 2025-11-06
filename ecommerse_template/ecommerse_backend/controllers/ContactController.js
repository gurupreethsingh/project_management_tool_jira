// controllers/contact.controller.js
const ContactModel = require("../models/ContactModel");
const nodemailer = require("nodemailer");

// --- email helper ---
const sendReplyEmail = async (userEmail, userName, originalMessage, replyContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "New Reply to Your Message",
      text: `Dear ${userName || "Customer"},\n\nWe have responded to your message: "${originalMessage}".\n\nReply from our team:\n"${replyContent}"\n\nThank you for reaching out to us.\n\nBest regards,\nEcoders Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reply email sent:", info.response);
  } catch (err) {
    console.error("Error sending reply email:", err.message);
  }
};

// --- create contact message ---
exports.addContactMessage = async (req, res) => {
  try {
    let {
      firstName,
      lastName,       // optional
      email,
      phone,          // optional
      message_text,
      agreeToLicense,
    } = req.body;

    // Basic required checks (lastName intentionally NOT required)
    if (!firstName || !email || !message_text) {
      return res.status(400).json({ error: "firstName, email and message_text are required" });
    }

    // agreeToLicense is required by schema; ensure it's present (usually a boolean)
    if (typeof agreeToLicense === "undefined") {
      return res.status(400).json({ error: "agreeToLicense is required" });
    }

    // normalize inputs
    email = String(email).trim().toLowerCase();
    firstName = String(firstName).trim();
    if (lastName) lastName = String(lastName).trim();
    if (phone) phone = String(phone).trim();
    message_text = String(message_text).trim();

    const newContactMessage = new ContactModel({
      firstName,
      lastName,   // may be undefined; schema allows it
      email,
      phone,
      message_text,
      agreeToLicense,
    });

    await newContactMessage.save();

    return res
      .status(201)
      .json({ message: "Contact message successfully submitted!", data: newContactMessage });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return res.status(500).json({
      error: "An error occurred while submitting the contact message.",
    });
  }
};

// --- get all messages ---
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactModel.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    return res.status(500).json({ error: "An error occurred while fetching messages." });
  }
};

// --- get by id ---
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactModel.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error retrieving message:", error);
    return res.status(500).json({ error: "An error occurred while retrieving the message." });
  }
};

// --- add a reply + email notify ---
exports.addReplyToMessage = async (req, res) => {
  try {
    const messageDoc = await ContactModel.findById(req.params.id);
    if (!messageDoc) return res.status(404).json({ error: "Message not found" });

    const { name, email: replyEmail, message } = req.body;

    // Validate reply payload (name + message are required)
    if (!name || !message) {
      return res.status(400).json({ error: "Reply 'name' and 'message' are required" });
    }

    const replyObj = {
      name: String(name).trim(),
      email: (replyEmail ? String(replyEmail).trim().toLowerCase() : messageDoc.email),
      message: String(message).trim(),
      timestamp: new Date(),
    };

    messageDoc.replies.push(replyObj);
    await messageDoc.save();

    // Fire-and-forget email (handled with internal try/catch)
    await sendReplyEmail(
      messageDoc.email,
      messageDoc.firstName,
      messageDoc.message_text,
      replyObj.message
    );

    return res.status(200).json({ message: "Reply added successfully", reply: replyObj });
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ error: "An error occurred while adding the reply." });
  }
};

// --- unread count ---
exports.getUnreadMessagesCount = async (req, res) => {
  try {
    const unreadCount = await ContactModel.countDocuments({ isRead: false });
    return res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// --- mark as read ---
exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    const result = await ContactModel.updateOne(
      { _id: messageId },
      { $set: { isRead: true } }
    );

    // For Mongoose ≥6, use matchedCount / modifiedCount
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(200).json({ success: true, message: "Already marked as read" });
    }

    return res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- total/read/unread counts ---
exports.getMessagesCount = async (req, res) => {
  try {
    const totalMessagesCount = await ContactModel.countDocuments();
    const unreadMessagesCount = await ContactModel.countDocuments({ isRead: false });
    const readMessagesCount = totalMessagesCount - unreadMessagesCount;

    return res.status(200).json({
      totalMessages: totalMessagesCount,
      unreadMessages: unreadMessagesCount,
      readMessages: readMessagesCount,
    });
  } catch (error) {
    console.error("Error fetching message counts:", error);
    return res.status(500).json({ error: "An error occurred while fetching counts." });
  }
};
