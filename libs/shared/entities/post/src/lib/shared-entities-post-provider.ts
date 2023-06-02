import { Post } from './shared-entities-post';

export const provider = (c) => {
  c.service('post', (c) => Post(c));
};
