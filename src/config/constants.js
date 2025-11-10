// src/constants/routes.js

// ---------- PUBLIC ROUTES ----------
export const PATHS = {
  HOME: "/",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  AUTH_SYNC: "/auth/sync", // Sync auth token from mobile app

  // Booking
  BOOKINGS: "/bookings",
  BOOKING_DETAIL: "/booking/:bookingId",
  CHECKOUT: "/checkout",
  BOOKING_CONFIRMATION: "/confirmation",

  // Info & Content
  MODELS: "/models",
  MODEL_DETAIL: "/model/:modelId",
  LOCATIONS: "/locations",
  LOCATION_DETAIL: "/locations/:locationId",
  OFFERS: "/offers",
  BLOG: "/blog",
  CAREERS: "/careers",
  ABOUT: "/about",
  CONTACT: "/contact",
  CORPORATE: "/corporate",
  TESTIMONIALS: "/testimonials",

  // Account
  PROFILE: "/profile",
  SETTINGS: "/settings",
  REVIEWS: "/reviews",
  NOTIFICATIONS: "/notifications",
  SUPPORT: "/support",
  WISHLIST: "/wishlist",
  REFERRALS: "/referrals",
  COMPARE: "/compare",

  // Driver
  DRIVER_DASHBOARD: "/driver/dashboard",
  DRIVER_REQUESTS: "/driver/requests",
  DRIVER_TRIPS: "/driver/trips",
  DRIVER_EARNINGS: "/driver/earnings",

  // Legal
  FAQ: "/faq",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  POLICIES: "/policies",
  REPORTS: "/reports",
  DISCLAIMER: "/disclaimer",
  AGREEMENT: "/agreement",
};

// ---------- ADMIN ROUTES ----------
export const ADMIN_PATHS = {
  DASHBOARD: "/admin",

  // Cars
  CARS: "/admin/cars",
  ADD_CAR: "/admin/cars/new",
  EDIT_CAR: "/admin/cars/:carId/edit",

  // Bookings
  BOOKINGS: "/admin/bookings",
  BOOKING_DETAIL: "/admin/bookings/:bookingId",

  // Users & Drivers
  USERS: "/admin/users",
  USER_DETAIL:"/admin/users/:userId",
  DRIVERS: "/admin/drivers",
  PROFESSIONAL_DRIVER_DETAIL: "/admin/drivers/professional/:driverId",


  // Reports & Settings
  REPORTS: "/admin/reports",
  SETTINGS: "/admin/settings",
  NOTIFICATIONS: "/admin/notifications",

  // Chat Management
  CHATS: "/admin/chats",
  CHAT_DETAIL: "/admin/chats/:id",
  ONLINE_USERS: "/admin/online-users",
  CHAT_USERS: "/admin/chat-users",
  ACTIVITY_LOGS: "/admin/activity-logs",
};

