import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { stylexPlugin } from './stylex.config.ts';

export default defineConfig(({ command }) => {
  const dev = command === 'dev';
  // Read API_URL from the repo-root .env. processEnv: {} keeps the file's other
  // values (the api's settings) out of this process and out of the bundle.
  const { parsed } = loadEnv({ cwd: '../..', processEnv: {} });
  const apiUrl = process.env.API_URL ?? parsed.API_URL ?? 'http://127.0.0.1:3001';

  return {
    plugins: [pluginReact()],
    source: { entry: { index: './src/main.tsx' } },
    resolve: { alias: { '@': './src' } },
    html: { title: 'Kit App' },
    server: {
      host: '127.0.0.1',
      port: Number(process.env.WEB_PORT ?? 3000),
      // The web app calls /api/*; the dev and preview servers forward it to the api.
      proxy: { '/api': { target: apiUrl, pathRewrite: { '^/api': '' } } },
    },
    tools: {
      rspack: {
        plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), stylexPlugin(dev)],
      },
    },
  };
});
