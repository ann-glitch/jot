const express = require("express");
const router = express.Router();
const {
  renderIdea,
  getIdeas,
  postIdeas,
  getEditIdea,
  updateIdea,
  deleteIdea,
} = require("../controllers/ideas");
const { protect } = require("../middleware/auth");

router.route("/add").get(protect, renderIdea);

router.route("/").get(protect, getIdeas).post(protect, postIdeas);

router.route("/:id").put(protect, updateIdea).delete(protect, deleteIdea);

router.route("/edit/:id").get(protect, getEditIdea);

module.exports = router;
