import { useCallback } from "react";

const useWishlistAnalytics = () => {
  const track = useCallback((eventName, payload = {}) => {
    try {
      if (window?.gtag) {
        window.gtag("event", eventName, payload);
      } else {
        console.debug("[wishlist-analytics]", eventName, payload);
      }
    } catch (error) {
      console.debug("[wishlist-analytics-error]", error);
    }
  }, []);

  return { track };
};

export default useWishlistAnalytics;
