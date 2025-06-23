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
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
        "icon-192x192.png",
        "icon-512x512.png",
        "screenshots/screen1.jpg",
      ],
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,json,tsx,jsx,md,txt}",
        ],
      },
      manifest: {
        id: "/",
        name: "Chess Timer - Professional Chess Clock",
        short_name: "ChessTimer",
        description:
          "A professional chess timer for physical games. Offline-ready and fullscreen capable.",
        lang: "en",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "landscape",
        background_color: "#0f172a",
        theme_color: "#1e293b",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "screenshots/screen1.jpg",
            sizes: "1280x720",
            type: "image/jpeg",
            label: "Main chess timer interface",
          },
        ],
        categories: ["games", "utilities", "productivity"],
        prefer_related_applications: false,
        launch_handler: {
          client_mode: "focus-existing",
        },
        scope_extensions: [],
        iarc_rating_id: "e10+",
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
