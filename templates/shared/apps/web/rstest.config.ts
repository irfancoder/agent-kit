import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { stylexPlugin } from './stylex.config.ts';

export default defineConfig({
  plugins: [pluginReact()],
  testEnvironment: 'happy-dom',
  include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
  resolve: { alias: { '@': './src' } },
  tools: { rspack: { plugins: [stylexPlugin(true)] } },
});
