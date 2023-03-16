import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';
import { getCollection, CollectionEntry } from 'astro:content';
import { PrismaClient } from '@prisma/client';
import {
  cleanSlug,
  generatePermalink,
} from '@astro-nx-depla/shared/util/formatting';
import type { Post } from '@astro-nx-depla/website/types';
const PostConfig = CONFIG.get('entities.post');

async function getNormalizedPost(post: CollectionEntry<'post'>): Promise<Post> {
  // console.log('ORIGINAL');
  // console.log(post);
  const { id, body, slug: rawSlug = '', data } = post;
  const { remarkPluginFrontmatter } = await post.render();

  const {
    tags: rawTags = [],
    category: rawCategory,
    author = 'Anonymous',
    publishDate: rawPublishDate = new Date(),
    ...rest
  } = data;

  const pattern = PostConfig?.item?.permalink;
  const slug = cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  const category = rawCategory ? cleanSlug(rawCategory) : undefined;
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    // id: id,
    slug: slug,

    publishDate: publishDate,
    category: category,
    tags: tags,
    // author: author,
    authorId: 1,

    ...rest,

    content: body,
    // or 'body' in case you consume from API

    permalink: await generatePermalink({
      pattern,
      id,
      slug,
      publishDate,
      category,
    }),

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
}

class DB extends PrismaClient {
  static #instance = new DB();
  static instance = () => this.#instance;

  constructor() {
    super();
    this.seed();
  }

  async seed() {
    const userExist = await this.user.count({
      where: {
        name: 'foo',
      },
    });

    if (!userExist) {
      await this.user.create({
        data: {
          name: 'foo',
          email: 'foo@example.com',
        },
      });
    }
    const author = await this.user.findUnique({
      where: {
        email: 'foo@example.com',
      },
    });

    const postsExist = await this.post.count();
    console.log('HERE');
    if (!postsExist) {
      const posts = await getCollection('post');
      posts.forEach(async (post) => {
        const data = await getNormalizedPost(post);
        if (data.tags.length === 0) {
          data.tags.push('default');
        }
        const tags = await Promise.all(
          data.tags.map(async (tagName) => {
            const tagInDb = await this.tag.findFirst({
              where: {
                name: tagName,
              },
            });
            // console.log(tagInDb);
            if (!tagInDb) {
              const newTagInDb = await this.tag.create({
                data: {
                  name: tagName,
                },
              });
              return { id: newTagInDb.id };
            } else {
              return { id: tagInDb.id };
            }
          })
        );
        data.tags = {
          connect: tags,
        };
        console.log('SIMULATING SEED');
        console.log(data);
        const result = await this.post.create({ data });
        // console.log('SEEDED DB', result);
      });
    }
  }
}

export const db = DB.instance();
