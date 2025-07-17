// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, allowedRoles = ["admin", "superadmin"] }) => {
//   const userToken = localStorage.getItem("token"); // Retrieve token
//   const user = JSON.parse(localStorage.getItem("user")); // Retrieve user

//   if (!userToken || !user) {
//     alert("You need to log in to access this page.");
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     alert("Only admin or superadmin can access this page.");
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const userToken = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!userToken || !user) {
    alert("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    alert("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
