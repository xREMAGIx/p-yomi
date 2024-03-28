import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const SPLIT_CSS_MARK = "/* ##SPLIT_CSS_MARK## */";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "../src/assets/icons"),
      "@server": path.resolve(__dirname, "../server/src"),
    },
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    {
      // ⚙️ custom plugin to remove duplicated css caused by css.preprocessorOptions.scss.additionalData
      name: "vite-plugin-strip-css",
      transform(src: string, id) {
        if (id.includes(".scss")) {
          if (id.includes("src/index.scss")) {
            // Keep the common file only in root css file
            return { code: src, map: null };
          }

          const split = src.split(SPLIT_CSS_MARK);
          const newSrc = split[split.length - 1];
          return { code: newSrc, map: null };
        }
      },
    },
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          `@use "./src/styles/common.scss" as *;` + SPLIT_CSS_MARK,
      },
    },
  },
});
