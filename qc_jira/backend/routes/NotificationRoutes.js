// // routes/NotificationRoutes.js
// const express = require("express");
// const router = express.Router();
// const NotificationController = require("../controllers/NotificationController");
// const {
//   protect,
//   isAdminOrSuperadmin,
// } = require("../middleware/authMiddleware");

// /* ======== SEND ======== */
// router.post(
//   "/send-notification-to-all-users",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.sendToAbsolutelyAll
// );

// router.post(
//   "/send-notification-to-all",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.sendNotificationToAll
// );

// router.post(
//   "/send-notification-to-one",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.sendNotificationToOne
// );

// /* ======== USER INBOX / ACTIONS ======== */
// router.get(
//   "/get-user-notifications/:userId",
//   protect,
//   NotificationController.getUserNotifications
// );

// router.put(
//   "/mark-read/:notificationId",
//   protect,
//   NotificationController.markAsRead
// );

// router.put(
//   "/mark-seen/:notificationId",
//   protect,
//   NotificationController.markAsSeen
// );

// router.put(
//   "/reply-to-notification/:notificationId",
//   protect,
//   NotificationController.replyToNotification
// );

// router.delete(
//   "/delete-notification/:notificationId",
//   protect,
//   NotificationController.deleteNotification
// );

// /* ======== COUNTS ======== */
// router.get(
//   "/count-notifications/:userId",
//   protect,
//   NotificationController.countNotifications
// );

// router.get(
//   "/counts/role/:role",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.countByRole
// );

// router.get(
//   "/counts/admin/all",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.countAllMessages
// );

// /* ======== LISTING ======== */
// // Admin list with filters
// router.get(
//   "/admin/messages",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.adminListAllMessages
// );

// // Role list with filters
// router.get(
//   "/role/:role/messages",
//   protect,
//   isAdminOrSuperadmin,
//   NotificationController.listMessagesByRole
// );

// module.exports = router;

//

const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const {
  protect,
  isAdminOrSuperadmin,
} = require("../middleware/authMiddleware");

/* ======== SEND ======== */
router.post(
  "/send-notification-to-all-users",
  protect,
  isAdminOrSuperadmin,
  NotificationController.sendToAbsolutelyAll
);
router.post(
  "/send-notification-to-all",
  protect,
  isAdminOrSuperadmin,
  NotificationController.sendNotificationToAll
);
router.post(
  "/send-notification-to-one",
  protect,
  isAdminOrSuperadmin,
  NotificationController.sendNotificationToOne
);

/* ======== USER INBOX / ACTIONS ======== */
router.get(
  "/get-user-notifications/:userId",
  protect,
  NotificationController.getUserNotifications
);
router.put(
  "/mark-read/:notificationId",
  protect,
  NotificationController.markAsRead
);
router.put(
  "/mark-seen/:notificationId",
  protect,
  NotificationController.markAsSeen
);
router.put(
  "/reply-to-notification/:notificationId",
  protect,
  NotificationController.replyToNotification
);
router.delete(
  "/delete-notification/:notificationId",
  protect,
  NotificationController.deleteNotification
);

/* ======== COUNTS ======== */
router.get(
  "/count-notifications/:userId",
  protect,
  NotificationController.countNotifications
);
router.get(
  "/counts/role/:role",
  protect,
  isAdminOrSuperadmin,
  NotificationController.countByRole
);
router.get(
  "/counts/admin/all",
  protect,
  isAdminOrSuperadmin,
  NotificationController.countAllMessages
);

/* ======== LISTING (ADMIN / ROLE) ======== */
router.get(
  "/admin/messages",
  protect,
  isAdminOrSuperadmin,
  NotificationController.adminListAllMessages
);
router.get(
  "/role/:role/messages",
  protect,
  isAdminOrSuperadmin,
  NotificationController.listMessagesByRole
);

module.exports = router;
