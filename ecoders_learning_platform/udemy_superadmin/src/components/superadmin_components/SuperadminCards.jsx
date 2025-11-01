// import React from "react";

// /**
//  * Wrapper that provides one consistent shadow everywhere
//  * + hover elevation. Prevents "double shadow" in card view.
//  */
// const SuperadminCards = ({ items, view, onClick, DashboardCard }) => {
//   const wrap = (cardEl, card) => {
//     if (card.key === "unread_messages" && Number(card.value) > 0) {
//       return (
//         <div key={card.key} className="relative">
//           {cardEl}
//           <span
//             title={`${card.value} unread`}
//             className="absolute -top-1 -right-1 inline-flex w-4 h-4 rounded-full bg-rose-500 ring-2 ring-white"
//           />
//         </div>
//       );
//     }
//     return <div key={card.key}>{cardEl}</div>;
//   };

//   const gridCls =
//     view === "grid"
//       ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3"
//       : view === "card"
//       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//       : "space-y-3";

//   return (
//     <div className={gridCls}>
//       {items.map((card) => {
//         const el = (
//           <div
//             className="rounded-2xl shadow-md hover:shadow-lg bg-white transition-all hover:-translate-y-[1px] cursor-pointer"
//             onClick={() => onClick(card.link)}
//           >
//             <div className="p-1">
//               <DashboardCard card={card} view={view} />
//             </div>
//           </div>
//         );
//         return wrap(el, card);
//       })}
//     </div>
//   );
// };

// export default SuperadminCards;

//

// src/components/superadmin_components/SuperadminCards.jsx
import React from "react";

/**
 * Wrapper that provides one consistent shadow everywhere
 * + hover elevation. Prevents "double shadow" in card view.
 */
const SuperadminCards = ({ items, view, onClick, DashboardCard }) => {
  const wrap = (cardEl, card) => {
    if (card.key === "unread_messages" && Number(card.value) > 0) {
      return (
        <div key={card.key} className="relative">
          {cardEl}
          <span
            title={`${card.value} unread`}
            className="absolute -top-1 -right-1 inline-flex w-4 h-4 rounded-full bg-rose-500 ring-2 ring-white"
          />
        </div>
      );
    }
    return <div key={card.key}>{cardEl}</div>;
  };

  const gridCls =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3"
      : view === "card"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      : // LIST: make it tighter
        "space-y-2";

  return (
    <div className={gridCls}>
      {items.map((card) => {
        const el = (
          <div
            className={`rounded-2xl bg-white transition-all cursor-pointer
              shadow-md hover:shadow-lg hover:-translate-y-[1px]`}
            onClick={() => onClick(card.link)}
          >
            <div className={view === "list" ? "p-0.5" : "p-1"}>
              <DashboardCard card={card} view={view} />
            </div>
          </div>
        );
        return wrap(el, card);
      })}
    </div>
  );
};

export default SuperadminCards;
