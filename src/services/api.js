// src/api/index.js
/* eslint-disable no-undef */
import axios from "axios";
import Cookies from "js-cookie";
import { getRelativePath, isPublicRoute, normalizePath } from "../utils/path";
import { getAuthToken } from "../utils/tokenService";

// ===================================================
// Environment / BaseURL
// ===================================================
const isProduction = process.env.NODE_ENV === "production";
// Use environment variable if available, otherwise fallback to localhost or production origin
const API_IP = import.meta.env.VITE_API_IP || import.meta.env.REACT_APP_API_IP || "localhost";
const API_PORT = import.meta.env.VITE_API_PORT || import.meta.env.REACT_APP_API_PORT || "3001";
const ORIGIN = isProduction 
  ? window.location.origin 
  : `http://${API_IP}:${API_PORT}`;
const baseURL = isProduction 
  ? `${ORIGIN}/api/v1` 
  : `http://${API_IP}:${API_PORT}/api/v1`;

// API configuration loaded

// ===================================================
// Axios Instance
// ===================================================
const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookie-based auth if your backend uses it
  timeout: 15000,
  // Don't set default Content-Type - let axios handle it based on data type
  // FormData will automatically set multipart/form-data with boundary
});

// ===================================================
// CSRF Handling
// ===================================================
let csrfToken = null;
async function getCsrfToken() {
  try {
    const res = await axios.get(`${ORIGIN}/api/csrf-token`, {
      withCredentials: true,
    });
    csrfToken = res.data?.csrfToken || null;
    return csrfToken;
  } catch (err) {
    console.error("[CSRF] Failed to fetch CSRF token:", err?.message || err);
    return null;
  }
}

// ===================================================
// Helper: determine if request was authenticated
// ===================================================
function requestWasAuthenticated(config) {
  // 1) token in cookies/storage
  const { token } = getAuthToken(); // implement to read from cookie/localStorage
  // 2) Authorization header (explicit)
  const authHeader = config?.headers?.Authorization;
  // 3) withCredentials true (cookie path) — too broad to rely on alone
  // We'll use (token || authHeader) as the main signal
  return Boolean(token || authHeader);
}

// ===================================================
// Request Interceptor
// ===================================================
api.interceptors.request.use(
  async (config) => {
    // Normalize route for public checks
    const relativePath = getRelativePath(config.url, api.defaults.baseURL);
    const normalizedPath = normalizePath(relativePath);
    const method = (config.method || "get").toLowerCase();

    // Set Content-Type based on data type
    // If FormData, let browser set multipart/form-data with boundary
    // Otherwise, set application/json
    if (!(config.data instanceof FormData)) {
      if (!config.headers?.["Content-Type"]) {
        config.headers = config.headers || {};
        config.headers["Content-Type"] = "application/json";
      }
    } else {
      // For FormData, remove Content-Type to let browser set it with boundary
      if (config.headers?.["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    }

    // Attach Authorization header if we have a bearer token
    const { token } = getAuthToken();

    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip CSRF for public routes and safe methods
    const safeMethods = ["get", "head", "options"];
    const isPublic = isPublicRoute(normalizedPath, method);

    if (!safeMethods.includes(method) && !isPublic) {
      if (!csrfToken) {
        csrfToken = await getCsrfToken();
      }
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================================
// Response Interceptor
// ===================================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    // --- CSRF refresh branch (403 with CSRF message) ---
    if (
      status === 403 &&
      typeof error?.response?.data?.message === "string" &&
      error.response.data.message.toLowerCase().includes("csrf")
    ) {
      try {
        csrfToken = await getCsrfToken();
        if (csrfToken && !originalRequest._retry) {
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["x-csrf-token"] = csrfToken;
          return api(originalRequest);
        }
      } catch (csrfErr) {
        console.error("[CSRF] Failed to refresh CSRF token:", csrfErr?.message || csrfErr);
      }
    }

    // --- 401 handling branch ---
    if (status === 401) {
      // Log the offending request for debugging
      try {
        console.error(
          "[AUTH 401 REDIRECT]",
          JSON.stringify(
            {
              url: originalRequest?.url,
              method: originalRequest?.method,
              normalizedPath: (originalRequest?.url || "").split("?")[0],
              onPage: window.location.pathname,
              message:
                error?.response?.data?.message ||
                error?.message ||
                "Unauthorized",
            },
            null,
            2
          )
        );
      } catch {
        // no-op
      }

      const skipRedirect = Boolean(originalRequest?._skip401Redirect);
      const wasAuthenticated = requestWasAuthenticated(originalRequest);

      // If the request looked authenticated (had token/header),
      // then clear tokens and redirect to login (unless caller opted out).
      if (wasAuthenticated && !skipRedirect) {
        // Clear locally stored tokens/cookies
        Cookies.remove("token", { path: "/" });
        // Optional: also clear any role cookie you may be storing
        Cookies.remove("current_role", { path: "/" });

        // Avoid loops on the login page
        const isOnLoginPage = window.location.pathname.includes("login");
        if (!isOnLoginPage) {
          window.location.href = "/login";
        }
        // Also set a friendly error message
        error.message = "Your session has expired. Please log in again.";
      } else {
        // For public checks or when explicitly skipped, do NOT redirect.
        // Just pass the error through.
      }
    }

    // --- Timeouts / Network ---
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please check your connection and try again.";
    } else if (!error.response) {
      // Enhanced network error message
      const errorDetails = {
        code: error.code,
        message: error.message,
        baseURL: api.defaults.baseURL,
        url: originalRequest?.url,
        fullUrl: originalRequest ? `${api.defaults.baseURL}${originalRequest.url}` : 'unknown',
      };
      
      console.error('[Network Error]', errorDetails);
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        error.message = `Network error. Unable to connect to ${api.defaults.baseURL}. Please ensure the backend server is running on port ${API_PORT}.`;
      } else {
      error.message = "Network error. Please check if the server is running and accessible.";
      }
    } else {
      // Other status mappings
      if (status === 403 && !error.message) {
        error.message = "You don't have permission to access this resource.";
      } else if (status >= 500 && !error.message) {
        error.message = "Server error. Please try again later.";
      }
    }

    if (!isProduction) {
      // Helpful details in dev
      console.debug("API Error Details:", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message,
        at: new Date().toISOString(),
      });
    }

    return Promise.reject(error);
  }
);

// ===================================================
// Auth Utilities (minimal, no TOKEN_KEYS dependency)
// ===================================================
export const authUtils = {
  // Store a token in a single cookie named "token"
  setAuthToken: (token) => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      expires: 7,
      secure: isProduction, // Must match backend Secure setting
      sameSite: isProduction ? "none" : "lax", // Safari requires "none" with Secure=true for cross-site
      path: "/",
    };
    Cookies.set("token", token, cookieOptions);
  },
  clearAuthTokens: () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("current_role", { path: "/" });
  },
  isAuthenticated: () => {
    const { token } = getAuthToken();
    return !!token;
  },
  getCurrentRole: () => Cookies.get("current_role") || "user",
  switchRole: (newRole) => {
    const isProduction = process.env.NODE_ENV === "production";
    Cookies.set("current_role", newRole, {
      expires: 7,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
    return true;
  },
};

// ===================================================
// API Client Wrapper
// Pass _skip401Redirect: true for any request where you
// don't want the global 401 redirect (e.g. public /auth/me probe).
// ===================================================
export const apiClient = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export default api;
