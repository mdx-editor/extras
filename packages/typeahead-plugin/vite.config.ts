import { defineConfig, mergeConfig } from "vite";
import { baseConfig } from "@mdxeditor/tooling/vite.config.base";
import { copyFileSync } from "fs";
import { resolve } from "path";

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      lib: {
        entry: "./src/index.tsx",
        name: "TypeaheadPlugin",
        fileName: "index",
      },
    },
    plugins: [
      {
        name: "copy-styles",
        closeBundle() {
          // Copy styles.css to dist folder
          copyFileSync(
            resolve(__dirname, "src/styles.css"),
            resolve(__dirname, "dist/styles.css"),
          );
        },
      },
    ],
  }),
);
