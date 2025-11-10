// Sentry initialization and configuration
// This file should be imported in main.jsx before React renders

let Sentry = null;

export const initSentry = () => {
  // Only initialize in production or if explicitly enabled
  const isProduction = import.meta.env.MODE === "production";
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const enableSentry = import.meta.env.VITE_ENABLE_SENTRY === "true";

  if (!sentryDsn || (!isProduction && !enableSentry)) {
    console.log("[Sentry] Not initialized - missing DSN or not in production");
    return;
  }

  try {
    // Dynamic import to avoid bundling Sentry in development
    import("@sentry/react").then((SentryModule) => {
      Sentry = SentryModule;

      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in production, 100% in dev
        // Session Replay
        replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
        replaysOnErrorSampleRate: 1.0, // Always capture replays on errors
        // Release tracking
        release: import.meta.env.VITE_APP_VERSION || "unknown",
        // Filter out sensitive data
        beforeSend(event, hint) {
          // Don't send events in development unless explicitly enabled
          if (!isProduction && !enableSentry) {
            return null;
          }

          // Filter out sensitive information
          if (event.request) {
            // Remove sensitive headers
            if (event.request.headers) {
              delete event.request.headers.Authorization;
              delete event.request.headers["x-csrf-token"];
            }

            // Remove sensitive query params
            if (event.request.query_string) {
              const params = new URLSearchParams(event.request.query_string);
              params.delete("token");
              params.delete("password");
              event.request.query_string = params.toString();
            }
          }

          // Remove sensitive user data
          if (event.user) {
            delete event.user.email;
            delete event.user.ip_address;
          }

          return event;
        },
      });

      console.log("[Sentry] Initialized successfully");
    });
  } catch (error) {
    console.error("[Sentry] Failed to initialize:", error);
  }
};

// Export Sentry instance for use in ErrorBoundary
export const getSentry = () => {
  return Sentry;
};

// Helper to manually capture exceptions
export const captureException = (error, context = {}) => {
  if (Sentry && Sentry.captureException) {
    Sentry.captureException(error, context);
  } else {
    console.error("[Error]", error, context);
  }
};

// Helper to capture messages
export const captureMessage = (message, level = "info") => {
  if (Sentry && Sentry.captureMessage) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}]`, message);
  }
};

