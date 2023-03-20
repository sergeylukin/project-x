import { getCollection, CollectionEntry } from 'astro:content';
import { IPost } from './interface';
import { cleanSlug, generatePermalink } from '@astro-nx-depla/shared/util/url';

async function getNormalizedPost(
  post: CollectionEntry<'post'>,
  user,
  config
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

  const pattern = config?.item?.permalink;
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
    authorId: user.id,

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

export async function PostSeed() {
  const postsExist = await this.post.count();
  if (!postsExist) {
    const posts = await getCollection('post');
    for (const post of posts) {
      const user = await this.user.findFirst();
      const data = await getNormalizedPost(post, user, this.post.config);
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
      const result = await this.post.create({ data });
    }
  }
}
