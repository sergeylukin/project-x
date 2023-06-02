import alias from 'esbuild-plugin-alias';
import * as esbuild from 'esbuild';
import { replace } from 'esbuild-plugin-replace';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const tsBlob = fs.readFileSync('tsconfig.base.json');
const tsConfig = JSON.parse(tsBlob);
const aliases = tsConfig.compilerOptions.paths;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const esBuildServerConfiguration = {
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
    // used to inject _ssr-bootstrap.ts
    replace({
      delimiters: [`\'`, `_`],
      values: {
        '@astro-nx-depla/website/app/src/lib/':
          "'" + path.resolve(__dirname, 'libs/website/app/src/lib') + '/_',
      },
    }),
    alias(
      Object.keys(aliases).reduce(
        (curr, prev) =>
          Object.assign(curr, { [prev]: path.resolve(aliases[prev][0]) }),
        {}
      )
    ),
  ],
};

const esBuildStaticConfiguration = {
  ...esBuildServerConfiguration,
  entryPoints: ['apps/website/astro-static.config.ts'],
  outfile: './apps/website/astro-static.config.mjs',
};

await esbuild.build(esBuildServerConfiguration);
await esbuild.build(esBuildStaticConfiguration);
