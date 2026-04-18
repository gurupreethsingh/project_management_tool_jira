import axios from "axios";
import globalBackendRoute from "../config/Config";

const base = `${globalBackendRoute}/api/wishlist`;

function getAuthConfig() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
}

function normalizeWishlistPayload(data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map((item) => ({
    ...item,
    _id: String(item?._id || ""),
    addedAt: item?.addedAt || null,
    product_name: item?.product_name || "Unnamed product",
    description: item?.description || "",
    brand: item?.brand || "",
    category_name: item?.category_name || "",
    availability_status: item?.availability_status !== false,
    savedForLater: Boolean(item?.savedForLater),
  }));
}

export async function fetchWishlistApi() {
  const { data } = await axios.get(`${base}/get-wishlist`, getAuthConfig());
  return normalizeWishlistPayload(data);
}

export async function removeWishlistItemApi(productId) {
  const { data } = await axios.delete(
    `${base}/remove-from-wishlist/${productId}`,
    getAuthConfig(),
  );
  return data;
}

export async function toggleSaveForLaterApi(productId) {
  const { data } = await axios.patch(
    `${base}/toggle-save-for-later/${productId}`,
    {},
    getAuthConfig(),
  );
  return data;
}

export async function moveWishlistItemToCartApi(productId) {
  const { data } = await axios.post(
    `${base}/move-to-cart`,
    { productId },
    getAuthConfig(),
  );
  return data;
}

export async function bulkMoveWishlistToCartApi(productIds) {
  const { data } = await axios.post(
    `${base}/bulk/move-to-cart`,
    { productIds },
    getAuthConfig(),
  );
  return data;
}

export async function bulkCheckoutWishlistApi(productIds) {
  const { data } = await axios.post(
    `${base}/bulk/checkout`,
    { productIds },
    getAuthConfig(),
  );
  return data;
}

export async function bulkSaveForLaterWishlistApi(
  productIds,
  savedForLater = true,
) {
  const { data } = await axios.patch(
    `${base}/bulk/save-for-later`,
    { productIds, savedForLater },
    getAuthConfig(),
  );
  return data;
}

export async function saveAllWishlistForLaterApi(savedForLater = true) {
  const { data } = await axios.patch(
    `${base}/save-all-for-later`,
    { savedForLater },
    getAuthConfig(),
  );
  return data;
}

export async function bulkRemoveWishlistApi(productIds) {
  const { data } = await axios.delete(`${base}/bulk/remove`, {
    ...getAuthConfig(),
    data: { productIds },
  });
  return data;
}

export async function clearWishlistApi() {
  const { data } = await axios.delete(`${base}/clear`, getAuthConfig());
  return data;
}
