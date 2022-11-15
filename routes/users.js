const express = require("express");
const router = express.Router();
const {
  renderLogin,
  renderRegister,
  register,
  login,
  logout,
} = require("../controllers/users");
const { protect } = require("../middleware/auth");

router.route("/login").get(renderLogin).post(login);

router.route("/register").get(renderRegister).post(register);

router.route("/logout").get(protect, logout);

module.exports = router;
