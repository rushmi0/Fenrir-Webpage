import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.wasm"],
  optimizeDeps: {
    exclude: ["quickjs-emscripten"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "ssl/192.168.1.210+2-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "ssl/192.168.1.210+2.pem")),
    },
  },
});
