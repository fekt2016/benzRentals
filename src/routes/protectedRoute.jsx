import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";

/**
 * roles: array of allowed roles for this route, e.g., ["admin", "user"]
 */
const ProtectedRoute = ({ children, roles }) => {
  const { data: userData, isLoading, isError } = useCurrentUser();
  const user = useMemo(() => userData?.user, [userData]);

  // implement this hook to get auth state

  // Not logged in → redirect to login
  // Show loader while checking auth
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Checking access...
      </div>
    );
  }

  // Role not allowed → redirect to home or unauthorized page
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → kick to home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  // Authorized → render the child route(s)
  return children;
};

export default ProtectedRoute;
