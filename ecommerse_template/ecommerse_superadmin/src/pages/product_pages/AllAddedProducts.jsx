import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import globalBackendRoute from "../../config/Config";
import SearchBar from "../../components/common_components/SearchBar";
import stopwords from "../../components/common_components/stopwords";

const AllAddedProducts = () => {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/all-added-products`
        );
        setProducts(res.data);
        setTotalCount(res.data.length);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (img) => {
    if (img) {
      const normalized = img.replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/products/${normalized}`;
    }
    return "https://via.placeholder.com/150";
  };

  const handleImageError = (e) => {
    if (!e.target.dataset.fallback) {
      e.target.src = "https://via.placeholder.com/150";
      e.target.dataset.fallback = "true";
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `${globalBackendRoute}/api/delete-product/${productId}`
      );
      if (res.status === 200) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  const filteredProducts = searchQuery.trim()
    ? products.filter((product) => {
        const fullText =
          `${product.product_name} ${product.sku} ${product.brand}`.toLowerCase();
        const queryWords = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word && !stopwords.includes(word));
        return queryWords.some((word) => fullText.includes(word));
      })
    : products;

  return (
    <div className="fullWidth py-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="headingText">
            All Products
            <span className="text-xs text-gray-500 ml-2">
              Showing {filteredProducts.length} of {totalCount}
            </span>
          </h2>

          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <FaThList
                className={`text-lg cursor-pointer ${
                  view === "list" ? "text-indigo-600" : "text-gray-500"
                }`}
                onClick={() => setView("list")}
                title="List"
              />
              <FaThLarge
                className={`text-lg cursor-pointer ${
                  view === "card" ? "text-indigo-600" : "text-gray-500"
                }`}
                onClick={() => setView("card")}
                title="Card"
              />
              <FaTh
                className={`text-lg cursor-pointer ${
                  view === "grid" ? "text-indigo-600" : "text-gray-500"
                }`}
                onClick={() => setView("grid")}
                title="Grid"
              />
            </div>

            <div className="min-w-[220px]">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No products found.
            </p>
          ) : view === "grid" ? (
            // ✅ ULTRA COMPACT GRID (image + name only)
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 2xl:grid-cols-12 gap-2">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/single-added-product/${product._id}`}
                  className="group relative bg-white border border-gray-100 rounded-md overflow-hidden hover:border-gray-200 hover:shadow-sm transition"
                  title={product.product_name}
                >
                  <div className="relative w-full aspect-square bg-gray-50">
                    <img
                      src={getImageUrl(product.product_image)}
                      alt={product.product_name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProduct(product._id);
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition
                                 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash className="text-[12px]" />
                    </button>
                  </div>

                  <div className="px-1.5 py-1">
                    <p className="text-[11px] leading-4 font-medium text-gray-800 truncate">
                      {product.product_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // ✅ COMPACT LIST/CARD VIEWS (image + name only)
            <div
              className={
                view === "card"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2"
                  : "space-y-2"
              }
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/single-added-product/${product._id}`}
                  className={
                    view === "card"
                      ? "group relative bg-white border border-gray-100 rounded-md overflow-hidden hover:border-gray-200 hover:shadow-sm transition"
                      : "group relative flex items-center gap-2 bg-white border border-gray-100 rounded-md px-2 py-1.5 hover:border-gray-200 hover:shadow-sm transition"
                  }
                  title={product.product_name}
                >
                  {view === "card" ? (
                    <>
                      <div className="relative w-full aspect-square bg-gray-50">
                        <img
                          src={getImageUrl(product.product_image)}
                          alt={product.product_name}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteProduct(product._id);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition
                                     bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash className="text-[12px]" />
                        </button>
                      </div>
                      <div className="px-1.5 py-1">
                        <p className="text-[11px] leading-4 font-medium text-gray-800 truncate">
                          {product.product_name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                        <img
                          src={getImageUrl(product.product_image)}
                          alt={product.product_name}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <p className="text-[12px] font-medium text-gray-800 truncate flex-1">
                        {product.product_name}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProduct(product._id);
                        }}
                        className="opacity-80 hover:opacity-100 transition
                                   bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                        title="Delete"
                      >
                        <FaTrash className="text-[12px]" />
                      </button>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAddedProducts;
