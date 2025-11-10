/**
 * Get Dashboard Route by User Role
 * Returns the appropriate dashboard route based on the user's role
 * 
 * @param {string} role - User role: "admin", "driver", or "user"
 * @returns {string} Dashboard route path
 */
export const getDashboardRouteByRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "driver":
      return "/driver/dashboard";
    case "user":
      return "/profile"; // User dashboard - redirect to profile page
    default:
      return "/login";
  }
};

