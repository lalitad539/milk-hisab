import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "दूध का हिसाब",
        short_name: "दूध हिसाब",
        description: "Daily Milk Tracker and Calculator",
        theme_color: "#176b87",
        background_color: "#f1f5f9",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-102x102.png",
            sizes: "102x102",
            type: "image/png"
          },
          {
            src: "/pwa-209x209.png",
            sizes: "209x209",
            type: "image/png"
          }
        ]
      }
    })
  ]
});