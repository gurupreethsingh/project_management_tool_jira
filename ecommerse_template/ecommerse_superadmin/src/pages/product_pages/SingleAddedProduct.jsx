// pages/product_pages/SingleAddedProduct.jsx
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaTags,
  FaWarehouse,
  FaStore,
  FaCube,
  FaPalette,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaPercentage,
  FaListOl,
  FaClock,
  FaFlag,
  FaGlobe,
  FaCheck,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import ModernFileInput from "../../components/common_components/ModernFileInput";
import ModernTextInput from "../../components/common_components/MordernTextInput";

export default function SingleAddedProduct() {
  const [productData, setProductData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});
  const [newMainImage, setNewMainImage] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/get-single-added-product-by-id/${id}`
        );
        setProductData(response.data);

        const dataCopy = { ...response.data };
        delete dataCopy.vendor;
        delete dataCopy.outlet;
        delete dataCopy.category;
        delete dataCopy.subcategory;
        setUpdatedFields(dataCopy);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // Append all updated fields
      Object.entries(updatedFields).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val);
          }
        }
      });

      // Handle new main image
      if (newMainImage) {
        formData.append("product_image", newMainImage);
      }

      // Handle new gallery images
      if (newGalleryImages.length > 0) {
        newGalleryImages.forEach((file) => {
          formData.append("all_product_images", file);
        });
      }

      await axios.put(
        `${globalBackendRoute}/api/update-product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product. Please try again.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    return `${globalBackendRoute}/${imagePath.replace(/\\/g, "/")}`;
  };

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "NA" : val;

  if (!productData)
    return <div className="text-center py-6 text-sm">Loading...</div>;

  const allFields = [
    { icon: <FaUser />, label: "Product Name", key: "product_name" },
    { icon: <FaTags />, label: "SKU", key: "sku" },
    { icon: <FaWarehouse />, label: "Stock", key: "stock" },
    { icon: <FaStore />, label: "Brand", key: "brand" },
    { icon: <FaPalette />, label: "Color", key: "color" },
    { icon: <FaCube />, label: "Material", key: "material" },
    { icon: <FaClipboardList />, label: "Display Price", key: "display_price" },
    { icon: <FaClipboardList />, label: "Selling Price", key: "selling_price" },
    { icon: <FaStar />, label: "Avg Rating", key: "avg_rating" },
    { icon: <FaClipboardList />, label: "Total Reviews", key: "total_reviews" },
    { icon: <FaChartLine />, label: "Total Sold", key: "total_products_sold" },
    { icon: <FaTags />, label: "Tags", key: "tags" },
    { icon: <FaPercentage />, label: "Discount", key: "discount" },
    { icon: <FaListOl />, label: "Min Qty", key: "min_purchase_qty" },
    { icon: <FaListOl />, label: "Max Qty", key: "max_purchase_qty" },
    {
      icon: <FaClock />,
      label: "Delivery Estimate",
      key: "delivery_time_estimate",
    },
    { icon: <FaFlag />, label: "Origin Country", key: "origin_country" },
    { icon: <FaGlobe />, label: "Availability", key: "availability_status" },
    { icon: <FaCheck />, label: "Featured", key: "featured" },
    { icon: <FaCheck />, label: "New Arrival", key: "is_new_arrival" },
    { icon: <FaCheck />, label: "Trending", key: "is_trending" },
    { icon: <FaTags />, label: "Meta Title", key: "meta_title" },
    { icon: <FaTags />, label: "Meta Description", key: "meta_description" },
    { icon: <FaTags />, label: "Slug", key: "slug" },
    {
      icon: <FaClipboardList />,
      label: "Section Appear",
      key: "section_to_appear",
    },
    { icon: <FaTags />, label: "Version", key: "version" },
    { icon: <FaTags />, label: "Admin Notes", key: "admin_notes" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="containerWidth my-4"
    >
      {/* Compact header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            {safe(productData.product_name)}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            SKU: {safe(productData.sku)} • Brand: {safe(productData.brand)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => (editMode ? handleUpdate() : setEditMode(true))}
            className="primaryBtn px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
          >
            <MdEdit className="text-sm" /> {editMode ? "Save" : "Edit"}
          </button>

          <Link
            to="/all-added-products"
            className="secondaryBtn px-3 py-1.5 rounded-full text-xs"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Dense two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: images (sticky on desktop) */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-4"
        >
          <div className="lg:sticky lg:top-4 space-y-2">
            {/* Main image */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
              <div className="w-full aspect-[4/3] bg-gray-50">
                <img
                  src={getImageUrl(productData.product_image)}
                  alt={productData.product_name || "Product"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Uploads only in edit mode */}
              {editMode && (
                <div className="p-2 space-y-2">
                  <ModernFileInput
                    label="Update Main Product Image"
                    multiple={false}
                    onFileSelect={(file) => setNewMainImage(file)}
                  />
                  <ModernFileInput
                    label="Update Gallery Images (Max 10)"
                    multiple={true}
                    maxFiles={10}
                    onFileSelect={(files) => setNewGalleryImages(files)}
                  />
                </div>
              )}
            </div>

            {/* Gallery preview: compact, dense grid */}
            {productData.all_product_images?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-lg p-2">
                <p className="text-[11px] font-semibold text-gray-700 mb-2">
                  Gallery ({productData.all_product_images.length})
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 gap-1.5">
                  {productData.all_product_images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-100"
                      title={`Gallery ${i + 1}`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: details (dense rows) */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-800">
                Product Details
              </p>
              <p className="text-[11px] text-gray-500">
                Compact view (scroll less)
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {allFields.map((field, idx) => (
                <ProductFieldCompact
                  key={idx}
                  icon={field.icon}
                  label={field.label}
                  value={
                    editMode && field.key ? (
                      <ModernTextInput
                        value={updatedFields[field.key] || ""}
                        onChange={(e) =>
                          setUpdatedFields((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      safe(updatedFields[field.key])
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductFieldCompact({ icon, label, value }) {
  return (
    <div className="px-3 py-2">
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
          <span className="text-gray-500 text-[12px]">{icon}</span>
          <span className="text-[12px] font-medium text-gray-700 truncate">
            {label}
          </span>
        </div>

        <div className="col-span-7 sm:col-span-8">
          <div className="text-[12px] text-gray-900 leading-5">
            {typeof value === "string" || typeof value === "number" ? (
              <span className="break-words">{value}</span>
            ) : (
              value
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
