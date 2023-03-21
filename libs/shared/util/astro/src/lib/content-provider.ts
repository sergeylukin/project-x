import { getCollection, getEntryBySlug } from './content';

export const contentProvider = (c) => {
  c.service('content', (c) => {
    return {
      getCollection,
      getEntryBySlug,
    };
  });
};
