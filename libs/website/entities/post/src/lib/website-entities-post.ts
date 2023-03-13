import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';
import { getCollection } from 'astro:content';
import { BLOG_BASE } from '@astro-nx-depla/website/data-access/url';
import { fetchPosts } from '@astro-nx-depla/website/data-access/post';
import { App } from '@astro-nx-depla/website/entities/app';
export const Post = CONFIG.get('entities.post');

export async function getPostListStaticPaths({ paginate }) {
  if (Post?.disabled || Post?.list?.disabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: Post.itemsPerPage,
  });
}

export const getMetaByPage = (page) => {
  const currentPage = page.currentPage ?? 1;

  return {
    title: `Blog${currentPage > 1 ? ` — Page ${currentPage}` : ''}`,
    description: App?.description,
    noindex: Post?.list?.noindex || currentPage > 1,
    ogType: 'blog',
  };
};
