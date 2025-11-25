import config from "@mdxeditor/tooling/eslint.config.mjs";

export default [
  ...config,
  {
    ignores: [".ladle/**"],
  },
  {
    rules: {
      // '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
