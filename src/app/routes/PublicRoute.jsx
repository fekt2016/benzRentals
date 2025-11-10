/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/useAuth";
import { getDashboardRouteByRole } from "../../utils/getDashboardRouteByRole";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import Cookies from "js-cookie";

/**
 * PublicRoute Component
 * 
 * Handles access control for public pages and authentication pages.
 * 
 * Access Rules:
 * - Public pages (/, /about, /contact, etc.):
 *   - Accessible to guests (not logged in)
 *   - Accessible to logged-in users (role="user")
 *   - NOT accessible to drivers or admins (redirected to their dashboards)
 * 
 * - Auth pages (/login, /register, /forgot-password):
 *   - Only accessible to guests (not logged in)
 *   - All logged-in users (any role) are redirected to their dashboard
 *   - Use blockRoles={["user", "driver", "admin"]} to block all logged-in users
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child routes to render if access is granted
 * @param {string[]} props.blockRoles - Array of roles that should be blocked from accessing this route
 *   - If user has one of these roles, they will be redirected to their dashboard
 *   - Example: blockRoles={["user", "driver", "admin"]} blocks all logged-in users (for auth pages)
 *   - If not specified, defaults to blocking drivers and admins (for public pages)
 */
const PublicRoute = ({ children, blockRoles }) => {
  const location = useLocation();
  
  // Check if token exists before enabling the query
  const token = Cookies.get("token");
  const { data: userData, isLoading, isError } = useCurrentUser({ 
    enabled: !!token // Only fetch if token exists
  });
  const user = useMemo(() => userData?.user, [userData]);

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
          Loading...
        </p>
      </div>
    );
  }

  // ============================================
  // GUEST ACCESS (No user logged in)
  // ============================================
  // If there's an error or no user, allow access (guest can view public pages)
  if (isError || !user) {
    return children;
  }

  // ============================================
  // BLOCKED ROLES CHECK
  // ============================================
  // Determine which roles to block:
  // - If blockRoles is explicitly provided, use it (for auth pages)
  // - If not provided, default to blocking drivers and admins (for public pages)
  //   This allows users (role="user") to access public pages
  const rolesToBlock = blockRoles || ["driver", "admin"];

  // If user's role is in the blocked roles list, redirect to their dashboard
  if (rolesToBlock.includes(user.role)) {
    const dashboardRoute = getDashboardRouteByRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // ============================================
  // ACCESS GRANTED
  // ============================================
  // User is either:
  // 1. A guest (no user)
  // 2. A logged-in user (role="user") accessing a public page
  // 3. A logged-in user whose role is not in the blocked list
  // Render children
  return children;
};

export default PublicRoute;

