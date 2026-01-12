import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaCog,
  FaPlus,
  FaBoxOpen,
  FaStore,
  FaBuilding,
  FaUserPlus,
  FaUsers,
  FaTags,
  FaLayerGroup,
  FaNewspaper,
  FaEnvelopeOpenText,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";

import globalBackendRoute from "../../config/Config";
import SearchBar from "../../components/common_components/SearchBar";
import LeftSidebarNav from "../../components/common_components/LeftSidebarNav";
import DashboardCard from "../../components/common_components/DashboardCard";
import DashboardLayout from "../../components/common_components/DashboardLayout";
import bgColorLogic from "../../components/common_components/bgColorLogic.jsx";
import stopwords from "../../components/common_components/stopwords.jsx";

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState("grid");

  const [roleCounts, setRoleCounts] = useState({});
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    subcategories: 0,
    vendors: 0,
    outlets: 0,
    blogs: 0,
    subscriptions: 0,
    guestOrders: 0,
    contactTotal: 0,
    contactUnread: 0,
  });

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

  // ✅ endpoints with likely mount prefixes
  const API = useMemo(() => {
    return {
      roleCounts: `${globalBackendRoute}/api/getUserCountsByRole`,
      products: `${globalBackendRoute}/api/count-all-products`,
      categories: `${globalBackendRoute}/api/category-count`,
      subcategories: `${globalBackendRoute}/api/count-all-subcategories`,
      vendors: `${globalBackendRoute}/api/vendors/count`,
      outlets: `${globalBackendRoute}/api/all-outlets`,
      guestOrders: `${globalBackendRoute}/api/get-all-guest-orders`,

      // these two were 404 for you -> likely mounted with prefixes:
      blogs: `${globalBackendRoute}/api/blogs/all-blogs`,
      subscriptions: `${globalBackendRoute}/api/subscriptions/subscription-count`,

      // contact routes mount depends; try both without crashing
      contactCountA: `${globalBackendRoute}/api/contact/messages/get-messages-count`,
      contactUnreadA: `${globalBackendRoute}/api/contact/messages/unread-count`,
      contactCountB: `${globalBackendRoute}/api/messages/get-messages-count`,
      contactUnreadB: `${globalBackendRoute}/api/messages/unread-count`,
    };
  }, []);

  useEffect(() => {
    const safeGet = async (url, config = {}) => {
      try {
        const res = await axios.get(url, config);
        return { ok: true, data: res.data, url };
      } catch (e) {
        return { ok: false, err: e, url };
      }
    };

    const fetchAllCounts = async () => {
      const results = await Promise.allSettled([
        safeGet(API.roleCounts, { headers: authHeader }),
        safeGet(API.products),
        safeGet(API.categories),
        safeGet(API.subcategories),
        safeGet(API.vendors),
        safeGet(API.outlets),
        safeGet(API.blogs),
        safeGet(API.subscriptions),
        safeGet(API.guestOrders),

        // contact: try A then fallback to B
        safeGet(API.contactCountA),
        safeGet(API.contactUnreadA),
        safeGet(API.contactCountB),
        safeGet(API.contactUnreadB),
      ]);

      const unwrap = (i) =>
        results[i].status === "fulfilled" ? results[i].value : null;

      const role = unwrap(0);
      if (role?.ok) setRoleCounts(role.data || {});

      const products = unwrap(1);
      const categories = unwrap(2);
      const subcats = unwrap(3);
      const vendors = unwrap(4);
      const outlets = unwrap(5);
      const blogs = unwrap(6);
      const subs = unwrap(7);
      const guestOrders = unwrap(8);

      // contact fallback logic
      const contactCountA = unwrap(9);
      const contactUnreadA = unwrap(10);
      const contactCountB = unwrap(11);
      const contactUnreadB = unwrap(12);

      const contactCount =
        (contactCountA?.ok ? contactCountA.data : null) ||
        (contactCountB?.ok ? contactCountB.data : null);

      const contactUnread =
        (contactUnreadA?.ok ? contactUnreadA.data : null) ||
        (contactUnreadB?.ok ? contactUnreadB.data : null);

      // log failures but don't break UI
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value?.ok === false) {
          const status = r.value.err?.response?.status;
          console.warn("Superadmin count fetch failed:", status, r.value.url);
        }
      });

      setCounts({
        products: Number(products?.ok ? products.data?.count : 0) || 0,
        categories: Number(categories?.ok ? categories.data?.count : 0) || 0,
        subcategories: Number(subcats?.ok ? subcats.data?.count : 0) || 0,
        vendors: Number(vendors?.ok ? vendors.data?.count : 0) || 0,

        outlets:
          outlets?.ok && Array.isArray(outlets.data) ? outlets.data.length : 0,
        blogs: blogs?.ok && Array.isArray(blogs.data) ? blogs.data.length : 0,
        subscriptions: Number(subs?.ok ? subs.data?.count : 0) || 0,

        guestOrders:
          guestOrders?.ok && Array.isArray(guestOrders.data)
            ? guestOrders.data.length
            : 0,

        contactTotal:
          Number(
            contactCount?.total || contactCount?.count || contactCount?.all || 0
          ) || 0,
        contactUnread:
          Number(contactUnread?.count || contactUnread?.unread || 0) || 0,
      });
    };

    fetchAllCounts();
  }, [API, authHeader]);

  const makeCard = ({ title, value, link, icon }) => {
    if (!title || String(title).trim().toLowerCase() === "null") return null;
    const n = Number(value) || 0;
    if (n <= 0) return null;
    return { title, value: n, link, icon, bgColor: bgColorLogic(n) };
  };

  const roleCards = useMemo(() => {
    const routeMap = {
      totalUsers: "/all-users",
      users: "/all-users",
      customers: "/all-users",
      admins: "/all-users",
      superadmins: "/all-users",
      vendors: "/all-vendors",
      employees: "/all-users",
    };

    const iconMap = {
      totalUsers: <FaUsers className="text-indigo-600 text-3xl" />,
      users: <FaUsers className="text-indigo-600 text-3xl" />,
      customers: <FaUsers className="text-indigo-600 text-3xl" />,
      admins: <FaUsers className="text-indigo-600 text-3xl" />,
      superadmins: <FaUsers className="text-indigo-600 text-3xl" />,
      vendors: <FaStore className="text-purple-600 text-3xl" />,
      employees: <FaUserPlus className="text-teal-600 text-3xl" />,
    };

    return Object.entries(roleCounts || {})
      .map(([key, value]) => {
        const title =
          key === "totalUsers"
            ? "Total Users"
            : key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return makeCard({
          title,
          value,
          link: routeMap[key] || "/all-users",
          icon: iconMap[key] || (
            <FaUsers className="text-indigo-600 text-3xl" />
          ),
        });
      })
      .filter(Boolean);
  }, [roleCounts]);

  const entityCards = useMemo(() => {
    return [
      makeCard({
        title: "Products",
        value: counts.products,
        link: "/all-added-products",
        icon: <FaBoxOpen className="text-green-600 text-3xl" />,
      }),
      makeCard({
        title: "Categories",
        value: counts.categories,
        link: "/all-categories",
        icon: <FaTags className="text-orange-500 text-3xl" />,
      }),
      makeCard({
        title: "Subcategories",
        value: counts.subcategories,
        link: "/all-subcategories",
        icon: <FaLayerGroup className="text-amber-600 text-3xl" />,
      }),
      makeCard({
        title: "Vendors",
        value: counts.vendors,
        link: "/all-vendors",
        icon: <FaStore className="text-purple-600 text-3xl" />,
      }),
      makeCard({
        title: "Outlets",
        value: counts.outlets,
        link: "/all-outlets",
        icon: <FaBuilding className="text-orange-500 text-3xl" />,
      }),
      makeCard({
        title: "Blogs",
        value: counts.blogs,
        link: "/all-blogs",
        icon: <FaNewspaper className="text-sky-600 text-3xl" />,
      }),
      makeCard({
        title: "Subscriptions",
        value: counts.subscriptions,
        link: "/all-subscriptions",
        icon: <FaBell className="text-indigo-600 text-3xl" />,
      }),
      makeCard({
        title: "Contact Messages",
        value: counts.contactTotal,
        link: "/all-messages",
        icon: <FaEnvelopeOpenText className="text-rose-600 text-3xl" />,
      }),
      makeCard({
        title: "Unread Messages",
        value: counts.contactUnread,
        link: "/all-messages",
        icon: <FaEnvelopeOpenText className="text-rose-600 text-3xl" />,
      }),
      makeCard({
        title: "Guest Orders",
        value: counts.guestOrders,
        link: "/all-guest-orders",
        icon: <FaClipboardList className="text-indigo-600 text-3xl" />,
      }),
    ].filter(Boolean);
  }, [counts]);

  const allCards = useMemo(() => {
    const combined = [...roleCards, ...entityCards].filter(Boolean);
    const seen = new Set();
    const unique = [];
    for (const c of combined) {
      const k = String(c.title).trim().toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      unique.push(c);
    }
    return unique;
  }, [roleCards, entityCards]);

  const filteredCards = useMemo(() => {
    if (search.trim() === "") return allCards;
    return allCards.filter((card) => {
      const text = `${card.title} ${card.value}`.toLowerCase();
      const queryWords = search
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => !stopwords.includes(word));
      return queryWords.some(
        (word) => text.includes(word) || text.includes(word.replace(/s$/, ""))
      );
    });
  }, [allCards, search]);

  return (
    <div className="fullWidth py-6">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
          <h1 className="headingText">Superadmin Dashboard</h1>
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
                  label: "Account Settings",
                  icon: <FaCog className="text-indigo-600" />,
                  path: `/profile/${userId}`,
                },
                {
                  label: "Add Category",
                  icon: <FaPlus className="text-orange-400" />,
                  path: "/add-category",
                },
                {
                  label: "Add Sub Category",
                  icon: <FaPlus className="text-orange-600" />,
                  path: "/add-sub-category",
                },
                {
                  label: "Add Product",
                  icon: <FaBoxOpen className="text-green-600" />,
                  path: "/add-product",
                },
                {
                  label: "Add Vendor",
                  icon: <FaStore className="text-purple-600" />,
                  path: "/add-vendor",
                },
                {
                  label: "Add Outlet",
                  icon: <FaBuilding className="text-orange-500" />,
                  path: "/add-outlet",
                },
                {
                  label: "Add Employee",
                  icon: <FaUserPlus className="text-teal-600" />,
                  path: "/add-employee",
                },

                {
                  label: "Add Blog",
                  icon: <FaPlus className="text-sky-600" />,
                  path: "/add-blog",
                },
                {
                  label: "All Messages",
                  icon: <FaEnvelopeOpenText className="text-rose-600" />,
                  path: "/all-messages",
                },
                {
                  label: "All Subscriptions",
                  icon: <FaBell className="text-indigo-600" />,
                  path: "/all-subscriptions",
                },
                {
                  label: "All Guest Orders",
                  icon: <FaClipboardList className="text-indigo-600" />,
                  path: "/all-guest-orders",
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
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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

export default SuperadminDashboard;
