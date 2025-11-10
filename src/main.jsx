import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "core-js/stable";
import "regenerator-runtime/runtime";

// Initialize Sentry before React renders
import { initSentry } from "./utils/sentry";
initSentry();

import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
