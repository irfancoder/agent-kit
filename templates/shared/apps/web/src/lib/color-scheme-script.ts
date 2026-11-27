// No imports: rsbuild.config.ts reads this at build time to inline the script.

/** Where the chosen scheme is kept between visits. */
export const COLOR_SCHEME_KEY = 'kitapp.color-scheme';

/** Runs in <head> before the first paint, so a saved choice shows with no flash. */
export const colorSchemeScript = `try{var s=localStorage.getItem(${JSON.stringify(COLOR_SCHEME_KEY)});document.documentElement.dataset.colorScheme=s==="light"||s==="dark"?s:"system"}catch(e){}`;
