import { createGlobalStyle } from "styled-components";

// Breakpoints (mobile-first)
export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const devices = {
  xs: `(max-width: ${breakpoints.xs})`,
  sm: `(max-width: ${breakpoints.sm})`,
  md: `(max-width: ${breakpoints.md})`,
  lg: `(max-width: ${breakpoints.lg})`,
  xl: `(max-width: ${breakpoints.xl})`,
  "2xl": `(max-width: ${breakpoints["2xl"]})`,
};

const GlobalStyles = createGlobalStyle`
  /* Import Google Fonts - Ultra Modern Luxury */
  
  :root {
    // Mercedes-Benz Luxury Color Palette
    --primary: #006994 ;        // Mercedes Red
    --primary-dark: #64b2d4;   // Dark Red
    --primary-light: #2f86c5;  // Light Red
    --secondary: #0D0D0D;      // Jet Black
    --secondary-light: #1A1A1A; // Dark Gray
    --accent: #FFD700;         // Gold Accent
    --accent-dark: #B8860B;    // Dark Gold
    
    // Neutral Colors
    --background: #FFFFFF;
    --surface: #F8FAFC;
    --white: #FFFFFF;
    --black: #000000;
    
    // Text Colors
    --text-primary: #1A1A1A;
    --text-secondary: #4B5563;
    --text-muted: #6B7280;
    --text-light: #9CA3AF;
    
    // Status Colors
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
    --info: #3B82F6;
    
    // Gray Scale
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-300: #D1D5DB;
    --gray-400: #9CA3AF;
    --gray-500: #6B7280;
    --gray-600: #4B5563;
    --gray-700: #374151;
    --gray-800: #1F2937;
    --gray-900: #111827;

    // Font Families - Ultra Modern Luxury
    --font-heading: 'Cormorant Garamond', serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;
    --font-accent: 'Plus Jakarta Sans', sans-serif;

    // Gradients
    --gradient-primary: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
    --gradient-secondary: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%);
    --gradient-accent: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
    --gradient-luxury: linear-gradient(135deg, #1E293B 0%, #374151 100%);
    --gradient-overlay: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);

    // Shadows
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 24px 48px rgba(0, 0, 0, 0.18);
    --shadow-xl: 0 32px 64px rgba(0, 0, 0, 0.24);
    --shadow-gold: 0 8px 32px rgba(255, 215, 0, 0.15);

    // Border Radius
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-2xl: 24px;
    --radius-3xl: 32px;
    --radius-full: 50px;

    // Spacing
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
    --space-2xl: 4rem;

    // Typography Scale
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;
    --text-6xl: 3.75rem;

    // Font Weights
    --font-light: 300;
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;

    // Transitions
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    --transition-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  /* Ensure fonts are loaded and applied */
  html {
    font-family: var(--font-body);
  }

  /* Reset + box model */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  /* Smooth scrolling */
  html {
    font-size: 62.5%; // 1rem = 10px for easy math
    scroll-behavior: smooth;
    width: 100vw;
    overflow-x: hidden;

    @media ${devices.lg} {
      font-size: 62.5%;
    }
    
    @media ${devices.md} {
      font-size: 60%;
    }
    
    @media ${devices.sm} {
      font-size: 58%;
    }

    @media ${devices.xs} {
      font-size: 56%;
    }
  }

  body {
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--background);
    line-height: 1.6;
    font-size: 1.6rem;
    font-weight: var(--font-normal);
    min-height: 100vh;
    overflow-x: hidden;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography Scale */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-semibold);
    color: var(--secondary);
    line-height: 1.2;
    margin-bottom: var(--space-md);
    overflow-wrap: break-word;
    letter-spacing: -0.01em;
  }

  h1 {
    font-size: var(--text-5xl);
    font-weight: var(--font-semibold);
    letter-spacing: -0.02em;

    @media ${devices.md} {
      font-size: var(--text-4xl);
    }

    @media ${devices.sm} {
      font-size: var(--text-3xl);
    }
  }

  h2 {
    font-size: var(--text-4xl);
    letter-spacing: -0.01em;

    @media ${devices.md} {
      font-size: var(--text-3xl);
    }

    @media ${devices.sm} {
      font-size: var(--text-2xl);
    }
  }

  h3 {
    font-size: var(--text-3xl);
    font-weight: var(--font-medium);

    @media ${devices.md} {
      font-size: var(--text-2xl);
    }
  }

  h4 {
    font-size: var(--text-2xl);
    font-weight: var(--font-medium);
  }

  h5 {
    font-size: var(--text-xl);
    font-weight: var(--font-medium);
  }

  h6 {
    font-size: var(--text-lg);
    font-weight: var(--font-medium);
  }

  p {
    margin-bottom: var(--space-md);
    color: var(--text-secondary);
    line-height: 1.7;
    font-family: var(--font-body);
    font-weight: var(--font-normal);
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-fast);
    font-family: var(--font-body);

    &:hover {
      color: var(--primary);
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Forms & Inputs */
  input,
  button,
  textarea,
  select {
    font-family: var(--font-body);
    color: inherit;
    border: none;
    background: none;
  }

  button {
    cursor: pointer;
    transition: all var(--transition-normal);
    font-family: var(--font-body);
    font-weight: var(--font-medium);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  /* Disabled states */
  *:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  select:disabled,
  input:disabled {
    background-color: var(--gray-100);
    color: var(--text-muted);
  }

  /* Focus states */
  input:focus,
  button:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* Button with icons */
  button:has(svg) {
    line-height: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  /* Selection */
  ::selection {
    background-color: var(--primary);
    color: var(--white);
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--gray-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: var(--radius-full);

    &:hover {
      background: var(--gray-500);
    }
  }

  /* Utility classes for luxury design */
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: var(--font-heading);
  }

  .gradient-text-accent {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: var(--font-heading);
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .luxury-card {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--gray-200);
    transition: all var(--transition-normal);

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-body);

    &--success {
      background: #F0FDF4;
      color: #166534;
      border: 1px solid #BBF7D0;
    }

    &--warning {
      background: #FFFBEB;
      color: #92400E;
      border: 1px solid #FED7AA;
    }

    &--error {
      background: #FEF2F2;
      color: #991B1B;
      border: 1px solid #FECACA;
    }

    &--info {
      background: #EFF6FF;
      color: #1E40AF;
      border: 1px solid #BFDBFE;
    }
  }

  /* Loading states */
  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--gray-300);
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Animation classes */
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.4s ease-out;
  }

  .slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile optimizations */
  @media ${devices.sm} {
    .mobile-hidden {
      display: none;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    img {
      max-width: 100% !important;
    }
    
    @page {
      margin: 0.5cm;
    }
  }
`;

export default GlobalStyles;
