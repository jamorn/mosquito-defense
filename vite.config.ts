import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// จำลอง __dirname ให้ปลอดภัยสำหรับระบบ ES Modules (ESM) ใน Vite 7
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@game": path.resolve(__dirname, "./src/game"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
  },
});
