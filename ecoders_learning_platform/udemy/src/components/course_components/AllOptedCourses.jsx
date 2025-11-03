// src/pages/course_pages/AllOptedCourses.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { useAuth, decodeToken } from "../../components/auth_components/AuthManager";
import { FaPython, FaJava, FaDatabase, FaReact, FaRobot } from "react-icons/fa";

const guessIcon = (title = "", tags = []) => {
  const hay = [title, ...(Array.isArray(tags) ? tags : [])].join(" ").toLowerCase();
  if (/java\b/.test(hay)) return <FaJava className="text-4xl text-red-500" />;
  if (/python/.test(hay)) return <FaPython className="text-4xl text-yellow-500" />;
  if (/(mysql|sql|db|database)/.test(hay)) return <FaDatabase className="text-4xl text-blue-500" />;
  if (/(selenium|robot)/.test(hay)) return <FaRobot className="text-4xl text-purple-700" />;
  if (/(react|web)/.test(hay)) return <FaReact className="text-4xl text-cyan-500" />;
  return <FaReact className="text-4xl text-cyan-500" />;
};

const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/['"]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") ||
  "course";

const uniqById = (arr) => {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = String(it.id || it._id || "");
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
};

const AllOptedCourses = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const [status, setStatus] = useState(null); // "expired" | "unauthorized" | null
  const [serverMsg, setServerMsg] = useState("");

  const userId = user?._id || user?.id || localStorage.getItem("userId") || null;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!isLoggedIn || !token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      setStatus(null);
      setServerMsg("");

      try {
        const { data } = await axios.get(`${globalBackendRoute}/api/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 100 },
        });
        if (!alive) return;
        setOrders(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        if (!alive) return;
        console.error("my-orders fetch error:", e);

        const respMsg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Unauthorized";
        setServerMsg(String(respMsg));

        if (e?.response?.status === 401) {
          const d = decodeToken(token);
          const isExpired = d?.exp ? Date.now() >= d.exp * 1000 : false;
          if (isExpired) {
            setStatus("expired");
            setErr("Your session expired. Please log in again.");
          } else {
            setStatus("unauthorized");
            setErr("We couldn’t verify your session for this request.");
          }
        } else if (e?.response?.status === 403) {
          setStatus("unauthorized");
          setErr("We couldn’t verify your session for this request.");
        } else {
          setErr("Failed to load your courses.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [isLoggedIn, token]);

  const optedCourses = useMemo(() => {
    const rows = [];
    for (const o of orders) {
      for (const it of o.items || []) {
        const c = it.course || {};
        const title = c.title || it.product_name || "Untitled Course";
        const id = String(c._id || "");
        const slug = c.slug || slugify(title);
        rows.push({
          id,
          title,
          slug,
          category:
            (it.snapshot?.tags && it.snapshot.tags[0]) ||
            (Array.isArray(c.tags) && c.tags[0]) ||
            "Course",
          description: "From basics to advanced — continue where you left off.",
          icon: guessIcon(title, c.tags || it.snapshot?.tags || []),
          progress: 0,
        });
      }
    }
    return uniqById(rows);
  }, [orders]);

  return (
    <div className="category_container">
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Your Opted Courses</h2>

        <div className="text-xs text-gray-400 text-center mb-2">
          token: {token ? "present" : "missing"}
        </div>

        <div className="all_categories border-t border-b py-5 container mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading…</div>
          ) : !isLoggedIn ? (
            <div className="text-center text-gray-500 py-10">Please log in to see your courses.</div>
          ) : err ? (
            <div className="text-center py-10">
              <div className="text-red-600 mb-2">{err}</div>
              {serverMsg && (
                <div className="text-xs text-gray-500 mb-4">Server said: {serverMsg}</div>
              )}
              {status ? (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                >
                  {status === "expired" ? "Go to Login" : "Re-authenticate"}
                </button>
              ) : null}
            </div>
          ) : optedCourses.length === 0 ? (
            <div className="text-center text-gray-500 py-10">You haven’t opted into any courses yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {optedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between hover:ring-2 hover:ring-purple-300"
                >
                  <div className="mb-4 flex justify-center">{course.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">{course.description}</p>

                  <div className="w-full mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-purple-600 transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      if (!userId) return alert("Please log in to open this course.");
                      navigate(`/user-course/${userId}/${course.id}`);
                    }}
                    className="mt-auto text-center text-sm text-purple-600 font-medium hover:underline cursor-pointer"
                  >
                    Resume Course →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOptedCourses;
