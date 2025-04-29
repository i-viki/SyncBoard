import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "production" && removeConsole(),
  ].filter(Boolean),

  server: {
    port: 3000,
    open: true,
  },

  preview: {
    port: 3000,
    open: true,
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",

        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "mui";
            if (id.includes("firebase")) return "firebase";
            if (id.includes("react-router")) return "router";
            if (id.includes("react")) return "react-vendor";
          }
        },
      },
    },
  },
}));