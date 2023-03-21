// @ts-nocheck
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from '@astro-nx-depla/shared/util/astro-plugin-predict-reading-time';
import { app } from '@astro-nx-depla/shared/app';
import { inject } from '@astro-nx-depla/shared/util/astro-plugin-inject';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  app.config.googleAnalyticsId
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: app.env('WEBSITE_BASE_URL'),
  base: app.config.basePathname,
  trailingSlash: app.config.trailingSlash ? 'always' : 'never',

  output: 'static',

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  outDir: '../../dist/apps/website',
  integrations: [
    react(),
    inject({
      filePath: '@astro-nx-depla/website/app/src/lib/_ssr-bootstrap.ts',
    }),
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
