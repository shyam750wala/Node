const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/userModel");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/user-registration")
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.log(`Error is : ${err}`);
  });

app.set("view engine", "ejs");

app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type!"), false);
    }
  },
});

app.post("/register", upload.array("profilePics", 5), async (req, res) => {
  try {
    const { name, email } = req.body;
    const files = req.files.map((file) => file.filename); // Store file paths

    const newUser = new User({ name, email, profilePics: files });
    await newUser.save();

    res.redirect("/uploads");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => {
  res.render("register");
});

app.get("/uploads", async (req, res) => {
  const users = await User.find();
  res.render("uploads", { users });
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
