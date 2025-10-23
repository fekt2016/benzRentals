/* eslint-disable react/react-in-jsx-scope */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalStyles from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { BrowserRouter, useLocation } from "react-router-dom";
import MainRoutes from "./routes/MainRoutes";
import cssVars from "css-vars-ponyfill";
import CookieConsent from "./components/CookieConsent";
import { useEffect } from "react";

// ScrollToTop component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  // Mobile viewport protection - runs on component mount
  useEffect(() => {
    // Prevent zooming and scaling issues
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTapZoom = (e) => {
      const currentTime = new Date().getTime();
      const timeSinceLastTap = currentTime - (window.lastTap || 0);
      
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        e.preventDefault();
        e.target.click && e.target.click();
      }
      
      window.lastTap = currentTime;
    };

    // Add event listeners
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    // Force viewport on mobile
    const setViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    };

    setViewport();

    // Re-apply on resize and orientation change
    window.addEventListener('resize', setViewport);
    window.addEventListener('orientationchange', setViewport);

    // Initialize CSS variables polyfill
    cssVars({
      watch: true,
    });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      window.removeEventListener('resize', setViewport);
      window.removeEventListener('orientationchange', setViewport);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <MainRoutes />
          <CookieConsent />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;