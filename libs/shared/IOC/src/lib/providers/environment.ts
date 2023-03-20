import { env } from '@astro-nx-depla/shared/util/environment';

export const provider = (c) => {
  c.service('env', (c) => env);
};
