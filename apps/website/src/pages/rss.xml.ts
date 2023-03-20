import rss from '@astrojs/rss';

import { app } from '@astro-nx-depla/shared/app';

export const get = async () => {
  if (app.post.config.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await app.post.findMany();

  return rss({
    title: `${app.config.name}’s Blog`,
    description: app.config.description,
    site: import.meta.env.SITE,

    items: posts.map((post) => {
      return {
        link: app.post.getPostPermalink(post.permalink),
        title: post.title,
        description: post.description || ' ',
        pubDate: post.publishDate,
      };
    }),
  });
};
