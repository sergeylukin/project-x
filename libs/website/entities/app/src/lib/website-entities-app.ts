import { app } from '@astro-nx-depla/website/app';

export const App = {
  getAppPermalink() {
    return app.config?.basePathname;
  },
};
