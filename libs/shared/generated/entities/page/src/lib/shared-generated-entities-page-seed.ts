import { IPage } from './shared-generated-entities-__entity-types';
import { cleanSlug, generatePermalink } from '@depla/utils-url';


let flag = false;

export async function PageSeed() {
  if (!flag) {
    flag = true;
    const pagesExist = await this.db.page._count();
    if (!pagesExist) {
      const tags = await this.collections.getCollection('page');
      for (const page of pages) {
        const user = await this.user.findFirst();
        const data = await getNormalized(page, user, this.db.page.config);
      }
    }
  }
}


