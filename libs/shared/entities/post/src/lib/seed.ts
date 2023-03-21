import { IPost } from './interface';
import { cleanSlug, generatePermalink } from '@astro-nx-depla/shared/util/url';

async function getNormalizedPost(post: IPost, user, config): Promise<IPost> {
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
  const postsExist = await this.db.post.count();
  if (!postsExist) {
    const posts = await this.collections.getCollection('post');
    for (const post of posts) {
      const user = await this.db.user.findFirst();
      const data = await getNormalizedPost(post, user, this.db.post.config);
      if (data.tags.length === 0) {
        data.tags.push('default');
      }
      const tags = await Promise.all(
        data.tags.map(async (tagName) => {
          const tagInDb = await this.db.tag.findFirst({
            where: {
              name: tagName,
            },
          });
          if (!tagInDb) {
            const newTagInDb = await this.db.tag.create({
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
      const result = await this.db.post.create({ data });
    }
  }
}
