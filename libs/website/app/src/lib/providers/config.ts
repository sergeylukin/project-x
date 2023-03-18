import { config } from '@astro-nx-depla/website/config';

export const provider = (c) => {
  c.service('config', (c) => {
    return Object.assign(config, {
      origin: c.isProd ? config.productionOrigin : config.origin,
    });
  });
};
