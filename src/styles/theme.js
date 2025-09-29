// src/styles/theme.js
export const theme = {
  colors: {
    primary: "#D32F2F",
    primaryDark: "#B71C1C",
    primaryLight: "#EF5350",
    secondary: "#0D0D0D",
    secondaryLight: "#1A1A1A",
    accent: "#FFD700",
    accentDark: "#B8860B",

    background: "#FFFFFF",
    surface: "#F8FAFC",
    white: "#FFFFFF",
    black: "#000000",

    text: {
      primary: "#1A1A1A",
      secondary: "#4B5563",
      muted: "#6B7280",
      light: "#9CA3AF",
    },

    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },

    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },

  gradients: {
    primary: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
    secondary: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)",
    accent: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
    luxury: "linear-gradient(135deg, #1E293B 0%, #374151 100%)",
    overlay:
      "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)",
  },

  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.06)",
    md: "0 8px 32px rgba(0, 0, 0, 0.12)",
    lg: "0 24px 48px rgba(0, 0, 0, 0.18)",
    xl: "0 32px 64px rgba(0, 0, 0, 0.24)",
    gold: "0 8px 32px rgba(255, 215, 0, 0.15)",
  },

  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "50px",
  },

  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },

  typography: {
    // Ultra Modern Luxury Fonts
    fonts: {
      heading: "'Cormorant Garamond', serif",
      body: "'Plus Jakarta Sans', sans-serif",
      accent: "'Plus Jakarta Sans', sans-serif",
    },

    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    // Specific font weights for each font family
    fontWeights: {
      "Cormorant Garamond": {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      "Plus Jakarta Sans": {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },

    letterSpacing: {
      tight: "-0.02em",
      normal: "-0.01em",
      wide: "0.05em",
    },
  },

  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  transitions: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
    bounce: "0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
};

export default theme;
