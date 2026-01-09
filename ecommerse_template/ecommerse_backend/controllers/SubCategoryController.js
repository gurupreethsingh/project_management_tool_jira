const SubCategory = require("../models/SubCategoryModel");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

// small helper
function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ✅ Create a new subcategory (NO DUPLICATES, revive if soft-deleted)
const addSubCategory = async (req, res) => {
  try {
    const { subcategory_name, category } = req.body;

    // validations
    if (!subcategory_name || !String(subcategory_name).trim()) {
      return res.status(400).json({ message: "subcategory_name is required" });
    }
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Valid category is required" });
    }

    const catExists = await Category.findById(category).select("_id");
    if (!catExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const rawName = String(subcategory_name).trim();
    const normalized = normalizeName(rawName);

    // ✅ Check existing (case-insensitive via normalized)
    const existing = await SubCategory.findOne({
      category,
      subcategory_name_normalized: normalized,
    });

    // ✅ If exists & active -> block
    if (existing && existing.isDeleted === false) {
      return res.status(400).json({
        message: "Subcategory already exists under this category",
      });
    }

    // ✅ If exists but soft-deleted -> revive it
    if (existing && existing.isDeleted === true) {
      existing.isDeleted = false;
      existing.subcategory_name = rawName; // keep latest casing user typed
      existing.subcategory_name_normalized = normalized;
      await existing.save();

      return res.status(200).json({
        message: "Subcategory restored successfully",
        subcategory: existing,
      });
    }

    // ✅ Create new
    const newSubCategory = new SubCategory({
      subcategory_name: rawName,
      subcategory_name_normalized: normalized,
      category,
    });

    await newSubCategory.save();

    return res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: newSubCategory,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);

    // ✅ handle unique index collision
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Subcategory already exists under this category",
      });
    }

    return res.status(500).json({ message: "Error adding subcategory" });
  }
};

// ✅ Get all subcategories (active only)
const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ isDeleted: false }).populate(
      "category"
    );
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};

// ✅ Get single subcategory by ID
const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate(
      "category"
    );
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ message: "Error fetching subcategory" });
  }
};

// ✅ Update subcategory (also prevents duplicates)
const updateSubCategory = async (req, res) => {
  try {
    const { subcategory_name, category } = req.body;

    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // if category update provided, validate it
    let nextCategory = subcategory.category;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Valid category is required" });
      }
      const catExists = await Category.findById(category).select("_id");
      if (!catExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      nextCategory = category;
    }

    // if name update provided, normalize & check duplicates
    let nextName = subcategory.subcategory_name;
    let nextNorm = subcategory.subcategory_name_normalized;

    if (subcategory_name && String(subcategory_name).trim()) {
      nextName = String(subcategory_name).trim();
      nextNorm = normalizeName(nextName);
    }

    // ✅ duplicate check (exclude itself)
    const duplicate = await SubCategory.findOne({
      _id: { $ne: subcategory._id },
      category: nextCategory,
      subcategory_name_normalized: nextNorm,
    });

    if (duplicate && duplicate.isDeleted === false) {
      return res.status(400).json({
        message:
          "Another subcategory with this name already exists in this category",
      });
    }

    // apply changes
    subcategory.category = nextCategory;
    subcategory.subcategory_name = nextName;
    subcategory.subcategory_name_normalized = nextNorm;

    const updated = await subcategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory: updated,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);

    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Subcategory already exists under this category",
      });
    }

    res.status(500).json({ message: "Error updating subcategory" });
  }
};

// ✅ Soft delete subcategory
const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.isDeleted = true;
    await subcategory.save();

    res.status(200).json({ message: "Subcategory soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};

// Count all subcategories
const countAllSubCategories = async (req, res) => {
  try {
    const count = await SubCategory.countDocuments();
    res.status(200).json({ total_subcategories: count });
  } catch (error) {
    res.status(500).json({ message: "Error counting subcategories" });
  }
};

// Count non-deleted subcategories
const countActiveSubCategories = async (req, res) => {
  try {
    const count = await SubCategory.countDocuments({ isDeleted: false });
    res.status(200).json({ active_subcategories: count });
  } catch (error) {
    res.status(500).json({ message: "Error counting active subcategories" });
  }
};

// Count subcategories per category (active only)
const countSubCategoriesPerCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    const counts = await Promise.all(
      categories.map(async (cat) => {
        const count = await SubCategory.countDocuments({
          category: cat._id,
          isDeleted: false,
        });
        return {
          categoryId: cat._id,
          categoryName: cat.category_name,
          subcategoryCount: count,
        };
      })
    );
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error counting subcategories per category:", error);
    res
      .status(500)
      .json({ message: "Error counting subcategories per category" });
  }
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  countAllSubCategories,
  countActiveSubCategories,
  countSubCategoriesPerCategory,
};
