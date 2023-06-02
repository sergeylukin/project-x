import { findImage } from '@depla/utils-image';
import { PrismockClient } from 'prismock';
import {
  getCanonical,
  cleanSlug,
  createPath,
  generatePermalink,
} from '@depla/utils-url';
import { prependAsyncCallbackToObjectMethods } from '@depla/utils-js-object';
import { Page as PageModel } from '@prisma/client';
import { PageSeed } from './shared-generated-entities-page-seed';

export function Page(app, config) {
  const { page: pageModel }: { page: PageModel } = app.db;

  prependAsyncCallbackToObjectMethods.call(
    app,
    pageModel,
    function (methodName) {
      if (!global._SSR) return;
      return {
        before: async () => {
          await PageSeed.call(app);
        },
        after: async () => {},
      };
    }
  );

  return Object.assign(pageModel, {
    config,
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    getPageTaxonomyPermalink(taxonomy, taxonomyValue) {
      const pathname = config.taxonomies[taxonomy]?.pathname;
      return createPath(pathname, taxonomyValue);
    },
    getPagePermalink(link) {
      return createPath(app?.config?.basePathname, link);
    },
    getPageListPermalink() {
      return createPath(app?.config?.basePathname, config?.list?.pathname);
    },
    async findPagesBySlugs(slugs: Array<string>): Promise<Array<Page>> {
      if (!Array.isArray(slugs)) return [];

      const pages = await pageModel.findMany();

      return slugs.reduce(function (r: Array<Page>, slug: string) {
        pages.some(function (page: Page) {
          return slug === page.slug && r.push(page);
        });
        return r;
      }, []);
    },
    async findPagesByIds(ids: Array<string>): Promise<Array<Page>> {
      if (!Array.isArray(ids)) return [];

      const pages = await pageModel.findMany();

      return ids.reduce(function (r: Array<Page>, id: string) {
        pages.some(function (page: Page) {
          return id === page.id && r.push(page);
        });
        return r;
      }, []);
    },
    async firstPage(): Promise<PageModel> {
      return pageModel.findUnique({ where: { id: 4 } });
    },
    async findLatestPages({
      count,
    }: {
      count?: number;
    }): Promise<Array<PageModel>> {
      const _count = count || 4;
      const pages = await pageModel.findMany();

      return pages ? pages.slice(0, _count) : [];
    },
    async getPageListStaticPaths({ paginate }) {
      if (config?.disabled || config?.list?.disabled) return [];
      const pages = await pageModel.findMany({
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
        pages.map((page) => ({
          ...page,
          tags: page?.tags?.map((pageTag) => ({ name: pageTag.tag.name })),
        })),
        {
          params: { blog: config?.list?.pathname || undefined },
          pageSize: config.itemsPerPage,
        }
      );
    },
    async getPageViewStaticPaths() {
      if (config?.disabled || config?.item?.disabled) return [];
      const pages = await pageModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return await Promise.all(
        pages.map(async (page) => {
          const entry = await app.collections.getEntryBySlug('page', page.slug);
          page.tags = page?.tags?.map((pageTag) => ({
            name: pageTag.tag.name,
          }));
          const { Content } = await entry.render();
          page.Content = Content;
          return {
            params: {
              blog: page.permalink,
            },
            props: { page },
          };
        })
      );
    },
    
    async getMetaByPage(page) {
      const url = getCanonical(
        createPath(config.pathname, page.permalink),
        app?.config?.origin
      );
      return {
        title: page.title,
        description: page.description,
        canonical: page.canonical || url,
        image: await findImage(page.image),
        noindex: config?.item?.noindex,
        ogType: 'article',
      };
    },
    async getPageCategoryListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.category?.disabled) return [];

      const pages = await pageModel.findMany();
      const categories = new Set();
      pages.map((page) => {
        typeof page.category === 'string' &&
          categories.add(page?.category?.toLowerCase());
      });

      return Array.from(categories).map((category: string) =>
        paginate(
          pages.filter(
            (page) =>
              typeof page.category === 'string' &&
              category === page?.category?.toLowerCase()
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
    getPageCategoryMetaByPage(page, category) {
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

    
    async getPageTagListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.tag?.disabled) return [];

      const pages = await pageModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const tags = new Set();
      pages.map((page) => {
        page.tags.forEach((pageTag) =>
          tags.add(pageTag.tag.name.toLowerCase())
        );
      });

      return Array.from(tags).map((tag: string) =>
        paginate(
          pages.filter(
            (page) =>
              Array.isArray(page.tags) &&
              page.tags.find((elem) => {
                return elem?.tag?.name?.toLowerCase() === tag;
              })
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

    getPageTagMetaByPage(page, tag) {
      const currentPage = page.currentPage ?? 1;
      const meta = {
        title: `Pages by tag '${tag}'${
          currentPage > 1 ? ` — Page ${currentPage} ` : ''
        }`,
        description: app?.config?.description,
        noindex: config.taxonomies.tag?.noindex,
      };
      return meta;
    },
    
  });
}
