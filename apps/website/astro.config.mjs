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
import { readingTimeRemarkPlugin } from '../../libs/shared/util/astro-remark-plugin-predict-reading-time/src';
import { CONFIG } from '../../libs/website/config/src';
const SITE = CONFIG['app'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadConfig = () => {
  return {
    name: '@depl/astrojs-load-config-plugin',
    hooks: {
      'astro:config:setup': async ({ updateConfig, injectScript }) => {
        const CONFIG_LOAD_JS = `
          import { CONFIG as ORIGINAL_CONFIG } from '@astro-nx-depla/website/config';
          import { CONFIG as CONFIG_PROVIDER } from '@astro-nx-depla/shared/util/config-provider';
          CONFIG_PROVIDER.set(ORIGINAL_CONFIG);
        `;
        injectScript('page-ssr', CONFIG_LOAD_JS);
        updateConfig({
          vite: {
            plugins: [
              {
                transform: (content, id) => {
                  if (/src\/pages\/.+\.ts$/.test(id)) {
                    content = `
                      ${CONFIG_LOAD_JS}
                      ${content}
                    `;
                    return {
                      code: content,
                      map: null,
                    };
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
};

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  outDir: '../../dist/apps/website',
  integrations: [
    loadConfig(),
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
      },
    },
  },
});
