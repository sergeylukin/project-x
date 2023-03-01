import rss from '@astrojs/rss';

import { getPermalink } from '@astro-nx-depla/website/data-access/url';
import { fetchPosts } from '@astro-nx-depla/website/data-access/post';
import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';

export const get = async () => {
  if (CONFIG.get('app.entities.post').disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();

  return rss({
    title: `${CONFIG.get('app').name}’s Blog`,
    description: CONFIG.get('app').description,
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.description,
      pubDate: post.publishDate,
    })),
  });
};
