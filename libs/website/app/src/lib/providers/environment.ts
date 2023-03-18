import { IEnvironment } from '@astro-nx-depla/shared/types/environment';
// @ts-ignore
const isProd =
  typeof process !== 'undefined'
    ? // @ts-ignore
      process?.env?.NODE_ENV === 'production'
    : typeof window !== 'undefined' &&
      window.hasOwnProperty('DEPLOY_DAY') &&
      // @ts-ignore
      window?.DEPLOY_DAY?.env === IEnvironment.Prod;

export const provider = (c) => {
  c.service('isProd', (c) => isProd);
  c.service('env', (c) => (isProd ? IEnvironment.Prod : IEnvironment.Dev));
};
