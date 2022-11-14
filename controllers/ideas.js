const Ideas = require("../models/Ideas");
const asyncHandler = require("express-async-handler");

//render idea form
exports.renderIdea = asyncHandler((req, res) => {
  res.render("ideas/add");
});

//process form
exports.postIdeas = asyncHandler(async (req, res) => {
  let errors = [];

  //add user to req.body
  req.body.user = req.user.id;

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  }
  const idea = {
    title: req.body.title,
    details: req.body.details,
    user: req.user.id,
  };
  await Ideas.create(idea);

  req.flash("success_msg", "Video idea added");
  res.status(201).redirect("/ideas");
});

//get form data
exports.getIdeas = asyncHandler(async (req, res) => {
  const data = await Ideas.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();

  res.status(200).render("ideas/index", {
    data,
  });
});

//get edit idea form
exports.getEditIdea = asyncHandler(async (req, res) => {
  const data = await Ideas.findById({ _id: req.params.id }).lean();

  res.status(200).render("ideas/edit", { data });
});

//update idea
exports.updateIdea = asyncHandler(async (req, res) => {
  const idea = await Ideas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  // make sure user is idea owner
  if (idea.user !== req.user.id) {
    req.flash("error_msg", "Not authorized");
    res.status(401).redirect("/ideas");
    return;
  } else {
    req.flash("success_msg", "Video idea updated");
    res.status(200).redirect("/ideas");
  }
});

//delete idea
exports.deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Ideas.deleteOne({ _id: req.params.id }).lean();

  // make sure user is idea owner
  if (idea.user !== req.user.id) {
    req.flash("error_msg", "Not authorized");
    res.status(401).redirect("/ideas");
    return;
  } else {
    req.flash("success_msg", "Video idea removed");
    res.status(200).redirect("/ideas");
  }
});
