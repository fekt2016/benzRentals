// utils/publicRoutes.js

export const PUBLIC_ROUTES = [
  "/",                       // homepage
  "/about",
  "/models",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/careers",

  // auth pages (UI routes)
  "/auth/login",
  "/auth/verifyotp",
  "/auth/forgot-password",
  // NOTE: don't put /auth/reset-password/:token as a literal — it won't match.
  // If your router uses /auth/reset-password/:token, keep only the base page here:
  "/auth/reset-password",    // page shell; token handled by router param
  "/auth/signup",

  // public UI pages with params
  "/reviews/car",            // base page; detail handled by param
];

// Public GET API endpoints (regex). These should match the **API paths** after normalization.
export const PUBLIC_GET_ENDPOINTS = [
  // Cars (list + details)
  /^\/cars$/,                // GET /cars
  /^\/cars\/[a-fA-F\d]{24}$/, // GET /cars/:id (Mongo ObjectId)

  // Reviews (public car reviews)
  /^\/reviews\/car\/[a-fA-F\d]{24}$/,

  // Categories and public assets
  /^\/category\/[^/]+$/,
  /^\/public\/.+$/,

  // Products (if still used)
  /^\/product\/[a-fA-F\d]{24}$/,
  /^\/product\/\d+$/,

  // Sellers (public views)
  /^\/seller\/[^/]+\/public-profile$/,
  /^\/seller\/public\/[^/]+$/,
  /^\/seller\/(?!me\/)[^/]+\/products$/,

  // Auth flows that are GETs (e.g., token validation)
  /^\/auth\/reset-password\/[^/]+$/, // GET /auth/reset-password/:token
];
