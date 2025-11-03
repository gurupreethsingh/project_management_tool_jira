// // src/components/superadmin_components/SuperadminSidebar.jsx
// import React from "react";
// import { FaSearch } from "react-icons/fa";

// /**
//  * Compact, modern sidebar with search + scroll.
//  * Expects items as [{ label, path, icon }] where icon is a React element.
//  */
// const SuperadminSidebar = ({ items, navFilter, setNavFilter, navigate }) => {
//   const filtered =
//     navFilter.trim() === ""
//       ? items
//       : items.filter((it) =>
//           String(it.label).toLowerCase().includes(navFilter.toLowerCase())
//         );

//   return (
//     <aside className="flex flex-col h-full min-h-0">
//       {/* Search */}
//       <div className="mb-2">
//         <div className="relative">
//           <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-8 pr-2 py-1.5 rounded-md w-full text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200"
//             value={navFilter}
//             onChange={(e) => setNavFilter(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Scroll area */}
//       <div
//         className="
//           custom-scroll overflow-y-auto pr-1
//           max-h-[calc(100vh-180px)]  /* tune if your header/footer differs */
//           space-y-1
//         "
//       >
//         {filtered.map((it) => (
//           <button
//             key={it.path}
//             onClick={() => navigate(it.path)}
//             className="
//               group w-full text-left flex items-center gap-2
//               px-2 py-1.5 rounded-md
//               border border-slate-100
//               bg-white/80 hover:bg-indigo-50
//               transition-colors
//             "
//             title={it.label}
//           >
//             {/* Icon a bit smaller + subtle container pill */}
//             <span
//               className="
//                 inline-flex items-center justify-center
//                 w-6 h-6 rounded-md bg-slate-50 ring-1 ring-slate-100
//                 group-hover:bg-white
//                 shrink-0
//               "
//             >
//               {it.icon}
//             </span>
//             <span className="text-[13px] text-slate-800 font-medium truncate">
//               {it.label}
//             </span>
//           </button>
//         ))}

//         {filtered.length === 0 && (
//           <div className="text-xs text-slate-500 py-6 text-center">
//             No matches
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default SuperadminSidebar;

//

// src/components/superadmin_components/SuperadminSidebar.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";

/**
 * Sidebar that can render vertically (column) or as a horizontal nav (row).
 * Props:
 * - items: [{ label, path, icon }]
 * - navFilter, setNavFilter
 * - navigate
 * - variant: "column" | "row"
 */
const SuperadminSidebar = ({
  items,
  navFilter,
  setNavFilter,
  navigate,
  variant = "column",
}) => {
  const filtered =
    navFilter.trim() === ""
      ? items
      : items.filter((it) =>
          String(it.label).toLowerCase().includes(navFilter.toLowerCase())
        );

  if (variant === "row") {
    // Horizontal, compact "top nav" with search + scroll
    return (
      <section className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-56 max-w-[60%]">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find action"
              className="pl-8 pr-2 py-1.5 rounded-md w-full text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={navFilter}
              onChange={(e) => setNavFilter(e.target.value)}
            />
          </div>
        </div>

        <div
          className="
            custom-scroll
            flex gap-2 overflow-x-auto overflow-y-hidden
            py-1
          "
        >
          {filtered.map((it) => (
            <button
              key={it.path}
              onClick={() => navigate(it.path)}
              className="
                group inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                border border-slate-200 bg-white hover:bg-indigo-50
                text-xs text-slate-800 font-medium
                shrink-0
                transition-colors
              "
              title={it.label}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 ring-1 ring-slate-100">
                {/* icons you pass in already have size; we visually shrink a bit */}
                <span className="scale-90 origin-center">{it.icon}</span>
              </span>
              <span className="whitespace-nowrap">{it.label}</span>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-xs text-slate-500 py-2 px-2">No matches</div>
          )}
        </div>
      </section>
    );
  }

  // Default vertical (unchanged from before, compact styling)
  return (
    <aside className="flex flex-col h-full min-h-0">
      <div className="mb-2">
        <div className="relative">
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1.5 rounded-md w-full text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200"
            value={navFilter}
            onChange={(e) => setNavFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="custom-scroll overflow-y-auto pr-1 max-h-[calc(100vh-180px)] space-y-1">
        {filtered.map((it) => (
          <button
            key={it.path}
            onClick={() => navigate(it.path)}
            className="
              group w-full text-left flex items-center gap-2
              px-2 py-1.5 rounded-md
              border border-slate-100
              bg-white/80 hover:bg-indigo-50
              transition-colors
            "
            title={it.label}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-50 ring-1 ring-slate-100 group-hover:bg-white shrink-0">
              <span className="scale-90 origin-center">{it.icon}</span>
            </span>
            <span className="text-[13px] text-slate-800 font-medium truncate">
              {it.label}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-slate-500 py-6 text-center">
            No matches
          </div>
        )}
      </div>
    </aside>
  );
};

export default SuperadminSidebar;
