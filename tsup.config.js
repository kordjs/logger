import { defineConfig } from 'tsup';

export default defineConfig({
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        dts: true,
        clean: true,
        splitting: false,
        sourcemap: true,
        minify: false,
        target: 'node16',
        outDir: 'dist'
});
