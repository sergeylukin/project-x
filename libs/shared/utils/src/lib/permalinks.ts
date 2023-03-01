import slugify from 'limax';

import {
  CONFIG,
  IAppConfig,
  IEntity,
  IEntityRoute,
} from '@astro-nx-depla/shared/util/config-provider';

import { trim } from '@astro-nx-depla/shared/util/formatting';

const SITE = CONFIG.get('app') as IAppConfig;
const BLOG = CONFIG.get('entities.post') as IEntity;
const CATEGORY = CONFIG.get(
  'entities.post.taxonomies.category'
) as IEntityRoute;

export const trimSlash = (s: string) => trim(trim(s, '/'));
const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE?.trailingSlash && paths ? '/' : '');
};

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const POST_PERMALINK_PATTERN = trimSlash(
  BLOG?.item?.permalink || '/%slug%'
);

export const BLOG_BASE = cleanSlug(BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(CATEGORY?.pathname || 'category');
export const TAG_BASE = cleanSlug(CATEGORY?.pathname) || 'tag';

/** */
export const getCanonical = (path = ''): string | URL =>
  new URL(path, SITE?.origin);

/** */
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  switch (type) {
    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** */
export const getAsset = (path: string): string =>
  '/' +
  [SITE?.basePathname, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/** */
const definitivePermalink = (permalink: string): string =>
  // @ts-ignore
  createPath(CONFIG.get('app.basePathname'), permalink);
