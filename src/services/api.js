/* eslint-disable no-undef */
import axios from "axios";
import Cookies from "js-cookie";

import { PUBLIC_ROUTES, PUBLIC_GET_ENDPOINTS } from "../utils/publicRoutes";
import { getRelativePath, isPublicRoute, normalizePath } from "../utils/path";
import { getAuthToken } from "../utils/tokenService";

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction
  ? ` ${process.env.REACT_APP_API_BASE_URL}`
  : "http://localhost:3001/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000, // Reduced from 500s to 15s for better UX
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("url", config.url);
    const relativePath = getRelativePath(config.url);
    const normalizedPath = normalizePath(relativePath);
    const method = config.method ? config.method.toLowerCase() : "get";
    // Skip authentication for public routes
    if (isPublicRoute(normalizedPath, method)) {
      return config; // no token needed
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Network errors (server not responding, CORS issues, etc.)
    if (error.code === "ECONNABORTED") {
      console.error("API Request Timeout:", error.message);
      error.message =
        "Request timeout. Please check your connection and try again.";
    } else if (!error.response) {
      console.error("Network Error:", error.message);
      error.message =
        "Network error. Please check if the server is running and accessible.";
    } else {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);

      // Handle specific HTTP status codes
      if (error.response.status === 401) {
        Cookies.remove("token");

        // Redirect to login if not already there
        const hasToken = !!Cookies.get("token"); // check if user ever had a token
        const isOnLoginPage = window.location.pathname.includes("login");

        if (hasToken && !isOnLoginPage) {
          window.location.href = "/login"; // only redirect logged-in users
        }

        error.message = "Your session has expired. Please log in again.";
      } else if (error.response.status === 403) {
        error.message = "You don't have permission to access this resource.";
      } else if (error.response.status >= 500) {
        error.message = "Server error. Please try again later.";
      }
    }

    // Enhanced error logging for debugging
    if (isProduction) {
      // Send error to logging service in production
      console.error("API Error Details:", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    return Promise.reject(error);
  }
);

// Utility functions for managing authentication
export const authUtils = {
  // Set authentication tokens
  setAuthToken: (token, role = "user") => {
    const tokenKey = TOKEN_KEYS[role] || "token";
    const cookieOptions = {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    Cookies.set(tokenKey, token, cookieOptions);
    Cookies.set("current_role", role, cookieOptions);
  },

  // Clear all authentication tokens
  clearAuthTokens: () => {
    Object.values(TOKEN_KEYS).forEach((key) =>
      Cookies.remove(key, { path: "/" })
    );
    Cookies.remove("current_role", { path: "/" });
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
        path: "/",
      });
      return true;
    }
    return false;
  },
};

// Enhanced API methods with better error handling
export const apiClient = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export default api;
