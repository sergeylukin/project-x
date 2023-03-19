import { config } from '@astro-nx-depla/website/config';

export const provider = (c) => {
  c.service('route', (c) => {
    return (route) => {
      console.log(
        '[TODO] finalize route service. Currently requested route: ' + route
      );
      return route;
    };
  });
};
