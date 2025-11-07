// import React from "react";
// import { Link } from "react-router-dom";

// const Breadcrumb = ({ pageTitle }) => {
//   return (
//     <nav
//       className="bg-transparent px-4 py-3 text-sm font-medium text-white"
//       aria-label="Breadcrumb"
//     >
//       <ol className="flex items-center space-x-2">
//         <li>
//           <Link to="/" className="hover:text-purple-600 text-purple-600">
//             Ecoders
//           </Link>
//         </li>
//         <li className="text-purple-600">|</li>
//         <li className="text-purple-600">{pageTitle}</li>
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;

//

//

//

// src/components/common_components/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ pageTitle }) => {
  return (
    <nav
      className="w-full py-3 text-xs sm:text-sm font-medium text-slate-600"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Ecoders
          </Link>
        </li>
        <li className="text-slate-500">/</li>
        <li className="text-slate-800 truncate max-w-[60vw]">{pageTitle}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
