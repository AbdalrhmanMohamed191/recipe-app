import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin
 = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRouteAdmin;