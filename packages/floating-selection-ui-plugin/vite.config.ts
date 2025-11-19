import { defineConfig, mergeConfig } from "vite";
import { baseConfig } from "@mdxeditor/tooling/vite.config.base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      lib: {
        entry: "./src/index.tsx",
        name: "FloatingSelectionUIPlugin",
        fileName: "index",
      },
    },
  }),
);
