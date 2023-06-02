import { findImage } from '@depla/utils-image';
import { PrismockClient } from 'prismock';
import {
  getCanonical,
  cleanSlug,
  createPath,
  generatePermalink,
} from '@depla/utils-url';
import { prependAsyncCallbackToObjectMethods } from '@depla/utils-js-object';
import { Tag as TagModel } from '@prisma/client';
import { TagSeed } from './shared-generated-entities-tag-seed';

export function Tag(app, config) {
  const { tag: tagModel }: { tag: TagModel } = app.db;

  prependAsyncCallbackToObjectMethods.call(
    app,
    tagModel,
    function (methodName) {
      if (!global._SSR) return;
      return {
        before: async () => {
          await TagSeed.call(app);
        },
        after: async () => {},
      };
    }
  );

  return Object.assign(tagModel, {
    config,
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    getTagTaxonomyPermalink(taxonomy, taxonomyValue) {
      const pathname = config.taxonomies[taxonomy]?.pathname;
      return createPath(pathname, taxonomyValue);
    },
    getTagPermalink(link) {
      return createPath(app?.config?.basePathname, link);
    },
    getTagListPermalink() {
      return createPath(app?.config?.basePathname, config?.list?.pathname);
    },
    async findTagsBySlugs(slugs: Array<string>): Promise<Array<Tag>> {
      if (!Array.isArray(slugs)) return [];

      const tags = await tagModel.findMany();

      return slugs.reduce(function (r: Array<Tag>, slug: string) {
        tags.some(function (tag: Tag) {
          return slug === tag.slug && r.push(tag);
        });
        return r;
      }, []);
    },
    async findTagsByIds(ids: Array<string>): Promise<Array<Tag>> {
      if (!Array.isArray(ids)) return [];

      const tags = await tagModel.findMany();

      return ids.reduce(function (r: Array<Tag>, id: string) {
        tags.some(function (tag: Tag) {
          return id === tag.id && r.push(tag);
        });
        return r;
      }, []);
    },
    async firstTag(): Promise<TagModel> {
      return tagModel.findUnique({ where: { id: 4 } });
    },
    async findLatestTags({
      count,
    }: {
      count?: number;
    }): Promise<Array<TagModel>> {
      const _count = count || 4;
      const tags = await tagModel.findMany();

      return tags ? tags.slice(0, _count) : [];
    },
    async getTagListStaticPaths({ paginate }) {
      if (config?.disabled || config?.list?.disabled) return [];
      const tags = await tagModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return paginate(
        //
        // Normalize from:
        //
        // ```
        // {
        //   tags: [{ tag: { name: '<name>' }}]
        // }
        // ```
        //
        // to:
        //
        // ```
        // {
        //   tags: [{ name: '<name>' }]
        // }
        // ```
        tags.map((tag) => ({
          ...tag,
          tags: tag?.tags?.map((tagTag) => ({ name: tagTag.tag.name })),
        })),
        {
          params: { blog: config?.list?.pathname || undefined },
          pageSize: config.itemsPerPage,
        }
      );
    },
    async getTagViewStaticPaths() {
      if (config?.disabled || config?.item?.disabled) return [];
      const tags = await tagModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return await Promise.all(
        tags.map(async (tag) => {
          const entry = await app.collections.getEntryBySlug('tag', tag.slug);
          tag.tags = tag?.tags?.map((tagTag) => ({
            name: tagTag.tag.name,
          }));
          const { Content } = await entry.render();
          tag.Content = Content;
          return {
            params: {
              blog: tag.permalink,
            },
            props: { tag },
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
    
    async getMetaByTag(tag) {
      const url = getCanonical(
        createPath(config.pathname, tag.permalink),
        app?.config?.origin
      );
      return {
        title: tag.title,
        description: tag.description,
        canonical: tag.canonical || url,
        image: await findImage(tag.image),
        noindex: config?.item?.noindex,
        ogType: 'article',
      };
    },
    async getTagCategoryListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.category?.disabled) return [];

      const tags = await tagModel.findMany();
      const categories = new Set();
      tags.map((tag) => {
        typeof tag.category === 'string' &&
          categories.add(tag?.category?.toLowerCase());
      });

      return Array.from(categories).map((category: string) =>
        paginate(
          tags.filter(
            (tag) =>
              typeof tag.category === 'string' &&
              category === tag?.category?.toLowerCase()
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
    getTagCategoryMetaByPage(page, category) {
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

    
  });
}
