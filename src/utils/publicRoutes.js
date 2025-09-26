export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/verifyotp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/signup",
  "/cars",
  "reviews/car/:id",
];
export const PUBLIC_GET_ENDPOINTS = [
  /^\/product\/[a-fA-F\d]{24}$/,
  /^\/product\/\d+$/,
  /^\/seller\/[^/]+\/public-profile$/,
  /^\/seller\/public\/[^/]+$/,
  /^\/seller\/(?!me\/)[^/]+\/products$/,
  /^\/category\/[^/]+$/,
  /^\/public\/.+$/,
];
