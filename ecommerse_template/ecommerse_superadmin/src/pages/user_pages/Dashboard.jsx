import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  FaTh,
  FaThLarge,
  FaThList,
  FaHeart,
  FaClipboardList,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

import globalBackendRoute from "../../config/Config";
import SearchBar from "../../components/common_components/SearchBar";
import LeftSidebarNav from "../../components/common_components/LeftSidebarNav";
import DashboardCard from "../../components/common_components/DashboardCard";
import DashboardLayout from "../../components/common_components/DashboardLayout";
import stopwords from "../../components/common_components/stopwords.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [counts, setCounts] = useState({
    orders: 0,
    wishlist: 0,
    cartItems: 0,
  });

  // ✅ IMPORTANT: adjust these prefixes if your app.use mount differs
  const API = useMemo(() => {
    return {
      userById: (id) => `${globalBackendRoute}/api/getUserById/${id}`, // your user route matches this
      myOrders: `${globalBackendRoute}/api/my-orders`, // your order route matches this

      // ✅ these are most likely the real paths (based on typical app.use)
      wishlist: `${globalBackendRoute}/api/wishlist/get-wishlist`,
      cart: `${globalBackendRoute}/api/cart/get-cart-items`,
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/my-account");
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      navigate("/my-account");
    }
  }, [navigate]);

  const authHeader = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // ✅ Fetch user (fix your "user was never set" bug)
  useEffect(() => {
    if (!userId) return;

    axios
      .get(API.userById(userId), { headers: authHeader })
      .then((res) => setUser(res.data))
      .catch((e) => console.error("Failed to fetch user:", e));
  }, [userId, API, authHeader]);

  // ✅ Fetch dashboard counts safely (even if one fails, others still show)
  useEffect(() => {
    if (!userId) return;

    const run = async () => {
      const results = await Promise.allSettled([
        axios.get(API.myOrders, { headers: authHeader }),
        axios.get(API.wishlist, { headers: authHeader }),
        axios.get(API.cart, { headers: authHeader }),
      ]);

      const [ordersR, wishlistR, cartR] = results;

      const orders =
        ordersR.status === "fulfilled" && Array.isArray(ordersR.value.data)
          ? ordersR.value.data.length
          : 0;

      const wishlistData =
        wishlistR.status === "fulfilled" ? wishlistR.value.data : null;

      const wishlist = Array.isArray(wishlistData)
        ? wishlistData.length
        : Array.isArray(wishlistData?.items)
        ? wishlistData.items.length
        : Array.isArray(wishlistData?.wishlist)
        ? wishlistData.wishlist.length
        : 0;

      const cartData = cartR.status === "fulfilled" ? cartR.value.data : null;

      const cartItems = Array.isArray(cartData)
        ? cartData.length
        : Array.isArray(cartData?.items)
        ? cartData.items.length
        : Array.isArray(cartData?.cartItems)
        ? cartData.cartItems.length
        : 0;

      // ✅ show errors clearly in console but don't break UI
      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          console.warn(
            "Dashboard count fetch failed:",
            idx,
            r.reason?.response?.status,
            r.reason?.config?.url
          );
        }
      });

      setCounts({ orders, wishlist, cartItems });
    };

    run();
  }, [userId, API, authHeader]);

  const cards = useMemo(() => {
    return [
      {
        title: "My Orders",
        value: counts.orders,
        icon: <FaClipboardList className="text-indigo-600 text-3xl" />,
        link: "/my-orders",
        bgColor: "bg-indigo-100 border border-indigo-300",
      },
      {
        title: "Wishlist",
        value: counts.wishlist,
        icon: <FaHeart className="text-red-500 text-3xl" />,
        link: "/wishlist",
        bgColor: "bg-red-100 border border-red-400",
      },
      {
        title: "Cart Items",
        value: counts.cartItems,
        icon: <FaShoppingCart className="text-green-600 text-3xl" />,
        link: "/cart",
        bgColor: "bg-green-100 border border-green-400",
      },
    ];
  }, [counts]);

  const filteredCards =
    search.trim() === ""
      ? cards
      : cards.filter((card) => {
          const text = `${card.title} ${card.value}`.toLowerCase();
          const queryWords = search
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => !stopwords.includes(word));

          return queryWords.some(
            (word) =>
              text.includes(word) || text.includes(word.replace(/s$/, ""))
          );
        });

  return (
    <div className="fullWidth py-6">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
          <h1 className="headingText">Welcome, {user?.name || "User"}</h1>

          <div className="flex items-center flex-wrap gap-3">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards..."
            />
          </div>
        </div>

        <DashboardLayout
          left={
            <LeftSidebarNav
              navigate={navigate}
              items={[
                {
                  label: "My Profile",
                  icon: <FaUser className="text-indigo-600" />,
                  path: `/profile/${userId}`,
                },
                {
                  label: "Orders",
                  icon: <FaClipboardList className="text-blue-600" />,
                  path: "/my-orders",
                },
                {
                  label: "Wishlist",
                  icon: <FaHeart className="text-red-600" />,
                  path: "/wishlist",
                },
                {
                  label: "Cart",
                  icon: <FaShoppingCart className="text-green-600" />,
                  path: "/cart",
                },
              ]}
            />
          }
          right={
            <div
              className={`${
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  : view === "card"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {filteredCards.map((card, index) => (
                <DashboardCard
                  key={`${card.title}-${index}`}
                  card={card}
                  view={view}
                  onClick={() => navigate(card.link)}
                />
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
