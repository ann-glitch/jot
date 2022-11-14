const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

//load env vars
dotenv.config({ path: "./config/.env" });

//mongoose connection
connectDB();

//Handlebars middlewares
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser
app.use(cookieParser());

//static
app.use(express.static(path.join(__dirname, "public")));

//method-override middleware
app.use(methodOverride("_method"));

//express-session middleware
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);

//connect-flash middleware
app.use(flash());

//global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
//home router
app.get("/", (req, res) => {
  res.render("index");
});

//about router
app.get("/about", (req, res) => {
  res.render("about");
});

//route files
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//mount routers
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`.cyan);
});
