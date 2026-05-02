// import { createContext, useState, useEffect, useContext } from "react";
// import { AuthContext } from "../auth_components/AuthManager";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { toast } from "react-toastify";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { isLoggedIn, user, loading } = useContext(AuthContext);

//   const [cartItems, setCartItems] = useState(() => {
//     const guestCart = localStorage.getItem("guest_cart");
//     if (guestCart) {
//       try {
//         const parsed = JSON.parse(guestCart);
//         if (parsed.expiry > Date.now()) {
//           return parsed.cart || [];
//         }
//       } catch {
//         console.error("Invalid guest cart");
//       }
//     }
//     return [];
//   });

//   const [cartLoading, setCartLoading] = useState(true);
//   const [syncDone, setSyncDone] = useState(false);

//   // 🔁 Re-trigger cart sync when user logs in
//   useEffect(() => {
//     if (loading) return;
//     setSyncDone(false);
//   }, [isLoggedIn, user?.id, loading]);

//   useEffect(() => {
//     if (loading || syncDone) return;

//     const handleCartLoad = async () => {
//       if (isLoggedIn && user) {
//         const guestCart = localStorage.getItem("guest_cart");
//         if (guestCart) {
//           try {
//             const parsed = JSON.parse(guestCart);
//             if (parsed.expiry > Date.now() && parsed.cart?.length > 0) {
//               const serverCart = await fetchServerCartRaw();
//               if (serverCart.length === 0) {
//                 await syncGuestCartToServer(parsed.cart);
//               }
//               localStorage.removeItem("guest_cart");
//             } else {
//               localStorage.removeItem("guest_cart");
//               await fetchServerCart();
//             }
//           } catch (err) {
//             console.warn("Guest cart parse error", err);
//             localStorage.removeItem("guest_cart");
//             await fetchServerCart();
//           }
//         } else {
//           await fetchServerCart();
//         }
//       } else {
//         setCartLoading(false);
//       }

//       setSyncDone(true);
//     };

//     handleCartLoad();
//   }, [isLoggedIn, user, loading, syncDone]);

//   useEffect(() => {
//     if (!isLoggedIn) {
//       const payload = {
//         cart: cartItems,
//         expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
//       };
//       localStorage.setItem("guest_cart", JSON.stringify(payload));
//     }
//   }, [cartItems, isLoggedIn]);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       if (!isLoggedIn) {
//         const guestCart = localStorage.getItem("guest_cart");
//         if (guestCart) {
//           try {
//             const parsed = JSON.parse(guestCart);
//             if (parsed.expiry > Date.now()) {
//               setCartItems(parsed.cart || []);
//             }
//           } catch {}
//         }
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [isLoggedIn]);

//   const fetchServerCartRaw = async () => {
//     try {
//       const { data } = await axios.get(
//         `${globalBackendRoute}/api/get-cart-items`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         },
//       );
//       return data.items || [];
//     } catch (error) {
//       console.error("Failed to fetch raw server cart:", error.message);
//       return [];
//     }
//   };

