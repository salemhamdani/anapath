import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project Pages URL: https://salemhamdani.github.io/anapath/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/anapath/" : "/",
}));
