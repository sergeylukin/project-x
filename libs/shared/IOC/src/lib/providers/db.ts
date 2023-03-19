import { PrismaClient } from '@prisma/client';

export const provider = (c) => {
  c.service('db', (c) => {
    const client = new PrismaClient();
    return client;
  });
};
