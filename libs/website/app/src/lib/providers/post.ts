import { Post } from '@astro-nx-depla/website/entities/post';

export const provider = (c) => {
  c.service('post', (c) => Post(c));
};
