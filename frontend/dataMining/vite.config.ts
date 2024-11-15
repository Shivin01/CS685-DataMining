import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    },
  }
})