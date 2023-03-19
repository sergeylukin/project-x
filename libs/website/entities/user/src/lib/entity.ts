import { User as UserModel } from '@prisma/client';

export function User(prismaUser: UserModel) {
  return Object.assign(prismaUser, {});
}
