import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { AuthContext } from "../auth_components/AuthManager";
import {
  fetchWishlistApi,
  removeWishlistItemApi,
  toggleSaveForLaterApi,
  moveWishlistItemToCartApi,
} from "../../api/wishlistApi";

export const WishlistContext = createContext();

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    ""
  );
}

function getAuthConfig() {
  const token = getStoredToken();

  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
}

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const wishlistQueryKey = useMemo(
    () => ["wishlist-items", user?._id || user?.id || "guest"],
    [user?._id, user?.id],
  );

  const {
    data: wishlistItems = [],
    isLoading: wishlistLoading,
    refetch,
  } = useQuery({
    queryKey: wishlistQueryKey,
    queryFn: fetchWishlistApi,
    enabled: Boolean(isLoggedIn && getStoredToken()),
    initialData: [],
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  const clearWishlist = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["wishlist-items"] });
    queryClient.setQueryData(["wishlist-items", "guest"], []);
  }, [queryClient]);

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn || !getStoredToken()) {
      clearWishlist();
      return [];
    }

    try {
      const result = await refetch();
      return Array.isArray(result?.data) ? result.data : [];
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        console.warn(
          "Unauthorized access to wishlist. Possibly invalid or expired token.",
        );
      } else {
        console.error("Wishlist fetch error:", err);
      }
      return [];
    }
  }, [isLoggedIn, refetch, clearWishlist]);

  useEffect(() => {
    if (!isLoggedIn || !getStoredToken()) {
      clearWishlist();
      return;
    }

    queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
  }, [isLoggedIn, wishlistQueryKey, queryClient, clearWishlist]);

  const addItemToLocalWishlist = useCallback(
    (product) => {
      queryClient.setQueryData(wishlistQueryKey, (prev = []) => {
        const id = String(product?._id || product?.product?._id || "");
        if (!id) return prev;

        const exists = prev.some(
          (item) => String(item?._id || item?.product?._id || "") === id,
        );

        if (exists) return prev;
        return [...prev, product];
      });
    },
    [queryClient, wishlistQueryKey],
  );

  const removeItemFromLocalWishlist = useCallback(
    (productId) => {
      const normalizedId = String(productId);

      queryClient.setQueryData(wishlistQueryKey, (prev = []) =>
        prev.filter(
          (item) =>
            String(item?._id || item?.product?._id || "") !== normalizedId,
        ),
      );
    },
    [queryClient, wishlistQueryKey],
  );

  const addToWishlist = useCallback(
    async (productId) => {
      try {
        await axios.post(
          `${globalBackendRoute}/api/wishlist/add-to-wishlist`,
          { productId },
          getAuthConfig(),
        );

        toast.success("Added to wishlist");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      } catch (error) {
        if (error?.response?.status === 409) {
          toast.info("Item already in wishlist");
        } else if (error?.response?.status === 401) {
          toast.error("Please login to use wishlist");
        } else {
          toast.error("Failed to add to wishlist");
        }

        console.error("Add to wishlist error:", error);
      }
    },
    [queryClient, wishlistQueryKey],
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        removeItemFromLocalWishlist(productId);
        await removeWishlistItemApi(productId);
        toast.success("Removed from wishlist");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      } catch (err) {
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });

        if (err?.response?.status === 403) {
          console.warn("Unauthorized remove from wishlist attempt.");
        } else {
          console.error("Remove wishlist error:", err);
          toast.error("Could not remove from wishlist");
        }
      }
    },
    [queryClient, wishlistQueryKey, removeItemFromLocalWishlist],
  );

  const toggleSaveForLater = useCallback(
    async (productId) => {
      try {
        queryClient.setQueryData(wishlistQueryKey, (prev = []) =>
          prev.map((item) =>
            String(item?._id || item?.product?._id || "") === String(productId)
              ? { ...item, savedForLater: !item.savedForLater }
              : item,
          ),
        );

        await toggleSaveForLaterApi(productId);
        toast.success("Wishlist updated");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      } catch (err) {
        console.error("Toggle save error:", err);
        toast.error("Could not update save for later");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      }
    },
    [queryClient, wishlistQueryKey],
  );

  const moveToCartFromWishlist = useCallback(
    async (productId) => {
      try {
        removeItemFromLocalWishlist(productId);
        await moveWishlistItemToCartApi(productId);
        toast.success("Moved to cart");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      } catch (err) {
        console.error("Move to cart error:", err);
        toast.error("Something went wrong");
        await queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      }
    },
    [queryClient, wishlistQueryKey, removeItemFromLocalWishlist],
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistLoading,
      addToWishlist,
      removeFromWishlist,
      toggleSaveForLater,
      moveToCartFromWishlist,
      fetchWishlist,
      clearWishlist,
      addItemToLocalWishlist,
      removeItemFromLocalWishlist,
    }),
    [
      wishlistItems,
      wishlistLoading,
      addToWishlist,
      removeFromWishlist,
      toggleSaveForLater,
      moveToCartFromWishlist,
      fetchWishlist,
      clearWishlist,
      addItemToLocalWishlist,
      removeItemFromLocalWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
