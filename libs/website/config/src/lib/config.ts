import defaultImage from '../assets/images/default.png';
import { IEnvironment } from '@astro-nx-depla/shared/util/config-provider';

const isProd =
  typeof process !== 'undefined'
    ? process?.env?.NODE_ENV === 'production'
    : typeof window !== 'undefined' &&
      window.hasOwnProperty('DEPLOY_DAY') &&
      // @ts-ignore
      window?.DEPLOY_DAY?.env === IEnvironment.Prod;

export const CONFIG = {
  app: {
    name: 'AstroWind',

    env: isProd ? IEnvironment.Prod : IEnvironment.Dev,

    origin: isProd ? 'https://e301.dep.la' : 'http://localhost:3000',
    basePathname: '/',
    trailingSlash: false,

    title: 'Deployday — prompt based website builder & maintainer',
    description:
      '🚀 Suitable for Startups, Small Business, Sass Websites, Professional Portfolios, Marketing Websites, Landing Pages & Blogs.',
    defaultImage: defaultImage,

    defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"

    language: 'en',
    textDirection: 'ltr',

    googleAnalyticsId: false, // or "G-XXXXXXXXXX",
    googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
  },

  entities: {
    post: {
      name: 'post',
      disabled: false,
      itemsPerPage: 4,

      item: {
        permalink: '/%year%/%slug%', // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
        noindex: false,
        disabled: false,
      },

      list: {
        pathname: 'blog', // Blog main path, you can change this to "articles" (/articles)
        noindex: false,
        disabled: false,
      },

      taxonomies: {
        category: {
          name: 'category',
          pathname: 'category', // Category main path /category/some-category
          noindex: true,
          disabled: false,
          itemsPerPage: 6,
        },
        tag: {
          name: 'tag',
          pathname: 'tag', // Tag main path /tag/some-tag
          noindex: true,
          disabled: false,
          itemsPerPage: 2,
        },
      },
    },
  },
};
