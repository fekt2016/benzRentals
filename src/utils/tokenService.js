import Cookies from "js-cookie";

export const TOKEN_KEYS = {
  admin: "admin_token",
  user: "user_token",
};
export const getAuthToken = () => {
  // Check if we're in a browser environment before accessing cookies
  if (typeof window === "undefined") {
    return { token: null, role: "user" };
  }

  try {
    // Get role from cookies instead of localStorage
    const role = Cookies.get("current_role") || "user";
    const tokenKey = TOKEN_KEYS[role] || "token";

    return {
      token: Cookies.get(tokenKey), // Get token from cookies
      role,
    };
  } catch (error) {
    console.warn("Error accessing cookies:", error);
    return { token: null, role: "user" };
  }
};
