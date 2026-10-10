import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages proje sayfası kök altında yayınlanır:
  // bizzness4711.github.io/Doping-Video/ → göreli yol olmadan asset'ler 404 verir.
  base: "./",
  plugins: [tailwindcss()],
});
