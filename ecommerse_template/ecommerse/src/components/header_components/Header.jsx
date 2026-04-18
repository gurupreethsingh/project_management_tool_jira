import { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineCameraswitch } from "react-icons/md";
import axios from "axios";

import { AuthContext } from "../../components/auth_components/AuthManager";
import { CartContext } from "../../components/cart_components/CartContext";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import CustomeLink from "../common_components/CustomeLink";
import MiniCart from "../../pages/cart_pages/MiniCart";
import globalBackendRoute from "../../config/Config";

const GUEST_CART_KEY = "guest_cart_items";
const GUEST_CART_EVENT = "guest-cart-updated";
const CART_UPDATED_EVENT = "cart-updated";

const getStoredToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("userToken") ||
  "";

const getGuestCartTotalCount = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((sum, item) => {
      const qty = Number(item?.quantity || 1);
      return sum + (qty > 0 ? qty : 1);
    }, 0);
  } catch {
    return 0;
  }
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [guestCartCount, setGuestCartCount] = useState(
    getGuestCartTotalCount(),
  );
  const [liveCartCount, setLiveCartCount] = useState(0);

  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const { resetCartState, cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const navigate = useNavigate();

  const syncCartCount = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      const guestCount = getGuestCartTotalCount();
      setGuestCartCount(guestCount);
      setLiveCartCount(guestCount);
      return;
    }

    try {
      const possibleUrls = [
        `${globalBackendRoute}/api/get-cart-items`,
        `${globalBackendRoute}/api/cart/get-cart-items`,
        `${globalBackendRoute}/api/cart/items`,
      ];

      let synced = false;

      for (const url of possibleUrls) {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const items =
            response?.data?.items ||
            response?.data?.cart?.items ||
            response?.data?.cartItems ||
            response?.data?.data?.items ||
            response?.data ||
            [];

          if (Array.isArray(items)) {
            const total = items.reduce((sum, item) => {
              const qty = Number(item?.quantity || 1);
              return sum + (qty > 0 ? qty : 1);
            }, 0);

            setLiveCartCount(total);
            synced = true;
            break;
          }
        } catch {
          // try next
        }
      }

      if (!synced) {
        if (Array.isArray(cartItems)) {
          const total = cartItems.reduce((sum, item) => {
            const qty = Number(item?.quantity || 1);
            return sum + (qty > 0 ? qty : 1);
          }, 0);
          setLiveCartCount(total);
        } else {
          setLiveCartCount(0);
        }
      }
    } catch (error) {
      console.error("Header cart sync error:", error);
      setLiveCartCount(0);
    }
  }, [cartItems]);

  useEffect(() => {
    const handleCartUpdate = () => {
      syncCartCount();
    };

    window.addEventListener(GUEST_CART_EVENT, handleCartUpdate);
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    syncCartCount();

    return () => {
      window.removeEventListener(GUEST_CART_EVENT, handleCartUpdate);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, [syncCartCount]);

  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      syncCartCount();
    } else {
      const guestCount = getGuestCartTotalCount();
      setGuestCartCount(guestCount);
      setLiveCartCount(guestCount);
    }
  }, [isLoggedIn, syncCartCount]);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const total = cartItems.reduce((sum, item) => {
        const qty = Number(item?.quantity || 1);
        return sum + (qty > 0 ? qty : 1);
      }, 0);
      setLiveCartCount(total);
    }
  }, [cartItems]);

  const cartCount = useMemo(() => {
    if (liveCartCount > 0) return liveCartCount;

    if (!getStoredToken()) return guestCartCount;

    if (!cartItems) return 0;

    if (Array.isArray(cartItems)) {
      return cartItems.reduce((sum, item) => {
        const qty = Number(item?.quantity || 1);
        return sum + (qty > 0 ? qty : 1);
      }, 0);
    }

    try {
      return Object.values(cartItems).reduce((sum, item) => {
        if (typeof item === "number") return sum + item;
        const qty = Number(item?.quantity || 1);
        return sum + (qty > 0 ? qty : 1);
      }, 0);
    } catch {
      return 0;
    }
  }, [cartItems, guestCartCount, liveCartCount]);

  const wishlistCount = useMemo(() => {
    return Array.isArray(wishlistItems) ? wishlistItems.length : 0;
  }, [wishlistItems]);

  const handleLogout = () => {
    resetCartState();
    setDropdownOpen(false);
    logout();
    setGuestCartCount(getGuestCartTotalCount());
    setLiveCartCount(0);
    navigate("/home");
  };

  const goToProfile = () => {
    navigate(`/profile/${user?.id}`);
    setDropdownOpen(false);
  };

  const dashboardRoute = useMemo(() => {
    if (!user?.role) return "/dashboard";
    const roleRoutes = { user: "/dashboard" };
    return roleRoutes[user.role] || "/dashboard";
  }, [user?.role]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(
        `/search-products?query=${encodeURIComponent(searchInput.trim())}`,
      );
      setSearchInput("");
      setMobileMenuOpen(false);
    }
  };

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 hp-font">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
        .containerFull { width: 100%; }
        .maxShell { margin: 0 auto; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes softPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.05);} }
        .pulse-soft { animation: softPulse 1.8s ease-in-out infinite; }
        @keyframes floatIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
        .float-in { animation: floatIn .22s ease-out; }

        .badgeDot{
          position:absolute;
          top:-6px;
          right:-6px;
          display:flex;
          align-items:center;
          justify-content:center;
          min-width:18px;
          height:18px;
          padding:0 6px;
          border-radius:9999px;
          font-size:11px;
          font-weight:900;
          line-height:1;
          background:#f97316;
          color:#fff;
          box-shadow: 0 10px 18px -12px rgba(249,115,22,0.55);
          z-index: 5;
        }
      `}</style>

      <div className="containerFull bg-white/85 backdrop-blur-xl">
        <nav className="maxShell px-3 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <a
              href="/home"
              className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 hover:bg-orange-50 transition"
              aria-label="Go to home"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-orange-500/15 blur-xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/25">
                  <MdOutlineCameraswitch className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold text-gray-900 tracking-tight">
                  ECOMMERCE
                </span>
                <span className="text-[11px] font-semibold text-orange-600">
                  Shop smarter
                </span>
              </div>
            </a>

            <CustomeLink
              linkAddress="/shop"
              linkName="SHOP ALL"
              customStyles="hidden md:inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[12px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            />
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-3xl"
              role="search"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className="w-full rounded-full border border-orange-200 bg-white/95 pl-12 pr-36 py-3 text-[14px] font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-white font-extrabold text-[12px] shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/wishlist"
              className="relative group flex items-center"
              aria-label="Wishlist"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative rounded-2xl bg-white px-3 py-2 hover:shadow-md transition">
                <FaHeart className="text-orange-500 text-xl group-hover:scale-110 transition-transform duration-200" />
                {isLoggedIn && wishlistCount > 0 && (
                  <span className="badgeDot pulse-soft">{wishlistCount}</span>
                )}
              </div>
            </Link>

            <div className="rounded-2xl bg-white px-2 py-2 hover:shadow-md transition">
              <MiniCart />
            </div>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[12px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition uppercase"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                >
                  <span className="max-w-[160px] truncate">{user.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl z-20 float-in">
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-wide">
                        Signed in
                      </p>
                      <p className="text-[12px] font-semibold text-orange-700 truncate">
                        {user?.name}
                      </p>
                    </div>

                    <button
                      onClick={goToProfile}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-orders");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      My Orders
                    </button>

                    <button
                      onClick={() => {
                        navigate(dashboardRoute);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      Dashboard
                    </button>

                    <div className="border-t border-orange-100" />

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-[13px] font-extrabold text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 shadow-lg shadow-orange-500/25 hover:opacity-95 transition"
                aria-label="Sign in"
              >
                <div className="bg-white/15 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                  </svg>
                </div>
                <span className="text-[12px] font-extrabold text-white">
                  SIGN IN
                </span>
              </Link>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/wishlist"
              className="relative"
              aria-label="Wishlist"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative rounded-2xl border border-orange-200 bg-white px-3 py-2 shadow-sm">
                <FaHeart className="text-orange-500 text-lg" />
                {isLoggedIn && wishlistCount > 0 && (
                  <span className="badgeDot">{wishlistCount}</span>
                )}
              </div>
            </Link>

            <Link
              to="/cart"
              className="relative"
              aria-label="Cart"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative rounded-2xl border border-orange-200 bg-white px-3 py-2 shadow-sm">
                <FiShoppingCart className="text-orange-600 text-[20px]" />
                {cartCount > 0 && <span className="badgeDot">{cartCount}</span>}
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-2xl border border-orange-200 bg-white px-3 py-2 text-gray-800 shadow-sm hover:shadow-md transition"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </nav>

        <div className="lg:hidden maxShell px-3 sm:px-6 lg:px-10 pb-3">
          <form onSubmit={handleSearch} className="w-full" role="search">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-orange-200 bg-white pl-12 pr-14 py-2.5 text-[13px] font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-2.5 text-white shadow shadow-orange-500/25"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-40 bg-black/60" />

        <DialogPanel
          role="dialog"
          aria-modal="true"
          className="fixed inset-y-0 right-0 z-50 w-[86vw] max-w-[360px] bg-white shadow-2xl overflow-y-auto"
        >
          <div className="p-5 border-b border-orange-100 bg-gradient-to-b from-orange-50 to-white">
            <div className="flex items-center justify-between gap-3">
              <CustomeLink
                linkAddress="/home"
                linkName="ECOMMERCE"
                customStyles="text-[18px] font-extrabold text-gray-900"
                onClick={() => closeAllMenus()}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-orange-200 bg-white px-3 py-2 text-gray-800 shadow-sm shrink-0"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-full border border-orange-200 bg-white pl-12 pr-14 py-2.5 text-[13px] font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-2.5 text-white shadow shadow-orange-500/25"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <div className="p-5 space-y-6">
            <div className="grid gap-3">
              <CustomeLink
                linkAddress="/shop"
                linkName="SHOP ALL"
                customStyles="block rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-[14px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              />

              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <FiShoppingCart className="text-orange-600" />
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="min-w-[28px] h-7 px-2 rounded-full bg-orange-500 text-white text-[12px] font-black inline-flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  navigate("/wishlist");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <FaHeart className="text-orange-500" />
                  Wishlist
                </span>
                {isLoggedIn && wishlistCount > 0 && (
                  <span className="min-w-[28px] h-7 px-2 rounded-full bg-orange-500 text-white text-[12px] font-black inline-flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            <div className="border-t border-orange-100" />

            {isLoggedIn && user ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    goToProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-800 hover:bg-orange-50"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-800 hover:bg-orange-50"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate(dashboardRoute);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-800 hover:bg-orange-50"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-extrabold text-red-500 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-center text-[14px] font-extrabold text-white shadow-lg shadow-orange-500/25"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
