import path from 'path';

import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

import unocss from '@unocss/astro';
import presetWind from '@unocss/preset-wind';
import { presetDaisy } from 'unocss-preset-daisy';
import presetTagify from '@unocss/preset-tagify';
import presetWebFonts from '@unocss/preset-web-fonts';
import presetTypography from '@unocss/preset-typography';
import transformerDirectives from '@unocss/transformer-directives';
import sitemap from '@astrojs/sitemap';
import image from '@depla/astro-image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from '@depla/utils-astro-plugin-predict-reading-time';
import { app } from '@sergeylukin/website/generated/app';
import { inject } from '@depla/utils-astro-plugin-inject';
import netlify from '@astrojs/netlify/functions';
import node from '@astrojs/node';
import { copyFromBuild } from 'astro-copy';

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

  output: 'server',
  adapter: netlify({
    dist: new URL('../../dist/apps/website/', import.meta.url),
    builders: true,
  }),
  // adapter: node({
  //   mode: 'middleware',
  // }),

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  // outDir: '../../dist/apps/website',
  integrations: [
    unocss({
      presets: [
        presetWind(),
        presetTagify({
          extraProperties: (matched) =>
            matched.startsWith('i-') ? { display: 'inline-block' } : {},
        }),
        presetDaisy(),
        presetTypography(),
        presetWebFonts({
          fonts: {
            // these will extend the default theme
            sans: 'InterVariable',
            mono: ['Fira Code', 'Fira Mono:400,700'],
            // custom ones
            handwritten: [
              {
                name: 'Shadows Into Light Two',
                cursive: true,
              },
            ],
            'text-page': [
              {
                name: 'InterVariable',
              },
              {
                name: 'sans-serif',
                provider: 'none',
              },
            ],
          },
        }),
      ],
      safelist: [
        /* this you can use to exclude utilities from purge */
      ],
      theme: {
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: 'calc(var(--radius) - 4px)',
        },
        animation: {
          keyframes: {
            'accordion-down': `from { height: 0; } to { height: var(--radix-accordion-content-height); }`,
            'accordion-up': `from { height: var(--radix-accordion-content-height); } to { height: 0; }`,
          },
        },
      },
      transformers: [transformerDirectives()],
      shortcuts: {
        '#header.scroll':
          'shadow-md md:shadow-lg bg-white md:bg-white/90 md:backdrop-blur-sm dark:bg-slate-900 dark:md:bg-slate-900/90',

        ['text-page']: 'c-text-page font-text-page',

        ['text-muted']: 'c-text-muted',

        ['bg-light']: 'bg-bg-page',

        ['bg-dark']: 'bg-slate-900',

        ['btn']:
          'inline-flex items-center justify-center rounded-full shadow-md  bg-transparent font-medium text-center text-page leading-snug transition py-3.5 px-6 md:px-8 ease-in duration-200 focus:ring-blue-500 focus:ring-offset-blue-200 focus:ring-2 focus:ring-offset-2 hover:bg-gray-100 dark:text-slate-300',

        ['btn-ghost']:
          'border-none shadow-none c-text-muted hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',

        ['btn-primary']:
          'bg-primary text-primary-foreground hover:bg-primary/90',
      },
    }),
    react(),
    inject({
      filePath: path.join(__dirname, '../..', 'libs/website/app/src/lib/_ssr-bootstrap.ts'),
    }),
    sitemap(),
    copyFromBuild({
      dest: path.join(__dirname, 'public/_astro'),
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      logLevel: 'debug',
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
    ssr: {
      noExternal: ['@depla/utils-astro-collections-facade',
      '@depla/utils-image'],
    },
    optimizeDeps: {
      exclude: ['prismock', 'astro:content'],
    },
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
