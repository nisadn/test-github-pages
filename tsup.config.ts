import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'currency/index': 'another-package/src/currency/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  skipNodeModulesBundle: true,
  minify: true,
  sourcemap: true,
  outDir: 'js',
  clean: true,
});