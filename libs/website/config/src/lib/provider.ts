import { config } from './website-config';

export const provider = (c) => {
  c.service('config', (c) => config);
};
