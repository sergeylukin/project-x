import { defineConfig } from 'astro/config';
import type { AstroUserConfig } from 'astro';
import config from './astro.config';

const configForStaticBuild: AstroUserConfig = {
  ...config,
  output: 'static',
};

export default defineConfig(configForStaticBuild);
