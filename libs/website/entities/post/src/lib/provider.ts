import { Post } from './entity';

export const provider = (c) => {
  c.service('post', (c) => Post(c));
};
