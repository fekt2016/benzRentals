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
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  "2xl": `(min-width: ${breakpoints["2xl"]})`,
};

const GlobalStyles = createGlobalStyle`
  :root {
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0px 6px 24px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 24px 32px rgba(0, 0, 0, 0.12);

    /* Border radius */
    --radius-tiny: 3px;
    --radius-sm: 5px;
    --radius-md: 7px;
    --radius-lg: 12px;
    --radius-circle: 100px;

    /* Backdrop */
    --backdrop-color: rgba(255, 255, 255, 0.1);

    /* Images (dark mode control) */
    --image-grayscale: 0;
    --image-opacity: 100%;
  }

  /* Reset + box model */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    transition: background-color 0.3s, border 0.3s;
  }

  html {
    font-size: 62.5%; // 1rem = 10px for easy math
    width: 100vw;
    overflow-x: hidden;

    @media ${devices.md} {
      font-size: 60%;
    }
    @media ${devices.sm} {
      font-size: 55%;
    }
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.white};
    line-height: 1.5;
    font-size: 1.6rem;
    min-height: 100vh;
    overflow-x: hidden;
    transition: color 0.3s, background-color 0.3s;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 1rem;
    line-height: 1.2;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  p {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
    filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
  }

  /* Forms & Buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  *:disabled {
    cursor: not-allowed;
  }

  select:disabled,
  input:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    color: ${({ theme }) => theme.colors.text};
  }

  input:focus,
  button:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primaryDark};
    outline-offset: 2px;
  }

  button:has(svg) {
    line-height: 0;
  }
`;

export default GlobalStyles;
