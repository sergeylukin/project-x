export enum IEnvironment {
  Prod = 'PROD',
  Dev = 'DEV',
}
export interface IAppConfig {
  name: string;
  env: IEnvironment;
  origin: string;
  basePathname: string;
  trailingSlash: boolean;
  title: string;
  description: string;
  defaultImage: string;
  defaultTheme: string;
  language: string;
  textDirection: string;
  googleAnalyticsId: string | boolean;
  googleSiteVerificationId: string;
}

export interface IEntityRoute {
  name?: string;
  permalink?: string;
  pathname?: string;
  noindex?: boolean;
  disabled?: boolean;
}

export interface IEntityRoutes {
  [key: string]: IEntityRoute;
}

export interface IEntity {
  name: string;
  disabled: boolean;
  itemsPerPage: number;
  item: IEntityRoute;
  list: IEntityRoute;
  taxonomies: IEntityRoutes;
}

export interface IEntities {
  [key: string]: IEntity;
}

export interface IConfig {
  app: IAppConfig;
  entities: IEntities;
}

let _CONFIG: IConfig;

export type IItem =
  | IConfig
  | IAppConfig
  | IEntities
  | IEntityRoute
  | IEntity
  | IEntityRoutes
  | string
  | boolean
  | number;

export const CONFIG = {
  get: (str: string): IItem =>
    str.split('.').reduce((obj: IItem, i: string): IItem => {
      return typeof obj === 'object' && Object.hasOwnProperty.call(obj, i)
        ? (obj as any)[i]
        : '';
    }, _CONFIG),

  set: (config: IConfig) => {
    _CONFIG = config;
  },
};
