import alias from 'esbuild-plugin-alias';
import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';

const tsBlob = fs.readFileSync('tsconfig.base.json');
const tsConfig = JSON.parse(tsBlob);
const aliases = tsConfig.compilerOptions.paths;

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
    alias(
      Object.keys(aliases).reduce(
        (curr, prev) =>
          Object.assign(curr, { [prev]: path.resolve(aliases[prev][0]) }),
        {}
      )
    ),
  ],
});
