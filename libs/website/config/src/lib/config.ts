import defaultImage from '../assets/images/default.png';

export const config = {
  name: 'AstroWind',

  origin: 'http://localhost:3000',
  productionOrigin: 'https://e301.dep.la',

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
};
