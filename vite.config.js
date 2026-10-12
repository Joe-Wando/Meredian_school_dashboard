import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le site public tourne sur 5180, le dashboard sur 5181.
export default defineConfig({
  plugins: [react()],
  server: { port: 5181, strictPort: true },
});
