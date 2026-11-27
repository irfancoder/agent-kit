import stylex from '@stylexjs/unplugin';

/**
 * The one StyleX transform, shared by the Rsbuild build and Rstest so
 * component tests compile styles the same way the app does.
 */
export const stylexPlugin = (dev: boolean) =>
  stylex.rspack({
    dev,
    // Class names stay readable in development; production output is hashed.
    debug: dev,
    unstable_moduleResolution: { type: 'commonJS', rootDir: import.meta.dirname },
    aliases: { '@/*': [`${import.meta.dirname}/src/*`] },
  });
