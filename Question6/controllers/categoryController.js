const Category = require("../models/category");

// Create Category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.redirect("/categories");
};

// List Categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.render("categories/index", { categories });
};

// Edit Category
exports.editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("categories/edit", { category });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  await Category.findByIdAndUpdate(req.params.id, { name });
  res.redirect("/categories");
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
};
