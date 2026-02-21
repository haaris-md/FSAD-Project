import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: true,   // ✅ FIX for Render
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: true,   // ✅ Also required for production preview
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
