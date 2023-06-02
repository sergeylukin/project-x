import { Tag } from './shared-entities-tag';

export const provider = (c) => {
  c.service('tag', (c) => Tag(c));
};