// ---------- ROUTE CONFIG (SEO META) ----------
export const ROUTE_CONFIG = {
  [PATHS.HOME]: {
    title: "BenzFlex - Premium Mercedes-Benz Rentals",
    description:
      "Experience luxury with our premium Mercedes-Benz rental fleet. Exclusive vehicles, exceptional service.",
    keywords:
      "mercedes-benz, luxury car rental, premium vehicles, benzflex, luxury rental",
  },
  [PATHS.ABOUT]: {
    title: "About Us - BenzFlex",
    description:
      "Learn about our story, mission, and commitment to luxury mobility.",
    keywords: "about benzflex, company mission, luxury car rental",
  },
  [PATHS.MODELS]: {
    title: "Our Fleet - Mercedes-Benz Models",
    description:
      "Browse our exclusive collection of Mercedes-Benz vehicles — from sedans to SUVs.",
    keywords: "mercedes-benz, fleet, luxury vehicles, rentals",
  },
  [PATHS.MODEL_DETAIL]: {
    title: "Model Details - BenzFlex",
    description:
      "Detailed information about this Mercedes-Benz model, features, and rental options.",
    keywords: "model details, car specifications, vehicle info",
  },
  [PATHS.LOCATIONS]: {
    title: "Our Locations - BenzFlex",
    description:
      "Find BenzFlex rental locations near you. Convenient pickup points across regions.",
    keywords: "rental locations, branches, pickup points",
  },
  [PATHS.LOCATION_DETAIL]: {
    title: "Location Details - BenzFlex",
    description:
      "Find detailed information about a specific BenzFlex branch and its services.",
    keywords: "branch details, contact, location info",
  },
  [PATHS.OFFERS]: {
    title: "Special Offers - BenzFlex",
    description:
      "Exclusive deals and promotions on luxury vehicle rentals. Save on your next trip.",
    keywords: "offers, discounts, deals, promotions",
  },
  [PATHS.BOOKINGS]: {
    title: "My Bookings - BenzFlex",
    description:
      "View and manage your vehicle reservations and rental history.",
    keywords: "bookings, reservations, car rentals",
  },
  [PATHS.BOOKING_DETAIL]: {
    title: "Booking Details - BenzFlex",
    description: "Detailed view of your luxury car booking.",
    keywords: "booking details, rental info, reservation",
  },
  [PATHS.CONTACT]: {
    title: "Contact Us - BenzFlex",
    description:
      "Reach out to our support team for assistance with your rental.",
    keywords: "contact, support, help center",
  },
  [PATHS.FAQ]: {
    title: "FAQ - BenzFlex",
    description:
      "Answers to frequently asked questions about our rentals and services.",
    keywords: "faq, help, questions",
  },
  [PATHS.PRIVACY]: {
    title: "Privacy Policy - BenzFlex",
    description: "Learn how BenzFlex protects your data and privacy.",
    keywords: "privacy, policy, security",
  },
  [PATHS.TERMS]: {
    title: "Terms of Service - BenzFlex",
    description:
      "Review the terms and conditions for BenzFlex rentals and services.",
    keywords: "terms, conditions, policy",
  },
  [PATHS.CAREERS]: {
    title: "Careers - BenzFlex",
    description: "Join the BenzFlex team and build a career in luxury rentals.",
    keywords: "careers, jobs, hiring",
  },
  [PATHS.BLOG]: {
    title: "Blog - BenzFlex",
    description: "Explore articles and updates from the BenzFlex team.",
    keywords: "blog, news, updates",
  },
  [PATHS.CHECKOUT]: {
  title: "Checkout - BenzFlex",
  description:
    "Complete your BenzFlex booking payment securely and confirm your luxury car rental.",
  keywords: "checkout, payment, booking, car rental, benzflex",
},
 [PATHS.BOOKING_CONFIRMATION]: {
    title: "Booking Confirmed - BenzFlex",
    description:
      "Your luxury Mercedes-Benz rental has been confirmed. Booking details and next steps.",
    keywords: "booking confirmed, reservation confirmed, rental confirmation",
  },[PATHS.CORPORATE]: {
  title: "Corporate Services - BenzFlex",
  description:
    "Partner with BenzFlex for premium corporate mobility solutions and luxury car rentals worldwide.",
  keywords: "corporate rentals, business car rental, executive fleet, benzflex corporate",
},
  
};

