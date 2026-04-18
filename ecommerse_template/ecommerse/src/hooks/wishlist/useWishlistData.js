import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  bulkCheckoutWishlistApi,
  bulkMoveWishlistToCartApi,
  bulkRemoveWishlistApi,
  bulkSaveForLaterWishlistApi,
  clearWishlistApi,
  fetchWishlistApi,
  moveWishlistItemToCartApi,
  removeWishlistItemApi,
  saveAllWishlistForLaterApi,
  toggleSaveForLaterApi,
} from "../../api/wishlistApi";

const WISHLIST_QUERY_KEY = ["wishlist-items"];

const useWishlistData = ({ enabled = true, onCartRefresh, analytics }) => {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchWishlistApi,
    enabled,
    placeholderData: [],
  });

  const invalidateWishlist = async () => {
    await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
  };

  const removeMutation = useMutation({
    mutationFn: removeWishlistItemApi,
    onSuccess: async () => {
      toast.success("Item removed");
      analytics?.track("wishlist_remove_single");
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Could not remove item");
    },
  });

  const toggleSaveMutation = useMutation({
    mutationFn: toggleSaveForLaterApi,
    onSuccess: async (_, productId) => {
      toast.success("Wishlist updated");
      analytics?.track("wishlist_toggle_save_for_later", { productId });
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Could not update save for later");
    },
  });

  const moveToCartMutation = useMutation({
    mutationFn: moveWishlistItemToCartApi,
    onSuccess: async (_, productId) => {
      toast.success("Moved to cart");
      analytics?.track("wishlist_move_single_to_cart", { productId });
      await invalidateWishlist();
      await onCartRefresh?.();
    },
    onError: () => {
      toast.error("Could not move item to cart");
    },
  });

  const bulkMoveMutation = useMutation({
    mutationFn: bulkMoveWishlistToCartApi,
    onSuccess: async (_, productIds) => {
      toast.success(`${productIds.length} item(s) moved to cart`);
      analytics?.track("wishlist_bulk_move_to_cart", {
        count: productIds.length,
      });
      await invalidateWishlist();
      await onCartRefresh?.();
    },
    onError: () => {
      toast.error("Bulk move to cart failed");
    },
  });

  const bulkCheckoutMutation = useMutation({
    mutationFn: bulkCheckoutWishlistApi,
    onSuccess: async (_, productIds) => {
      toast.success(`${productIds.length} item(s) added for checkout`);
      analytics?.track("wishlist_bulk_checkout", {
        count: productIds.length,
      });
      await invalidateWishlist();
      await onCartRefresh?.();
    },
    onError: () => {
      toast.error("Bulk checkout failed");
    },
  });

  const bulkSaveMutation = useMutation({
    mutationFn: ({ productIds, savedForLater }) =>
      bulkSaveForLaterWishlistApi(productIds, savedForLater),
    onSuccess: async (_, variables) => {
      toast.success(
        variables.savedForLater
          ? "Selected items saved for later"
          : "Selected items unsaved",
      );
      analytics?.track("wishlist_bulk_save_for_later", {
        count: variables.productIds.length,
        savedForLater: variables.savedForLater,
      });
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Bulk save for later failed");
    },
  });

  const saveAllMutation = useMutation({
    mutationFn: saveAllWishlistForLaterApi,
    onSuccess: async (_, savedForLater) => {
      toast.success(savedForLater ? "All items saved" : "All items unsaved");
      analytics?.track("wishlist_save_all_for_later", { savedForLater });
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Save all failed");
    },
  });

  const bulkRemoveMutation = useMutation({
    mutationFn: bulkRemoveWishlistApi,
    onSuccess: async (_, productIds) => {
      toast.success(`${productIds.length} item(s) removed`);
      analytics?.track("wishlist_bulk_remove", { count: productIds.length });
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Bulk remove failed");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearWishlistApi,
    onSuccess: async () => {
      toast.success("Wishlist cleared");
      analytics?.track("wishlist_clear_all");
      await invalidateWishlist();
    },
    onError: () => {
      toast.error("Could not clear wishlist");
    },
  });

  return {
    wishlistItems: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    isFetching: wishlistQuery.isFetching,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    refetchWishlist: wishlistQuery.refetch,

    removeItem: removeMutation.mutateAsync,
    toggleSaveForLater: toggleSaveMutation.mutateAsync,
    moveSingleToCart: moveToCartMutation.mutateAsync,

    bulkMoveToCart: bulkMoveMutation.mutateAsync,
    bulkCheckout: bulkCheckoutMutation.mutateAsync,
    bulkSaveForLater: bulkSaveMutation.mutateAsync,
    saveAllForLater: saveAllMutation.mutateAsync,
    bulkRemove: bulkRemoveMutation.mutateAsync,
    clearWishlist: clearMutation.mutateAsync,

    isMutating:
      removeMutation.isPending ||
      toggleSaveMutation.isPending ||
      moveToCartMutation.isPending ||
      bulkMoveMutation.isPending ||
      bulkCheckoutMutation.isPending ||
      bulkSaveMutation.isPending ||
      saveAllMutation.isPending ||
      bulkRemoveMutation.isPending ||
      clearMutation.isPending,
  };
};

export default useWishlistData;
