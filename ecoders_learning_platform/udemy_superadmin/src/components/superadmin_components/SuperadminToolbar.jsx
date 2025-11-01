import React from "react";
import { FaThList, FaThLarge, FaTh } from "react-icons/fa";
import SearchBar from "../../components/common_components/SearchBar";

const SuperadminToolbar = ({
  view,
  setView,
  search,
  setSearch,
  rowsPerPage,
  setRowsPerPage,
  sortBy,
  setSortBy,
  showingCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap  gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Superadmin Dashboard
        </h1>
        <div className="text-xs sm:text-sm text-slate-600 mt-1">
          Showing <span className="font-medium">{showingCount}</span> of{" "}
          <span className="font-medium">{totalCount}</span> cards
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-2  px-2 py-1">
          <FaThList
            className={`text-lg cursor-pointer ${
              view === "list" ? "text-indigo-600" : "text-slate-500"
            }`}
            onClick={() => setView("list")}
            title="List"
          />
          <FaThLarge
            className={`text-lg cursor-pointer ${
              view === "card" ? "text-indigo-600" : "text-slate-500"
            }`}
            onClick={() => setView("card")}
            title="Card"
          />
          <FaTh
            className={`text-lg cursor-pointer ${
              view === "grid" ? "text-indigo-600" : "text-slate-500"
            }`}
            onClick={() => setView("grid")}
            title="Grid"
          />
        </div>

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards..."
        />

        <div className="flex items-center gap-1">
          <label className="text-sm text-slate-600">Rows:</label>
          <select
            className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value) || 10)}
          >
            {[10, 15, 20, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <label className="text-sm text-slate-600">Sort:</label>
          <select
            className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title_asc">Title (A–Z)</option>
            <option value="title_desc">Title (Z–A)</option>
            <option value="count_asc">Count (Low→High)</option>
            <option value="count_desc">Count (High→Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SuperadminToolbar;
