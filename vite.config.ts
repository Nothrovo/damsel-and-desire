import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "development" ? "/" : "/damsel-and-desire/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      port: 3000,
      open: false
    },
    build: {
      outDir: "dist",
      sourcemap: true
    }
  };
});
