import {
  getCollection,
  getEntryBySlug,
} from '@astro-nx-depla/shared/util/astro';

export const provider = (c) => {
  c.service('content', (c) => {
    return {
      getCollection,
      getEntryBySlug,
    };
  });
};
