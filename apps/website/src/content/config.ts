import { defineCollection } from 'astro:content';
import { postCollection } from '@astro-nx-depla/shared/entities/post';

export const collections = {
  post: defineCollection(postCollection),
};
