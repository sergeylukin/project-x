import { User as UserModel } from '@prisma/client';
import { UserSeed } from './seed';

export function User(app) {
  const { user: prismaUser }: { user: UserModel } = app.db;

  return Object.assign(prismaUser, {
    seed: () => UserSeed.call(app),
  });
}
