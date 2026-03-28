import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { wsDevIntegration } from "./src/integrations/ws-dev";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react(), wsDevIntegration()],
  vite: {
    plugins: [tailwindcss()],
  },
});
