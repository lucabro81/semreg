import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/worker-entry.ts'),
      name: 'SemReg',
      fileName: (format) => `semreg.worker.${format}.js`,
      formats: ['es', 'umd'],
    },
    outDir: 'dist/worker',
    minify: true,
    target: 'es2015',
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: 'dist/worker/types',
      exclude: ['**/*.test.ts'],
    }),
  ],
});