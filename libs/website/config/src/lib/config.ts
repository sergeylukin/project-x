import defaultImage from '../assets/images/default.png';
import { IEnvironment } from '@astro-nx-depla/shared/util/config-provider';

const isProd = process.env.NODE_ENV === 'production';
console.log(
  'HEREWEWEW TOUFO',
  isProd,
  process,
  process.env,
  process.env.NODE_ENV
);

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
        permalink: '/%slug%', // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
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
        },
        tag: {
          name: 'tag',
          pathname: 'tag', // Tag main path /tag/some-tag
          noindex: true,
          disabled: false,
        },
      },
    },
  },
};
