import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import globalBackendRoute from "../../config/Config";
import { AuthContext } from "../auth_components/AuthManager";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const authHeaders = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const emit = (name, detail = {}) => {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch {
      /* no-op */
    }
  };

  // -------- Fetch wishlist from server (mounted under /api/wishlist/*) --------
  const fetchWishlist = async () => {
    const t = localStorage.getItem("token");
    if (!t) {
      setWishlistItems([]);
      return;
    }
    try {
      setWishlistLoading(true);
      const res = await axios.get(
        `${globalBackendRoute}/api/get-wishlist`,
        { headers: authHeaders() }
      );
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setWishlistItems(items);
      emit("wishlist:changed", { action: "fetch", count: items.length });
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setWishlistItems([]);
      } else {
        console.error("Wishlist fetch error:", err);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  // Hydrate once on mount (if token exists)
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when login changes
  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Cross-tab login/logout
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          fetchWishlist();
        } else {
          setWishlistItems([]);
          emit("wishlist:changed", { action: "cleared" });
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // -------- Local helpers for optimistic UI --------
  const addItemToLocalWishlist = (course) => {
    setWishlistItems((prev) => {
      const id = String(course?._id || "");
      if (!id) return prev;
      if (prev.some((p) => String(p._id) === id)) return prev;
      const next = [...prev, course];
      emit("wishlist:changed", { action: "add:local", courseId: id, count: next.length });
      return next;
    });
  };

  const removeItemFromLocalWishlist = (courseId) => {
    setWishlistItems((prev) => {
      const next = prev.filter((item) => String(item._id) !== String(courseId));
      emit("wishlist:changed", { action: "remove:local", courseId, count: next.length });
      return next;
    });
  };

  // -------- Actions --------
  // Add to wishlist
  const addToWishlist = async (courseId) => {
    const t = localStorage.getItem("token");
    if (!t) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      await axios.post(
        `${globalBackendRoute}/api/add-to-wishlist`,
        { courseId },
        { headers: authHeaders() }
      );
      await fetchWishlist();
      emit("wishlist:changed", { action: "add", courseId });
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("Course already in wishlist");
      } else if (error.response?.status === 401) {
        toast.error("Please login to use wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
      console.error("Add to wishlist error:", error);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (courseId) => {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      await axios.delete(
        `${globalBackendRoute}/api/remove-from-wishlist/${courseId}`,
        { headers: authHeaders() }
      );
      removeItemFromLocalWishlist(courseId);
      await fetchWishlist();
      emit("wishlist:changed", { action: "remove", courseId });
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn("Unauthorized remove from wishlist attempt.");
      } else {
        console.error("Remove wishlist error:", err);
      }
      await fetchWishlist();
    }
  };

  // Toggle Save for Later
  const toggleSaveForLater = async (courseId) => {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      await axios.patch(
        `${globalBackendRoute}/api/toggle-save-for-later/${courseId}`,
        {},
        { headers: authHeaders() }
      );
      await fetchWishlist();
      emit("wishlist:changed", { action: "toggle-save", courseId });
    } catch (err) {
      console.error("Toggle save error:", err);
    }
  };

  // Move to Cart (and broadcast so Header/Cart refresh immediately)
  const moveToCartFromWishlist = async (courseId) => {
    const t = localStorage.getItem("token");
    if (!t) {
      toast.error("Please login first");
      return;
    }
    try {
      await axios.post(
        `${globalBackendRoute}/api/move-to-cart`,
        { courseId },
        { headers: authHeaders() }
      );
      // Optimistic local update + server re-sync
      removeItemFromLocalWishlist(courseId);
      emit("wishlist:changed", { action: "moved-to-cart", courseId });
      emit("cart:updated", { source: "wishlist", courseId }); // 👈 header listens and refreshes cart context
      await fetchWishlist();
      toast.success("Moved to cart");
    } catch (err) {
      console.error("Move to cart error:", err);
      toast.error("Something went wrong");
      await fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistLoading,
        addToWishlist,
        removeFromWishlist,
        toggleSaveForLater,
        moveToCartFromWishlist,
        fetchWishlist,
        addItemToLocalWishlist,
        removeItemFromLocalWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
