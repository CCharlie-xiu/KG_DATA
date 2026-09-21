import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 挂在 /KG_DATA/；本地 dev 仍用 "/"。可用 VITE_BASE 覆盖。
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE || (command === "build" ? "/KG_DATA/" : "/"),
}));
