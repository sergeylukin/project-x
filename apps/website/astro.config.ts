// @ts-nocheck
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from '@astro-nx-depla/shared/util/predict-reading-time';
import { config } from '@astro-nx-depla/website/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  config.googleAnalyticsId
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site:
    process.env.NODE_ENV === 'production'
      ? config.productionOrigin
      : config.origin,
  base: config.basePathname,
  trailingSlash: config.trailingSlash ? 'always' : 'never',

  output: 'static',

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  outDir: '../../dist/apps/website',
  integrations: [
    react(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@cms': path.resolve(
          __dirname,
          '../../libs/shared/ui/src/lib/react/cms.jsx'
        ),
        '@layout': path.resolve(
          __dirname,
          '../../libs/shared/ui/src/lib/layouts/'
        ),
      },
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname, '../../')],
      },
    },
  },
});