// ---------- ADMIN ROUTE CONFIG ----------
export const ADMIN_ROUTE_CONFIG = {
  [ADMIN_PATHS.DASHBOARD]: {
    title: "Admin Dashboard - BenzFlex",
    description: "Overview and analytics for the BenzFlex admin system.",
  },
  [ADMIN_PATHS.CARS]: {
    title: "Manage Cars - BenzFlex Admin",
    description: "Manage and update BenzFlex fleet inventory.",
  },
  [ADMIN_PATHS.ADD_CAR]: {
    title: "Add New Car - BenzFlex Admin",
    description: "Add a new Mercedes-Benz to your fleet.",
  },
  [ADMIN_PATHS.EDIT_CAR]: {
    title: "Edit Car - BenzFlex Admin",
    description: "Modify car details and specifications.",
  },
  [ADMIN_PATHS.BOOKINGS]: {
    title: "Manage Bookings - BenzFlex Admin",
    description: "View, edit, and manage all customer bookings.",
  },
  [ADMIN_PATHS.BOOKING_DETAIL]: {
    title: "Booking Details - BenzFlex Admin",
    description: "Detailed admin view of a customer booking.",
  },
  [ADMIN_PATHS.USERS]: {
    title: "Manage Users - BenzFlex Admin",
    description: "Manage customer accounts and access levels.",
  },
  [ADMIN_PATHS.DRIVERS]: {
    title: "Manage Drivers - BenzFlex Admin",
    description: "View, verify, and manage registered drivers.",
  },
  [ADMIN_PATHS.REPORTS]: {
    title: "Reports - BenzFlex Admin",
    description: "System analytics and performance reports.",
  },
  [ADMIN_PATHS.SETTINGS]: {
    title: "Admin Settings - BenzFlex",
    description: "Update system configurations and admin preferences.",
  },
  [ADMIN_PATHS.NOTIFICATIONS]: {
    title: "Notifications - BenzFlex Admin",
    description: "Manage system alerts and messages.",
  },
 [ADMIN_PATHS.USER_DETAIL]: {
  title: "User Profile - BenzFlex Admin",
  description: "View and edit detailed user information, preferences, and account status.",
},
 [ADMIN_PATHS.CHATS]: {
  title: "Chat Management - BenzFlex Admin",
  description: "Monitor and respond to all customer chat sessions.",
},
 [ADMIN_PATHS.CHAT_DETAIL]: {
  title: "Chat Session - BenzFlex Admin",
  description: "View and respond to customer chat messages.",
},
 [ADMIN_PATHS.ONLINE_USERS]: {
  title: "Online Users - BenzFlex Admin",
  description: "View and chat with users currently online.",
},
};

// ---------- NAVIGATION MENU ----------
export const NAVIGATION_MENU = {
  main: [
    { path: PATHS.HOME, label: "Home" },
    { path: PATHS.MODELS, label: "Our Fleet" },
    { path: PATHS.LOCATIONS, label: "Locations" },
    { path: PATHS.OFFERS, label: "Special Offers" },
    { path: PATHS.ABOUT, label: "About Us" },
    { path: PATHS.CONTACT, label: "Contact" },
  ],
  user: [
    { path: PATHS.PROFILE, label: "My Profile" },
    { path: PATHS.BOOKINGS, label: "My Bookings" },
    { path: PATHS.REVIEWS, label: "My Reviews" },
    { path: PATHS.SETTINGS, label: "Settings" },
  ],
  footer: [
    {
      title: "Company",
      links: [
        { path: PATHS.ABOUT, label: "About Us" },
        { path: PATHS.CORPORATE, label: "Corporate Rentals" },
        { path: PATHS.CAREERS, label: "Careers" },
        { path: PATHS.CONTACT, label: "Contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { path: PATHS.MODELS, label: "Our Fleet" },
        { path: PATHS.LOCATIONS, label: "Locations" },
        { path: PATHS.OFFERS, label: "Special Offers" },
        { path: PATHS.CORPORATE, label: "Corporate Rentals" },
      ],
    },
    {
      title: "Support",
      links: [
        { path: PATHS.FAQ, label: "FAQ" },
        { path: PATHS.CONTACT, label: "Support" },
        { path: PATHS.PRIVACY, label: "Privacy Policy" },
      ],
    },
    {
      title: "Legal",
      links: [
        { path: PATHS.TERMS, label: "Terms of Service" },
        { path: PATHS.PRIVACY, label: "Privacy Policy" },
        { path: PATHS.DISCLAIMER, label: "Disclaimer" },
      ],
    },
  ],
};
