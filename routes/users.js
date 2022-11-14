const express = require("express");
const router = express.Router();
const {
  renderLogin,
  renderRegister,
  register,
  login,
  logout,
} = require("../controllers/users");

router.route("/login").get(renderLogin).post(login);

router.route("/register").get(renderRegister).post(register);

router.route("/logout").get(logout);

module.exports = router;
