import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        "defaults",
        "not IE 11",
        "chrome >= 49",
        "firefox >= 52",
        "safari >= 10",
        "ios_saf >= 10",
        "android >= 4.4",
        "samsung >= 4",
      ],
      modernPolyfills: [
        "es.array.at",
        "es.array.find-last",
        "es.object.has-own",
        "es.string.match-all",
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["core-js", "regenerator-runtime"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["core-js", "regenerator-runtime"],
  },
});
