import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';
import { getCollection, CollectionEntry } from 'astro:content';
import { PrismaClient } from '@prisma/client';
import {
  cleanSlug,
  generatePermalink,
} from '@astro-nx-depla/shared/util/formatting';
import { IPost, PostSeed, Post } from '@astro-nx-depla/website/entities/post';
import { UserSeed } from '@astro-nx-depla/website/entities/user';
const PostConfig = CONFIG.get('entities.post');

async function getNormalizedPost(
  post: CollectionEntry<'post'>
): Promise<IPost> {
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
    this.post = Post(this.post);
  }

  async seed() {
    UserSeed.call(this);
    PostSeed.call(this);
  }
}

export const db = DB.instance();
