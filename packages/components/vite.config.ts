/// <reference types="vitest" />
import { defineConfig } from 'vite'
import plugins from './.build/plugins';
import buildConfig from './.build/build';

// https://vite.dev/config/
export default defineConfig({
  plugins,
  build: buildConfig,
  esbuild: {
    drop: ['console', 'debugger']
  }
})
