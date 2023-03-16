import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';

const AppConfig = CONFIG.get('app');

export const App = {
  getAppPermalink() {
    return AppConfig?.basePathname;
  },
};
