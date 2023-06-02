import { IUser } from './shared-generated-entities-__entity-types';
import { cleanSlug, generatePermalink } from '@depla/utils-url';


let flag = false;
export async function UserSeed() {
  if (!flag) {
    flag = true;
    const userExist = await this.db.user._count({
      where: {
        name: 'foo',
      },
    });

    if (!userExist) {
      await this.db.user._create({
        data: {
          name: 'foo',
          email: 'foo@example.com',
        },
      });
    }
    const author = await this.db.user._findUnique({
      where: {
        email: 'foo@example.com',
      },
    });
  }
}

