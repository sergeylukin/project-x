import { config } from '@astro-nx-depla/website/config';

export const provider = (c) => {
  c.service('config', (c) => config);
};
