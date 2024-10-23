const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Student = require("./models/student");
const app = express();

const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((err) => {
    console.log(`Error is : ${err}`);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Express session setup with MongoStore
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/studentDB", // Use 127.0.0.1
    }),
    cookie: { maxAge: 60000 * 60 }, // 1 hour session
  })
);

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login", { message: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await user.comparePassword(password))) {
    req.session.userId = user._id; // Store user ID in the session
    res.redirect("/students");
  } else {
    res.render("login", { message: "Invalid credentials!" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Display All Students (Read)
app.get("/students", isAuthenticated, async (req, res) => {
  const students = await Student.find();
  res.render("students", { students });
});

// Create Student Form
app.get("/students/new", isAuthenticated, (req, res) => {
  res.render("new-student");
});

// Handle Student Creation
app.post("/students", isAuthenticated, async (req, res) => {
  const { name, age, course } = req.body;
  const student = new Student({ name, age, course });
  await student.save();
  res.redirect("/students");
});

// Edit Student Form
app.get("/students/edit/:id", isAuthenticated, async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("edit-student", { student });
});

// Handle Student Update
app.post("/students/edit/:id", isAuthenticated, async (req, res) => {
  const { name, age, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, course });
  res.redirect("/students");
});

// Delete Student
app.post("/students/delete/:id", isAuthenticated, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/students");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
