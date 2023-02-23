/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'apps/wensite/public/**/*.html',
    'apps/website/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    'libs/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
