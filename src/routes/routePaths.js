// src/constants/routes.js
export const PATHS = {
  HOME: "/",
  MODELS: "/models",
  MODEL: "/model/:modelId",
  LOCATIONS: "/locations",
  LOCATION: "/locations/:locationId",
  OFFERS: "/offers",
  CORPORATE: "/corporate",
  ABOUT: "/about",
  CONTACT: "/contact",
  SUPPORT: "/Support",
  BOOKINGS: "/bookings",
  BOOKING: "/booking/:bookingId",
  CONFIRMATION: "/confirmation",
  LOGIN: "/login",
  SIGNUP: "/signup",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  REVIEWS: "/reviews",
  NOTIFICATIONS: "/notifications",
  TESTIMONIALS: "/testimonials",
  FAQ: "/faq",
  PRIVACY: "/privacy",
  TERMS: "/terms",
};

export const ADMIN_PATHS = {
  DASHBOARD: "/admin",
  CARS: "/admin/cars",
  ADD_CAR: "/admin/cars/new",
  EDIT_CAR: "/admin/cars/:carId/edit",
  BOOKINGS: "/admin/bookings",
  USERS: "/admin/users",
  REPORTS: "/admin/reports",
  NOTIFICATIONS: "/admin/notifications",
  SETTINGS: "/admin/settings",
};

// Complete Route configurations with metadata
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
      "Learn about our story, mission, and commitment to luxury mobility. Discover why BenzFlex is the premier choice.",
    keywords: "about benzflex, our story, company mission, luxury car rental",
  },
  [PATHS.MODELS]: {
    title: "Our Fleet - Mercedes-Benz Models",
    description:
      "Browse our exclusive collection of Mercedes-Benz vehicles. From luxury sedans to premium SUVs.",
    keywords: "mercedes-benz fleet, car models, luxury vehicles, rental cars",
  },
  [PATHS.MODEL]: {
    title: "Model Details - BenzFlex",
    description:
      "Detailed information about this Mercedes-Benz model. Features, specifications, and rental options.",
    keywords: "car details, model specifications, vehicle features",
  },
  [PATHS.LOCATIONS]: {
    title: "Our Locations - BenzFlex",
    description:
      "Find BenzFlex rental locations near you. Multiple convenient locations for luxury vehicle rentals.",
    keywords: "rental locations, branches, pickup locations",
  },
  [PATHS.LOCATION]: {
    title: "Location Details - BenzFlex",
    description:
      "Detailed information about this BenzFlex location. Services, hours, and contact information.",
    keywords: "location details, branch information",
  },
  [PATHS.OFFERS]: {
    title: "Special Offers - BenzFlex",
    description:
      "Exclusive deals and promotions on luxury vehicle rentals. Save on your next Mercedes-Benz rental.",
    keywords: "special offers, promotions, discounts, deals",
  },
  [PATHS.CORPORATE]: {
    title: "Corporate Rentals - BenzFlex",
    description:
      "Premium vehicle rental solutions for businesses. Corporate accounts and fleet management.",
    keywords: "corporate rental, business vehicles, fleet management",
  },
  [PATHS.CONTACT]: {
    title: "Contact Us - BenzFlex",
    description:
      "Get in touch with our luxury vehicle specialists. We're here to help with your rental needs.",
    keywords: "contact benzflex, customer service, support",
  },
  [PATHS.HELP_CENTER]: {
    title: "Help Center - BenzFlex",
    description:
      "Find answers to common questions and get support for your BenzFlex rental experience.",
    keywords: "help, support, faq, assistance",
  },
  [PATHS.BOOKINGS]: {
    title: "My Bookings - BenzFlex",
    description:
      "View and manage your vehicle reservations and rental history.",
    keywords: "bookings, reservations, rental history",
  },
  [PATHS.BOOKING]: {
    title: "Booking Details - BenzFlex",
    description: "Detailed information about your vehicle rental booking.",
    keywords: "booking details, reservation information",
  },
  [PATHS.CONFIRMATION]: {
    title: "Booking Confirmation - BenzFlex",
    description:
      "Your luxury vehicle rental has been confirmed. Thank you for choosing BenzFlex.",
    keywords: "confirmation, booking confirmed",
  },
  [PATHS.LOGIN]: {
    title: "Login - BenzFlex",
    description:
      "Sign in to your BenzFlex account to manage your bookings and preferences.",
    keywords: "login, sign in, account",
  },
  [PATHS.SIGNUP]: {
    title: "Sign Up - BenzFlex",
    description:
      "Create your BenzFlex account to start renting luxury Mercedes-Benz vehicles.",
    keywords: "sign up, register, create account",
  },
  [PATHS.CHECKOUT]: {
    title: "Checkout - BenzFlex",
    description:
      "Complete your luxury vehicle rental reservation with secure checkout.",
    keywords: "checkout, booking, reservation",
  },
  [PATHS.PROFILE]: {
    title: "My Profile - BenzFlex",
    description:
      "Manage your personal information, preferences, and rental history.",
    keywords: "profile, account settings, personal information",
  },
  [PATHS.SETTINGS]: {
    title: "Settings - BenzFlex",
    description: "Customize your BenzFlex account settings and preferences.",
    keywords: "settings, preferences, account configuration",
  },
  [PATHS.REVIEWS]: {
    title: "My Reviews - BenzFlex",
    description: "View and manage your vehicle rental reviews and ratings.",
    keywords: "reviews, ratings, feedback",
  },
  [PATHS.NOTIFICATIONS]: {
    title: "Notifications - BenzFlex",
    description:
      "Manage your notification preferences and view recent updates.",
    keywords: "notifications, alerts, updates",
  },
  [PATHS.TESTIMONIALS]: {
    title: "Testimonials - BenzFlex",
    description:
      "Read what our customers say about their BenzFlex luxury rental experience.",
    keywords: "testimonials, reviews, customer stories",
  },
  [PATHS.FAQ]: {
    title: "FAQ - BenzFlex",
    description:
      "Frequently asked questions about Mercedes-Benz rentals and our services.",
    keywords: "faq, frequently asked questions, help",
  },
  [PATHS.PRIVACY]: {
    title: "Privacy Policy - BenzFlex",
    description:
      "Learn how BenzFlex protects your privacy and handles your personal information.",
    keywords: "privacy policy, data protection",
  },
  [PATHS.TERMS]: {
    title: "Terms of Service - BenzFlex",
    description:
      "Read the terms and conditions for using BenzFlex luxury vehicle rental services.",
    keywords: "terms of service, terms and conditions",
  },
};

