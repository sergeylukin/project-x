import { env } from './environment';

export const provider = (c) => {
  c.service('env', (c) => env);
};
