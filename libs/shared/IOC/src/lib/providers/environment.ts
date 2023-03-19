import { IEnvironment } from '@astro-nx-depla/shared/types/environment';
import { isProd } from '@astro-nx-depla/shared/util/environment';

export const provider = (c) => {
  c.service('isProd', (c) => isProd);
  c.service('env', (c) => (isProd ? IEnvironment.Prod : IEnvironment.Dev));
};
