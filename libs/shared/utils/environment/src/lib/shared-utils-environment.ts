import { IEnvironment } from '@astro-nx-depla/shared/types/environment';

// @ts-ignore
export const isProd =
  typeof process !== 'undefined'
    ? // @ts-ignore
      process?.env?.NODE_ENV === 'production'
    : typeof window !== 'undefined' &&
      window.hasOwnProperty('DEPLOY_DAY') &&
      // @ts-ignore
      window?.DEPLOY_DAY?.env === IEnvironment.Prod;
