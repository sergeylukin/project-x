npx create-nx-workspace@latest astro-nx-depla --preset=empty --pm=npm
npm i -D @nxtensions/astro@latest
npx nx g @nxtensions/astro:app website

npx astro add tailwind

- move astro.config.mjs and tailwind.config.cjs to apps/website
