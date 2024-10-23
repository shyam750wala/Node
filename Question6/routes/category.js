const express = require("express");
const {
  createCategory,
  getCategories,
  editCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/edit/:id", editCategory);
router.post("/categories", createCategory);
router.post("/categories/update/:id", updateCategory);
router.post("/categories/delete/:id", deleteCategory);

module.exports = router;
