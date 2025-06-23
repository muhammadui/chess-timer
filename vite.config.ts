import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,gif,webp,json,tsx,jsx,md,txt}",
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Chess Timer - Professional Chess Clock",
        short_name: "ChessTimer",
        description:
          "Professional chess timer for physical chess games. Track time, switch turns, and never lose track of your game time again.",
        theme_color: "#1e293b",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
