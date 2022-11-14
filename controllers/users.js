const asyncHandler = require("express-async-handler");
const Users = require("../models/Users");

//render login page
exports.renderLogin = asyncHandler((req, res) => {
  res.render("users/login");
});

//render register page
exports.renderRegister = asyncHandler((req, res) => {
  res.render("users/register");
});

//register form route
exports.register = asyncHandler(async (req, res) => {
  let errors = [];

  const { name, email, password } = req.body;

  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 6) {
    errors.push({ text: "Password must be more than 6 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    const registeredUser = await Users.findOne({ email: req.body.email });
    if (registeredUser) {
      req.flash("error_msg", "Email already registered");
      res.status(400).redirect("/users/register");
    } else {
      //create user
      const user = await Users.create({ name, email, password });

      //create token
      const token = user.getSignedJwtToken();

      //create cookie
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      if (process.env.NODE_ENV === "production") {
        options.secure = true;
      }

      req.flash("success_msg", "Registered successfully, you can login now!");
      res.status(200).cookie("token", token, options).redirect("/users/login");
    }
  }
});

//login form route
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation for email & password
  if (!email || !password) {
    req.flash("error_msg", "Please add an email and password");
    res.status(400).redirect("/users/login");
    return;
  }

  //check user
  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    req.flash("error_msg", "No user found");
    res.status(400).redirect("/users/login");
    return;
  }

  //check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    req.flash("error_msg", "Invalid credentials");
    res.status(400).redirect("/users/login");
    return;
  }

  //create token
  const token = user.getSignedJwtToken();

  //create cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(200).cookie("token", token, options).redirect("/ideas");
});

//logout route
exports.logout = asyncHandler((req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  req.flash("success_msg", "Successfully logged out!");
  res.status(200).redirect("/users/login");
});
