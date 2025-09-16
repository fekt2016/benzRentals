// src/styles/theme.js

export const lightTheme = {
  colors: {
    primary: "#D32F2F", // Deep red (luxury feel)
    primaryDark: "#B71C1C", // Darker red for hover
    secondary: "#0D0D0D", // Almost black (minimalist contrast)
    background: "#FFFFFF", // Clean white background
    text: "#1A1A1A", // Deep gray text (not pure black, softer)
    white: "#FFFFFF",
    gray: "#9E9E9E", // Neutral gray for muted text/icons
    accent: "#FFD700", // Gold accent (premium touch)
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  shadows: {
    card: "0px 2px 6px rgba(0, 0, 0, 0.08)", // Softer shadow
    button: "0px 2px 6px rgba(0, 0, 0, 0.12)",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "16px",
  },
};

export const darkTheme = {
  colors: {
    primary: "#D32F2F",
    primaryDark: "#B71C1C",
    secondary: "#F5F5F5", // Light gray secondary for dark mode
    background: "#0D0D0D", // True dark background
    text: "#EAEAEA", // Soft white text
    white: "#FFFFFF",
    gray: "#B0B0B0", // Muted gray
    accent: "#FFD700", // Gold accent (stands out in dark mode too)
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  shadows: {
    card: "0px 2px 6px rgba(255, 255, 255, 0.08)",
    button: "0px 2px 6px rgba(255, 255, 255, 0.12)",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "16px",
  },
};
