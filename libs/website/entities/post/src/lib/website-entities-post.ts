import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';
import { getCollection, getEntryBySlug } from 'astro:content';
import { findImage } from '@astro-nx-depla/website/data-access/url';
import {
  getCanonical,
  cleanSlug,
  createPath,
  generatePermalink,
} from '@astro-nx-depla/shared/util/formatting';
import { db } from './db';
import { Post as PostModel } from '@prisma/client';
import { create } from 'domain';

const AppConfig = CONFIG.get('app');
const PostConfig = CONFIG.get('entities.post');
const PostCategoryConfig = CONFIG.get('entities.post.taxonomies.category');
const PostTagConfig = CONFIG.get('entities.post.taxonomies.tag');

function Posts(prismaPost: PostModel) {
  return Object.assign(prismaPost, {
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    getPostTaxonomyPermalink(taxonomy, taxonomyValue) {
      const pathname = CONFIG.get(
        `entities.post.taxonomies.${taxonomy}.pathname`
      );
      return createPath(pathname, taxonomyValue);
    },
    getPostPermalink(link) {
      return createPath(AppConfig?.basePathname, link);
    },
    getPostListPermalink() {
      return PostConfig?.list?.pathname;
    },
    async findPostsBySlugs(slugs: Array<string>): Promise<Array<Post>> {
      if (!Array.isArray(slugs)) return [];

      const posts = await prismaPost.findMany();

      return slugs.reduce(function (r: Array<Post>, slug: string) {
        posts.some(function (post: Post) {
          return slug === post.slug && r.push(post);
        });
        return r;
      }, []);
    },
    async findPostsByIds(ids: Array<string>): Promise<Array<Post>> {
      if (!Array.isArray(ids)) return [];

      const posts = await prismaPost.findMany();

      return ids.reduce(function (r: Array<Post>, id: string) {
        posts.some(function (post: Post) {
          return id === post.id && r.push(post);
        });
        return r;
      }, []);
    },
    async firstPost(): Promise<PostModel> {
      return prismaPost.findUnique({ where: { id: 4 } });
    },
    async findLatestPosts({
      count,
    }: {
      count?: number;
    }): Promise<Array<PostModel>> {
      const _count = count || 4;
      const posts = await prismaPost.findMany();

      return posts ? posts.slice(0, _count) : [];
    },
    async getPostListStaticPaths({ paginate }) {
      if (PostConfig?.disabled || PostConfig?.list?.disabled) return [];
      const posts = await prismaPost.findMany({
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
      posts.map((post) => {
        console.log(post);
      });
      return paginate(posts, {
        params: { blog: PostConfig?.list?.pathname || undefined },
        pageSize: PostConfig.itemsPerPage,
      });
    },
    async getPostViewStaticPaths() {
      if (PostConfig?.disabled || PostConfig?.item?.disabled) return [];
      const posts = await prismaPost.findMany();
      return await Promise.all(
        posts.map(async (post) => {
          const entry = await getEntryBySlug('post', post.slug);
          const { Content } = await entry.render();
          post.Content = Content;
          console.log(entry);
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
        description: AppConfig?.description,
        noindex: PostConfig?.list?.noindex || currentPage > 1,
        ogType: 'blog',
      };
    },
    async getMetaByPost(post) {
      const url = getCanonical(
        createPath(PostConfig.pathname, post.permalink),
        AppConfig?.origin
      );
      return {
        title: post.title,
        description: post.description,
        canonical: post.canonical || url,
        image: await findImage(post.image),
        noindex: PostConfig?.item?.noindex,
        ogType: 'article',
      };
    },
    async getPostCategoryListStaticPaths({ paginate }) {
      if (PostConfig?.disabled || PostCategoryConfig?.disabled) return [];

      const posts = await prismaPost.findMany();
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
              blog: PostCategoryConfig.pathname || undefined,
            },
            pageSize: PostCategoryConfig.itemsPerPage,
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
        description: AppConfig?.description,
        noindex: PostCategoryConfig?.noindex,
      };
      return meta;
    },

    async getPostTagListStaticPaths({ paginate }) {
      if (PostConfig?.disabled || PostTagConfig?.disabled) return [];

      const posts = await prismaPost.findMany({
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
            params: { tag: tag, blog: PostTagConfig.pathname || undefined },
            pageSize: PostTagConfig.itemsPerPage,
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
        description: AppConfig?.description,
        noindex: PostTagConfig?.noindex,
      };
      return meta;
    },
  });
}

export const Post = Posts(db.post);

export interface IPost {
  id: string;
  slug: string;

  publishDate: Date;
  title: string;
  description?: string;

  image?: string;

  canonical?: string | URL;
  permalink?: string;

  draft?: boolean;

  excerpt?: string;
  category?: string;
  tags?: Array<string>;
  author?: string;

  Content: unknown;
  content?: string;

  readingTime?: number;
}
