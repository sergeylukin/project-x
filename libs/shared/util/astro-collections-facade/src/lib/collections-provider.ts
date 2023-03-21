import { getCollection, getEntryBySlug } from './collections';

export const collectionsProvider = (c) => {
  c.service('collections', (c) => {
    return {
      getCollection,
      getEntryBySlug,
    };
  });
};
