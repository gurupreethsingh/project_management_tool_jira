const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const { verifyToken, isSuperAdmin } = require("../middleware/AuthMiddleware");

const { productUpload } = ProductController;

// -----------------------------------
// ROUTES
// -----------------------------------

// @route   POST /api/products/add-product
// @desc    Add a new product with main image + gallery images
// @access  Private (SuperAdmin only)
router.post(
  "/add-product",
  verifyToken,
  isSuperAdmin,
  productUpload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "all_product_images", maxCount: 5 },
  ]),
  ProductController.createProduct,
);

// @route   GET /api/products/all-added-products
// @desc    Get all products
// @access  Public
router.get("/all-added-products", ProductController.getAllProducts);

// @route   GET /api/products/get-single-added-product-by-id/:id
// @desc    Get single product by ID
// @access  Public
router.get(
  "/get-single-added-product-by-id/:id",
  ProductController.getProductById,
);

// @route   GET /api/products/get-products-by-category/:categoryId
// @desc    Get products by category ID
// @access  Public
router.get(
  "/get-products-by-category/:categoryId",
  ProductController.getProductsByCategory,
);

// @route   GET /api/products/get-products-by-subcategory/:subCategoryId
// @desc    Get products by subcategory ID
// @access  Public
router.get(
  "/get-products-by-subcategory/:subCategoryId",
  ProductController.getProductsBySubCategory,
);

// @route   GET /api/products/get-products-sorted
// @desc    Get sorted products
// @access  Public
router.get("/get-products-sorted", ProductController.getProductsSorted);

// @route   GET /api/products/recommended/history-categories
// @desc    Get recommended products from logged-in user's history categories
// @access  Private (Any logged-in user)
router.get(
  "/recommended/history-categories",
  verifyToken,
  ProductController.getRecommendedProductsFromHistory,
);

// @route   GET /api/products/recommended/history-brands
// @desc    Get recommended products from logged-in user's history brands
// @access  Private (Any logged-in user)
router.get(
  "/recommended/history-brands",
  verifyToken,
  ProductController.getPopularProductsFromHistoryBrands,
);

// @route   PUT /api/products/update-product/:id
// @desc    Update product by ID
// @access  Private (SuperAdmin only)
router.put(
  "/update-product/:id",
  verifyToken,
  isSuperAdmin,
  productUpload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "all_product_images", maxCount: 5 },
  ]),
  ProductController.updateProductById,
);

// @route   PUT /api/products/add-one-gallery-image/:id
// @desc    Add one gallery image to product
// @access  Private (SuperAdmin only)
router.put(
  "/add-one-gallery-image/:id",
  verifyToken,
  isSuperAdmin,
  productUpload.single("gallery_image"),
  ProductController.addOneGalleryImage,
);

// @route   PUT /api/products/remove-one-gallery-image/:id
// @desc    Remove one gallery image from product
// @access  Private (SuperAdmin only)
router.put(
  "/remove-one-gallery-image/:id",
  verifyToken,
  isSuperAdmin,
  ProductController.removeOneGalleryImage,
);

// @route   DELETE /api/products/delete-product/:id
// @desc    Delete product by ID
// @access  Private (SuperAdmin only)
router.delete(
  "/delete-product/:id",
  verifyToken,
  isSuperAdmin,
  ProductController.deleteProductById,
);

// @route   GET /api/products/count-all-products
// @desc    Count all products
// @access  Public
router.get("/count-all-products", ProductController.countAllProducts);

// @route   GET /api/products/count-products-by-category
// @desc    Count products by category
// @access  Public
router.get(
  "/count-products-by-category",
  ProductController.countProductsByCategory,
);

// @route   GET /api/products/count-products-by-subcategory
// @desc    Count products by subcategory
// @access  Public
router.get(
  "/count-products-by-subcategory",
  ProductController.countProductsBySubCategory,
);

// @route   GET /api/products/count-products-by-vendor
// @desc    Count products by vendor
// @access  Public
router.get(
  "/count-products-by-vendor",
  ProductController.countProductsByVendor,
);

// @route   GET /api/products/count-products-by-status
// @desc    Count products by availability status
// @access  Public
router.get(
  "/count-products-by-status",
  ProductController.countProductsByStatus,
);

// @route   GET /api/products/count-products-by-section
// @desc    Count products by section
// @access  Public
router.get(
  "/count-products-by-section",
  ProductController.countProductsBySection,
);

// @route   GET /api/products/search-products
// @desc    Search products
// @access  Public
router.get("/search-products", ProductController.searchProducts);

module.exports = router;
