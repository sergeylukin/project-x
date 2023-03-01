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

nx generate @nrwl/nx-plugin:executor dev-astro-with-netlify-cms --project=nx

npx nx g @nrwl/js:library config-provider --directory=shared/util \
--importPath=@astro-nx-depla/shared/util/config-provider

npx nx g @nrwl/js:library post --directory=website/data-access \
--importPath=@astro-nx-depla/website/data-access/post

npx nx g @nrwl/js:library types --directory=website \
--importPath=@astro-nx-depla/website/types

modify libs/website/\* tsconfig.json to have this:
"files": ["../../../../apps/website/.astro/types.d.ts"]

nx g @nrwl/workspace:lib formatting --directory=shared/util \
--importPath=@astro-nx-depla/util/formatting

nx g @nrwl/workspace:lib astro-remark-plugin-predict-reading-time \
--directory=shared/util --importPath=@astro-nx-depla/util/predict-reading-time

npx nx g @nrwl/workspace:lib image --directory=website/data-access \
--importPath=@astro-nx-depla/website/data-access/image

npx nx g @nxtensions/astro:lib layout --directory=shared \
 --importPath=@astro-nx-depla/shared/layout
npx nx g @nrwl/workspace:lib menu-data --directory=website \
--importPath=@astro-nx-depla/website/menu-data

