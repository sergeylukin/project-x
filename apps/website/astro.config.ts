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
import { app } from '@astro-nx-depla/shared/app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadConfig = () => {
  return {
    name: '@depl/astrojs-load-config-plugin',
    hooks: {
      'astro:config:setup': async ({ updateConfig, injectScript }) => {
        const CONFIG_LOAD_JS = `
          import { app as APP_FOR_SEED } from '@astro-nx-depla/website/app';
          APP_FOR_SEED.user.seed()
          APP_FOR_SEED.post.seed()
        `;
        injectScript('page-ssr', CONFIG_LOAD_JS);
      },
    },
  };
};

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
    loadConfig(),
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
