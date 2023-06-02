import { ITag } from './shared-generated-entities-__entity-types';
import { cleanSlug, generatePermalink } from '@depla/utils-url';


let flag = false;

export async function TagSeed() {
  if (!flag) {
    flag = true;
    const tagsExist = await this.db.tag._count();
    if (!tagsExist) {
      const tags = await this.collections.getCollection('tag');
      for (const tag of tags) {
        const user = await this.user.findFirst();
        const data = await getNormalized(tag, user, this.db.tag.config);
      }
    }
  }
}


