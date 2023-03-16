export async function PostSeed() {
  const postsExist = await this.post.count();
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
    });
  }
}
