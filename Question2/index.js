const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bcrypt = require("bcryptjs");
const path = require("path");
const { users } = require("./models/users");

const app = express();
const PORT = 3000;

// Middleware to parse request body and set the view engine to EJS
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Set up the session with a file store
app.use(
  session({
    store: new FileStore({ path: "./sessions", retries: 1 }), // Session file storage path
    secret: "yourSecretKey", // Change to a more secure key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }, // Session expires after 1 minute
  })
);

// Helper function to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Route to render login page
app.get("/login", (req, res) => {
  res.render("login", { message: null });
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (user) {
    // Compare hashed password
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user; // Store user details in session
      return res.redirect("/dashboard");
    }
  }

  res.render("login", { message: "Invalid credentials!" });
});

// Route to render registration page
app.get("/register", (req, res) => {
  res.render("register", { message: null });
});

// Handle registration form submission
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users.find((u) => u.username === username)) {
    return res.render("register", { message: "Username already exists!" });
  }

  // Hash password before storing
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Add new user to "database"
  users.push({ username, password: hashedPassword });

  res.redirect("/login");
});

// Route for dashboard (protected)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
