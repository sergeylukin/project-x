import { route } from './route';

export const provider = (c) => {
  c.service('route', (c) => route);
};
