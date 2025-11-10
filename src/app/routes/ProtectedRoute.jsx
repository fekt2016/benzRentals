/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/useAuth";
import { getDashboardRouteByRole } from "../../utils/getDashboardRouteByRole";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import Cookies from "js-cookie";

/**
 * ProtectedRoute Component
 * 
 * A centralized route guard for role-based protected routes.
 * 
 * Access Rules:
 * - Requires authentication (redirects to /login if not logged in)
 * - Only allows access if user's role matches allowedRoles
 * - Redirects to user's dashboard if role doesn't match
 * 
 * Role Restrictions:
 * - user → can only access /user/* routes
 * - driver → can only access /driver/* routes
 * - admin → can only access /admin/* routes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child routes to render if access is granted
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route (e.g., ["admin"], ["driver"], ["user"])
 * @param {string[]} props.roles - Legacy prop name (deprecated, use allowedRoles instead)
 */
const ProtectedRoute = ({ children, allowedRoles, roles }) => {
  const location = useLocation();
  
  // Check if token exists before enabling the query
  const token = Cookies.get("token");
  const { data: userData, isLoading, isError } = useCurrentUser({ 
    enabled: !!token // Only fetch if token exists
  });
  const user = useMemo(() => userData?.user, [userData]);

  // Support both allowedRoles (new) and roles (legacy) for backward compatibility
  const rolesToCheck = allowedRoles || roles || [];

  // ============================================
  // LOADING STATE
  // ============================================
  // Show loading spinner while checking authentication state
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: "1rem",
        }}
      >
        <LoadingSpinner size="md" />
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Checking access...
        </p>
      </div>
    );
  }

  // ============================================
  // AUTHENTICATION CHECK
  // ============================================
  // Protected routes require authentication
  // If there's an error or no user, redirect to login
  // Preserve the intended destination in state for post-login redirect
  if (isError || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ============================================
  // ROLE-BASED ACCESS CONTROL
  // ============================================
  // If no roles specified, deny access (protected routes must specify allowedRoles)
  if (rolesToCheck.length === 0) {
    // No roles specified - deny access and redirect to user's dashboard
    const dashboardRoute = getDashboardRouteByRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Check if user's role is in the allowed roles list
  const hasAccess = rolesToCheck.includes(user.role);

  // ============================================
  // ROLE MISMATCH HANDLING
  // ============================================
  // Strict role enforcement:
  // - Drivers can ONLY access /driver/* routes
  // - Admins can ONLY access /admin/* routes
  // - Users can ONLY access /user/* routes
  // If user's role doesn't match allowed roles, redirect to their dashboard
  if (!hasAccess) {
    const dashboardRoute = getDashboardRouteByRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // ============================================
  // ACCESS GRANTED
  // ============================================
  // User is authenticated and has the correct role, render children
  return children;
};

export default ProtectedRoute;
