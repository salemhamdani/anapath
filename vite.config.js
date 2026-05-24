import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves from /repo-name/ unless this is a user/org site (username.github.io)
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "true" ? "/anapath/" : "/",
});