//   const fetchServerCart = async () => {
//     try {
//       setCartLoading(true);
//       const items = await fetchServerCartRaw();
//       setCartItems(items);
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   const syncGuestCartToServer = async (cart) => {
//     try {
//       await axios.post(
//         `${globalBackendRoute}/api/sync-cart`,
//         { items: cart },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       console.log("Guest cart synced to server!");
//     } catch (error) {
//       console.error("Error syncing guest cart:", error.message);
//     }
//   };

//   const addToCart = async (product) => {
//     if (isLoggedIn) {
//       try {
//         await axios.post(
//           `${globalBackendRoute}/api/add-to-cart`,
//           { productId: product._id, quantity: 1 },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         );
//         fetchServerCart();
//         toast.success("Product added to cart!");
//       } catch (error) {
//         console.error("Failed to add to cart:", error.message);
//         toast.error("Failed to add!");
//       }
//     } else {
//       setCartItems((prev) => {
//         const existing = prev.find((item) => item._id === product._id);
//         if (existing) {
//           return prev.map((item) =>
//             item._id === product._id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item,
//           );
//         }
//         return [...prev, { ...product, quantity: 1 }];
//       });
//       toast.success("Product added to cart!");
//     }
//   };

//   const removeFromCart = async (productId) => {
//     if (isLoggedIn) {
//       try {
//         await axios.delete(
//           `${globalBackendRoute}/api/remove-cart-item/${productId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         );
//         fetchServerCart();
//         toast.success("Item removed!");
//       } catch (error) {
//         console.error("Failed to remove item:", error.message);
//         toast.error("Failed to remove!");
//       }
//     } else {
//       setCartItems((prev) => prev.filter((item) => item._id !== productId));
//       toast.success("Item removed!");
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (isLoggedIn) {
//       try {
//         await axios.patch(
//           `${globalBackendRoute}/api/update-cart/${productId}`,
//           { quantity },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         );
//         fetchServerCart();
//         toast.success("Cart updated!");
//       } catch (error) {
//         console.error("Failed to update item:", error.message);
//         toast.error("Failed to update!");
//       }
//     } else {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item._id === productId ? { ...item, quantity } : item,
//         ),
//       );
//       toast.success("Cart updated!");
//     }
//   };

//   const clearCart = async () => {
//     try {
//       if (isLoggedIn) {
//         await axios.delete(`${globalBackendRoute}/api/clear-cart`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//       }
//       setCartItems([]);
//       localStorage.removeItem("guest_cart");
//       toast.success("Cart cleared!");
//     } catch (error) {
//       console.error("Failed to clear cart:", error.message);
//       toast.error("Failed to clear cart!");
//     }
//   };

//   const resetCartState = () => {
//     setCartItems([]);
//     localStorage.removeItem("cartItems");
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartLoading,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         fetchServerCart,
//         resetCartState,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

//

//original
//

// 🔥 FULL UPDATED CartContext (BASED ON YOUR CODE)
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth_components/AuthManager";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  const getCartProductId = (item) => {
    return (
      item?.product?._id ||
      item?.productId ||
      item?.product_id ||
      item?._id ||
      ""
    );
  };

  const [cartItems, setCartItems] = useState(() => {
    const guestCart = localStorage.getItem("guest_cart");

    if (guestCart) {
      try {
        const parsed = JSON.parse(guestCart);
        if (parsed.expiry > Date.now()) {
          return parsed.cart || [];
        }
      } catch {
        console.error("Invalid guest cart");
      }
    }

    return [];
  });

  const [cartLoading, setCartLoading] = useState(true);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    if (loading) return;
    setSyncDone(false);
  }, [isLoggedIn, user?.id, loading]);

  useEffect(() => {
    if (loading || syncDone) return;

    const handleCartLoad = async () => {
      if (isLoggedIn && user) {
        const guestCart = localStorage.getItem("guest_cart");

        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);

            if (parsed.expiry > Date.now() && parsed.cart?.length > 0) {
              const serverCart = await fetchServerCartRaw();

              if (serverCart.length === 0) {
                await syncGuestCartToServer(parsed.cart);
              }

              localStorage.removeItem("guest_cart");
            } else {
              localStorage.removeItem("guest_cart");
              await fetchServerCart();
            }
          } catch (err) {
            console.warn("Guest cart parse error", err);
            localStorage.removeItem("guest_cart");
            await fetchServerCart();
          }
        } else {
          await fetchServerCart();
        }
      } else {
        setCartLoading(false);
      }

      setSyncDone(true);
    };

    handleCartLoad();
  }, [isLoggedIn, user, loading, syncDone]);

  useEffect(() => {
    if (!isLoggedIn) {
      const payload = {
        cart: cartItems,
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      localStorage.setItem("guest_cart", JSON.stringify(payload));
    }
  }, [cartItems, isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!isLoggedIn) {
        const guestCart = localStorage.getItem("guest_cart");

        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);

            if (parsed.expiry > Date.now()) {
              setCartItems(parsed.cart || []);
            }
          } catch {}
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchServerCartRaw = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/get-cart-items`,
        {
          headers: getAuthHeaders(),
        },
      );

      return data.items || [];
    } catch (error) {
      console.error("Failed to fetch raw server cart:", error.message);
      return [];
    }
  };

  const fetchServerCart = async () => {
    try {
      setCartLoading(true);
      const items = await fetchServerCartRaw();
      setCartItems(items);
    } finally {
      setCartLoading(false);
    }
  };

  const syncGuestCartToServer = async (cart) => {
    try {
      await axios.post(
        `${globalBackendRoute}/api/sync-cart`,
        { items: cart },
        {
          headers: getAuthHeaders(),
        },
      );

      await fetchServerCart();
      console.log("Guest cart synced to server!");
    } catch (error) {
      console.error("Error syncing guest cart:", error.message);
    }
  };

  const addToCart = async (product) => {
    if (isLoggedIn) {
      try {
        await axios.post(
          `${globalBackendRoute}/api/add-to-cart`,
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchServerCart();
        toast.success("Product added to cart!");
      } catch (error) {
        console.error("Failed to add to cart:", error.message);
        toast.error("Failed to add!");
      }

      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => String(getCartProductId(item)) === String(product._id),
      );

      if (existing) {
        return prev.map((item) =>
          String(getCartProductId(item)) === String(product._id)
            ? {
                ...item,
                quantity: Number(item.quantity || 1) + 1,
              }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    toast.success("Product added to cart!");
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;

    if (isLoggedIn) {
      try {
        await axios.delete(
          `${globalBackendRoute}/api/remove-cart-item/${productId}`,
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchServerCart();
        toast.success("Item removed!");
      } catch (error) {
        console.error("Failed to remove item:", error.message);
        toast.error("Failed to remove!");
      }

      return;
    }

    setCartItems((prev) =>
      prev.filter(
        (item) => String(getCartProductId(item)) !== String(productId),
      ),
    );

    toast.success("Item removed!");
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;

    const safeQuantity = Math.max(1, Number(quantity || 1));

    if (isLoggedIn) {
      const oldCartItems = [...cartItems];

      try {
        setCartItems((prev) =>
          prev.map((item) =>
            String(getCartProductId(item)) === String(productId)
              ? {
                  ...item,
                  quantity: safeQuantity,
                }
              : item,
          ),
        );

        await axios.patch(
          `${globalBackendRoute}/api/update-cart/${productId}`,
          {
            quantity: safeQuantity,
          },
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchServerCart();
      } catch (error) {
        console.error("Failed to update item:", error.message);
        setCartItems(oldCartItems);
        toast.error("Failed to update!");
      }

      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        String(getCartProductId(item)) === String(productId)
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item,
      ),
    );
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => String(getCartProductId(cartItem)) === String(productId),
    );

    if (!item) return;

    const currentQuantity = Number(item.quantity || 1);
    updateQuantity(productId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => String(getCartProductId(cartItem)) === String(productId),
    );

    if (!item) return;

    const currentQuantity = Number(item.quantity || 1);

    if (currentQuantity <= 1) {
      removeFromCart(productId);
      return;
    }

    updateQuantity(productId, currentQuantity - 1);
  };

  const clearCart = async () => {
    try {
      if (isLoggedIn) {
        await axios.delete(`${globalBackendRoute}/api/clear-cart`, {
          headers: getAuthHeaders(),
        });
      }

      setCartItems([]);
      localStorage.removeItem("guest_cart");
      toast.success("Cart cleared!");
    } catch (error) {
      console.error("Failed to clear cart:", error.message);
      toast.error("Failed to clear cart!");
    }
  };

  const resetCartState = () => {
    setCartItems([]);
    localStorage.removeItem("guest_cart");
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  );

  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number(
      item?.selling_price || item?.product?.selling_price || 0,
    );

    const quantity = Number(item.quantity || 1);

    return total + Number((price * quantity).toFixed(2));
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartCount,
        cartTotal,

        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        fetchServerCart,
        resetCartState,

        getCartProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
