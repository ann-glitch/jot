const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const asyncHandler = require("express-async-handler");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //make sure token exists
  if (!token) {
    req.flash("error_msg", "Not Authorized to access this route");
    res.status(401).redirect("/users/login");
    return;
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    req.user = await Users.findById(decoded.id);

    next();
  } catch (err) {
    req.flash("error_msg", "Not Authorized");
    res.status(401).redirect("/users/login");
    return;
  }
});
