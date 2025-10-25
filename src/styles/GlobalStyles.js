import { createGlobalStyle } from "styled-components";

// Breakpoints (mobile-first)
export const breakpoints = {
  xs: "320px",
  xs1: "480px",
  sm: "640px",
  md: "768px",
  md2: "968px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const devices = {
  xs: `(max-width: ${breakpoints.xs})`,
  xs1: `(max-width: ${breakpoints.xs})`,
  sm: `(max-width: ${breakpoints.sm})`,
  md: `(max-width: ${breakpoints.md})`,
  md2: `(max-width: ${breakpoints.md2})`,
  lg: `(max-width: ${breakpoints.lg})`,
  xl: `(max-width: ${breakpoints.xl})`,
  "2xl": `(max-width: ${breakpoints["2xl"]})`,
};

const GlobalStyles = createGlobalStyle`
  /* Import Google Fonts - Ultra Modern Luxury */
  
  :root {
    // Mercedes-Benz Luxury Color Palette
    --primary: #5ccefb ;        // Mercedes Red
    --primary-dark: #4090b0;   // Dark Red
    --primary-light: #aee7fd;  // Light Red
    --secondary: #0D0D0D;      // Jet Black
    --secondary-light: #1A1A1A; // Dark Gray
    --accent: #fb895c;         // Gold Accent
    --accent-dark: #c96e4a;    // Dark Gold
    
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
    --gradient-primary: linear-gradient(135deg, #4090b0 0%, #aee7fd 100%);
    --gradient-secondary: linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%);
    --gradient-accent: linear-gradient(135deg, #fb895c 0%, #c96e4a 100%);
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
    --space-xs: .8rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 2.5rem;
    --space-2xl: 3.5rem;
    --space-3xl: 6rem;

    // ===== INCREASED TYPOGRAPHY SCALE =====
    --text-xs: 0.8rem;        // Increased from 0.7rem
    --text-sm: 0.95rem;       // Increased from 0.8rem
    --text-base: 1.1rem;      // Increased from 1rem
    --text-lg: 1.25rem;       // Increased from 1.12rem
    --text-xl: 1.4rem;        // Increased from 1.2rem
    --text-2xl: 1.8rem;       // Increased from 1.5rem
    --text-3xl: 2.2rem;       // Increased from 1.8rem
    --text-4xl: 2.8rem;       // Increased from 2.25rem
    --text-5xl: 3.5rem;       // Increased from 3rem
    --text-6xl: 4.5rem;       // Increased from 3.75rem
    --text-7xl: 5rem;         // Increased from 4rem

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

  /* ========== MOBILE VIEWPORT FIXES ========== */
  
  /* Reset + box model */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    /* Prevent text size adjustment on mobile */
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
    /* Improve touch interactions */
    touch-action: manipulation;
  }

  /* Mobile viewport protection */
  html {
    font-family: var(--font-body);
    font-size: 62.5%; // 1rem = 10px for easy math
    scroll-behavior: smooth;
    width: 100vw;
    overflow-x: hidden;
    
    /* Prevent font scaling in landscape on iOS */
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    /* Remove tap highlight */
    -webkit-tap-highlight-color: transparent;
    
    /* Ensure proper viewport behavior */
    height: 100%;
    position: fixed; /* Prevents elastic scrolling on iOS */

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
    
    /* Mobile viewport fixes */
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto; /* Allow vertical scrolling */
    position: relative !important; 
    
    
    /* Prevent elastic scrolling on iOS */
    -webkit-overflow-scrolling: touch;
    
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Ensure content fits viewport */
    max-width: 100vw;
  }

  #root {
    width: 100%;
    min-height: 100%;
    position: relative;
    overflow-x: hidden;
  }

  /* ========== MOBILE FORM FIXES ========== */
  
  /* Prevent zoom on input focus in iOS */
  @media screen and (max-width: 768px) {
    input, select, textarea {
      font-size: 16px !important; /* Prevents auto-zoom in iOS Safari */
    }
    
    /* Ensure form elements are touch-friendly */
    input, select, textarea, button {
      min-height: 44px; /* Minimum touch target size */
    }
  }

  /* Touch device improvements */
  @media (hover: none) and (pointer: coarse) {
    button, a, [role="button"] {
      min-height: 44px; /* Minimum touch target size */
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  /* ========== EXISTING STYLES (with mobile optimizations) ========== */

  /* Typography Scale */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-semibold);
    color: var(--secondary);
    line-height: 1.2;
    margin-bottom: var(--space-md);
    overflow-wrap: break-word;
    letter-spacing: -0.01em;
    
    /* Ensure text doesn't cause overflow */
    word-wrap: break-word;
    hyphens: auto;
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
    font-size: var(--text-base);
    
    /* Prevent text overflow on mobile */
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-fast);
    font-family: var(--font-body);
    font-size: inherit;

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
    
    /* Prevent images from causing overflow */
    object-fit: cover;
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
    font-size: var(--text-base);
    
    /* Mobile-friendly sizing */
    min-height: 44px;
  }

  button {
    cursor: pointer;
    transition: all var(--transition-normal);
    font-family: var(--font-body);
    font-weight: var(--font-medium);
    font-size: var(--text-base);

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

  /* ========== MOBILE-SPECIFIC OVERRIDES ========== */

  /* Container constraints for mobile */
  @media ${devices.sm} {
    .container, .page-wrapper, [class*="container"] {
      max-width: 100vw;
      overflow-x: hidden;
    }
    
    /* Hide elements that might cause layout issues */
    .mobile-hidden {
      display: none;
    }
    
    /* Ensure content doesn't overflow */
    .mobile-full-width {
      width: 100vw;
      margin-left: calc(-50vw + 50%);
    }
  }

  /* iOS Safari specific fixes */
  @supports (-webkit-touch-callout: none) {
    body {
      /* iOS-specific height fix */
      min-height: -webkit-fill-available;
    }
    
    html {
      height: -webkit-fill-available;
    }
    
    /* Force GPU rendering for better performance */
    .gpu-render {
      transform: translateZ(0);
    }
  }

  /* Utility classes for luxury design */
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: var(--font-heading);
    font-size: inherit;
  }

  .gradient-text-accent {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: var(--font-heading);
    font-size: inherit;
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