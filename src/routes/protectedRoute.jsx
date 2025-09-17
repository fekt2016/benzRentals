import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // your auth context or hook

/**
 * roles: array of allowed roles for this route, e.g., ["admin", "user"]
 */
const ProtectedRoute = ({ roles }) => {
  const { user, isAuthenticated } = useAuth(); // implement this hook to get auth state

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → redirect to home or unauthorized page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized → render the child route(s)
  return <Outlet />;
};

export default ProtectedRoute;
