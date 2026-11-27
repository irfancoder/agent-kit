import { createColorScheme, createLocalStorage } from '@ui-sdk/core';

// data-color-scheme on <html>: "system" follows the OS, "light" and "dark" pin it.
// tokens.css maps the attribute to color-scheme, so every light-dark() colour follows.
export const colorScheme = createColorScheme({
  storage: createLocalStorage('kitapp.color-scheme'),
  global: true,
});
