import { getCollection, getEntryBySlug } from 'astro:content';
import { findImage } from '@astro-nx-depla/shared/util/image';
import {
  getCanonical,
  cleanSlug,
  createPath,
  generatePermalink,
} from '@astro-nx-depla/shared/util/url';
import { Post as PostModel } from '@prisma/client';
import { config } from './config';

export function Post(app) {
  const { post }: { post: PostModel } = app.db;

  return Object.assign(post, {
    config,
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    getPostTaxonomyPermalink(taxonomy, taxonomyValue) {
      const pathname = config.taxonomies[taxonomy]?.pathname;
      return createPath(pathname, taxonomyValue);
    },
    getPostPermalink(link) {
      return createPath(app?.config?.basePathname, link);
    },
    getPostListPermalink() {
      return createPath(app?.config?.basePathname, config?.list?.pathname);
    },
    async findPostsBySlugs(slugs: Array<string>): Promise<Array<Post>> {
      if (!Array.isArray(slugs)) return [];

      const posts = await post.findMany();

      return slugs.reduce(function (r: Array<Post>, slug: string) {
        posts.some(function (post: Post) {
          return slug === post.slug && r.push(post);
        });
        return r;
      }, []);
    },
    async findPostsByIds(ids: Array<string>): Promise<Array<Post>> {
      if (!Array.isArray(ids)) return [];

      const posts = await post.findMany();

      return ids.reduce(function (r: Array<Post>, id: string) {
        posts.some(function (post: Post) {
          return id === post.id && r.push(post);
        });
        return r;
      }, []);
    },
    async firstPost(): Promise<PostModel> {
      return post.findUnique({ where: { id: 4 } });
    },
    async findLatestPosts({
      count,
    }: {
      count?: number;
    }): Promise<Array<PostModel>> {
      const _count = count || 4;
      const posts = await post.findMany();

      return posts ? posts.slice(0, _count) : [];
    },
    async getPostListStaticPaths({ paginate }) {
      if (config?.disabled || config?.list?.disabled) return [];
      const posts = await post.findMany({
        include: {
          tags: true,
        },
        // select: {
        //   title: true,
        //   slug: true,
        //   content: true,
        //   tags: {
        //     select: {
        //       name: true,
        //     },
        //   },
        // },
      });
      return paginate(posts, {
        params: { blog: config?.list?.pathname || undefined },
        pageSize: config.itemsPerPage,
      });
    },
    async getPostViewStaticPaths() {
      if (config?.disabled || config?.item?.disabled) return [];
      const posts = await post.findMany();
      return await Promise.all(
        posts.map(async (post) => {
          const entry = await getEntryBySlug('post', post.slug);
          const { Content } = await entry.render();
          post.Content = Content;
          return {
            params: {
              blog: post.permalink,
            },
            props: { post: post },
          };
        })
      );
    },
    getMetaByPage(page) {
      const currentPage = page.currentPage ?? 1;

      return {
        title: `Blog${currentPage > 1 ? ` — Page ${currentPage}` : ''}`,
        description: app?.config?.description,
        noindex: config?.list?.noindex || currentPage > 1,
        ogType: 'blog',
      };
    },
    async getMetaByPost(post) {
      const url = getCanonical(
        createPath(config.pathname, post.permalink),
        app?.config?.origin
      );
      return {
        title: post.title,
        description: post.description,
        canonical: post.canonical || url,
        image: await findImage(post.image),
        noindex: config?.item?.noindex,
        ogType: 'article',
      };
    },
    async getPostCategoryListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.category?.disabled) return [];

      const posts = await post.findMany();
      const categories = new Set();
      posts.map((post) => {
        typeof post.category === 'string' &&
          categories.add(post.category.toLowerCase());
      });

      return Array.from(categories).map((category: string) =>
        paginate(
          posts.filter(
            (post) =>
              typeof post.category === 'string' &&
              category === post.category.toLowerCase()
          ),
          {
            params: {
              category: category,
              blog: config.taxonomies.category.pathname || undefined,
            },
            pageSize: config.taxonomies.category.itemsPerPage,
            props: { category },
          }
        )
      );
    },
    getPostCategoryMetaByPage(page, category) {
      const currentPage = page.currentPage ?? 1;
      const meta = {
        title: `Category'${category}' ${
          currentPage > 1 ? ` — Page ${currentPage}` : ''
        }`,
        description: app?.config?.description,
        noindex: config.taxonomies.category?.noindex,
      };
      return meta;
    },

    async getPostTagListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.tag?.disabled) return [];

      const posts = await post.findMany({
        include: {
          tags: true,
        },
      });
      const tags = new Set();
      posts.map((post) => {
        Array.isArray(post.tags) &&
          post.tags.map((tag) => tags.add(tag.name.toLowerCase()));
      });

      return Array.from(tags).map((tag: string) =>
        paginate(
          posts.filter(
            (post) =>
              Array.isArray(post.tags) &&
              post.tags.find((elem) => elem.name.toLowerCase() === tag)
          ),
          {
            params: {
              tag: tag,
              blog: config.taxonomies.tag.pathname || undefined,
            },
            pageSize: config.taxonomies.tag.itemsPerPage,
            props: { tag },
          }
        )
      );
    },

    getPostTagMetaByPage(page, tag) {
      const currentPage = page.currentPage ?? 1;
      const meta = {
        title: `Posts by tag '${tag}'${
          currentPage > 1 ? ` — Page ${currentPage} ` : ''
        }`,
        description: app?.config?.description,
        noindex: config.taxonomies.tag?.noindex,
      };
      return meta;
    },
  });
}
