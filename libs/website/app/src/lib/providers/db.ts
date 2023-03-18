import { PrismaClient } from '@prisma/client';
import { PostSeed } from '@astro-nx-depla/website/entities/post';
import { UserSeed } from '@astro-nx-depla/website/entities/user';

export const provider = (c) => {
  c.service('db', (c) => {
    const client = new PrismaClient();
    UserSeed.call(client);
    PostSeed.call(client);
    return client;
  });
};
