import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import {env} from "process";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ...((env?.NODE_ENV === "production") ? {
    base: "/admin/",
  } : {}),
  server: {
  port: 4000,
  },
})