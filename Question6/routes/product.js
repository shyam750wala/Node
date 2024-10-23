const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getProducts,
  editProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/products", getProducts);
router.get("/products/edit/:id", editProduct);
router.post("/products", upload.array("images", 5), createProduct); // Up to 5 images
router.post("/products/update/:id", upload.array("images", 5), updateProduct);
router.post("/products/delete/:id", deleteProduct);

module.exports = router;
