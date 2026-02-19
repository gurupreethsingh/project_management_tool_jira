// controllers/SubscriptionController.js
const Subscription = require("../models/SubscriptionModel");

// Handle new subscriptions
const subscribe = async (req, res) => {
  try {
    let { email, subscriptionType } = req.body;

    email = String(email || "")
      .trim()
      .toLowerCase();
    subscriptionType = String(subscriptionType || "newsletter").trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    let subscription = await Subscription.findOne({ email });

    if (subscription && subscription.isActive) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    if (subscription && !subscription.isActive) {
      // Reactivate subscription if previously canceled
      subscription.isActive = true;
      subscription.subscriptionType =
        subscriptionType || subscription.subscriptionType;
      subscription.canceledAt = null;
      await subscription.save();
    } else {
      // Create a new subscription
      subscription = new Subscription({
        email,
        subscriptionType,
      });
      await subscription.save();
    }

    return res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);
    return res.status(500).json({
      message: error?.message || "Server error",
    });
  }
};

// Fetch all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("GET SUBSCRIPTIONS ERROR:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Cancel subscription
const unsubscribe = async (req, res) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();

  try {
    const subscription = await Subscription.findOne({ email });
    if (!subscription || !subscription.isActive) {
      return res
        .status(404)
        .json({ message: "Subscription not found or already canceled." });
    }

    await subscription.cancelSubscription();
    return res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (error) {
    console.error("UNSUBSCRIBE ERROR:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Resubscribe
const resubscribe = async (req, res) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();

  try {
    const subscription = await Subscription.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    subscription.isActive = true;
    subscription.canceledAt = null;
    await subscription.save();

    return res.status(200).json({ message: "Resubscribed successfully!" });
  } catch (error) {
    console.error("RESUBSCRIBE ERROR:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get total subscription count
const getSubscriptionCount = async (req, res) => {
  try {
    const count = await Subscription.countDocuments({ isActive: true });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("COUNT ERROR:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

module.exports = {
  subscribe,
  getAllSubscriptions,
  unsubscribe,
  resubscribe,
  getSubscriptionCount,
};
