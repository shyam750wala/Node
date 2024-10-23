const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => {
    console.log("Connected with database");
  })
  .catch((err) => {
    console.log(`Error is : ${err}`);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Routes
app.use(categoryRoutes);
app.use(productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
