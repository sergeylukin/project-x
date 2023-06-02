import { findImage } from '@depla/utils-image';
import { PrismockClient } from 'prismock';
import {
  getCanonical,
  cleanSlug,
  createPath,
  generatePermalink,
} from '@depla/utils-url';
import { prependAsyncCallbackToObjectMethods } from '@depla/utils-js-object';
import { User as UserModel } from '@prisma/client';
import { UserSeed } from './shared-generated-entities-user-seed';

export function User(app, config) {
  const { user: userModel }: { user: UserModel } = app.db;

  prependAsyncCallbackToObjectMethods.call(
    app,
    userModel,
    function (methodName) {
      if (!global._SSR) return;
      return {
        before: async () => {
          await UserSeed.call(app);
        },
        after: async () => {},
      };
    }
  );

  return Object.assign(userModel, {
    config,
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    getUserTaxonomyPermalink(taxonomy, taxonomyValue) {
      const pathname = config.taxonomies[taxonomy]?.pathname;
      return createPath(pathname, taxonomyValue);
    },
    getUserPermalink(link) {
      return createPath(app?.config?.basePathname, link);
    },
    getUserListPermalink() {
      return createPath(app?.config?.basePathname, config?.list?.pathname);
    },
    async findUsersBySlugs(slugs: Array<string>): Promise<Array<User>> {
      if (!Array.isArray(slugs)) return [];

      const users = await userModel.findMany();

      return slugs.reduce(function (r: Array<User>, slug: string) {
        users.some(function (user: User) {
          return slug === user.slug && r.push(user);
        });
        return r;
      }, []);
    },
    async findUsersByIds(ids: Array<string>): Promise<Array<User>> {
      if (!Array.isArray(ids)) return [];

      const users = await userModel.findMany();

      return ids.reduce(function (r: Array<User>, id: string) {
        users.some(function (user: User) {
          return id === user.id && r.push(user);
        });
        return r;
      }, []);
    },
    async firstUser(): Promise<UserModel> {
      return userModel.findUnique({ where: { id: 4 } });
    },
    async findLatestUsers({
      count,
    }: {
      count?: number;
    }): Promise<Array<UserModel>> {
      const _count = count || 4;
      const users = await userModel.findMany();

      return users ? users.slice(0, _count) : [];
    },
    async getUserListStaticPaths({ paginate }) {
      if (config?.disabled || config?.list?.disabled) return [];
      const users = await userModel.findMany({
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
        users.map((user) => ({
          ...user,
          tags: user?.tags?.map((userTag) => ({ name: userTag.tag.name })),
        })),
        {
          params: { blog: config?.list?.pathname || undefined },
          pageSize: config.itemsPerPage,
        }
      );
    },
    async getUserViewStaticPaths() {
      if (config?.disabled || config?.item?.disabled) return [];
      const users = await userModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return await Promise.all(
        users.map(async (user) => {
          const entry = await app.collections.getEntryBySlug('user', user.slug);
          user.tags = user?.tags?.map((userTag) => ({
            name: userTag.tag.name,
          }));
          const { Content } = await entry.render();
          user.Content = Content;
          return {
            params: {
              blog: user.permalink,
            },
            props: { user },
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
    
    async getMetaByUser(user) {
      const url = getCanonical(
        createPath(config.pathname, user.permalink),
        app?.config?.origin
      );
      return {
        title: user.title,
        description: user.description,
        canonical: user.canonical || url,
        image: await findImage(user.image),
        noindex: config?.item?.noindex,
        ogType: 'article',
      };
    },
    async getUserCategoryListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.category?.disabled) return [];

      const users = await userModel.findMany();
      const categories = new Set();
      users.map((user) => {
        typeof user.category === 'string' &&
          categories.add(user?.category?.toLowerCase());
      });

      return Array.from(categories).map((category: string) =>
        paginate(
          users.filter(
            (user) =>
              typeof user.category === 'string' &&
              category === user?.category?.toLowerCase()
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
    getUserCategoryMetaByPage(page, category) {
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

    
    async getUserTagListStaticPaths({ paginate }) {
      if (config?.disabled || config.taxonomies.tag?.disabled) return [];

      const users = await userModel.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const tags = new Set();
      users.map((user) => {
        user.tags.forEach((userTag) =>
          tags.add(userTag.tag.name.toLowerCase())
        );
      });

      return Array.from(tags).map((tag: string) =>
        paginate(
          users.filter(
            (user) =>
              Array.isArray(user.tags) &&
              user.tags.find((elem) => {
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

    getUserTagMetaByPage(page, tag) {
      const currentPage = page.currentPage ?? 1;
      const meta = {
        title: `Users by tag '${tag}'${
          currentPage > 1 ? ` — Page ${currentPage} ` : ''
        }`,
        description: app?.config?.description,
        noindex: config.taxonomies.tag?.noindex,
      };
      return meta;
    },
    
  });
}
