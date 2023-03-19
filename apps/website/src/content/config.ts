import { defineCollection } from 'astro:content';
import { postCollection } from '@astro-nx-depla/website/entities/post';

export const collections = {
  post: defineCollection(postCollection),
};
