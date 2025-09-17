/* eslint-disable no-undef */
import axios from "axios";
import Cookies from "js-cookie";

import { PUBLIC_ROUTES, PUBLIC_GET_ENDPOINTS } from "../utils/publicRoutes";
import { getRelativePath, isPublicRoute, normalizePath } from "../utils/path";
import { getAuthToken } from "../utils/tokenService";
import { TOKEN_KEYS } from "../utils/tokenService";

const API_CONFIG = {
  DEVELOPMENT: "http://localhost:4000/api/v1/",
  PRODUCTION: "https://eazworld.com/api/v1/",
  TIMEOUT: 500000,
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const relativePath = getRelativePath(config.url);
  const normalizedPath = normalizePath(relativePath);
  const method = config.method ? config.method.toLowerCase() : "get";

  console.debug(`[API] ${method.toUpperCase()} ${normalizedPath}`);

  // Skip authentication for public routes
  if (isPublicRoute(normalizedPath, method)) {
    return config;
  }

  // Add authentication for protected routes
  const { token, role } = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["x-user-role"] = role;
    config.roleContext = role;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle authentication errors by clearing invalid tokens
    if (error.response?.status === 401) {
      // Clear all authentication cookies
      Object.values(TOKEN_KEYS).forEach((key) => Cookies.remove(key));
      Cookies.remove("current_role");
    }

    return Promise.reject(error);
  }
);

// Utility functions for managing authentication
export const authUtils = {
  // Set authentication tokens
  setAuthToken: (token, role = "user") => {
    const tokenKey = TOKEN_KEYS[role] || "token";
    Cookies.set(tokenKey, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set("current_role", role, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  // Clear all authentication tokens
  clearAuthTokens: () => {
    Object.values(TOKEN_KEYS).forEach((key) => Cookies.remove(key));
    Cookies.remove("current_role");
  },

  // Get current authentication status
  isAuthenticated: () => {
    const { token } = getAuthToken();
    return !!token;
  },

  // Get current user role
  getCurrentRole: () => {
    return Cookies.get("current_role") || "user";
  },

  // Switch user role (for multi-role accounts)
  switchRole: (newRole) => {
    if (TOKEN_KEYS[newRole]) {
      Cookies.set("current_role", newRole, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return true;
    }
    return false;
  },
};

export default api;
