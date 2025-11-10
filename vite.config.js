import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces (required for mobile access)
    port: 5173,
    strictPort: true,
  },
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
    // Disable source maps in production (reduces build size significantly)
    sourcemap: false,
    // Minify for production (esbuild is faster and built-in)
    minify: 'esbuild',
    // Remove empty chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["core-js", "regenerator-runtime"],
        },
        // Clean up file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Clean dist folder before building
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["core-js", "regenerator-runtime"],
    exclude: ["date-fns-tz"],
  },
  resolve: {
    alias: {
      "date-fns-tz": resolve(__dirname, "./src/__mocks__/date-fns-tz.js"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git'],
  },
});
