const express = require("express");
const {
  allMessages,
  sendMessage,
  createOrUpdateMessage,
  allMessagesOfChat
} = require("../controllers/MessageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/:chaterId").get(protect, allMessages);
// router.route("/").post(protect, sendMessage);
router.route("/").post(protect, createOrUpdateMessage);
router.route("/:chaterId").get(protect, allMessagesOfChat);
module.exports = router;