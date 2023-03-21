import { config } from './config';

export const provider = (c) => {
  c.service('config', (c) => config);
};