// Admin route configurations
export const ADMIN_ROUTE_CONFIG = {
  [ADMIN_PATHS.DASHBOARD]: {
    title: "Admin Dashboard - BenzFlex",
    description: "BenzFlex administration dashboard",
  },
  [ADMIN_PATHS.CARS]: {
    title: "Manage Cars - BenzFlex Admin",
    description: "Manage the BenzFlex vehicle fleet",
  },
  [ADMIN_PATHS.ADD_CAR]: {
    title: "Add New Car - BenzFlex Admin",
    description: "Add a new vehicle to the BenzFlex fleet",
  },
  [ADMIN_PATHS.EDIT_CAR]: {
    title: "Edit Car - BenzFlex Admin",
    description: "Edit vehicle information in the BenzFlex fleet",
  },
  [ADMIN_PATHS.BOOKINGS]: {
    title: "Manage Bookings - BenzFlex Admin",
    description: "Manage all vehicle rental bookings",
  },
  [ADMIN_PATHS.USERS]: {
    title: "Manage Users - BenzFlex Admin",
    description: "Manage BenzFlex user accounts",
  },
  [ADMIN_PATHS.REPORTS]: {
    title: "Reports - BenzFlex Admin",
    description: "View reports and analytics",
  },
  [ADMIN_PATHS.NOTIFICATIONS]: {
    title: "Admin Notifications - BenzFlex",
    description: "Manage system notifications",
  },
  [ADMIN_PATHS.SETTINGS]: {
    title: "Admin Settings - BenzFlex",
    description: "System configuration and settings",
  },
};

// Navigation menu structure
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
        { path: PATHS.CORPORATE, label: "Corporate" },
        { path: PATHS.CONTACT, label: "Contact" },
        { path: PATHS.TESTIMONIALS, label: "Testimonials" },
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
        { path: PATHS.HELP_CENTER, label: "Help Center" },
        { path: PATHS.FAQ, label: "FAQ" },
        { path: PATHS.CONTACT, label: "Contact Support" },
        { path: PATHS.PRIVACY, label: "Privacy Policy" },
      ],
    },
    {
      title: "Legal",
      links: [
        { path: PATHS.TERMS, label: "Terms of Service" },
        { path: PATHS.PRIVACY, label: "Privacy Policy" },
        { path: PATHS.CORPORATE, label: "Corporate Policies" },
      ],
    },
  ],
};
