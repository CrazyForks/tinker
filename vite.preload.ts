import { defineConfig } from 'vite'
import { resolve } from 'path'
import { builtinModules } from 'node:module'
import { alias } from './vite.config'

const external = builtinModules.filter((e) => !e.startsWith('_'))
external.push(
  'electron',
  'ffmpeg-static',
  'fs-extra',
  'licia',
  ...external.map((m) => `node:${m}`)
)

export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist/preload',
    minify: mode === 'development' ? false : 'esbuild',
    lib: {
      entry: [
        resolve(__dirname, 'src/preload/index.ts'),
        resolve(__dirname, 'src/preload/plugin.ts'),
      ],
      name: 'Main',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['cjs'],
    },
    rollupOptions: {
      external: (id) =>
        external.some((pkg) => id === pkg || id.startsWith(pkg + '/')),
    },
  },
  resolve: {
    alias,
  },
}))
