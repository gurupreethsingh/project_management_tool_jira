// import React from "react";

// /**
//  * Pure content card (no shadows here). The wrapper (SuperadminCards) owns shadows
//  * so all views get exactly one default shadow + one hover shadow.
//  */
// const DashboardCard = ({ card, view, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`cursor-pointer rounded-2xl bg-white ${
//         view === "card"
//           ? "p-6 flex flex-col items-center text-center"
//           : view === "grid"
//           ? "p-4 flex flex-col"
//           : "p-4 flex items-center justify-between"
//       }`}
//     >
//       <div
//         className={`${
//           view === "list"
//             ? "flex items-center gap-4"
//             : "flex items-center justify-between w-full"
//         }`}
//       >
//         <div className="min-w-0">
//           <p className="subHeadingText text-sm  font-bold text-gray-600 mb-2 leading-tight">
//             {card.title}
//           </p>
//           <p className="text-md font-bold text-gray-700">{card.value}</p>
//         </div>
//         <div className="shrink-0">{card.icon}</div>
//       </div>
//     </div>
//   );
// };

// export default DashboardCard;

//

// src/components/common_components/DashboardCard.jsx
import React from "react";

const DashboardCard = ({ card, view, onClick }) => {
  // shared wrappers: NO shadow here (wrapper handles it)
  const base =
    "cursor-pointer rounded transition duration-200 bg-white select-none";

  const cls =
    view === "card"
      ? `${base} p-6 flex flex-col items-center text-center`
      : view === "grid"
      ? `${base} p-4 flex flex-col`
      : // LIST: single, compact row — icon, title, count (right)
        `${base} px-3 py-2 flex items-center justify-between gap-2`;

  if (view === "list") {
    return (
      <div onClick={onClick} className={cls}>
        {/* left: icon + title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0">
            {card.icon /* size already uniform */}
          </span>
          <p className="text-sm font-medium text-slate-800 truncate">
            {card.title}
          </p>
        </div>
        {/* right: count */}
        <div className="shrink-0">
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            {card.value}
          </span>
        </div>
      </div>
    );
  }

  // GRID / CARD
  return (
    <div onClick={onClick} className={cls}>
      <div
        className={`${
          view === "list"
            ? "flex items-center gap-4"
            : "flex items-center justify-between w-full"
        }`}
      >
        <div>
          <p className="font-bold text-gray-600 text-sm">{card.title}</p>
          <p className="text-xl text-gray-600 font-bold">{card.value}</p>
        </div>
        <div>{card.icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
