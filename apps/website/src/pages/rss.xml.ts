import rss from '@astrojs/rss';

import { SITE, BLOG } from '@astro-nx-depla/website/config';
import { getPermalink, fetchPosts } from '@astro-nx-depla/shared/utils';

export const get = async () => {
  if (BLOG.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();

  return rss({
    title: `${SITE.name}’s Blog`,
    description: SITE.description,
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.description,
      pubDate: post.publishDate,
    })),
  });
};
