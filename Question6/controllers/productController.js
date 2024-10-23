const Product = require("../models/product");
const Category = require("../models/category");
const path = require("path");
const fs = require("fs");

// Create Product
exports.createProduct = async (req, res) => {
  const { name, price, description, category } = req.body;

  const images = req.files.map((file) => `/uploads/${file.filename}`);
  const product = new Product({ name, price, description, category, images });
  await product.save();
  res.redirect("/products");
};

// List Products
exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  res.render("products/index", { products });
};

// Edit Product
exports.editProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  const categories = await Category.find();
  res.render("products/edit", { product, categories });
};

// Update Product
exports.updateProduct = async (req, res) => {
  const { name, price, description, category } = req.body;

  // If new images are uploaded
  let images = req.body.oldImages || [];
  if (req.files) {
    images = images.concat(
      req.files.map((file) => `/uploads/${file.filename}`)
    );
  }
  await Product.findByIdAndUpdate(req.params.id, {
    name,
    price,
    description,
    category,
    images,
  });
  res.redirect("/products");
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.images.forEach((image) =>
    fs.unlinkSync(path.join(__dirname, "../public", image))
  ); // Delete images from server
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
};
