// src/pages/users/AllUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

// Stop-words to ignore inside the query
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "user",
  "users",
  "role",
  "named",
  "called",
]);

// Normalize strings for matching (lowercase + strip accents/diacritics)
const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove diacritics

// Tokenize the query; trim outer spaces, split by whitespace, drop stop-words
const tokenize = (raw) => {
  const trimmed = String(raw || "").trim(); // remove front/back spaces
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/) // split on any whitespace block
    .map(norm)
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t)); // drop stop-words
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "card" | "list"
  const [searchQuery, setSearchQuery] = useState(""); // raw input (kept as typed)
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${globalBackendRoute}/api/all-users`)
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const getImageUrl = (avatar) => {
    if (avatar) {
      const normalized = String(avatar)
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalized}`;
    }
    return null;
  };

  const handleUserClick = (id) => navigate(`/single-user/${id}`);

  // Build a filtered list using a TRIMMED, tokenized query
  const filteredUsers = useMemo(() => {
    const tokens = tokenize(searchQuery); // uses TRIMMED copy internally
    if (!tokens.length) return users; // empty or all-stop-words => show all

    return users.filter((u) => {
      // Build a searchable haystack across attributes
      const hay = norm(
        [u?.name || "", u?.email || "", u?.role || ""].join(" ")
      );

      // Match if ANY token occurs in ANY attribute (OR across tokens)
      return tokens.some((t) => hay.includes(t));
    });
  }, [users, searchQuery]);

  const UserCard = ({ user }) => {
    const imgUrl = getImageUrl(user?.avatar);

    return (
      <div
        onClick={() => handleUserClick(user?._id)}
        className="cursor-pointer flex flex-col items-start relative hover:shadow-lg transition border rounded-lg p-2"
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={user?.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-slate-100 rounded-lg">
            <FaUserCircle className="text-slate-400 text-6xl" />
          </div>
        )}
        <h3 className="mt-2 text-md font-semibold text-gray-900">
          {user?.name}
        </h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-600">{user?.role}</p>
      </div>
    );
  };

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="mx-auto container px-6 lg:px-8">
        {/* Header / Controls */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-900">All Users</h2>
          <div className="flex items-center space-x-4">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            {/* Search (keeps raw input; matching uses a TRIMMED copy internally) */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, role…"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user?._id} user={user} />
              ))}
              {!filteredUsers.length && (
                <div className="col-span-full text-sm text-slate-500">
                  No users match your search.
                </div>
              )}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard key={user?._id} user={user} />
              ))}
              {!filteredUsers.length && (
                <div className="col-span-full text-sm text-slate-500">
                  No users match your search.
                </div>
              )}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user?._id}
                  onClick={() => handleUserClick(user?._id)}
                  className="cursor-pointer flex items-center gap-4 bg-white border rounded-lg p-4 hover:shadow-md"
                >
                  {getImageUrl(user?.avatar) ? (
                    <img
                      src={getImageUrl(user?.avatar)}
                      alt={user?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <FaUserCircle className="text-slate-400 text-6xl" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-600">{user?.role}</p>
                  </div>
                </div>
              ))}

              {!filteredUsers.length && (
                <div className="text-sm text-slate-500">
                  No users match your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
