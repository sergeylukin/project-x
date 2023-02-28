npx create-nx-workspace@latest astro-nx-depla --preset=empty --pm=npm
npm i -D @nxtensions/astro@latest
npx nx g @nxtensions/astro:app website

npx astro add tailwind

- move astro.config.mjs and tailwind.config.cjs to apps/website

npx nx g @nxtensions/astro:lib common
npx nx g @nxtensions/astro:lib config --directory=website --importPath=@astro-nx-depla/website/config
npx nx g @nxtensions/astro:lib ui --directory=shared --importPath=@astro-nx-depla/shared/ui
npx astro add sitemap image mdx partytown

npm install @nrwl/nx-plugin@latest
nx g @nrwl/nx-plugin:plugin nx
