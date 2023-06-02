import { prisma } from './shared-prisma.js';

export const provider = (c) => {
  c.service('prisma', (c) => prisma);
};
