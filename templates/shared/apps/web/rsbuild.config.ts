import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { colorSchemeScript } from './src/lib/color-scheme-script.ts';

// Read API_URL and WEB_PORT from the repo-root .env (Turborepo doesn't pass shell
// env through to tasks). processEnv: {} keeps the file's other values (the api's
// settings) out of this process and out of the bundle.
const { parsed } = loadEnv({ cwd: '../..', processEnv: {} });
const apiUrl = process.env.API_URL ?? parsed.API_URL ?? 'http://127.0.0.1:3001';
const webPort = Number(process.env.WEB_PORT ?? parsed.WEB_PORT ?? 3000);

export default defineConfig({
  plugins: [pluginReact()],
  source: { entry: { index: './src/main.tsx' } },
  resolve: { alias: { '@': './src' } },
  html: {
    title: 'Kit App',
    // Puts the saved colour scheme on <html> before the first paint, so there is no flash.
    tags: [{ tag: 'script', children: colorSchemeScript, head: true }],
  },
  // Rsbuild compiles dynamic imports (every code-split route) on first visit by default.
  // That pulls the component library into an HMR update it can't accept, and the page
  // reloads mid-test.
  dev: { lazyCompilation: false },
  server: {
    host: '127.0.0.1',
    port: webPort,
    // The web app calls /api/*; the dev and preview servers forward it to the api.
    proxy: { '/api': { target: apiUrl, pathRewrite: { '^/api': '' } } },
  },
  tools: {
    rspack: { plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true })] },
  },
});
