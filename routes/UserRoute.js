const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  logout,
} = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect,allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.get("/logout",protect, logout);

module.exports = router;