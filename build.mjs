import alias from 'esbuild-plugin-alias';
import * as esbuild from 'esbuild';
import path from 'path';

await esbuild.build({
  entryPoints: ['apps/website/astro.config.ts'],
  bundle: true,
  outfile: './apps/website/astro.config.mjs',
  packages: 'external',
  outbase: './',
  format: 'esm',
  // platform: 'node',
  loader: {
    '.png': 'binary',
  },
  plugins: [
    alias({
      '@astro-nx-depla/nx': path.resolve('./libs/nx/src/index.ts'),
      '@astro-nx-depla/shared/layout': path.resolve(
        './libs/shared/layout/src/index.js'
      ),
      '@astro-nx-depla/shared/ui': path.resolve(
        './libs/shared/ui/src/index.js'
      ),
      '@astro-nx-depla/shared/util/config-provider': path.resolve(
        'libs/shared/util/config-provider/src/index.ts'
      ),
      '@astro-nx-depla/shared/util/formatting': path.resolve(
        'libs/shared/util/formatting/src/index.ts'
      ),
      '@astro-nx-depla/shared/util/predict-reading-time': path.resolve(
        'libs/shared/util/astro-remark-plugin-predict-reading-time/src/index.ts'
      ),
      '@astro-nx-depla/website/config': path.resolve(
        './libs/website/config/src/index.ts'
      ),
      '@astro-nx-depla/website/data-access/post': path.resolve(
        'libs/website/data-access/post/src/index.ts'
      ),
      '@astro-nx-depla/website/data-access/url': path.resolve(
        'libs/website/data-access/url/src/index.ts'
      ),
      '@astro-nx-depla/website/menu-data': path.resolve(
        'libs/website/menu-data/src/index.ts'
      ),
      '@astro-nx-depla/website/types': path.resolve(
        './libs/website/types/src/index.ts'
      ),
    }),
  ],
});
