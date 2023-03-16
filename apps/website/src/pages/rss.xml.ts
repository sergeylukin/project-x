import rss from '@astrojs/rss';

import { db } from '@astro-nx-depla/website/db';
import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';

export const get = async () => {
  if (CONFIG.get('app.entities.post').disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await db.post.findMany();

  return rss({
    title: `${CONFIG.get('app').name}’s Blog`,
    description: CONFIG.get('app').description,
    site: import.meta.env.SITE,

    items: posts.map((post) => {
      return {
        link: db.post.getPostPermalink(post.permalink),
        title: post.title,
        description: post.description || ' ',
        pubDate: post.publishDate,
      };
    }),
  });
};
