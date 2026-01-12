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

  const [loading, setLoading] = useState(true);

  // ✅ headers
  const authHeader = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // ✅ helper: try multiple possible URLs until one works
  const tryGet = async (urls, config = {}) => {
    for (const url of urls) {
      try {
        const res = await axios.get(url, config);
        return { ok: true, data: res.data, url };
      } catch (e) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) {
          return { ok: false, err: e, url };
        }
        // continue for 404 / wrong mount
      }
    }
    return {
      ok: false,
      err: new Error("All endpoints failed"),
      url: urls?.[0],
    };
  };

  // ✅ decode token and set userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ fetch user + counts (only after userId exists)
  useEffect(() => {
    if (!userId) return;

    const run = async () => {
      setLoading(true);

      // user
      const userRes = await tryGet(
        [`${globalBackendRoute}/api/getUserById/${userId}`],
        { headers: authHeader }
      );
      if (userRes.ok) setUser(userRes.data);

      // counts
      const ordersReq = tryGet(
        [
          `${globalBackendRoute}/api/my-orders`,
          `${globalBackendRoute}/api/orders/my-orders`,
        ],
        { headers: authHeader }
      );

      const wishlistReq = tryGet(
        [
          `${globalBackendRoute}/api/wishlist/get-wishlist`,
          `${globalBackendRoute}/api/get-wishlist`,
          `${globalBackendRoute}/api/wishlists/get-wishlist`,
        ],
        { headers: authHeader }
      );

      const cartReq = tryGet(
        [
          `${globalBackendRoute}/api/cart/get-cart-items`,
          `${globalBackendRoute}/api/get-cart-items`,
          `${globalBackendRoute}/api/carts/get-cart-items`,
        ],
        { headers: authHeader }
      );

      const [ordersRes, wishlistRes, cartRes] = await Promise.allSettled([
        ordersReq,
        wishlistReq,
        cartReq,
      ]);

      const safe = (r) => (r.status === "fulfilled" ? r.value : { ok: false });

      const o = safe(ordersRes);
      const w = safe(wishlistRes);
      const c = safe(cartRes);

      const ordersCount =
        o.ok && Array.isArray(o.data)
          ? o.data.length
          : o.ok && Array.isArray(o.data?.orders)
          ? o.data.orders.length
          : 0;

      const wishlistCount =
        w.ok && Array.isArray(w.data)
          ? w.data.length
          : w.ok && Array.isArray(w.data?.items)
          ? w.data.items.length
          : w.ok && Array.isArray(w.data?.wishlist)
          ? w.data.wishlist.length
          : 0;

      const cartCount =
        c.ok && Array.isArray(c.data)
          ? c.data.length
          : c.ok && Array.isArray(c.data?.items)
          ? c.data.items.length
          : c.ok && Array.isArray(c.data?.cartItems)
          ? c.data.cartItems.length
          : 0;

      // don't crash UI if endpoints fail
      if (!w.ok) console.warn("Wishlist route not found. Check backend mount.");
      if (!c.ok) console.warn("Cart route not found. Check backend mount.");

      setCounts({
        orders: ordersCount,
        wishlist: wishlistCount,
        cartItems: cartCount,
      });
      setLoading(false);
    };

    run();
  }, [userId, authHeader]);

  // ✅ cards
  const cards = useMemo(() => {
    return [
      {
        title: "My Orders",
        value: counts.orders,
        icon: <FaClipboardList className="text-orange-600 text-3xl" />,
        link: "/my-orders",
        bgColor: "bg-orange-50 border border-orange-200",
      },
      {
        title: "Wishlist",
        value: counts.wishlist,
        icon: <FaHeart className="text-orange-600 text-3xl" />,
        link: "/wishlist",
        bgColor: "bg-orange-50 border border-orange-200",
      },
      {
        title: "Cart Items",
        value: counts.cartItems,
        icon: <FaShoppingCart className="text-orange-600 text-3xl" />,
        link: "/cart",
        bgColor: "bg-orange-50 border border-orange-200",
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

  // ✅ LOADING UI (instead of returning early before hooks)
  if (!userId) {
    return (
      <div className="fullWidth py-10">
        <div className="containerWidth">
          <div className="rounded-3xl bg-orange-50 border border-orange-200 p-5">
            <p className="text-[13px] font-extrabold text-orange-800">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullWidth py-6">
      <style>{`
        .dashOrangeIconActive { color: rgb(249, 115, 22); }
        .dashOrangeIconIdle { color: rgb(100, 116, 139); }
        .dashChip {
          border-radius: 9999px;
          padding: 0.45rem 0.8rem;
          font-weight: 900;
          font-size: 12px;
          background: rgba(255,247,237,.9);
          border: 1px solid rgba(251,191,36,.35);
          color: rgb(124,45,18);
        }
        .dashShadowSoft{
          box-shadow: 0 18px 30px -22px rgba(249,115,22,0.35);
        }
      `}</style>

      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
          <div className="min-w-0">
            <h1 className="headingText flex items-center gap-3">
              Welcome, {user?.name || "User"}{" "}
              <span className="dashChip">Dashboard</span>
            </h1>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">
              Manage your orders, wishlist and cart in one place.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "dashOrangeIconActive" : "dashOrangeIconIdle"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "dashOrangeIconActive" : "dashOrangeIconIdle"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "dashOrangeIconActive" : "dashOrangeIconIdle"
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
                  icon: <FaUser className="text-orange-600" />,
                  path: `/profile/${userId}`,
                },
                {
                  label: "Orders",
                  icon: <FaClipboardList className="text-orange-600" />,
                  path: "/my-orders",
                },
                {
                  label: "Wishlist",
                  icon: <FaHeart className="text-orange-600" />,
                  path: "/wishlist",
                },
                {
                  label: "Cart",
                  icon: <FaShoppingCart className="text-orange-600" />,
                  path: "/cart",
                },
              ]}
            />
          }
          right={
            <div className="mb-3">
              {loading && (
                <div className="mb-4 rounded-3xl bg-orange-50 border border-orange-200 p-4">
                  <p className="text-[12px] font-extrabold text-orange-800">
                    Syncing counts from database...
                  </p>
                </div>
              )}

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
                  <div key={index} className="dashShadowSoft rounded-2xl">
                    <DashboardCard
                      card={card}
                      view={view}
                      onClick={() => navigate(card.link)}
                    />
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
