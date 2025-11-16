import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Reads package.json and returns all dependencies and devDependencies
 * to be marked as external in Rollup
 */
function getExternalDependencies() {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  const peerDependencies = Object.keys(packageJson.peerDependencies || {});

  // Combine all dependencies and remove duplicates
  return [
    ...new Set([...dependencies, ...devDependencies, ...peerDependencies]),
  ];
}

export const baseConfig = defineConfig({
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      formats: ['es'],
      entry: '', // Will be overridden by package-specific config
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) => {
        // Get all dependencies from package.json
        const externals = getExternalDependencies();

        // Check if the module ID matches any dependency
        // This handles both exact matches and sub-paths (e.g., 'react/jsx-runtime')
        return externals.some((dep) => id === dep || id.startsWith(`${dep}/`));
      },
    },
    sourcemap: true,
  },
});
